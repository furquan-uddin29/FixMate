'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, ShieldCheck, Clock, Award, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-navy-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-900/60 border border-primary-700/50 flex items-center justify-center text-primary-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">100% Verified Professionals</h4>
              <p className="text-xs text-navy-400 leading-relaxed">
                Every technician undergoes stringent background screening, credential verification, and skills testing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/40 border border-emerald-700/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Up to 6 Months Warranty</h4>
              <p className="text-xs text-navy-400 leading-relaxed">
                All repairs come backed by FixMate warranty protection and digital receipts for total peace of mind.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-900/40 border border-sky-700/40 flex items-center justify-center text-sky-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Real-Time Job Tracking</h4>
              <p className="text-xs text-navy-400 leading-relaxed">
                Follow your technician from dispatch to arrival with visual timeline updates and live status notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Fix<span className="text-primary-400">Mate</span></span>
            </Link>
            <p className="text-sm text-navy-400 max-w-sm mb-6 leading-relaxed">
              "Your Home, Our Responsibility." The next-generation on-demand local repair and home maintenance platform connecting homeowners with trusted, verified trade specialists.
            </p>
            <div className="space-y-2 text-xs text-navy-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>24/7 Helpline: +1 (800) 349-MATE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>support@fixmate.app</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>Metro City Central Station Hub</span>
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Services</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/services?category=Plumbing" className="hover:text-white transition-colors">Plumbing & Leaks</Link></li>
              <li><Link href="/services?category=Electrical" className="hover:text-white transition-colors">Electrical & Wiring</Link></li>
              <li><Link href="/services?category=AC Repair" className="hover:text-white transition-colors">AC Repair & Refill</Link></li>
              <li><Link href="/services?category=Appliance Repair" className="hover:text-white transition-colors">Appliance Service</Link></li>
              <li><Link href="/services?category=Painting" className="hover:text-white transition-colors">Wall Painting</Link></li>
              <li><Link href="/services?category=Cleaning" className="hover:text-white transition-colors">Sanitization & Cleaning</Link></li>
            </ul>
          </div>

          {/* Customers */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Customers</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/customer/book-service" className="hover:text-white transition-colors">Book a Service</Link></li>
              <li><Link href="/customer/bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
              <li><Link href="/customer/tracking" className="hover:text-white transition-colors">Live Job Tracker</Link></li>
              <li><Link href="/customer/complaints" className="hover:text-white transition-colors">Disputes & Complaints</Link></li>
              <li><Link href="/customer/reviews" className="hover:text-white transition-colors">Verified Reviews</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Transparent Pricing</Link></li>
            </ul>
          </div>

          {/* Technicians & Admin */}
          <div>
            <h5 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Portals</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/technician" className="hover:text-white transition-colors">Technician Dashboard</Link></li>
              <li><Link href="/technician/requests" className="hover:text-white transition-colors">Job Dispatch Pool</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Console</Link></li>
              <li><Link href="/admin/dispatch" className="hover:text-white transition-colors">Dispatcher Center</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Join as Technician</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Platform Sign In</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-400">
          <p>© {new Date().getFullYear()} FixMate Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-navy-400">
            <span>Designed for CSE 3292 Web Development Bootcamp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Support</Link>
            <span className="text-navy-600">|</span>
            <span className="text-emerald-400 font-medium">PostgreSQL & Next.js App Router</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
