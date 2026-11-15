import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status, admin_response } = await request.json();

    const updated = store.updateComplaint(id, {
      status,
      admin_response,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ complaint: updated, message: 'Complaint response recorded' });
  } catch (error) {
    console.error('API /api/complaints/[id] PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
