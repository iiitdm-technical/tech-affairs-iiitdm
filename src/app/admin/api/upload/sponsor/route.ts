import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/server/session';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { session, user } = await getCurrentSession();
    if (!session || !user || user.role !== 'A') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'File is required' }, { status: 400 });

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error } = await supabase.storage
      .from('sponsors')
      .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('sponsors').getPublicUrl(fileName);
    return NextResponse.json({ success: true, url: urlData.publicUrl });
  } catch (error) {
    console.error('Error uploading sponsor logo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
