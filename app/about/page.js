'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import {
  Wrench,
  ShieldCheck,
  Target,
  Users,
  Award,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-navy-50/40">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy-950 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-bold text-primary-400 uppercase tracking-widest block">
            About FixMate
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            "Your Home, Our Responsibility."
          </h1>
          <p className="text-sm sm:text-base text-navy-300 max-w-2xl mx-auto leading-relaxed">
            FixMate is a next-generation on-demand local technician and home repair service platform engineered to solve the chronic trust, punctuality, and pricing issues in residential maintenance.
          </p>
        </div>
      </section>

      {/* Mission & Problem Solving */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block">
              The Problem We Solve
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Why Traditional Handyman Booking Fails
            </h2>
            <p className="text-sm text-navy-600 leading-relaxed">
              Every year, millions of homeowners struggle with unverified handymen who charge arbitrary rates, fail to show up on schedule, lack insurance, and offer zero warranty when a pipe bursts 2 days later.
            </p>
            <p className="text-sm text-navy-600 leading-relaxed">
              At the same time, skilled, certified technicians lack reliable dispatch mechanisms, digital invoicing tools, and fair dispute management systems.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-navy-100 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Our Mission</h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              To build the most transparent, accountable, and technology-driven home service ecosystem where homeowners enjoy prompt, high-standard maintenance and trade technicians build dignified, sustainable careers.
            </p>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2">
            <ShieldCheck className="w-8 h-8 text-primary-600" />
            <h4 className="font-bold text-navy-900 text-sm">Rigorous Vetting</h4>
            <p className="text-xs text-navy-500 leading-relaxed">
              Identity verification, police background screening, and trade license validation before any pro is approved.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2">
            <Award className="w-8 h-8 text-emerald-600" />
            <h4 className="font-bold text-navy-900 text-sm">Warranty Backed</h4>
            <p className="text-xs text-navy-500 leading-relaxed">
              Every completed repair includes standard 3 to 6-month FixMate warranty coverage against recurring leaks or faults.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2">
            <HeartHandshake className="w-8 h-8 text-amber-500" />
            <h4 className="font-bold text-navy-900 text-sm">Transparent Rate Cards</h4>
            <p className="text-xs text-navy-500 leading-relaxed">
              Clear itemized pricing: base inspection fee + standard labor + parts at cost. No hidden markups.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2">
            <Users className="w-8 h-8 text-purple-600" />
            <h4 className="font-bold text-navy-900 text-sm">Dedicated Portals</h4>
            <p className="text-xs text-navy-500 leading-relaxed">
              Purpose-built dashboards for Customers, Technicians, and Dispatch Administrators for end-to-end governance.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
