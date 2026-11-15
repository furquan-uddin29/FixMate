import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');

    const complaints = store.getComplaints({ customerId, status });
    return NextResponse.json({ complaints });
  } catch (error) {
    console.error('API /api/complaints GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { booking_id, customer_id, category, title, description } = body;

    if (!booking_id || !title || !description || !category) {
      return NextResponse.json({ error: 'Missing complaint information' }, { status: 400 });
    }

    const complaint = store.createComplaint(body);
    return NextResponse.json({ complaint, message: 'Complaint lodged successfully' }, { status: 201 });
  } catch (error) {
    console.error('API /api/complaints POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
