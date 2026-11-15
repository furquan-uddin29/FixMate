'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Check, X, DollarSign, Clock, Wrench } from 'lucide-react';
import Modal from '@/components/common/Modal';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isNewModal, setIsNewModal] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Plumbing',
    short_description: '',
    base_price: 50.00,
    labor_charge: 30.00,
    emergency_fee: 25.00,
    estimated_duration: '1 - 2 hours',
    is_active: true,
  });

  const loadServices = async () => {
    try {
      const res = await fetch('/api/services?active=false');
      const data = await res.json();
      if (data.services) setServices(data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setFormData({
      name: svc.name,
      category: svc.category,
      short_description: svc.short_description,
      base_price: svc.base_price,
      labor_charge: svc.labor_charge || 30.00,
      emergency_fee: svc.emergency_fee || 25.00,
      estimated_duration: svc.estimated_duration,
      is_active: svc.is_active,
    });
    setIsNewModal(false);
  };

  const handleOpenNew = () => {
    setEditingService(null);
    setFormData({
      name: '',
      category: 'Plumbing',
      short_description: '',
      base_price: 50.00,
      labor_charge: 30.00,
      emergency_fee: 25.00,
      estimated_duration: '1 - 2 hours',
      is_active: true,
    });
    setIsNewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewModal) {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setActionMsg('New service added successfully.');
          loadServices();
          setIsNewModal(false);
        }
      } else {
        const res = await fetch(`/api/services/${editingService.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setActionMsg('Service updated successfully.');
          loadServices();
          setEditingService(null);
        }
      }
    } catch (err) {
      alert('Error updating service');
    }
  };

  const handleToggleStatus = async (svc) => {
    try {
      await fetch(`/api/services/${svc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !svc.is_active }),
      });
      loadServices();
    } catch (err) {
      alert('Error changing status');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">Services & Pricing Rate Cards</h1>
          <p className="text-xs sm:text-sm text-navy-500 mt-1">
            Configure transparent rate cards, base inspection fees, emergency fees, and service active statuses.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
          {actionMsg}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-navy-100 p-6 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-navy-500">Loading services...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50/70 border-b border-navy-100 text-navy-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Service Name</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Base Inspection</th>
                  <th className="py-3 px-4 font-bold">Labor Charge</th>
                  <th className="py-3 px-4 font-bold">Emergency Surcharge</th>
                  <th className="py-3 px-4 font-bold">Est Duration</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-navy-50/50">
                    <td className="py-3.5 px-4 font-bold text-navy-900">{svc.name}</td>
                    <td className="py-3.5 px-4 text-primary-700 font-semibold">{svc.category}</td>
                    <td className="py-3.5 px-4 font-bold text-navy-900">${Number(svc.base_price).toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold text-navy-700">${Number(svc.labor_charge || 30).toFixed(2)}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">+${Number(svc.emergency_fee || 25).toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-navy-500">{svc.estimated_duration}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${svc.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {svc.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(svc)}
                        className="px-2.5 py-1 bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-lg text-xs font-bold"
                      >
                        Edit Rate
                      </button>
                      <button
                        onClick={() => handleToggleStatus(svc)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${svc.is_active ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                      >
                        {svc.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {(editingService || isNewModal) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setEditingService(null);
            setIsNewModal(false);
          }}
          title={isNewModal ? 'Add New Platform Service' : `Edit Rate Card: ${editingService?.name}`}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Service Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm"
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="AC Repair">AC Repair</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Painting">Painting</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="Smart Home">Smart Home</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Estimated Duration</label>
                <input
                  type="text"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Base Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Labor Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.labor_charge}
                  onChange={(e) => setFormData({ ...formData, labor_charge: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Emergency Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.emergency_fee}
                  onChange={(e) => setFormData({ ...formData, emergency_fee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-700 uppercase mb-1">Short Description *</label>
              <textarea
                rows={2}
                required
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  setEditingService(null);
                  setIsNewModal(false);
                }}
                className="px-4 py-2 text-xs font-bold text-navy-600 hover:bg-navy-50 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary-700"
              >
                Save Rate Card
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
