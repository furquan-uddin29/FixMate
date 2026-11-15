'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Database, UserCheck, Shield, Wrench, ChevronRight, Check } from 'lucide-react';

export default function DatabaseBanner() {
  const { user, role, switchRole } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const isConnected = isSupabaseConfigured();

  return (
    <>
      <div className="bg-navy-950 text-white text-xs border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="font-semibold text-navy-200">
              {isConnected ? 'Supabase PostgreSQL: Connected' : 'FixMate Live In-Memory Data Store (Supabase Ready)'}
            </span>
            <button
              onClick={() => setShowConfigModal(true)}
              className="text-primary-400 hover:text-primary-300 underline font-medium ml-1 transition-colors"
            >
              Setup Guide
            </button>
          </div>

          {/* Quick Role Switcher for CSE 3292 Evaluation */}
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-navy-400 hidden sm:inline">Role Switcher:</span>
            <button
              onClick={() => switchRole('customer')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                role === 'customer'
                  ? 'bg-primary-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Customer
            </button>
            <button
              onClick={() => switchRole('technician')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                role === 'technician'
                  ? 'bg-primary-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Technician
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                role === 'admin'
                  ? 'bg-primary-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-navy-800 text-navy-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Instructions Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-navy-100 text-navy-900 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-navy-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold">Supabase PostgreSQL Integration</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-navy-400 hover:text-navy-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-navy-600">
              <p>
                FixMate is built with first-class <strong>Supabase & PostgreSQL</strong> integration including Row-Level
                Security (RLS), state machine audit triggers, and relational constraints.
              </p>

              <div className="bg-navy-50 p-4 rounded-xl space-y-2 border border-navy-100 font-mono text-xs text-navy-800">
                <p className="font-semibold text-navy-900 font-sans">To connect your live Supabase project:</p>
                <ol className="list-decimal list-inside space-y-1 font-sans">
                  <li>Create a project at <span className="text-primary-600 font-medium">https://supabase.com</span></li>
                  <li>Copy SQL from <code className="bg-white px-1 py-0.5 rounded border">supabase/migrations/20240101000000_init_fixmate.sql</code></li>
                  <li>Paste into Supabase SQL Editor and click <strong>Run</strong></li>
                  <li>Put your credentials in <code className="bg-white px-1 py-0.5 rounded border">.env.local</code>:</li>
                </ol>
                <pre className="p-2 bg-navy-900 text-navy-100 rounded-lg overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
                </pre>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Full Functionality Active:</strong> Even without remote keys, the application executes real
                  REST API route handlers, validates the 8-stage state machine, creates bookings, dispatches
                  technicians, submits reviews, and generates receipts!
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-5 py-2.5 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
