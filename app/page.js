'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import {
  Wrench,
  Search,
  Calendar,
  ShieldCheck,
  Star,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Phone,
  Droplet,
  Zap,
  Wind,
  Cpu,
  Paintbrush,
  Sparkles,
  MapPin,
  Users,
  Check,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_TECHNICIANS, INITIAL_REVIEWS } from '@/lib/data/demoData';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const services = INITIAL_SERVICES.slice(0, 6);
  const featuredTechs = INITIAL_TECHNICIANS.filter(t => t.verification_status === 'verified').slice(0, 4);

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Droplet': return <Droplet className="w-6 h-6 text-blue-500" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Wind': return <Wind className="w-6 h-6 text-sky-500" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-purple-500" />;
      case 'Paintbrush': return <Paintbrush className="w-6 h-6 text-rose-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-500" />;
      default: return <Wrench className="w-6 h-6 text-primary-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-50/40">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-primary-50/30 to-navy-50/40 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold border border-primary-200">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                <span>FixMate Verified & Insured Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight leading-[1.1]">
                Reliable Home Services, <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">
                  Just One Click Away.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-navy-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                FixMate connects you with certified local plumbers, electricians, AC technicians, and appliance specialists in minutes. Upfront rates, live job tracking, and warranty-backed workmanship.
              </p>

              {/* Search Bar Input */}
              <div className="p-2 bg-white rounded-2xl shadow-xl shadow-navy-950/5 border border-navy-100 max-w-lg mx-auto lg:mx-0 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-3 gap-2">
                  <Search className="w-5 h-5 text-navy-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search e.g. plumbing leak, AC gas refill..."
                    className="w-full text-sm py-2 text-navy-900 focus:outline-none placeholder:text-navy-400"
                  />
                </div>
                <Link
                  href={searchQuery ? `/services?search=${encodeURIComponent(searchQuery)}` : '/services'}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-primary-600/20"
                >
                  <span>Find Pro</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Action Buttons & Social Proof */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/customer/book-service"
                  className="px-7 py-3.5 bg-navy-900 hover:bg-navy-950 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-primary-400" />
                  <span>Book a Service Now</span>
                </Link>
                <Link
                  href="/services"
                  className="px-7 py-3.5 bg-white hover:bg-navy-50 text-navy-800 font-bold text-sm rounded-xl border border-navy-200 transition shadow-sm"
                >
                  Explore All Services
                </Link>
              </div>

              {/* Hero Stats */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-navy-100 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-navy-900">4.9/5</span>
                  <p className="text-[11px] text-navy-500 font-medium">Customer Rating</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-navy-900">800+</span>
                  <p className="text-[11px] text-navy-500 font-medium">Repairs Completed</p>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-navy-900">100%</span>
                  <p className="text-[11px] text-navy-500 font-medium">Verified Tradesmen</p>
                </div>
              </div>
            </div>

            {/* Right Column Hero Graphic Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                    alt="Technician working"
                    className="w-full h-80 object-cover object-center"
                  />
                  <div className="p-6 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          Technician En Route
                        </span>
                      </div>
                      <span className="text-xs font-bold text-navy-400">ETA 18 mins</span>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <img
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80"
                        alt="David Miller"
                        className="w-12 h-12 rounded-xl object-cover border"
                      />
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm">David Miller</h4>
                        <p className="text-xs text-navy-500">Master Plumber • 8 yrs exp</p>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>4.95 (142 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-navy-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-navy-900 block">Warranty Protected</span>
                    <span className="text-[10px] text-navy-400">Up to 6 Months Coverage</span>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-navy-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-navy-900 block">Express Dispatch</span>
                    <span className="text-[10px] text-navy-400">Within 45 Minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR SERVICES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block mb-2">
                Certified Trade Categories
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
                Popular Repair Services
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              <span>View All 8 Categories</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="group bg-white rounded-3xl border border-navy-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-navy-100">
                  <img
                    src={svc.image_url}
                    alt={svc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-navy-800 shadow-sm flex items-center gap-1.5">
                    {getServiceIcon(svc.icon)}
                    <span>{svc.category}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-navy-900 text-lg leading-snug group-hover:text-primary-600 transition-colors">
                      {svc.name}
                    </h3>
                    <p className="text-xs text-navy-500 mt-2 line-clamp-2 leading-relaxed">
                      {svc.short_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-navy-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-navy-400 block">Starting from</span>
                      <span className="text-xl font-black text-navy-900">${svc.base_price}</span>
                    </div>

                    <Link
                      href={`/customer/book-service?service=${svc.id}`}
                      className="px-4 py-2 bg-primary-50 group-hover:bg-primary-600 text-primary-700 group-hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW FIXMATE WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-navy-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-primary-400 uppercase tracking-widest block mb-2">
              Simple 5-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How FixMate Works
            </h2>
            <p className="text-sm text-navy-400 mt-3 leading-relaxed">
              From the moment you place a request until your repair is completed and warrantied, our platform guarantees transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Choose Service',
                desc: 'Select from certified plumbing, electrical, AC, or appliance categories.',
              },
              {
                step: '02',
                title: 'Describe Problem',
                desc: 'Enter your issue details, symptoms, and upload optional photos.',
              },
              {
                step: '03',
                title: 'Select Schedule',
                desc: 'Pick your preferred date and window, or opt for emergency fast dispatch.',
              },
              {
                step: '04',
                title: 'Pro Matched',
                desc: 'Our dispatching system assigns a verified technician in your neighborhood.',
              },
              {
                step: '05',
                title: 'Track & Pay',
                desc: 'Follow live progress, inspect completed work, and receive a digital receipt.',
              },
            ].map((st, i) => (
              <div
                key={i}
                className="bg-navy-900/80 p-6 rounded-3xl border border-navy-800 space-y-3 relative hover:border-primary-500/50 transition"
              >
                <span className="text-3xl font-black text-primary-500/30 block">{st.step}</span>
                <h4 className="text-base font-bold text-white">{st.title}</h4>
                <p className="text-xs text-navy-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE FIXMATE */}
      <section className="py-20 bg-navy-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block">
                The FixMate Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight leading-snug">
                Why Homeowners & Businesses Rely on FixMate
              </h2>
              <p className="text-sm text-navy-600 leading-relaxed">
                Traditional handyman hiring is plagued with uncertain pricing, no-shows, and zero accountability. FixMate fixes this with a strictly governed digital platform.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  {
                    title: '100% Verified Professionals',
                    desc: 'Every technician is ID-checked, criminal background-screened, and trade-certified before being approved.',
                  },
                  {
                    title: 'Transparent Upfront Rate Cards',
                    desc: 'Clear itemized rate cards with zero hidden surprises or surprise surcharges.',
                  },
                  {
                    title: 'Real-Time 8-Stage Progress Tracking',
                    desc: 'Watch your service evolve chronologically from dispatch to arrival and completion.',
                  },
                  {
                    title: 'Digital Warranty & Proof of Service',
                    desc: 'Every service automatically receives a verifiable digital receipt and warranty certificate.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-navy-500 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2">
                <ShieldCheck className="w-8 h-8 text-primary-600 mb-2" />
                <h4 className="text-lg font-black text-navy-900">Background Checked</h4>
                <p className="text-xs text-navy-500 leading-relaxed">
                  Strict vetting ensures peace of mind when welcoming specialists into your home.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2 mt-6">
                <Award className="w-8 h-8 text-emerald-600 mb-2" />
                <h4 className="text-lg font-black text-navy-900">Guaranteed Work</h4>
                <p className="text-xs text-navy-500 leading-relaxed">
                  Free follow-up re-inspection if any serviced joint or component fails.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2">
                <Clock className="w-8 h-8 text-amber-500 mb-2" />
                <h4 className="text-lg font-black text-navy-900">On-Time Arrival</h4>
                <p className="text-xs text-navy-500 leading-relaxed">
                  Strict time windows with real-time GPS arrival alerts for minimal wait time.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-2 mt-6">
                <Wrench className="w-8 h-8 text-sky-600 mb-2" />
                <h4 className="text-lg font-black text-navy-900">Genuine Parts</h4>
                <p className="text-xs text-navy-500 leading-relaxed">
                  Technicians exclusively install verified OEM components with manufacturer seals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED TECHNICIANS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block mb-2">
              Meet The Experts
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              Featured Verified Technicians
            </h2>
            <p className="text-sm text-navy-500 mt-2">
              Our top-rated tradespeople with stellar track records and hundreds of completed 5-star jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTechs.map((tech) => (
              <div
                key={tech.id}
                className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm hover:shadow-lg transition-all text-center space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="relative inline-block mx-auto mb-3">
                    <img
                      src={tech.avatar_url}
                      alt={tech.full_name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md mx-auto"
                    />
                    <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <h4 className="font-bold text-navy-900 text-base">{tech.full_name}</h4>
                  <p className="text-xs font-semibold text-primary-600 mt-0.5">
                    {tech.service_categories.join(', ')}
                  </p>
                  <p className="text-xs text-navy-400 mt-1">{tech.experience_years} years experience</p>

                  <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold mt-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{tech.rating}</span>
                    <span className="text-navy-400">({tech.completed_jobs_count} jobs)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-navy-100">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {tech.skills.slice(0, 2).map((sk, idx) => (
                      <span key={idx} className="text-[10px] bg-navy-50 text-navy-600 px-2 py-0.5 rounded-md font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-navy-50/70 border-t border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block mb-2">
              Verified Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              What Homeowners Say About FixMate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-3xl border border-navy-100 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-navy-600 leading-relaxed italic">
                    "{rev.review_text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-navy-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy-900 block">{rev.customer_name}</span>
                    <span className="text-[11px] text-navy-400">{rev.service_name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Job
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Need an Urgent Repair Right Now?
          </h2>
          <p className="text-sm sm:text-base text-primary-100 max-w-2xl mx-auto">
            Book online in under 2 minutes. We match you with verified technicians ready to solve your problem today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/customer/book-service"
              className="px-8 py-3.5 bg-white text-primary-700 hover:bg-navy-50 font-bold text-sm rounded-xl shadow-lg transition"
            >
              Book a Service Now
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 bg-primary-800/80 hover:bg-primary-900 text-white font-bold text-sm rounded-xl border border-primary-500/40 transition"
            >
              Apply as a Technician
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
