import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { i2r_bookings, i2r_booking_equipment, i2r_equipment, Users } from '@/db/schema';
import { eq, and, lt, inArray, gt, ne } from 'drizzle-orm';

// GET - Fetch bookings for admin (type: pending | all)
export async function GET(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession();
    if (!session || !user || user.role !== 'A')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const type = new URL(request.url).searchParams.get('type') ?? 'pending';

    const baseQuery = db
      .select({
        booking_id: i2r_bookings.booking_id,
        user_id: i2r_bookings.user_id,
        department: i2r_bookings.department,
        project_name: i2r_bookings.project_name,
        intended_use: i2r_bookings.intended_use,
        start_time: i2r_bookings.start_time,
        end_time: i2r_bookings.end_time,
        status: i2r_bookings.status,
        created_at: i2r_bookings.created_at,
        comments: i2r_bookings.comments,
        user_name: Users.name,
        user_email: Users.email,
        equipment_name: i2r_equipment.name,
        equipment_category: i2r_equipment.category,
        equipment_id: i2r_equipment.equipment_id,
      })
      .from(i2r_bookings)
      .innerJoin(Users, eq(i2r_bookings.user_id, Users.user_id))
      .leftJoin(i2r_booking_equipment, eq(i2r_bookings.booking_id, i2r_booking_equipment.booking_id))
      .leftJoin(i2r_equipment, eq(i2r_booking_equipment.equipment_id, i2r_equipment.equipment_id))
      .orderBy(i2r_bookings.created_at);

    let rows;
    if (type === 'pending') {
      rows = await baseQuery.where(eq(i2r_bookings.status, 'P'));
    } else if (type === 'completed') {
      rows = await baseQuery.where(lt(i2r_bookings.end_time, new Date()));
    } else {
      rows = await baseQuery; // all — no where clause
    }

    // Group equipment by booking
    const grouped = rows.reduce((acc, row) => {
      const existing = acc.find((b) => b.booking_id === row.booking_id);
      if (existing) {
        if (row.equipment_name) {
          existing.equipment.push({ equipment_id: row.equipment_id, name: row.equipment_name, category: row.equipment_category });
        }
      } else {
        acc.push({
          booking_id: row.booking_id,
          user_id: row.user_id,
          department: row.department,
          project_name: row.project_name,
          intended_use: row.intended_use,
          start_time: row.start_time,
          end_time: row.end_time,
          status: row.status,
          created_at: row.created_at,
          comments: row.comments,
          user: { name: row.user_name, email: row.user_email },
          equipment: row.equipment_name
            ? [{ equipment_id: row.equipment_id, name: row.equipment_name, category: row.equipment_category }]
            : [],
        });
      }
      return acc;
    }, [] as Record<string, unknown>[]);

    return NextResponse.json(grouped);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Approve or reject a pending booking (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession();
    if (!session || !user || user.role !== 'A')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { booking_id, action, reason } = await request.json();

    if (!booking_id || !action || !['approve', 'reject'].includes(action))
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });

    // Fetch the booking (must be pending)
    const [booking] = await db
      .select()
      .from(i2r_bookings)
      .where(and(eq(i2r_bookings.booking_id, booking_id), eq(i2r_bookings.status, 'P')));

    if (!booking)
      return NextResponse.json({ error: 'Booking not found or already processed' }, { status: 404 });

    // Get the equipment IDs for this booking
    const bookingEquipment = await db
      .select({ equipment_id: i2r_booking_equipment.equipment_id })
      .from(i2r_booking_equipment)
      .where(eq(i2r_booking_equipment.booking_id, booking_id));

    const equipmentIds = bookingEquipment.map((e) => e.equipment_id);

    if (action === 'approve') {
      // Before approving, check for conflicts with other approved bookings
      if (equipmentIds.length > 0) {
        const conflicts = await db
          .select({ booking_id: i2r_bookings.booking_id, equipment_name: i2r_equipment.name })
          .from(i2r_booking_equipment)
          .innerJoin(i2r_bookings, eq(i2r_booking_equipment.booking_id, i2r_bookings.booking_id))
          .innerJoin(i2r_equipment, eq(i2r_booking_equipment.equipment_id, i2r_equipment.equipment_id))
          .where(
            and(
              inArray(i2r_booking_equipment.equipment_id, equipmentIds),
              eq(i2r_bookings.status, 'A'),                        // already approved
              ne(i2r_bookings.booking_id, booking_id),             // not this booking
              lt(i2r_bookings.start_time, booking.end_time),       // overlaps
              gt(i2r_bookings.end_time, booking.start_time),
            )
          );

        if (conflicts.length > 0) {
          const names = [...new Set(conflicts.map((c) => c.equipment_name))].join(', ');
          return NextResponse.json(
            { error: `Cannot approve: equipment has conflicting approved booking: ${names}` },
            { status: 409 }
          );
        }
      }

      // Approve: mark booking approved + mark equipment busy
      await db.transaction(async (tx) => {
        await tx
          .update(i2r_bookings)
          .set({ status: 'A', comments: reason || 'Approved by admin' })
          .where(eq(i2r_bookings.booking_id, booking_id));

        if (equipmentIds.length > 0) {
          await tx
            .update(i2r_equipment)
            .set({ status: 'B' })
            .where(inArray(i2r_equipment.equipment_id, equipmentIds));
        }
      });

      return NextResponse.json({ success: true, message: 'Booking approved' });
    } else {
      // Reject: mark booking rejected
      // Equipment was NOT marked busy for pending bookings, so nothing to free
      await db
        .update(i2r_bookings)
        .set({ status: 'R', comments: reason || 'Rejected by admin' })
        .where(eq(i2r_bookings.booking_id, booking_id));

      return NextResponse.json({ success: true, message: 'Booking rejected' });
    }
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
