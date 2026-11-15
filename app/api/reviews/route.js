import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const technicianId = searchParams.get('technicianId');
    const customerId = searchParams.get('customerId');

    const reviews = store.getReviews({ technicianId, customerId });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('API /api/reviews GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { booking_id, rating, review_text } = body;

    if (!booking_id || !rating || !review_text) {
      return NextResponse.json({ error: 'Booking ID, rating (1-5), and review text are required' }, { status: 400 });
    }

    // Verify booking is completed
    const booking = store.getBookingById(booking_id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    if (booking.status !== 'completed') {
      return NextResponse.json({ error: 'Customer reviews can only be submitted for completed services' }, { status: 400 });
    }

    const review = store.createReview({
      booking_id,
      customer_id: booking.customer_id,
      customer_name: booking.customer_name,
      technician_id: booking.assigned_technician_id,
      technician_name: booking.technician_name,
      service_name: booking.service_name,
      rating: Number(rating),
      review_text,
    });

    return NextResponse.json({ review, message: 'Review submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('API /api/reviews POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
