'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, ShieldCheck, Star, MapPin, Power, Phone, Mail } from 'lucide-react';

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTechs = async () => {
    try {
      const res = await fetch('/api/technicians');
      const data = await res.json();
      if (data.technicians) setTechnicians(data.technicians);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechs();
  }, []);

  const handleToggle = async (tech) => {
    const nextVal = !tech.is_available;
    try {
      await fetch(`/api/technicians/${tech.id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: nextVal }),
      });
      fetchTechs();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Technicians Roster & Performance
        </h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Active roster of trade technicians, ratings, skills, and dispatch availability.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-navy-500">Loading technician registry...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((t) => (
            <div key={t.id} className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src={t.avatar_url} alt={t.full_name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                  <div>
                    <h3 className="font-bold text-navy-900 text-base">{t.full_name}</h3>
                    <p className="text-xs text-navy-500">{t.service_categories.join(', ')}</p>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{t.rating} ({t.completed_jobs_count} completed)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-navy-600 bg-navy-50/60 p-3 rounded-2xl border border-navy-100">
                  <p><strong>Contact:</strong> {t.phone}</p>
                  <p><strong>Experience:</strong> {t.experience_years} years in field</p>
                  <p><strong>Location:</strong> {t.address || t.city}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {t.skills.map((s, idx) => (
                    <span key={idx} className="text-[10px] bg-navy-100 text-navy-700 px-2 py-0.5 rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-navy-100 flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${t.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {t.is_available ? 'Online (Ready)' : 'Offline'}
                </span>

                <button
                  onClick={() => handleToggle(t)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-navy-100 hover:bg-navy-200 text-navy-800 transition"
                >
                  Toggle Availability
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
