'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  AlertCircle,
  Truck,
  CheckCircle2,
  Wrench,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import ServiceRecordModal from './ServiceRecordModal';

export default function JobCard({ booking, onStatusUpdated }) {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdateStatus = async (nextStatus, note) => {
    setUpdating(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/bookings/${booking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          next_status: nextStatus,
          actor_role: 'technician',
          note: note || `Technician updated job status to ${nextStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      if (onStatusUpdated) onStatusUpdated(data.booking);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-navy-100 shadow-md hover:shadow-lg transition-all p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-navy-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2 py-0.5 rounded bg-navy-100 text-navy-800">
                {booking.booking_code}
              </span>
              <StatusBadge status={booking.status} />
              {booking.is_emergency && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  ⚡ Emergency
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-navy-900 mt-1.5">{booking.service_name}</h3>
          </div>

          <div className="text-right">
            <span className="text-xs text-navy-400 block">Estimated Payout</span>
            <span className="text-lg font-black text-emerald-600">
              ${(booking.final_cost || booking.estimated_cost || 50).toFixed(2)}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Customer & Location */}
        <div className="space-y-2 text-xs text-navy-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-navy-900">{booking.customer_name} • {booking.customer_phone}</p>
              <p className="text-navy-500">{booking.service_address}, {booking.area}, {booking.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
            <span>Scheduled: <strong>{booking.preferred_date}</strong> ({booking.preferred_time_slot})</span>
          </div>

          {booking.special_instructions && (
            <div className="p-2.5 bg-navy-50 rounded-xl text-navy-700">
              <strong>Entry Note:</strong> {booking.special_instructions}
            </div>
          )}
        </div>

        {/* Problem Description */}
        <div className="bg-navy-50/50 p-4 rounded-2xl border border-navy-100">
          <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wider mb-1">
            Issue: {booking.problem_title}
          </h4>
          <p className="text-xs text-navy-600 line-clamp-3 leading-relaxed">
            {booking.problem_description}
          </p>
          {booking.problem_images && booking.problem_images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {booking.problem_images.map((img, i) => (
                <a key={i} href={img} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-lg overflow-hidden border border-navy-200 block">
                  <img src={img} alt="issue" className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* State Machine Transition Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/customer/tracking?id=${booking.id}`}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <span>Audit History</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            {booking.status === 'technician_assigned' && (
              <button
                disabled={updating}
                onClick={() => handleUpdateStatus('on_the_way', 'Technician departed for site')}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
              >
                <Truck className="w-4 h-4" />
                <span>Mark On the Way</span>
              </button>
            )}

            {booking.status === 'on_the_way' && (
              <button
                disabled={updating}
                onClick={() => handleUpdateStatus('arrived', 'Technician arrived at customer location')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                <span>Mark Arrived</span>
              </button>
            )}

            {booking.status === 'arrived' && (
              <button
                disabled={updating}
                onClick={() => handleUpdateStatus('in_progress', 'Technician commenced diagnostic & active repair')}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
              >
                <Wrench className="w-4 h-4" />
                <span>Start Repair</span>
              </button>
            )}

            {booking.status === 'in_progress' && (
              <button
                onClick={() => setShowCompletionModal(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <Award className="w-4 h-4" />
                <span>Finish & Record Job</span>
              </button>
            )}

            {booking.status === 'completed' && (
              <Link
                href={`/customer/bookings/${booking.id}/receipt`}
                className="px-4 py-2 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <span>View Receipt & Warranty</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {showCompletionModal && (
        <ServiceRecordModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          booking={booking}
          onCompleted={(res) => {
            if (onStatusUpdated) onStatusUpdated(res.booking);
          }}
        />
      )}
    </>
  );
}
