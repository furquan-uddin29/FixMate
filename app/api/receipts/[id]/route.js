import { NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const receipt = store.getReceiptByBookingId(id);
    if (!receipt) {
      return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
    }
    return NextResponse.json({ receipt });
  } catch (error) {
    console.error('API /api/receipts/[id] GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
