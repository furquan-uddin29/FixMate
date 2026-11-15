'use client';

import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import {
  UserCheck,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  AlertCircle,
  Wrench,
  Search,
} from 'lucide-react';

export default function DispatchModal({ isOpen, onClose, booking, onDispatched }) {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [filterCategory, setFilterCategory] = useState(booking?.service_category || 'All');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchTechs() {
      try {
        const res = await fetch('/api/technicians');
        const data = await res.json();
        if (data.technicians) {
          setTechnicians(data.technicians);
        }
      } catch (err) {
        console.error('Failed to load technicians:', err);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchTechs();
      if (booking?.service_category) {
        setFilterCategory(booking.service_category);
      }
    }
  }, [isOpen, booking]);

  const filteredTechs = technicians.filter((t) => {
    if (filterCategory !== 'All' && !t.service_categories.includes(filterCategory)) {
      return false;
    }
    return true;
  });

  const handleDispatch = async () => {
    if (!selectedTechId) {
      setErrorMsg('Please select an eligible verified technician from the list.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/bookings/${booking.id}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technician_id: selectedTechId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch technician');

      if (onDispatched) onDispatched(data.booking);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispatch Verified Technician to Booking" maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Booking summary banner */}
        <div className="p-4 bg-navy-50 rounded-2xl border border-navy-100 flex items-start justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-navy-900">{booking?.booking_code}</span>
              <span className="font-semibold text-primary-700 bg-primary-100 px-2 py-0.5 rounded">
                {booking?.service_category}
              </span>
            </div>
            <p className="font-bold text-navy-900 mt-1">{booking?.problem_title}</p>
            <p className="text-navy-500 mt-0.5">{booking?.service_address}, {booking?.city}</p>
          </div>
          <div className="text-right">
            <span className="text-navy-400 block">Preferred Schedule</span>
            <span className="font-bold text-navy-800">{booking?.preferred_date}</span>
            <span className="text-navy-500 block">{booking?.preferred_time_slot}</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-navy-700 uppercase tracking-wider">
            Available Verified Specialists ({filteredTechs.length})
          </span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-navy-200 text-navy-800"
          >
            <option value="All">All Trade Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="AC Repair">AC Repair</option>
            <option value="Appliance Repair">Appliance Repair</option>
            <option value="Painting">Painting</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Smart Home">Smart Home</option>
          </select>
        </div>

        {/* Technicians list */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-8 text-center text-xs text-navy-500">Loading technician registry...</div>
          ) : filteredTechs.length === 0 ? (
            <div className="py-8 text-center text-xs text-navy-500">
              No technicians found for category "{filterCategory}".
            </div>
          ) : (
            filteredTechs.map((tech) => {
              const isEligible = tech.verification_status === 'verified' && tech.is_available;
              const isSelected = selectedTechId === tech.id;

              return (
                <div
                  key={tech.id}
                  onClick={() => {
                    if (isEligible) setSelectedTechId(tech.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/70 ring-2 ring-primary-500/20 shadow-sm'
                      : isEligible
                      ? 'border-navy-100 hover:border-navy-300 hover:bg-navy-50/50 cursor-pointer'
                      : 'border-navy-100 bg-navy-50/40 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={tech.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'}
                      alt={tech.full_name}
                      className="w-11 h-11 rounded-xl object-cover border"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-navy-900 text-sm">{tech.full_name}</h4>
                        {tech.verification_status === 'verified' ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                            Pending Review
                          </span>
                        )}
                        {!tech.is_available && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
                            Offline
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-navy-500 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {tech.rating} ({tech.completed_jobs_count} jobs)
                        </span>
                        <span>•</span>
                        <span>{tech.service_categories.join(', ')}</span>
                        <span>•</span>
                        <span>{tech.experience_years} yrs exp</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <input
                      type="radio"
                      name="selectedTech"
                      checked={isSelected}
                      disabled={!isEligible}
                      onChange={() => setSelectedTechId(tech.id)}
                      className="w-4 h-4 text-primary-600"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-100">
          <span className="text-xs text-navy-400">
            Assignment transitions status to <strong>technician_assigned</strong>
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-navy-600 hover:bg-navy-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting || !selectedTechId}
              onClick={handleDispatch}
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-md disabled:opacity-50 transition"
            >
              {submitting ? 'Dispatching...' : 'Confirm Dispatch'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
