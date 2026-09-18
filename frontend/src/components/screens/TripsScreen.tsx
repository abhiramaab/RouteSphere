import React, { useMemo, useState } from 'react';
import { Navigation, Plus, MapPin, Truck, User, Route } from 'lucide-react';
import { Trip, TripStatus } from '../../types';
import { tripStatusMeta } from '../../lib/format';
import { StatusChip, EmptyState } from '../ui/atoms';

interface TripsScreenProps {
  trips: Trip[];
  query: string;
  onDispatch: () => void;
}

export const TripsScreen: React.FC<TripsScreenProps> = ({ trips, query, onDispatch }) => {
  const [status, setStatus] = useState<TripStatus | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    let list = trips;
    if (status !== 'ALL') list = list.filter((t) => t.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.tripCode.toLowerCase().includes(q) ||
          t.driverName.toLowerCase().includes(q) ||
          t.origin.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q)
      );
    }
    return list;
  }, [trips, status, query]);

  const active = trips.filter((t) => t.status === 'IN_PROGRESS');
  const completed = trips.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Active trips', value: active.length, icon: Navigation, tone: 'text-brand-600 bg-brand-50' },
          { label: 'Completed', value: completed, icon: Route, tone: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total dispatched', value: trips.length, icon: Truck, tone: 'text-violet-600 bg-violet-50' },
        ].map((s, i) => (
          <div key={s.label} className="panel animate-rise flex items-center gap-4 p-4" style={{ animationDelay: `${i * 60}ms` }}>
            <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[22px] font-bold leading-none text-ink-900">{s.value}</p>
              <p className="mt-1 text-[12px] font-medium text-ink-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 overflow-x-auto">
          {(['ALL', 'IN_PROGRESS', 'SCHEDULED', 'COMPLETED', 'CANCELLED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                status === s
                  ? 'bg-ink-900 text-white'
                  : 'border border-ink-200 bg-white text-ink-500 hover:text-ink-800'
              }`}
            >
              {s === 'ALL' ? 'All trips' : tripStatusMeta[s].label}
            </button>
          ))}
        </div>
        <button onClick={onDispatch} className="btn-primary ml-auto px-3 py-1.5">
          <Plus className="h-3.5 w-3.5" /> Dispatch trip
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={Navigation}
            title="No trips to show"
            description="Dispatch a pending shipment to create a trip."
            action={
              <button onClick={onDispatch} className="btn-primary mt-1">
                <Plus className="h-3.5 w-3.5" /> Dispatch trip
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t, i) => (
            <div
              key={t.id}
              className="panel animate-rise p-5 transition-shadow hover:shadow-lift"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-900 text-white">
                    <Navigation className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-mono text-[13px] font-bold text-ink-900">{t.tripCode}</p>
                    <p className="text-[11.5px] text-ink-400">Shipment {t.trackingNumber}</p>
                  </div>
                </div>
                <StatusChip meta={tripStatusMeta[t.status]} />
              </div>

              {/* route line */}
              <div className="mt-5 flex items-stretch gap-3">
                <div className="flex flex-col items-center pt-1.5">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-brand-500 bg-white" />
                  <span className="my-1 w-px flex-1 bg-gradient-to-b from-brand-300 to-ink-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-800" />
                </div>
                <div className="flex flex-1 flex-col justify-between gap-4 py-0.5">
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">
                      Origin
                    </p>
                    <p className="text-[13px] font-medium text-ink-800">{t.origin}</p>
                  </div>
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">
                      Destination
                    </p>
                    <p className="text-[13px] font-medium text-ink-800">{t.destination}</p>
                  </div>
                </div>

                <div className="hidden flex-col items-end justify-between border-l border-ink-100 pl-5 sm:flex">
                  <span className="flex items-center gap-2 text-[12px] text-ink-600">
                    <User className="h-3.5 w-3.5 text-ink-400" />
                    {t.driverName}
                  </span>
                  <span className="flex items-center gap-2 text-[12px] text-ink-600">
                    <Truck className="h-3.5 w-3.5 text-ink-400" />
                    {t.vehiclePlate}
                  </span>
                  <span className="flex items-center gap-2 text-[12px] text-ink-500">
                    <MapPin className="h-3.5 w-3.5 text-ink-400" />
                    {t.distanceKm} km
                  </span>
                </div>
              </div>

              {t.status === 'IN_PROGRESS' ? (
                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-[11px]">
                    <span className="font-medium text-ink-500">Progress</span>
                    <span className="font-semibold text-ink-800">{t.progressPercent}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-[width] duration-1000"
                      style={{ width: `${t.progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-[11px] text-ink-400">{t.eta}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
