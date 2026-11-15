import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { store } from '@/lib/data/store';
import { BOOKING_STATES } from '@/lib/state-machine/bookingWorkflow';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const technicianId = searchParams.get('technicianId');
    const status = searchParams.get('status');

    const supabase = getServerSupabase();
    if (supabase) {
      let query = supabase.from('bookings').select('*, services(*), profiles(*)');
      if (customerId) query = query.eq('customer_id', customerId);
      if (technicianId) query = query.eq('assigned_technician_id', technicianId);
      if (status) query = query.eq('status', status);

      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && data) {
        return NextResponse.json({ bookings: data, source: 'supabase' });
      }
    }

    const bookings = store.getBookings({ customerId, technicianId, status });
    return NextResponse.json({ bookings, source: 'store' });
  } catch (error) {
    console.error('API /api/bookings GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Server-side validation
    const {
      service_id,
      problem_title,
      problem_description,
      preferred_date,
      preferred_time_slot,
      customer_name,
      customer_phone,
      service_address,
      area,
      city,
    } = body;

    if (!service_id || !problem_title || !problem_description || !preferred_date || !preferred_time_slot || !customer_name || !service_address || !city) {
      return NextResponse.json(
        { error: 'Missing required booking fields. Please complete all steps.' },
        { status: 400 }
      );
    }

    // Look up service for base price & labor
    const service = store.getServiceById(service_id);
    const basePrice = service ? service.base_price : 50.00;
    const laborCharge = service ? service.labor_charge : 30.00;
    const emergencyFee = body.is_emergency ? (service ? service.emergency_fee : 25.00) : 0.00;
    const estimatedCost = Number(basePrice) + Number(laborCharge) + Number(emergencyFee);

    const bookingPayload = {
      ...body,
      service_name: service ? service.name : 'Home Service',
      service_category: service ? service.category : 'General',
      estimated_cost: estimatedCost,
      status: BOOKING_STATES.REQUESTED,
    };

    const supabase = getServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select()
        .single();
      if (!error && data) {
        return NextResponse.json({ booking: data, source: 'supabase' }, { status: 201 });
      }
    }

    const createdBooking = store.createBooking(bookingPayload);
    return NextResponse.json({ booking: createdBooking, source: 'store' }, { status: 201 });
  } catch (error) {
    console.error('API /api/bookings POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
