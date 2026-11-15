'use client';

import React from 'react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colorStyles = {
    blue: {
      bg: 'bg-primary-50 text-primary-600',
      border: 'border-primary-100',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-purple-100',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
    },
  }[color] || { bg: 'bg-navy-50 text-navy-600', border: 'border-navy-100' };

  return (
    <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-navy-500">
          {title}
        </span>
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colorStyles.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <span className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          {value}
        </span>
        {subtitle && (
          <p className="text-xs text-navy-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
