import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const activeOnly = searchParams.get('active') !== 'false';

    const supabase = getServerSupabase();
    if (supabase) {
      let query = supabase.from('services').select('*');
      if (activeOnly) query = query.eq('is_active', true);
      if (category && category !== 'All') query = query.eq('category', category);
      if (search) query = query.ilike('name', `%${search}%`);

      const { data, error } = await query;
      if (!error && data) {
        return NextResponse.json({ services: data, source: 'supabase' });
      }
    }

    // Fallback to server store
    const services = store.getServices({ category, search, activeOnly });
    return NextResponse.json({ services, source: 'store' });
  } catch (error) {
    console.error('API /api/services GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.category || !body.base_price) {
      return NextResponse.json({ error: 'Name, category, and base price are required' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('services').insert([body]).select().single();
      if (!error && data) {
        return NextResponse.json({ service: data, source: 'supabase' }, { status: 201 });
      }
    }

    const newService = store.createService(body);
    return NextResponse.json({ service: newService, source: 'store' }, { status: 201 });
  } catch (error) {
    console.error('API /api/services POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
