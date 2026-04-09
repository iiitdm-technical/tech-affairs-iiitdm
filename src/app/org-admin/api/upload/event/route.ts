import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { createClient } from '@supabase/supabase-js';

function isOrgAdmin(user: { role: string; orgSlugs: string[] }) {
  return user.role === 'A' || (user.role === 'O' && user.orgSlugs.length > 0);
}

export async function POST(request: NextRequest) {
  const { session, user } = await getCurrentSession();
  if (!session || !user || !isOrgAdmin(user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const eventId = formData.get('eventId') as string;

  if (!file || !eventId) {
    return NextResponse.json({ error: 'File and eventId are required' }, { status: 400 });
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `event-${eventId}-${Date.now()}.${fileExt}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from('events')
    .upload(filePath, Buffer.from(bytes), { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: 'Upload failed' }, { status: 500 });

  const { data: urlData } = supabase.storage.from('events').getPublicUrl(filePath);
  return NextResponse.json({ success: true, url: urlData.publicUrl });
}
