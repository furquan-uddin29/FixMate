'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { getRoleHome } from '@/lib/auth/roles';
import {
  Wrench,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight,
  Shield,
  LayoutDashboard,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const portalHref = role ? getRoleHome(role) : '/customer';

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary-700 to-primary-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-navy-900 tracking-tight">Fix<span className="text-primary-600">Mate</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-100 text-primary-700 uppercase tracking-wider">Pro</span>
              </div>
              <span className="text-[11px] text-navy-400 font-medium tracking-tight block -mt-1 hidden sm:block">
                Your Home, Our Responsibility.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-primary-600'
                      : 'text-navy-600 hover:text-navy-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth / Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href={portalHref}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl border border-primary-200 transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>
                    {role === 'admin'
                      ? 'Admin Dashboard'
                      : role === 'technician'
                      ? 'Technician Hub'
                      : 'My Dashboard'}
                  </span>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-navy-200">
                  <div className="text-right">
                    <p className="text-xs font-bold text-navy-900 leading-tight truncate max-w-[120px]">
                      {user?.full_name || 'Active User'}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-primary-600">
                      {role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-navy-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-navy-700 hover:text-navy-900 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/customer/book-service"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Service</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-navy-600 hover:text-navy-900 hover:bg-navy-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-navy-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-navy-700 hover:text-primary-600 hover:bg-navy-50 rounded-lg"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-navy-100 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={portalHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-50 text-primary-700 rounded-xl font-semibold text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to {role} Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-navy-700 font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/customer/book-service"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm shadow-md"
                >
                  Book a Service
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
