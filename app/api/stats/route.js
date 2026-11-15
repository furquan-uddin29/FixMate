import { NextResponse } from 'next/server';
import { store } from '@/lib/data/store';

export async function GET() {
  try {
    const stats = store.getStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('API /api/stats GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
