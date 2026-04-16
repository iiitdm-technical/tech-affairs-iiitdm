import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { db } from '@/db';
import { Events, Clubs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CACHE_TAGS, bust } from '@/lib/cache';

// GET - Fetch all events with club information (admin only)
export async function GET() {
  try {
    const { session, user } = await getCurrentSession();
    
    if (!session || !user || user.role !== 'A') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await db
      .select({
        event_id: Events.event_id,
        club_id: Events.club_id,
        name: Events.name,
        description: Events.description,
        start_time: Events.start_time,
        end_time: Events.end_time,
        location: Events.location,
        link: Events.link,
        requirements: Events.requirements,
        imageUrl: Events.imageUrl,
        club_name: Clubs.name,
      })
      .from(Events)
      .leftJoin(Clubs, eq(Events.club_id, Clubs.club_id))
      .orderBy(Events.start_time);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new event (admin only)
export async function POST(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession();
    
    if (!session || !user || user.role !== 'A') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { club_id, name, description, start_time, end_time, location, link, requirements } = body;

    if (!club_id || !name || !description || !start_time || !end_time || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate that the club exists
    const [club] = await db
      .select()
      .from(Clubs)
      .where(eq(Clubs.club_id, club_id));

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    const [event] = await db
      .insert(Events)
      .values({
        club_id,
        name,
        description,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        location,
        link: link || '',
        requirements: requirements || '',
        imageUrl: null, // Will be updated when image is uploaded
      })
      .returning();

    bust(CACHE_TAGS.events);
    return NextResponse.json({
      success: true,
      event,
      message: 'Event added successfully'
    });
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update event (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession();
    
    if (!session || !user || user.role !== 'A') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { event_id, club_id, name, description, start_time, end_time, location, link, requirements, imageUrl } = body;

    if (!event_id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (club_id !== undefined) updateData.club_id = club_id;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (start_time !== undefined) updateData.start_time = new Date(start_time);
    if (end_time !== undefined) updateData.end_time = new Date(end_time);
    if (location !== undefined) updateData.location = location;
    if (link !== undefined) updateData.link = link;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    // If club_id is being updated, validate that the club exists
    if (club_id !== undefined) {
      const [club] = await db
        .select()
        .from(Clubs)
        .where(eq(Clubs.club_id, club_id));

      if (!club) {
        return NextResponse.json({ error: 'Club not found' }, { status: 404 });
      }
    }

    const [event] = await db
      .update(Events)
      .set(updateData)
      .where(eq(Events.event_id, event_id))
      .returning();

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    bust(CACHE_TAGS.events);
    return NextResponse.json({
      success: true,
      event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete event (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { session, user } = await getCurrentSession();
    
    if (!session || !user || user.role !== 'A') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const event_id = searchParams.get('event_id');

    if (!event_id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Check if event exists
    const [event] = await db
      .select()
      .from(Events)
      .where(eq(Events.event_id, parseInt(event_id)));

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Delete the event
    await db
      .delete(Events)
      .where(eq(Events.event_id, parseInt(event_id)));

    bust(CACHE_TAGS.events);
    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}