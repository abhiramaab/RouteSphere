import React, { useState } from 'react';
import { 
  Navigation, 
  Truck, 
  User, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-blue-600">
            <Navigation className="h-5 w-5" />
            <h3 className="text-base font-bold text-slate-900">Trip Dispatch Orchestrator</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Shipment Summary */}
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3.5 mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-mono text-xs font-bold text-blue-700">
              {shipment.trackingNumber}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {shipment.weightKg.toLocaleString()} kg
            </span>
          </div>
          <div className="text-xs text-slate-900 font-medium">{shipment.customerName}</div>
          <div className="text-xs text-slate-600 mt-1">
            {shipment.origin} <span className="text-blue-600">→</span> {shipment.destination}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Driver Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-blue-600" /> Assign Driver
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
            >
              {availableDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} (Rating: {d.rating.toFixed(1)}, Status: {d.status})
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-blue-600" /> Assign Vehicle
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
            >
              {activeVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} — {v.model} (Cap: {(v.capacityKg / 1000).toFixed(1)}T)
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-200">
            <span className="font-semibold text-slate-800">TripController:</span> Allocates driver and vehicle, generates trip code, updates shipment status to IN_TRANSIT.
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
              Confirm Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
