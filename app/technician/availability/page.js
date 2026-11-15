'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import AvailabilityToggle from '@/components/technician/AvailabilityToggle';
import { Calendar, Clock, Check, Save, ShieldCheck } from 'lucide-react';

export default function TechnicianAvailabilityPage() {
  const { user } = useAuth();
  const [savedMsg, setSavedMsg] = useState('');

  const [schedule, setSchedule] = useState([
    { day: 'Monday', active: true, start: '08:00 AM', end: '06:00 PM' },
    { day: 'Tuesday', active: true, start: '08:00 AM', end: '06:00 PM' },
    { day: 'Wednesday', active: true, start: '08:00 AM', end: '06:00 PM' },
    { day: 'Thursday', active: true, start: '08:00 AM', end: '06:00 PM' },
    { day: 'Friday', active: true, start: '08:00 AM', end: '06:00 PM' },
    { day: 'Saturday', active: true, start: '09:00 AM', end: '04:00 PM' },
    { day: 'Sunday', active: false, start: '10:00 AM', end: '02:00 PM' },
  ]);

  const handleToggleDay = (idx) => {
    const updated = [...schedule];
    updated[idx].active = !updated[idx].active;
    setSchedule(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg('Weekly availability calendar saved and synced with dispatcher dispatch engine.');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Duty Status & Availability Management
        </h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Configure your on-demand dispatch availability, active working days, and operating hours.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Main Switch Component */}
      <AvailabilityToggle
        technician={{ id: 'tech-01', is_available: true }}
        onToggle={(val) => {}}
      />

      {/* Working Days & Schedule Card */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-navy-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-bold text-navy-900 text-base">Weekly Working Roster</h3>
          <p className="text-xs text-navy-500 mt-0.5">
            The dispatcher algorithm only routes customer appointments within your active working windows.
          </p>
        </div>

        <div className="divide-y divide-navy-100">
          {schedule.map((slot, idx) => (
            <div key={slot.day} className="py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`day-${idx}`}
                  checked={slot.active}
                  onChange={() => handleToggleDay(idx)}
                  className="w-4 h-4 text-emerald-600 rounded border-navy-300"
                />
                <label htmlFor={`day-${idx}`} className={`font-bold text-xs ${slot.active ? 'text-navy-900' : 'text-navy-400 line-through'}`}>
                  {slot.day}
                </label>
              </div>

              {slot.active ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-navy-500">Working hours:</span>
                  <span className="font-semibold text-navy-800 bg-navy-50 px-2.5 py-1 rounded-lg border border-navy-200">
                    {slot.start} – {slot.end}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-lg">
                  Rest Day / Off Duty
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-navy-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Working Hours</span>
          </button>
        </div>
      </form>
    </div>
  );
}
