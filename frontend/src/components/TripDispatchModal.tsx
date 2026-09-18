import React, { useState } from 'react';
import { 
  Navigation, 
  Truck, 
  User, 
  Package, 
  CheckCircle, 
  X 
} from 'lucide-react';
import { Shipment, Driver, Vehicle } from '../types';

interface TripDispatchModalProps {
  shipment: Shipment;
  drivers: Driver[];
  vehicles: Vehicle[];
  onClose: () => void;
  onConfirmDispatch: (data: { shipmentId: number; driverId: number; vehicleId: number }) => void;
}

export const TripDispatchModal: React.FC<TripDispatchModalProps> = ({
  shipment,
  drivers,
  vehicles,
  onClose,
  onConfirmDispatch,
}) => {
  const availableDrivers = drivers.filter((d) => d.status === 'AVAILABLE' || d.status === 'ON_DUTY');
  const activeVehicles = vehicles.filter((v) => v.status === 'ACTIVE');

  const [selectedDriverId, setSelectedDriverId] = useState<number>(availableDrivers[0]?.id || 1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number>(activeVehicles[0]?.id || 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmDispatch({
      shipmentId: shipment.id,
      driverId: Number(selectedDriverId),
      vehicleId: Number(selectedVehicleId),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Navigation className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Trip Dispatch Orchestrator</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Shipment Summary */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-xs font-bold text-indigo-300">
              {shipment.trackingNumber}
            </span>
            <span className="text-[11px] font-bold text-slate-300">
              {shipment.weightKg.toLocaleString()} kg
            </span>
          </div>
          <div className="text-xs text-slate-200 font-semibold">{shipment.customerName}</div>
          <div className="text-xs text-slate-400 mt-1">
            {shipment.origin} <span className="text-indigo-400">➔</span> {shipment.destination}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Driver Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-indigo-400" /> Assign Certified Driver
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              {availableDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} (Rating: {d.rating.toFixed(1)}★, Status: {d.status})
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-indigo-400" /> Assign Fleet Haulage Unit
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              {activeVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} — {v.model} (Cap: {(v.capacityKg / 1000).toFixed(1)}T)
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-3 text-[11px] text-slate-400 border border-slate-800">
            <span className="font-semibold text-slate-200">TripController Execution:</span> Allocates driver and vehicle, generates unique `tripCode`, marks shipment `IN_TRANSIT`, and publishes automated notifications.
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
              Confirm Dispatch & Track Live
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
