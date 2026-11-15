'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, ShieldCheck, Zap, ArrowRight, Layers } from 'lucide-react';
import { INITIAL_SERVICES } from '@/lib/data/demoData';

export default function AdminPricingPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Transparent Rate Card Governance
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            FixMate guarantee: Standardized pricing transparently visible to customers before confirmation.
          </p>
        </div>

        <Link
          href="/admin/services"
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Layers className="w-4 h-4" />
          <span>Manage Rates in Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {INITIAL_SERVICES.map((svc) => (
          <div key={svc.id} className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full inline-block">
                {svc.category}
              </span>
              <h3 className="font-bold text-navy-900 text-base">{svc.name}</h3>

              <div className="space-y-2 text-xs text-navy-600 pt-2 border-t border-navy-100">
                <div className="flex justify-between">
                  <span>Inspection Fee:</span>
                  <span className="font-bold text-navy-900">${svc.base_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor Charge:</span>
                  <span className="font-bold text-navy-900">${svc.labor_charge?.toFixed(2) || '30.00'}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Emergency Surcharge:</span>
                  <span className="font-bold">+${svc.emergency_fee?.toFixed(2) || '25.00'}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-navy-50 rounded-2xl text-[11px] text-navy-600 flex items-center justify-between font-bold">
              <span>Standard Baseline</span>
              <span className="text-primary-600 font-black text-sm">
                ${(svc.base_price + (svc.labor_charge || 30)).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
