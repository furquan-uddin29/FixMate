'use client';

import React from 'react';
import Link from 'next/link';
import {
  WORKFLOW_STEPS,
  BOOKING_STATES,
  getStatusMeta,
  getStepNumber,
} from '@/lib/state-machine/bookingWorkflow';
import {
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Shield,
  Truck,
  Wrench,
  Award,
  RefreshCw,
  Printer,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function ServiceTracker({ booking, onRefresh, onSimulateNextStep }) {
  if (!booking) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-navy-100 text-center text-navy-500">
        No active booking selected for tracking.
      </div>
    );
  }

  const currentStepNum = getStepNumber(booking.status);
  const isTerminal = booking.status === BOOKING_STATES.CANCELLED || booking.status === BOOKING_STATES.REJECTED;

  return (
    <div className="bg-white rounded-3xl border border-navy-100 shadow-xl overflow-hidden space-y-8 p-6 sm:p-8">
      {/* Tracker Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-100">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-black px-2.5 py-1 rounded bg-navy-100 text-navy-800 tracking-wider">
              {booking.booking_code}
            </span>
            <StatusBadge status={booking.status} size="lg" />
            {booking.is_emergency && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                ⚡ Emergency Dispatch
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-navy-900 mt-2">
            {booking.service_name || 'Home Maintenance Service'}
          </h2>
          <p className="text-xs sm:text-sm text-navy-500 mt-0.5">
            Placed on {new Date(booking.created_at).toLocaleString()}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl border border-navy-200 text-navy-600 hover:text-navy-900 hover:bg-navy-50 transition"
              title="Refresh Status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {booking.status === 'completed' && (
            <Link
              href={`/customer/bookings/${booking.id}/receipt`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              View Digital Receipt
            </Link>
          )}

          {/* Teacher/Evaluator State Simulator Shortcut */}
          {onSimulateNextStep && !isTerminal && booking.status !== 'completed' && (
            <button
              onClick={onSimulateNextStep}
              className="px-3.5 py-2 bg-navy-900 text-white hover:bg-navy-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              title="Advances state machine to next milestone for evaluation"
            >
              <span>Advance Step &rarr;</span>
            </button>
          )}
        </div>
      </div>

      {/* 8-Step Visual Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
            Live Repair Milestone Sequence
          </h3>
          <span className="text-xs font-semibold text-primary-600">
            {isTerminal ? 'Workflow Ended' : `Milestone ${currentStepNum || 1} of 7`}
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="relative">
          {/* Mobile vertical, Desktop horizontal */}
          <div className="hidden lg:grid grid-cols-7 gap-2 relative">
            {/* Connecting Bar */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-navy-100 z-0" />
            <div
              className="absolute top-5 left-8 h-1 bg-primary-600 transition-all duration-500 z-0"
              style={{
                width: `${Math.min(100, Math.max(0, ((currentStepNum - 1) / 6) * 100))}%`,
              }}
            />

            {WORKFLOW_STEPS.map((s, idx) => {
              const isPassed = currentStepNum > s.step;
              const isCurrent = currentStepNum === s.step;

              return (
                <div key={s.status} className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                      isPassed
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : isCurrent
                        ? 'bg-navy-950 text-white ring-4 ring-navy-200 animate-bounce'
                        : 'bg-white border-2 border-navy-200 text-navy-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                  </div>
                  <h4
                    className={`mt-3 text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-primary-700'
                        : isPassed
                        ? 'text-navy-900'
                        : 'text-navy-400'
                    }`}
                  >
                    {s.shortLabel}
                  </h4>
                  <p className="text-[10px] text-navy-400 mt-0.5 line-clamp-2 px-1">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile / Vertical View */}
          <div className="lg:hidden space-y-4">
            {WORKFLOW_STEPS.map((s) => {
              const isPassed = currentStepNum > s.step;
              const isCurrent = currentStepNum === s.step;

              return (
                <div
                  key={s.status}
                  className={`flex items-start gap-4 p-3 rounded-2xl transition ${
                    isCurrent ? 'bg-primary-50/70 border border-primary-200' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPassed
                        ? 'bg-primary-600 text-white'
                        : isCurrent
                        ? 'bg-navy-950 text-white animate-pulse'
                        : 'bg-navy-100 text-navy-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                  </div>
                  <div>
                    <h5
                      className={`text-sm font-bold ${
                        isCurrent ? 'text-primary-800' : 'text-navy-800'
                      }`}
                    >
                      {s.label}
                    </h5>
                    <p className="text-xs text-navy-500">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking & Technician Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-navy-100">
        {/* Assigned Technician Card */}
        <div className="bg-navy-50/60 p-5 rounded-2xl border border-navy-100">
          <span className="text-xs font-bold text-navy-500 uppercase tracking-wider block mb-3">
            Assigned Service Specialist
          </span>

          {booking.assigned_technician_id && booking.technician_name ? (
            <div className="flex items-center gap-4">
              <img
                src={
                  booking.technician_avatar ||
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'
                }
                alt={booking.technician_name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-navy-900 text-base">{booking.technician_name}</h4>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-navy-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-primary-600" />
                  <span>{booking.technician_phone || '+1 (555) 234-5678'}</span>
                </p>
                <p className="text-xs text-navy-500 flex items-center gap-1 mt-0.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Identity & Background Checked</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <User className="w-8 h-8 text-navy-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-navy-700">Dispatcher Matching Technician</p>
              <p className="text-xs text-navy-400 mt-1">
                Our algorithm is matching the top-rated local specialist for your area.
              </p>
            </div>
          )}
        </div>

        {/* Location & Schedule Card */}
        <div className="bg-navy-50/60 p-5 rounded-2xl border border-navy-100 space-y-2.5 text-xs text-navy-600">
          <span className="text-xs font-bold text-navy-500 uppercase tracking-wider block mb-1">
            Service Details & Schedule
          </span>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-navy-900">{booking.preferred_date}</p>
              <p className="text-navy-500">{booking.preferred_time_slot}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-navy-900">{booking.service_address}</p>
              <p className="text-navy-500">
                {booking.area}, {booking.city} {booking.postal_code}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-navy-200 flex justify-between font-bold text-navy-900 text-sm">
            <span>Estimated Charges</span>
            <span className="text-primary-600">${Number(booking.estimated_cost || 50).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Status Audit Log History */}
      {booking.status_history && booking.status_history.length > 0 && (
        <div className="pt-4 border-t border-navy-100">
          <h4 className="text-xs font-bold text-navy-700 uppercase tracking-wider mb-3">
            Real-Time Audit Trail (Supabase Events)
          </h4>
          <div className="space-y-2">
            {booking.status_history.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-navy-50/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="font-semibold text-navy-900 capitalize">{h.status.replace(/_/g, ' ')}:</span>
                  <span className="text-navy-600">{h.note}</span>
                </div>
                <span className="text-[11px] text-navy-400">
                  {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
