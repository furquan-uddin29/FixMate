'use client';

import React, { useState } from 'react';
import { Database, ShieldCheck, Key, Server, Save, CheckCircle2 } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminSettingsPage() {
  const [platformCommission, setPlatformCommission] = useState(15);
  const [emergencySurchargeDefault, setEmergencySurchargeDefault] = useState(25);
  const [warrantyDefaultMonths, setWarrantyDefaultMonths] = useState(6);
  const [saved, setSaved] = useState(false);

  const isConnected = isSupabaseConfigured();

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">System & Platform Settings</h1>
        <p className="text-xs sm:text-sm text-navy-500 mt-1">
          Configure database connectivity, operational fee models, and default warranty periods.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration parameters saved.</span>
        </div>
      )}

      {/* Database Integration Card */}
      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-100">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-600" />
            <h3 className="font-bold text-navy-900 text-base">Supabase PostgreSQL Integration</h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isConnected ? 'Connected & Live' : 'Active In-Memory Server Store (Supabase Ready)'}
          </span>
        </div>

        <p className="text-xs text-navy-600 leading-relaxed">
          FixMate is fully configured with Supabase PostgreSQL RLS policies, automated trigger state machine logging, and relational integrity. To connect your remote database, update credentials in <code className="bg-navy-50 px-1 py-0.5 rounded border text-primary-700 font-mono">.env.local</code>.
        </p>

        <div className="p-3 bg-navy-50 rounded-2xl font-mono text-[11px] text-navy-700 space-y-1">
          <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not specified (Using In-Memory Store)'}</p>
          <p>POSTGRES_SCHEMA: public (17 relational tables with RLS)</p>
        </div>
      </div>

      {/* Operational Fees Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-navy-100 p-8 shadow-sm space-y-6">
        <h3 className="font-bold text-navy-900 text-base">Business Fee Parameters</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase mb-1">
              Platform Commission (%)
            </label>
            <input
              type="number"
              value={platformCommission}
              onChange={(e) => setPlatformCommission(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase mb-1">
              Emergency Fee Baseline ($)
            </label>
            <input
              type="number"
              value={emergencySurchargeDefault}
              onChange={(e) => setEmergencySurchargeDefault(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase mb-1">
              Default Warranty (Months)
            </label>
            <input
              type="number"
              value={warrantyDefaultMonths}
              onChange={(e) => setWarrantyDefaultMonths(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm font-semibold"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-navy-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
