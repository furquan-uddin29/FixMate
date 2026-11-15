import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { is_available } = await request.json();

    if (typeof is_available !== 'boolean') {
      return NextResponse.json({ error: 'is_available boolean required' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (supabase) {
      await supabase
        .from('technician_profiles')
        .update({ is_available })
        .eq('id', id);
    }

    const updated = store.updateTechnician(id, { is_available });
    if (!updated) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
    }

    return NextResponse.json({
      technician: updated,
      message: `Availability updated to ${is_available ? 'Available' : 'Unavailable'}`,
    });
  } catch (error) {
    console.error('API /api/technicians/[id]/availability error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
