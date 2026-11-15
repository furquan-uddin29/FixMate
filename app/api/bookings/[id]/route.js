import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';
import { BOOKING_STATES } from '@/lib/state-machine/bookingWorkflow';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(*), technician_profiles(*), booking_status_history(*)')
        .or(`id.eq.${id},booking_code.eq.${id}`)
        .single();
      if (!error && data) {
        return NextResponse.json({ booking: data, source: 'supabase' });
      }
    }

    const booking = store.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking, source: 'store' });
  } catch (error) {
    console.error('API /api/bookings/[id] GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const booking = store.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Cancellation eligibility check
    if (['in_progress', 'completed'].includes(booking.status)) {
      return NextResponse.json(
        { error: 'Cannot cancel a booking that is currently in progress or completed' },
        { status: 400 }
      );
    }

    const result = store.updateBookingStatus(
      id,
      BOOKING_STATES.CANCELLED,
      'Customer cancelled the booking request',
      'customer'
    );

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking: result.booking,
    });
  } catch (error) {
    console.error('API /api/bookings/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
