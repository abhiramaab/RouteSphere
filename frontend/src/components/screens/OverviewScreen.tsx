import React from 'react';
import {
  Package,
  Gauge,
  Clock,
  IndianRupee,
  Users,
  TrendingUp,
} from 'lucide-react';
import { LogisticsMetrics, Shipment, Trip, Driver } from '../../types';
import {
  compactInr,
  shipmentStatusMeta,
  priorityMeta,
  tripStatusMeta,
  avatarTone,
  relativeTime,
} from '../../lib/format';
import { StatusChip, Avatar, Sparkline } from '../ui/atoms';

interface OverviewProps {
  metrics: LogisticsMetrics;
  shipments: Shipment[];
  trips: Trip[];
  drivers: Driver[];
  onOpenShipment: (s: Shipment) => void;
  onGoToTab: (tab: 'shipments' | 'trips' | 'fleet' | 'drivers') => void;
}

const Card: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  tone: string;
  spark: number[];
  delay: number;
}> = ({ icon: Icon, label, value, sub, tone, spark, delay }) => (
  <div
    className="panel animate-rise p-4"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-4 w-4" />
      </div>
      <Sparkline values={spark} className="h-8 w-20" />
    </div>
    <p className="mt-3 text-[24px] font-bold leading-none tracking-tight text-ink-900">
      {value}
    </p>
    <p className="mt-1.5 text-[12px] font-medium text-ink-500">{label}</p>
    {sub ? <p className="mt-0.5 text-[11px] text-ink-400">{sub}</p> : null}
  </div>
);

