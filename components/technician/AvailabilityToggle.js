'use client';

import React, { useState } from 'react';
import { Power, Check, X, Clock, Calendar } from 'lucide-react';

export default function AvailabilityToggle({ technician, onToggle }) {
  const [isAvailable, setIsAvailable] = useState(technician?.is_available ?? true);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const nextVal = !isAvailable;
    setLoading(true);
    try {
      const res = await fetch(`/api/technicians/${technician.id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: nextVal }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAvailable(nextVal);
        if (onToggle) onToggle(nextVal);
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <h3 className="font-bold text-navy-900 text-base">
            Dispatch Duty Status: {isAvailable ? 'Online & Ready for Jobs' : 'Offline / On Break'}
          </h3>
        </div>
        <p className="text-xs text-navy-500 mt-1">
          {isAvailable
            ? 'Your profile is active in the dispatcher queue. You will receive real-time job offers.'
            : 'You are currently hidden from automated customer job matching.'}
        </p>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleToggle}
        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
          isAvailable
            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        <Power className="w-4 h-4" />
        <span>{isAvailable ? 'Go Offline' : 'Go Online Now'}</span>
      </button>
    </div>
  );
}
