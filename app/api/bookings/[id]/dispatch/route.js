import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { technician_id } = body;

    if (!technician_id) {
      return NextResponse.json({ error: 'technician_id is required for dispatch' }, { status: 400 });
    }

    const result = store.dispatchTechnician(id, technician_id);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      message: 'Technician successfully dispatched to booking',
      booking: result.booking,
    });
  } catch (error) {
    console.error('API /api/bookings/[id]/dispatch POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
