import React, { useMemo, useState } from 'react';
import { Fuel, Plus, Droplet, IndianRupee, MapPin } from 'lucide-react';
import { FuelLog } from '../../types';
import { inr } from '../../lib/format';
import { EmptyState } from '../ui/atoms';

interface Props {
  fuelLogs: FuelLog[];
  query: string;
  onCreate: () => void;
}

export const FuelLogsScreen: React.FC<Props> = ({ fuelLogs, query, onCreate }) => {
  const filtered = useMemo(() => {
    if (!query.trim()) return fuelLogs;
    const q = query.toLowerCase();
    return fuelLogs.filter(
      (f) =>
        f.fuelStation.toLowerCase().includes(q) ||
        f.driverName.toLowerCase().includes(q) ||
        (f.vehicleNumber || '').toLowerCase().includes(q) ||
        (f.customerName || '').toLowerCase().includes(q)
    );
  }, [fuelLogs, query]);

  const totalLitres = fuelLogs.reduce((s, f) => s + f.fuelQuantity, 0);
  const totalCost = fuelLogs.reduce((s, f) => s + f.fuelCost, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total fuel logged', value: `${totalLitres.toFixed(1)} L`, icon: Droplet, tone: 'text-brand-600 bg-brand-50' },
          { label: 'Total fuel spend', value: inr(totalCost), icon: IndianRupee, tone: 'text-amber-600 bg-amber-50' },
          { label: 'Entries', value: String(fuelLogs.length), icon: Fuel, tone: 'text-emerald-600 bg-emerald-50' },
        ].map((s, i) => (
          <div key={s.label} className="panel animate-rise flex items-center gap-4 p-4" style={{ animationDelay: `${i * 60}ms` }}>
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[20px] font-bold leading-none text-ink-900">{s.value}</p>
              <p className="mt-1 text-[12px] font-medium text-ink-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-ink-400" />
            <h2 className="text-[14px] font-bold tracking-tight text-ink-900">Fuel logs</h2>
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
              {fuelLogs.length}
            </span>
          </div>
          <button onClick={onCreate} className="btn-primary px-3 py-1.5">
            <Plus className="h-3.5 w-3.5" /> Log fuel
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Fuel}
            title="No fuel logs yet"
            description="Record refuels against shipments to track consumption and cost."
            action={
              <button onClick={onCreate} className="btn-primary mt-1">
                <Plus className="h-3.5 w-3.5" /> Log fuel
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead className="border-b border-ink-200 bg-ink-50/60">
                <tr>
                  <th className="th">Station</th>
                  <th className="th">Vehicle</th>
                  <th className="th">Driver</th>
                  <th className="th">Shipment</th>
                  <th className="th">Quantity</th>
                  <th className="th">Cost</th>
                  <th className="th">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((f, i) => (
                  <tr
                    key={f.id}
                    className="transition-colors hover:bg-ink-50 animate-rise"
                    style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                  >
                    <td className="td">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-ink-400" />
                        <span className="max-w-[200px] truncate">{f.fuelStation}</span>
                      </span>
                    </td>
                    <td className="td font-mono text-[12px]">{f.vehicleNumber || '—'}</td>
                    <td className="td max-w-[150px] truncate">{f.driverName}</td>
                    <td className="td font-mono text-[12px] text-ink-500">
                      #{f.shipmentId}
                    </td>
                    <td className="td font-medium">{f.fuelQuantity} L</td>
                    <td className="td font-semibold text-ink-900">{inr(f.fuelCost)}</td>
                    <td className="td text-ink-500">
                      ₹{f.fuelQuantity ? (f.fuelCost / f.fuelQuantity).toFixed(2) : '0.00'}/L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
