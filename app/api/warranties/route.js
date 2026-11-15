import { NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerName = searchParams.get('customerName');
    const bookingId = searchParams.get('bookingId');

    const warranties = store.getWarranties({ customerName, bookingId });
    return NextResponse.json({ warranties });
  } catch (error) {
    console.error('API /api/warranties GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
