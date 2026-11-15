'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import JobCard from '@/components/technician/JobCard';
import { Wrench, CheckCircle2, Filter } from 'lucide-react';

export default function TechnicianJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setJobs(data.bookings);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    if (filter === 'active') {
      return ['technician_assigned', 'on_the_way', 'arrived', 'in_progress'].includes(j.status);
    }
    if (filter === 'completed') {
      return j.status === 'completed';
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            My Assigned Service Jobs
          </h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Update job statuses in real-time as you travel and perform repairs at customer premises.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-navy-100 shadow-sm">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'active'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            Active Work Orders
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filter === 'completed'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-navy-600 hover:text-navy-900'
            }`}
          >
            Finished Jobs
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-navy-500">Loading work orders...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-navy-100 text-center p-8 space-y-2">
          <Wrench className="w-12 h-12 text-navy-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No jobs in this category</h3>
          <p className="text-xs text-navy-500">You currently have no work orders matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((job) => (
            <JobCard key={job.id} booking={job} onStatusUpdated={fetchJobs} />
          ))}
        </div>
      )}
    </div>
  );
}
