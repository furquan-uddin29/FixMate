import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const availableParam = searchParams.get('available');
    const isAvailable = availableParam !== null ? availableParam === 'true' : undefined;

    const supabase = getServerSupabase();
    if (supabase) {
      let query = supabase.from('technician_profiles').select('*, profiles(*)');
      if (status) query = query.eq('verification_status', status);
      if (isAvailable !== undefined) query = query.eq('is_available', isAvailable);

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ technicians: data, source: 'supabase' });
      }
    }

    const technicians = store.getTechnicians({ category, status, isAvailable });
    return NextResponse.json({ technicians, source: 'store' });
  } catch (error) {
    console.error('API /api/technicians GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
