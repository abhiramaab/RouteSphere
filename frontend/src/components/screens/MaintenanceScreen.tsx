import React, { useMemo, useState } from 'react';
import { Wrench, Plus, CalendarClock, IndianRupee } from 'lucide-react';
import { Maintenance, Vehicle } from '../../types';
import { vehicleStatusMeta, inr, shortDate } from '../../lib/format';
import { StatusChip, EmptyState } from '../ui/atoms';

interface Props {
  records: Maintenance[];
  vehicles: Vehicle[];
  query: string;
  onCreate: () => void;
}

export const MaintenanceScreen: React.FC<Props> = ({ records, vehicles, query, onCreate }) => {
  const vehicleMap = useMemo(() => {
    const m = new Map<number, Vehicle>();
    vehicles.forEach((v) => m.set(v.id, v));
    return m;
  }, [vehicles]);

  const filtered = useMemo(() => {
    if (!query.trim()) return records;
    const q = query.toLowerCase();
    return records.filter(
      (r) =>
        r.serviceType.toLowerCase().includes(q) ||
        (r.remarks || '').toLowerCase().includes(q) ||
        (vehicleMap.get(r.vehicleId)?.plateNumber || '').toLowerCase().includes(q)
    );
  }, [records, query, vehicleMap]);

  const totalCost = records.reduce((s, r) => s + r.serviceCost, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Service records', value: String(records.length), icon: Wrench, tone: 'text-brand-600 bg-brand-50' },
          { label: 'Total service spend', value: inr(totalCost), icon: IndianRupee, tone: 'text-amber-600 bg-amber-50' },
          { label: 'Upcoming services', value: String(records.filter((r) => r.nextServiceDate).length), icon: CalendarClock, tone: 'text-violet-600 bg-violet-50' },
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
            <Wrench className="h-4 w-4 text-ink-400" />
            <h2 className="text-[14px] font-bold tracking-tight text-ink-900">Maintenance history</h2>
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
              {records.length}
            </span>
          </div>
          <button onClick={onCreate} className="btn-primary px-3 py-1.5">
            <Plus className="h-3.5 w-3.5" /> Log maintenance
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No maintenance records"
            description="Record services to keep vehicle history and next-service dates."
            action={
              <button onClick={onCreate} className="btn-primary mt-1">
                <Plus className="h-3.5 w-3.5" /> Log maintenance
              </button>
            }
          />
        ) : (
          <div className="space-y-3 p-4">
            {filtered.map((r, i) => {
              const v = vehicleMap.get(r.vehicleId);
              return (
                <div
                  key={r.id}
                  className="animate-rise rounded-xl border border-ink-200 p-4 transition-shadow hover:shadow-card"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-ink-900 text-white">
                        <Wrench className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[13.5px] font-bold text-ink-900">{r.serviceType}</p>
                        <p className="font-mono text-[11.5px] text-ink-500">
                          {v ? `${v.plateNumber} · ${v.model}` : `Vehicle #${r.vehicleId}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusChip meta={vehicleStatusMeta[r.vehicleStatus]} />
                      <span className="text-[13px] font-bold text-ink-900">{inr(r.serviceCost)}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 border-t border-ink-100 pt-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                        Last service
                      </p>
                      <p className="text-[12.5px] font-medium text-ink-700">
                        {shortDate(r.lastServiceDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                        Next service
                      </p>
                      <p className="text-[12.5px] font-medium text-ink-700">
                        {r.nextServiceDate ? shortDate(r.nextServiceDate) : '—'}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                        Remarks
                      </p>
                      <p className="text-[12.5px] text-ink-600">{r.remarks || '—'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
