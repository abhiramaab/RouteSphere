import React from 'react';
import { 
  Truck, 
  Gauge, 
  Fuel, 
  Calendar, 
  Plus
} from 'lucide-react';
import { Vehicle } from '../types';

interface FleetGridProps {
  vehicles: Vehicle[];
  onOpenCreateVehicle?: () => void;
}

export const FleetGrid: React.FC<FleetGridProps> = ({ vehicles, onOpenCreateVehicle }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Fleet Assets ({vehicles.length})
          </h3>
          <p className="text-xs text-slate-500">
            Vehicle telemetry, odometer readings, and maintenance tracking
          </p>
        </div>

        {onOpenCreateVehicle && (
          <button
            onClick={onOpenCreateVehicle}
            className="flex items-center gap-1.5 self-start sm:self-center rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Register Vehicle</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const isMaintenance = v.status === 'IN_MAINTENANCE';
          return (
            <div
              key={v.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {v.plateNumber}
                  </span>
                  <h4 className="font-semibold text-slate-900 mt-2 text-sm">{v.model}</h4>
                  <span className="text-xs text-slate-500">{v.type}</span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    isMaintenance
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {isMaintenance ? 'Maintenance' : 'Active'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Gauge className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] text-slate-400">Odometer</div>
                    <div className="font-mono font-semibold text-slate-800">
                      {v.currentOdometerKm.toLocaleString()} km
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Fuel className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] text-slate-400">Efficiency</div>
                    <div className="font-mono font-semibold text-slate-800">
                      {v.fuelEfficiencyKmPerL} km/L
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  Service: {v.lastMaintenanceDate}
                </span>
                <span className="font-mono text-[11px] font-medium text-slate-700">
                  Cap: {(v.capacityKg / 1000).toFixed(1)}T
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
