import React, { useMemo, useState } from 'react';
import { Users, Plus, Phone, BadgeCheck, Star, Search } from 'lucide-react';
import { Driver, DriverStatus } from '../../types';
import { driverStatusMeta, avatarTone, initials } from '../../lib/format';
import { StatusChip, EmptyState } from '../ui/atoms';

interface DriversScreenProps {
  drivers: Driver[];
  query: string;
  onCreate: () => void;
}

export const DriversScreen: React.FC<DriversScreenProps> = ({ drivers, query, onCreate }) => {
  const [status, setStatus] = useState<DriverStatus | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    let list = drivers;
    if (status !== 'ALL') list = list.filter((d) => d.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.fullName.toLowerCase().includes(q) ||
          d.licenseNumber.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q)
      );
    }
    return list;
  }, [drivers, status, query]);

  const counts = {
    ALL: drivers.length,
    AVAILABLE: drivers.filter((d) => d.status === 'AVAILABLE').length,
    ON_DUTY: drivers.filter((d) => d.status === 'ON_DUTY').length,
    OFF_DUTY: drivers.filter((d) => d.status === 'OFF_DUTY').length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {(['ALL', 'AVAILABLE', 'ON_DUTY', 'OFF_DUTY'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                status === s
                  ? 'bg-ink-900 text-white'
                  : 'border border-ink-200 bg-white text-ink-500 hover:text-ink-800'
              }`}
            >
              {s === 'ALL' ? 'All' : driverStatusMeta[s].label}
              <span className={`rounded-full px-1.5 text-[10px] ${status === s ? 'bg-white/20' : 'bg-ink-100 text-ink-500'}`}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
        <button onClick={onCreate} className="btn-primary ml-auto px-3 py-1.5">
          <Plus className="h-3.5 w-3.5" /> Onboard driver
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={Search}
            title="No drivers found"
            description="Try a different filter or onboard a new driver."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d, i) => (
            <div
              key={d.id}
              className="panel animate-rise p-4 transition-shadow hover:shadow-lift"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${avatarTone(
                    d.fullName
                  )}`}
                >
                  {initials(d.fullName)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[13.5px] font-bold text-ink-900">{d.fullName}</p>
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                  </div>
                  <p className="truncate font-mono text-[11px] text-ink-400">
                    {d.licenseNumber}
                  </p>
                </div>
                <StatusChip meta={driverStatusMeta[d.status]} />
              </div>

              <div className="mt-4 flex items-center gap-4 border-t border-ink-100 pt-3 text-[12px]">
                <span className="flex items-center gap-1.5 text-ink-500">
                  <Phone className="h-3.5 w-3.5 text-ink-400" />
                  {d.phone || '—'}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-ink-50 px-2 py-2 text-center">
                  <p className="text-[15px] font-bold text-ink-900">{d.tripsCompleted}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                    Trips
                  </p>
                </div>
                <div className="rounded-lg bg-ink-50 px-2 py-2 text-center">
                  <p className="flex items-center justify-center gap-0.5 text-[15px] font-bold text-ink-900">
                    {d.rating}
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                    Rating
                  </p>
                </div>
                <div className="rounded-lg bg-ink-50 px-2 py-2 text-center">
                  <p className="text-[15px] font-bold text-ink-900">
                    {d.experienceYears ?? '—'}
                    {d.experienceYears ? <span className="text-[10px]">y</span> : null}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                    Exp
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
