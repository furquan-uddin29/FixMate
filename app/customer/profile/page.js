'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { User, Phone, Mail, MapPin, CheckCircle2, Shield } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || 'Sarah Jenkins');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 111-2233');
  const [address, setAddress] = useState(user?.address || '742 Evergreen Terrace, Apt 4B');
  const [city, setCity] = useState(user?.city || 'Downtown Metro');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">Customer Profile</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Manage your personal details, default service address, and notification preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-navy-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-navy-100">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
            alt="Profile Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
          />
          <div>
            <h3 className="font-bold text-navy-900 text-base">{fullName}</h3>
            <p className="text-xs text-navy-500">{user?.email}</p>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
              Verified FixMate Member
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              Contact Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              Primary Service Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
              City / Metro Region
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-navy-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
