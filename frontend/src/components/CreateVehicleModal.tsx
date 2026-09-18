import React, { useState } from 'react';
import { Truck, X, ShieldCheck } from 'lucide-react';
import { VehicleType } from '../types';

interface CreateVehicleModalProps {
  onClose: () => void;
  onSubmit: (vehicle: {
    plateNumber: string;
    model: string;
    capacityKg: number;
    type: 'TRUCK' | 'VAN' | 'SEMI_TRUCK';
  }) => void;
}

export const CreateVehicleModal: React.FC<CreateVehicleModalProps> = ({ onClose, onSubmit }) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [model, setModel] = useState('Tata Signa 4825.TK');
  const [capacityKg, setCapacityKg] = useState('18000');
  const [type, setType] = useState<VehicleType>('TRUCK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber) return;
    onSubmit({
      plateNumber,
      model,
      capacityKg: Number(capacityKg) || 12000,
      type: type as any,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Truck className="h-5 w-5" />
            <h3 className="text-base font-bold text-slate-900">Register Vehicle</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5 mb-4 text-xs font-mono text-blue-700 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
          <span>Endpoint: POST /api/vehicles</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle License Plate</label>
            <input
              type="text"
              required
              placeholder="e.g. KA-01-AB-1234"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name</label>
            <input
              type="text"
              required
              placeholder="e.g. BharatBenz 2823R Heavy Truck"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (kg)</label>
              <input
                type="number"
                required
                value={capacityKg}
                onChange={(e) => setCapacityKg(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VehicleType)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="TRUCK">TRUCK</option>
                <option value="VAN">VAN</option>
                <option value="SEMI_TRUCK">SEMI_TRUCK</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
