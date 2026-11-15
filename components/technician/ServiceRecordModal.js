'use client';

import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Award, Plus, Trash2, Wrench, ShieldCheck, DollarSign } from 'lucide-react';

export default function ServiceRecordModal({ isOpen, onClose, booking, onCompleted }) {
  const [repairDescription, setRepairDescription] = useState('');
  const [laborCharges, setLaborCharges] = useState(65);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [warrantyMonths, setWarrantyMonths] = useState(6);
  const [parts, setParts] = useState([
    { name: '', cost: '' },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPart = () => {
    setParts([...parts, { name: '', cost: '' }]);
  };

  const handleRemovePart = (index) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handlePartChange = (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = value;
    setParts(updated);
  };

  const totalPartsCost = parts.reduce((acc, p) => acc + (Number(p.cost) || 0), 0);
  const calculatedFinalCost = (booking?.estimated_cost || 50) + Number(additionalCharges) + totalPartsCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repairDescription.trim()) {
      setErrorMsg('Please enter a thorough description of the repair work done.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const validParts = parts
        .filter(p => p.name.trim() !== '')
        .map(p => ({ name: p.name.trim(), cost: Number(p.cost) || 0 }));

      const res = await fetch(`/api/bookings/${booking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          next_status: 'completed',
          actor_role: 'technician',
          note: `Technician completed repair work: ${repairDescription.substring(0, 50)}...`,
          service_record: {
            repair_description: repairDescription,
            parts_used: validParts,
            labor_charges: Number(laborCharges),
            additional_charges: Number(additionalCharges),
            warranty_months: Number(warrantyMonths),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to complete job');

      if (onCompleted) onCompleted(data);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Service & Register Work Record" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
            {errorMsg}
          </div>
        )}

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Service Record Requirement:</strong> Every completed job automatically generates the customer digital receipt and registers an active FixMate warranty certificate.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1.5">
            Repair & Workmanship Description *
          </label>
          <textarea
            required
            rows={3}
            value={repairDescription}
            onChange={(e) => setRepairDescription(e.target.value)}
            placeholder="Describe what components were tested, repaired, or replaced, and root cause identified..."
            className="w-full px-4 py-2.5 rounded-xl border border-navy-200 text-sm text-navy-900"
          />
        </div>

        {/* Parts Used Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider">
              Replacement Parts & Consumables Installed
            </label>
            <button
              type="button"
              onClick={handleAddPart}
              className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Part</span>
            </button>
          </div>

          <div className="space-y-2">
            {parts.map((part, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Part name (e.g. 1/2-inch Brass Valve)"
                  value={part.name}
                  onChange={(e) => handlePartChange(idx, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-navy-200 text-xs text-navy-900"
                />
                <div className="w-28 relative">
                  <span className="absolute left-3 top-2 text-navy-400 text-xs">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={part.cost}
                    onChange={(e) => handlePartChange(idx, 'cost', e.target.value)}
                    className="w-full pl-6 pr-3 py-2 rounded-xl border border-navy-200 text-xs text-navy-900"
                  />
                </div>
                {parts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePart(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Financials & Warranty */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1">
              Labor Charge ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={laborCharges}
              onChange={(e) => setLaborCharges(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1">
              Additional Surcharge ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={additionalCharges}
              onChange={(e) => setAdditionalCharges(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1">
              Warranty Coverage
            </label>
            <select
              value={warrantyMonths}
              onChange={(e) => setWarrantyMonths(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-navy-200 text-sm font-semibold"
            >
              <option value={1}>1 Month Warranty</option>
              <option value={3}>3 Months Warranty</option>
              <option value={6}>6 Months Warranty</option>
              <option value={12}>12 Months Warranty</option>
            </select>
          </div>
        </div>

        {/* Total Cost Display */}
        <div className="p-4 bg-navy-50 rounded-2xl border border-navy-100 flex items-center justify-between text-sm">
          <div>
            <span className="text-xs text-navy-500 block">Final Customer Amount</span>
            <span className="font-bold text-navy-900">Total Billed to Customer</span>
          </div>
          <span className="text-xl font-black text-emerald-600">
            ${calculatedFinalCost.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-navy-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-navy-600 hover:bg-navy-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md disabled:opacity-50 transition"
          >
            {submitting ? 'Generating Receipt & Record...' : 'Finalize & Mark Completed'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
