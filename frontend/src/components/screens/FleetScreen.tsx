import React, { useMemo, useState } from 'react';
import { Truck, Plus, Gauge, Wrench, Fuel, Search } from 'lucide-react';
import { Vehicle } from '../../types';
import { vehicleStatusMeta, kg } from '../../lib/format';
import { StatusChip, EmptyState } from '../ui/atoms';

interface FleetScreenProps {
  vehicles: Vehicle[];
  query: string;
  onCreate: () => void;
}

export const FleetScreen: React.FC<FleetScreenProps> = ({ vehicles, query, onCreate }) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'IN_MAINTENANCE'>('ALL');

  const filtered = useMemo(() => {
    let list = vehicles;
    if (filter !== 'ALL') list = list.filter((v) => v.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (v) =>
          v.plateNumber.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.type.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vehicles, filter, query]);

  const utilization = (v: Vehicle) =>
    v.status === 'ACTIVE' ? 68 + (v.currentOdometerKm % 28) : v.status === 'IN_MAINTENANCE' ? 4 : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {(['ALL', 'ACTIVE', 'IN_MAINTENANCE'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                filter === f ? 'bg-ink-900 text-white' : 'bg-white text-ink-500 hover:text-ink-800 border border-ink-200'
              }`}
            >
              {f === 'ALL' ? 'All vehicles' : f === 'ACTIVE' ? 'Active' : 'Maintenance'}
            </button>
          ))}
        </div>
        <button onClick={onCreate} className="btn-primary ml-auto px-3 py-1.5">
          <Plus className="h-3.5 w-3.5" /> Register vehicle
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={Search}
            title="No vehicles found"
            description="Adjust the filter or register a new vehicle to the fleet."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v, i) => (
            <div
              key={v.id}
              className="panel group animate-rise overflow-hidden p-4 transition-shadow hover:shadow-lift"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-900 text-white">
                    <Truck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-[13px] font-bold tracking-tight text-ink-900">
                      {v.plateNumber}
                    </p>
                    <p className="text-[11.5px] text-ink-500">{v.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <StatusChip meta={vehicleStatusMeta[v.status]} />
              </div>

              <p className="mt-3 truncate text-[12.5px] text-ink-600">{v.model}</p>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-ink-500">Utilization</span>
                  <span className="font-semibold text-ink-800">{utilization(v)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className={`h-full rounded-full transition-[width] duration-700 ${
                      v.status === 'ACTIVE'
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${utilization(v)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-100 pt-3">
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-ink-400">
                    <Gauge className="h-3 w-3" /> Odometer
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-ink-800">
                    {(v.currentOdometerKm / 1000).toFixed(0)}k km
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-ink-400">
                    <Fuel className="h-3 w-3" /> Efficiency
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-ink-800">
                    {v.fuelEfficiencyKmPerL} km/L
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-ink-400">
                    <Wrench className="h-3 w-3" /> Capacity
                  </p>
                  <p className="mt-0.5 text-[12px] font-semibold text-ink-800">{kg(v.capacityKg)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
