import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { i2r_bookings, i2r_booking_equipment, i2r_equipment } from '@/db/schema';
import { eq, and, lt, inArray } from 'drizzle-orm';

/**
 * POST /i2r/api/admin/release
 *
 * Scans all approved bookings whose end_time has passed and frees their equipment
 * (sets status back to 'A'). Also marks those bookings as completed (reuses 'R' with
 * a 'Completed' comment, or we add a 'C' status — here we keep schema-compatible and
 * just leave them as 'A' approved but equipment freed).
 *
 * Called automatically when the admin dashboard loads.
 */
export async function POST() {
  try {
    const { session, user } = await getCurrentSession();
    if (!session || !user || user.role !== 'A')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const now = new Date();

    // Find approved bookings that have ended
    const expired = await db
      .select({ booking_id: i2r_bookings.booking_id })
      .from(i2r_bookings)
      .where(and(eq(i2r_bookings.status, 'A'), lt(i2r_bookings.end_time, now)));

    if (expired.length === 0) return NextResponse.json({ released: 0 });

    const expiredIds = expired.map((b) => b.booking_id);

    // Get all equipment used in those bookings
    const equipmentRows = await db
      .select({ equipment_id: i2r_booking_equipment.equipment_id })
      .from(i2r_booking_equipment)
      .where(inArray(i2r_booking_equipment.booking_id, expiredIds));

    const equipmentIds = [...new Set(equipmentRows.map((e) => e.equipment_id))];

    await db.transaction(async (tx) => {
      // Mark bookings as completed (use a distinct comment; status stays 'A' = approved/completed)
      await tx
        .update(i2r_bookings)
        .set({ comments: 'Completed — equipment released automatically' })
        .where(inArray(i2r_bookings.booking_id, expiredIds));

      // Free the equipment
      if (equipmentIds.length > 0) {
        await tx
          .update(i2r_equipment)
          .set({ status: 'A' })
          .where(inArray(i2r_equipment.equipment_id, equipmentIds));
      }
    });

    return NextResponse.json({ released: expiredIds.length });
  } catch (error) {
    console.error('Error releasing expired bookings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
