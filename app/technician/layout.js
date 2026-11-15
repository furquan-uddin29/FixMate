'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  LayoutDashboard,
  BellRing,
  Wrench,
  Clock,
  History,
  DollarSign,
  Star,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Power,
} from 'lucide-react';

export default function TechnicianLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Overview', href: '/technician', icon: LayoutDashboard },
    { label: 'New Requests', href: '/technician/requests', icon: BellRing, badge: 'Live' },
    { label: 'My Active Jobs', href: '/technician/jobs', icon: Wrench },
    { label: 'Duty & Availability', href: '/technician/availability', icon: Clock },
    { label: 'Job History', href: '/technician/history', icon: History },
    { label: 'Earnings & Payouts', href: '/technician/earnings', icon: DollarSign },
    { label: 'Client Reviews', href: '/technician/reviews', icon: Star },
    { label: 'Pro Profile', href: '/technician/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-navy-50/50">
      {/* Technician Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-navy-950 text-white border-r border-navy-800 shadow-xl shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-navy-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-navy-950 shadow-md">
              <Wrench className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight">Fix<span className="text-amber-400">Mate</span></span>
              <span className="text-[10px] text-amber-300 font-bold block uppercase tracking-wider">
                Technician Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Technician Profile Card */}
        <div className="p-5 border-b border-navy-800 bg-navy-900/60">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'}
              alt={user?.full_name || 'Technician'}
              className="w-11 h-11 rounded-xl object-cover border-2 border-amber-400 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm truncate">{user?.full_name || 'David Miller'}</h4>
              <p className="text-[11px] text-navy-400 truncate">Plumbing & Master Pipe Repair</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified Pro
                </span>
                <span className="text-[9px] font-bold text-amber-400">★ 4.95</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-navy-950 shadow-md shadow-amber-500/20'
                    : 'text-navy-300 hover:text-white hover:bg-navy-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${
                      isActive ? 'bg-navy-950 text-white' : 'bg-amber-400 text-navy-950 animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-navy-800 space-y-2">
          <Link
            href="/technician/availability"
            className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-emerald-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-emerald-800/40"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Duty: Online & Active</span>
          </Link>
          <button
            onClick={logout}
            className="w-full py-2 text-rose-400 hover:bg-rose-950/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-navy-950 text-white border-b border-navy-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-navy-950 flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="font-black text-white text-lg">Fix<span className="text-amber-400">Mate Pro</span></span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-navy-300 rounded-lg"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-navy-950 text-white border-b border-navy-800 p-4 space-y-2 animate-fadeIn">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                  pathname === item.href ? 'bg-amber-500 text-navy-950' : 'text-navy-300'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-rose-400 text-xs font-bold"
            >
              Sign Out
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
