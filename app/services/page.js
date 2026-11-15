'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import {
  Search,
  Filter,
  Wrench,
  Clock,
  ShieldCheck,
  ArrowRight,
  Droplet,
  Zap,
  Wind,
  Cpu,
  Paintbrush,
  Sparkles,
  Hammer,
} from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Plumbing',
    'Electrical',
    'AC Repair',
    'Appliance Repair',
    'Painting',
    'Cleaning',
    'Carpentry',
    'Smart Home',
  ];

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      try {
        const url = `/api/services?category=${encodeURIComponent(selectedCategory)}&search=${encodeURIComponent(searchQuery)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.services) {
          setServices(data.services);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-navy-50/40">
      <Navbar />

      {/* Header */}
      <section className="bg-navy-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-primary-400 uppercase tracking-widest block">
            FixMate Service Catalog & Rate Cards
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Transparent Home Maintenance & Repairs
          </h1>
          <p className="text-sm sm:text-base text-navy-300 max-w-2xl mx-auto leading-relaxed">
            Every service is performed by verified trade specialists, backed by standard warranty protection, and billed through clear transparent rate cards.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="p-2 bg-white rounded-2xl shadow-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-navy-400 ml-2" />
              <input
                type="text"
                placeholder="Search services, e.g. plumbing, AC, wiring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm text-navy-900 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-navy-400 hover:text-navy-700 px-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Content Section */}
      <section className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                    : 'bg-white text-navy-700 hover:bg-navy-100 border border-navy-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {loading ? (
            <div className="py-20 text-center text-sm text-navy-500">
              Loading service catalog...
            </div>
          ) : services.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-navy-100 p-8">
              <Wrench className="w-12 h-12 text-navy-300 mx-auto mb-3" />
              <h3 className="font-bold text-navy-900 text-base">No services found</h3>
              <p className="text-xs text-navy-500 mt-1">
                Try searching for a different keyword or selecting "All" categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-white rounded-3xl border border-navy-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 bg-navy-100">
                      <img
                        src={svc.image_url}
                        alt={svc.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-navy-900 shadow-sm">
                        {svc.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-navy-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Estimated: {svc.estimated_duration}</span>
                      </div>

                      <h3 className="font-bold text-navy-900 text-lg leading-snug">
                        {svc.name}
                      </h3>

                      <p className="text-xs text-navy-600 leading-relaxed line-clamp-3">
                        {svc.full_description || svc.short_description}
                      </p>

                      {/* Itemized pricing preview */}
                      <div className="pt-3 border-t border-navy-100 text-xs space-y-1 text-navy-500">
                        <div className="flex justify-between">
                          <span>Inspection & Base Call:</span>
                          <span className="font-bold text-navy-900">${svc.base_price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standard Labor:</span>
                          <span className="font-bold text-navy-900">${svc.labor_charge || 30}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/customer/book-service?service=${svc.id}`}
                      className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>Book Service Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