export const OverviewScreen: React.FC<OverviewProps> = ({
  metrics,
  shipments,
  trips,
  drivers,
  onOpenShipment,
  onGoToTab,
}) => {
  const liveTrips = trips.filter((t) => t.status === 'IN_PROGRESS');
  const recent = [...shipments]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6);
  const available = drivers.filter((d) => d.status === 'AVAILABLE');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card
          icon={Package}
          label="Active shipments"
          value={String(metrics.activeShipments)}
          sub={`${metrics.pendingDeliveries} awaiting dispatch`}
          tone="bg-brand-50 text-brand-600"
          spark={[4, 6, 5, 8, 7, 10, 9, 12]}
          delay={0}
        />
        <Card
          icon={Gauge}
          label="Fleet utilization"
          value={`${metrics.fleetUtilizationPercent}%`}
          sub="Across all active vehicles"
          tone="bg-emerald-50 text-emerald-600"
          spark={[60, 64, 62, 70, 74, 80, 78, 86]}
          delay={60}
        />
        <Card
          icon={Clock}
          label="On-time delivery"
          value={`${metrics.onTimeDeliveryRate}%`}
          sub="Rolling 30-day rate"
          tone="bg-violet-50 text-violet-600"
          spark={[88, 90, 91, 89, 93, 95, 96, 98]}
          delay={120}
        />
        <Card
          icon={IndianRupee}
          label="Monthly revenue"
          value={compactInr(metrics.totalRevenueMonthly)}
          sub="Collected invoices"
          tone="bg-amber-50 text-amber-600"
          spark={[20, 24, 22, 30, 34, 38, 42, 48]}
          delay={180}
        />
        <Card
          icon={Users}
          label="Available drivers"
          value={String(metrics.availableDrivers)}
          sub={`${drivers.length} in directory`}
          tone="bg-cyan-50 text-cyan-600"
          spark={[8, 9, 7, 10, 11, 12, 13, 14]}
          delay={240}
        />
        <Card
          icon={TrendingUp}
          label="Live trips"
          value={String(liveTrips.length)}
          sub="Currently in progress"
          tone="bg-rose-50 text-rose-600"
          spark={[1, 2, 1, 3, 2, 4, 3, 3]}
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        {/* Live routes */}
        <div className="panel overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="text-[14px] font-bold tracking-tight text-ink-900">Live routes</h2>
              <p className="text-[12px] text-ink-500">Active dispatches and progress</p>
            </div>
            <button
              onClick={() => onGoToTab('trips')}
              className="text-[12px] font-semibold text-brand-600 hover:text-brand-700"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-ink-100">
            {liveTrips.length === 0 ? (
              <p className="px-5 py-10 text-center text-[13px] text-ink-400">
                No trips in progress. Dispatch a shipment to start one.
              </p>
            ) : (
              liveTrips.slice(0, 4).map((t, i) => (
                <div
                  key={t.id}
                  className="animate-rise px-5 py-4"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                      </span>
                      <span className="font-mono text-[12px] font-semibold text-ink-800">
                        {t.tripCode}
                      </span>
                      <StatusChip meta={tripStatusMeta[t.status]} />
                    </div>
                    <span className="text-[12px] font-semibold text-ink-700">
                      {t.progressPercent}%
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 text-[12.5px] text-ink-600">
                    <span className="truncate">{t.origin}</span>
                    <svg viewBox="0 0 24 12" className="h-2.5 w-6 shrink-0 text-ink-300">
                      <path
                        d="M1 6h20M17 2l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="truncate">{t.destination}</span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-[width] duration-700"
                      style={{ width: `${t.progressPercent}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-ink-400">
                    <span>{t.driverName}</span>
                    <span>{t.eta}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Available drivers */}
        <div className="panel overflow-hidden">
          <div className="panel-header">
            <div>
              <h2 className="text-[14px] font-bold tracking-tight text-ink-900">Ready to dispatch</h2>
              <p className="text-[12px] text-ink-500">{available.length} drivers available</p>
            </div>
            <button
              onClick={() => onGoToTab('drivers')}
              className="text-[12px] font-semibold text-brand-600 hover:text-brand-700"
            >
              Directory
            </button>
          </div>
          <div className="divide-y divide-ink-100">
            {available.slice(0, 5).map((d, i) => (
              <div
                key={d.id}
                className="flex items-center gap-3 px-5 py-3 animate-rise"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Avatar name={d.fullName} toneClass={avatarTone(d.fullName)} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-ink-800">
                    {d.fullName}
                  </p>
                  <p className="truncate font-mono text-[10.5px] text-ink-400">
                    {d.licenseNumber}
                  </p>
                </div>
                <span className="text-[11.5px] font-semibold text-amber-600">★ {d.rating}</span>
              </div>
            ))}
            {available.length === 0 ? (
              <p className="px-5 py-10 text-center text-[13px] text-ink-400">
                All drivers are currently assigned.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Recent shipments */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div>
            <h2 className="text-[14px] font-bold tracking-tight text-ink-900">Recent shipments</h2>
            <p className="text-[12px] text-ink-500">Latest activity across the network</p>
          </div>
          <button
            onClick={() => onGoToTab('shipments')}
            className="text-[12px] font-semibold text-brand-600 hover:text-brand-700"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-ink-200 bg-ink-50/60">
              <tr>
                <th className="th">Tracking</th>
                <th className="th">Route</th>
                <th className="th">Priority</th>
                <th className="th">Status</th>
                <th className="th">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {recent.map((s, i) => (
                <tr
                  key={s.id}
                  onClick={() => onOpenShipment(s)}
                  className="cursor-pointer transition-colors hover:bg-ink-50 animate-rise"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td className="td font-mono text-[12px] font-medium text-ink-800">
                    {s.trackingNumber}
                  </td>
                  <td className="td">
                    <span className="flex items-center gap-1.5">
                      <span className="max-w-[140px] truncate">{s.origin}</span>
                      <span className="text-ink-300">→</span>
                      <span className="max-w-[140px] truncate">{s.destination}</span>
                    </span>
                  </td>
                  <td className="td">
                    <StatusChip meta={priorityMeta[s.priority]} />
                  </td>
                  <td className="td">
                    <StatusChip meta={shipmentStatusMeta[s.status]} />
                  </td>
                  <td className="td text-ink-500">{relativeTime(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
