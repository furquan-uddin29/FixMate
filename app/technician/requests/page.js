'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  BellRing,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  ShieldCheck,
  Check,
} from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';

export default function TechnicianRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const loadRequests = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        // Show bookings that are requested or confirmed and not yet assigned
        const unassigned = data.bookings.filter(
          b => ['booking_requested', 'booking_confirmed'].includes(b.status) && !b.assigned_technician_id
        );
        setRequests(unassigned);
      }
    } catch (err) {
      console.error('Failed to load job requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAcceptRequest = async (bookingId) => {
    setProcessingId(bookingId);
    setActionMsg('');

    try {
      // Tech accepts: dispatch technician assignment
      const res = await fetch(`/api/bookings/${bookingId}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technician_id: user?.technician_id || 'tech-01' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to accept booking');

      setActionMsg(`Booking ${data.booking.booking_code} accepted! It is now added to your Active Jobs.`);
      loadRequests();
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineRequest = (bookingId) => {
    // Locally dismiss from request pool
    setRequests(requests.filter(r => r.id !== bookingId));
    setActionMsg('Job request declined.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Incoming Job Requests Pool
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {requests.length} Available
          </span>
        </div>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Review problem details, location, and rate card. Accepting assigns you exclusively to the booking.
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg('')} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-navy-500">Scanning dispatch pool...</div>
      ) : requests.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-navy-100 text-center p-8 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">All Job Requests Handled!</h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            There are no pending unassigned bookings in your zone right now. Check back shortly or view your Active Jobs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm hover:shadow-md transition-shadow space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-navy-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-navy-100 text-navy-800">
                      {req.booking_code}
                    </span>
                    <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                      {req.service_category}
                    </span>
                    {req.is_emergency && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        ⚡ Urgent
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-navy-400 block">Estimated Payout</span>
                    <span className="text-base font-black text-emerald-600">
                      ${(req.estimated_cost || 50).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-navy-900 text-base">{req.service_name}</h3>
                  <h4 className="font-semibold text-xs text-navy-700 mt-1">{req.problem_title}</h4>
                  <p className="text-xs text-navy-600 mt-1 leading-relaxed bg-navy-50/60 p-3 rounded-xl border border-navy-100">
                    {req.problem_description}
                  </p>
                </div>

                {/* Location & Time */}
                <div className="space-y-1.5 text-xs text-navy-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>{req.service_address}, {req.area}, {req.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>{req.preferred_date} • {req.preferred_time_slot}</span>
                  </div>
                </div>
              </div>

              {/* Accept / Decline CTA */}
              <div className="pt-4 border-t border-navy-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleDeclineRequest(req.id)}
                  className="px-4 py-2 text-xs font-bold text-navy-500 hover:text-navy-900 hover:bg-navy-50 rounded-xl transition"
                >
                  Decline
                </button>
                <button
                  type="button"
                  disabled={processingId === req.id}
                  onClick={() => handleAcceptRequest(req.id)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{processingId === req.id ? 'Claiming Job...' : 'Accept & Claim Job'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
