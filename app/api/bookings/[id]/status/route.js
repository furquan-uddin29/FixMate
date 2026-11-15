import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';
import { isValidTransition, BOOKING_STATES } from '@/lib/state-machine/bookingWorkflow';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { next_status, note, service_record, actor_role } = body;

    const booking = store.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // State machine transition validation
    if (!isValidTransition(booking.status, next_status)) {
      return NextResponse.json(
        {
          error: `Invalid status transition: Cannot move from "${booking.status}" to "${next_status}". Allowed transitions: check state machine rules.`,
        },
        { status: 400 }
      );
    }

    // If moving to COMPLETED, must provide service details
    if (next_status === BOOKING_STATES.COMPLETED) {
      if (!service_record || !service_record.repair_description) {
        return NextResponse.json(
          {
            error: 'Cannot complete job without recording repair description, parts used, and labor charges.',
          },
          { status: 400 }
        );
      }

      const completionResult = store.recordServiceCompletion(id, service_record);
      return NextResponse.json({
        message: 'Service marked as completed. Digital receipt and warranty generated.',
        booking: completionResult.booking,
        receipt: completionResult.receipt,
        warranty: completionResult.warranty,
      });
    }

    // Otherwise standard state advancement
    const result = store.updateBookingStatus(id, next_status, note, actor_role || 'user');
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      message: `Booking status transitioned to ${next_status}`,
      booking: result.booking,
    });
  } catch (error) {
    console.error('API /api/bookings/[id]/status PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
