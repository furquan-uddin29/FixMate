'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Compass,
  Star,
  ShieldAlert,
  User,
  LogOut,
  Wrench,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export default function CustomerLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Overview', href: '/customer', icon: LayoutDashboard },
    { label: 'Book a Service', href: '/customer/book-service', icon: Calendar, badge: 'New' },
    { label: 'My Bookings', href: '/customer/bookings', icon: Clock },
    { label: 'Track Service', href: '/customer/tracking', icon: Compass },
    { label: 'My Reviews', href: '/customer/reviews', icon: Star },
    { label: 'Complaints', href: '/customer/complaints', icon: ShieldAlert },
    { label: 'My Profile', href: '/customer/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-navy-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-navy-100 shadow-sm shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-navy-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-600/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black text-navy-900 tracking-tight">Fix<span className="text-primary-600">Mate</span></span>
              <span className="text-[10px] text-navy-400 font-bold block uppercase tracking-wider">
                Customer Portal
              </span>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-5 border-b border-navy-100 bg-navy-50/40">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
              alt={user?.full_name || 'Customer'}
              className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-navy-900 text-sm truncate">{user?.full_name || 'Sarah Jenkins'}</h4>
              <p className="text-[11px] text-navy-400 truncate">{user?.email || 'sarah.jenkins@example.com'}</p>
              <span className="inline-block mt-0.5 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                Verified Member
              </span>
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
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                    : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-navy-100 space-y-2">
          <Link
            href="/customer/book-service"
            className="w-full py-2.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-primary-400" />
            <span>Book New Service</span>
          </Link>
          <button
            onClick={logout}
            className="w-full py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Navbar Header */}
        <header className="lg:hidden bg-white border-b border-navy-100 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="font-black text-navy-900 text-lg">Fix<span className="text-primary-600">Mate</span></span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-navy-600 rounded-lg"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-b border-navy-100 p-4 space-y-2 animate-fadeIn">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                  pathname === item.href
                    ? 'bg-primary-600 text-white'
                    : 'text-navy-700 hover:bg-navy-50'
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
              className="w-full text-left px-3 py-2 text-rose-600 text-xs font-bold"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Page Inner Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
