'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Wrench,
  ShieldCheck,
  Calendar,
  Send,
  DollarSign,
  ShieldAlert,
  Star,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Layers,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Job Dispatch Center', href: '/admin/dispatch', icon: Send, badge: 'Hot' },
    { label: 'All Bookings', href: '/admin/bookings', icon: Calendar },
    { label: 'Technician Verification', href: '/admin/verification', icon: ShieldCheck, badge: '1 Pending' },
    { label: 'Technicians Registry', href: '/admin/technicians', icon: Wrench },
    { label: 'Customer Management', href: '/admin/customers', icon: Users },
    { label: 'Services & Rates', href: '/admin/services', icon: Layers },
    { label: 'Pricing Rate Cards', href: '/admin/pricing', icon: DollarSign },
    { label: 'Complaints & Disputes', href: '/admin/complaints', icon: ShieldAlert },
    { label: 'Warranty Tracking', href: '/admin/warranties', icon: Award },
    { label: 'Business Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-navy-50/50">
      {/* Admin Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-navy-950 text-white border-r border-navy-800 shadow-2xl shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-navy-800">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight">Fix<span className="text-primary-400">Mate</span></span>
              <span className="text-[10px] text-primary-300 font-bold block uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Administrator Profile Card */}
        <div className="p-5 border-b border-navy-800 bg-navy-900/60">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80'}
              alt={user?.full_name || 'Admin'}
              className="w-11 h-11 rounded-xl object-cover border-2 border-primary-500 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm truncate">{user?.full_name || 'Alexander Sterling'}</h4>
              <p className="text-[11px] text-navy-400 truncate">{user?.email || 'admin@fixmate.test'}</p>
              <span className="inline-block mt-0.5 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-primary-900/80 text-primary-300 border border-primary-700/50">
                Super Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
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
                      isActive ? 'bg-navy-950 text-white' : 'bg-primary-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom sign out */}
        <div className="p-4 border-t border-navy-800">
          <button
            onClick={logout}
            className="w-full py-2.5 text-rose-400 hover:bg-rose-950/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-navy-950 text-white border-b border-navy-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-black text-white text-lg">Fix<span className="text-primary-400">Mate Admin</span></span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-navy-300 rounded-lg"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {mobileOpen && (
          <div className="lg:hidden bg-navy-950 text-white border-b border-navy-800 p-4 space-y-1.5 animate-fadeIn">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                  pathname === item.href ? 'bg-primary-600 text-white' : 'text-navy-300'
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
