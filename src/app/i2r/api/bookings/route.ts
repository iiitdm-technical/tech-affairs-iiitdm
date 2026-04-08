import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { i2r_bookings, i2r_booking_equipment, i2r_equipment } from '@/db/schema';
import { eq, and, inArray, or, lt, gt } from 'drizzle-orm';

// GET - Fetch user bookings
export async function GET() {
  try {
    const { session, user } = await getCurrentSession();
    if (!session || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const bookings = await db
      .select({
        booking_id: i2r_bookings.booking_id,
        project_name: i2r_bookings.project_name,
        department: i2r_bookings.department,
        intended_use: i2r_bookings.intended_use,
        start_time: i2r_bookings.start_time,
        end_time: i2r_bookings.end_time,
        status: i2r_bookings.status,
        created_at: i2r_bookings.created_at,
        comments: i2r_bookings.comments,
        equipment_name: i2r_equipment.name,
        equipment_category: i2r_equipment.category,
      })
      .from(i2r_bookings)
      .leftJoin(i2r_booking_equipment, eq(i2r_bookings.booking_id, i2r_booking_equipment.booking_id))
      .leftJoin(i2r_equipment, eq(i2r_booking_equipment.equipment_id, i2r_equipment.equipment_id))
      .where(eq(i2r_bookings.user_id, user.id))
      .orderBy(i2r_bookings.created_at);

    type BookingRow = {
      booking_id: number;
      project_name: string;
      department: string;
      intended_use: string;
      start_time: Date;
      end_time: Date;
      status: string | null;
      created_at: Date | null;
      comments: string | null;
      equipment: { name: string; category: string | null }[];
    };

    // Group equipment by booking
    const grouped = bookings.reduce((acc, row) => {
      const existing = acc.find((b) => b.booking_id === row.booking_id);
      if (existing) {
        if (row.equipment_name) existing.equipment.push({ name: row.equipment_name, category: row.equipment_category });
      } else {
        acc.push({
          booking_id: row.booking_id,
          project_name: row.project_name,
          department: row.department,
          intended_use: row.intended_use,
          start_time: row.start_time,
          end_time: row.end_time,
          status: row.status,
          created_at: row.created_at,
          comments: row.comments,
          equipment: row.equipment_name ? [{ name: row.equipment_name, category: row.equipment_category }] : [],
        });
      }
      return acc;
    }, [] as BookingRow[]);

    return NextResponse.json(grouped);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new booking request (status = Pending, equipment NOT marked busy yet)
export async function POST(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession();
    if (!session || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { department, project_name, intended_use, start_time, end_time, equipment_ids } = body;

    if (!department || !project_name || !intended_use || !start_time || !end_time || !equipment_ids?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    if (endDate <= startDate) {
      return NextResponse.json({ error: 'End time must be after start time' }, { status: 400 });
    }

    // Check if any of the requested equipment has an APPROVED booking that overlaps this time window
    // (Pending bookings don't block equipment — only approved ones do)
    const conflicts = await db
      .select({ booking_id: i2r_bookings.booking_id, equipment_name: i2r_equipment.name })
      .from(i2r_booking_equipment)
      .innerJoin(i2r_bookings, eq(i2r_booking_equipment.booking_id, i2r_bookings.booking_id))
      .innerJoin(i2r_equipment, eq(i2r_booking_equipment.equipment_id, i2r_equipment.equipment_id))
      .where(
        and(
          inArray(i2r_booking_equipment.equipment_id, equipment_ids),
          eq(i2r_bookings.status, 'A'),          // only approved bookings block
          lt(i2r_bookings.start_time, endDate),   // existing starts before new end
          gt(i2r_bookings.end_time, startDate),   // existing ends after new start
        )
      );

    if (conflicts.length > 0) {
      const names = [...new Set(conflicts.map((c) => c.equipment_name))].join(', ');
      return NextResponse.json(
        { error: `Equipment already booked for this time slot: ${names}` },
        { status: 409 }
      );
    }

    // Create booking — do NOT touch equipment status at this point
    // Equipment is only marked 'B' when admin approves
    const result = await db.transaction(async (tx) => {
      const [booking] = await tx
        .insert(i2r_bookings)
        .values({ user_id: user.id, department, project_name, intended_use, start_time: startDate, end_time: endDate, status: 'P' })
        .returning({ booking_id: i2r_bookings.booking_id });

      for (const equipment_id of equipment_ids) {
        await tx.insert(i2r_booking_equipment).values({ booking_id: booking.booking_id, equipment_id });
      }

      return booking;
    });

    return NextResponse.json({ success: true, booking_id: result.booking_id, message: 'Booking request submitted. Awaiting admin approval.' });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Cancel booking (user cancels their own pending booking)
export async function PATCH(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession();
    if (!session || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { booking_id } = await request.json();
    if (!booking_id) return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });

    // Only allow cancelling pending bookings owned by this user
    const [booking] = await db
      .select()
      .from(i2r_bookings)
      .where(and(eq(i2r_bookings.booking_id, booking_id), eq(i2r_bookings.user_id, user.id)));

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    if (booking.status !== 'P')
      return NextResponse.json({ error: 'Only pending bookings can be cancelled' }, { status: 400 });

    await db.transaction(async (tx) => {
      await tx
        .update(i2r_bookings)
        .set({ status: 'R', comments: 'Cancelled by user' })
        .where(eq(i2r_bookings.booking_id, booking_id));
      // Equipment was never marked busy for pending bookings, nothing to free
    });

    return NextResponse.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
