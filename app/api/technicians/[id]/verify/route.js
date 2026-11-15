import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status, remarks } = await request.json();

    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 });
    }

    const supabase = getServerSupabase();
    if (supabase) {
      await supabase
        .from('technician_verifications')
        .update({
          status,
          remarks,
          reviewed_at: new Date().toISOString(),
        })
        .eq('technician_id', id);
    }

    const updated = store.updateTechnician(id, {
      verification_status: status,
      verification_remarks: remarks,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
    }

    return NextResponse.json({ technician: updated, message: `Technician status updated to ${status}` });
  } catch (error) {
    console.error('API /api/technicians/[id]/verify error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
