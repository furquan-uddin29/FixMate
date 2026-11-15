import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();
      if (!error && data) {
        return NextResponse.json({ service: data, source: 'supabase' });
      }
    }

    const service = store.getServiceById(id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ service, source: 'store' });
  } catch (error) {
    console.error('API /api/services/[id] GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();

    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return NextResponse.json({ service: data, source: 'supabase' });
      }
    }

    const updated = store.updateService(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ service: updated, source: 'store' });
  } catch (error) {
    console.error('API /api/services/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
