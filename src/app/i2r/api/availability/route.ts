import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { i2r_bookings, i2r_booking_equipment } from '@/db/schema';
import { eq, and, lt, gt } from 'drizzle-orm';

/**
 * GET /i2r/api/availability?start=ISO&end=ISO
 *
 * Returns equipment_ids that are already booked (approved) for the given time window.
 * The client uses this to grey-out unavailable equipment in the booking form.
 */
export async function GET(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession();
    if (!session || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) return NextResponse.json({ booked_equipment_ids: [] });

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate)
      return NextResponse.json({ booked_equipment_ids: [] });

    const conflicts = await db
      .select({ equipment_id: i2r_booking_equipment.equipment_id })
      .from(i2r_booking_equipment)
      .innerJoin(i2r_bookings, eq(i2r_booking_equipment.booking_id, i2r_bookings.booking_id))
      .where(
        and(
          eq(i2r_bookings.status, 'A'),
          lt(i2r_bookings.start_time, endDate),
          gt(i2r_bookings.end_time, startDate),
        )
      );

    const bookedIds = [...new Set(conflicts.map((c) => c.equipment_id))];
    return NextResponse.json({ booked_equipment_ids: bookedIds });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
