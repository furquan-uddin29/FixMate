import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const tech = store.getTechnicianById(id);
    if (!tech) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
    }
    return NextResponse.json({ technician: tech, source: 'store' });
  } catch (error) {
    console.error('API /api/technicians/[id] GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    const updated = store.updateTechnician(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
    }
    return NextResponse.json({ technician: updated, source: 'store' });
  } catch (error) {
    console.error('API /api/technicians/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
