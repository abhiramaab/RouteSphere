import React from 'react';
import { 
  Truck, 
  Gauge, 
  Fuel, 
  Calendar, 
  CheckCircle, 
  Wrench 
} from 'lucide-react';
import { Vehicle } from '../types';

interface FleetGridProps {
  vehicles: Vehicle[];
}

export const FleetGrid: React.FC<FleetGridProps> = ({ vehicles }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-indigo-400" />
            Fleet Assets & Telematics ({vehicles.length})
          </h3>
          <p className="text-xs text-slate-400">
            Real-time vehicle health, odometer telemetry, and scheduled maintenance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const isMaintenance = v.status === 'IN_MAINTENANCE';
          return (
            <div
              key={v.id}
              className={`rounded-2xl border ${
                isMaintenance 
                  ? 'border-amber-500/30 bg-amber-950/10' 
                  : 'border-slate-800 bg-slate-900/50'
              } p-5 backdrop-blur-sm transition-all hover:border-indigo-500/40`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {v.plateNumber}
                  </span>
                  <h4 className="font-semibold text-slate-200 mt-2 text-sm">{v.model}</h4>
                  <span className="text-[11px] text-slate-400">{v.type}</span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isMaintenance
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {isMaintenance ? 'IN MAINTENANCE' : 'ACTIVE FLEET'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Gauge className="h-3.5 w-3.5 text-indigo-400" />
                  <div>
                    <div className="text-[10px] text-slate-500">Odometer</div>
                    <div className="font-mono font-semibold text-slate-200">
                      {v.currentOdometerKm.toLocaleString()} km
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Fuel className="h-3.5 w-3.5 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-slate-500">Efficiency</div>
                    <div className="font-mono font-semibold text-slate-200">
                      {v.fuelEfficiencyKmPerL} km/L
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/50">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-500" />
                  Last Service: {v.lastMaintenanceDate}
                </span>
                <span className="font-mono text-slate-300">
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
