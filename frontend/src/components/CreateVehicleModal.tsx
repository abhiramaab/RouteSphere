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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Truck className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Register Fleet Vehicle</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/20 p-2.5 mb-4 text-[11px] font-mono text-indigo-300 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>Endpoint: POST /api/vehicles (VehicleController)</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle License Plate</label>
            <input
              type="text"
              required
              placeholder="e.g. KA-01-AB-1234"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Make & Model</label>
            <input
              type="text"
              required
              placeholder="e.g. BharatBenz 2823R Heavy Truck"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payload Capacity (kg)</label>
              <input
                type="number"
                required
                value={capacityKg}
                onChange={(e) => setCapacityKg(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VehicleType)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="TRUCK">TRUCK</option>
                <option value="VAN">VAN</option>
                <option value="SEMI_TRUCK">SEMI_TRUCK</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
            >
              Register Fleet Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
