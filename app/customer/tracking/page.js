'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ServiceTracker from '@/components/customer/ServiceTracker';
import { Compass, Calendar } from 'lucide-react';

function TrackingContent() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');

  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(queryId || '');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
        // Default to query ID or first active booking
        const targetId = queryId || selectedBookingId;
        const matched = data.bookings.find(b => b.id === targetId || b.booking_code === targetId);
        if (matched) {
          setSelectedBooking(matched);
          setSelectedBookingId(matched.id);
        } else if (data.bookings.length > 0) {
          setSelectedBooking(data.bookings[0]);
          setSelectedBookingId(data.bookings[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching tracking data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [queryId]);

  const handleSelectChange = (id) => {
    setSelectedBookingId(id);
    const found = bookings.find(b => b.id === id);
    if (found) setSelectedBooking(found);
  };

  // State advance simulation shortcut for CSE 3292 evaluation
  const handleSimulateNextStep = async () => {
    if (!selectedBooking) return;
    const current = selectedBooking.status;

    let nextStatus = '';
    let note = '';
    let serviceRecord = null;

    if (current === 'booking_requested') {
      nextStatus = 'booking_confirmed';
      note = 'Dispatcher confirmed booking schedule';
    } else if (current === 'booking_confirmed') {
      nextStatus = 'technician_assigned';
      note = 'Assigned certified master specialist';
    } else if (current === 'technician_assigned') {
      nextStatus = 'on_the_way';
      note = 'Technician en route to premises';
    } else if (current === 'on_the_way') {
      nextStatus = 'arrived';
      note = 'Technician on premises';
    } else if (current === 'arrived') {
      nextStatus = 'in_progress';
      note = 'Repair and maintenance commenced';
    } else if (current === 'in_progress') {
      nextStatus = 'completed';
      note = 'Repair completed and inspected';
      serviceRecord = {
        repair_description: 'Replaced brass coupling valve, re-threaded joint, and verified seal pressure.',
        parts_used: [{ name: 'Brass Coupling Seal', cost: 24.00 }],
        labor_charges: 60.00,
        additional_charges: 0.00,
        warranty_months: 6,
      };
    }

    if (!nextStatus) return;

    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          next_status: nextStatus,
          note,
          service_record: serviceRecord,
          actor_role: 'evaluator',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedBooking(data.booking);
        fetchBookings();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Selector Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Real-Time Service Tracker
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Follow your repair progress live with automatic Supabase state synchronisation.
          </p>
        </div>

        {bookings.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-navy-500 hidden sm:inline">Active Booking:</span>
            <select
              value={selectedBookingId}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-navy-200 bg-white text-navy-900 shadow-sm"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.booking_code} - {b.service_name} ({b.status.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-navy-500">Loading tracking telemetry...</div>
      ) : (
        <ServiceTracker
          booking={selectedBooking}
          onRefresh={fetchBookings}
          onSimulateNextStep={handleSimulateNextStep}
        />
      )}
    </div>
  );
}

export default function CustomerTrackingPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-navy-500">Loading service tracker...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
