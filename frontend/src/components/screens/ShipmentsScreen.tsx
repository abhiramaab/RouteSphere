import React, { useMemo, useState } from 'react';
import { Package, Search, Filter, ArrowUpDown, Trash2, Send, Plus } from 'lucide-react';
import { Shipment, ShipmentStatus } from '../../types';
import {
  shipmentStatusMeta,
  priorityMeta,
  kg,
  shortDate,
  relativeTime,
} from '../../lib/format';
import { StatusChip, EmptyState } from '../ui/atoms';
import { RouteSphereApi } from '../../api';

interface ShipmentsScreenProps {
  shipments: Shipment[];
  query: string;
  onCreate: () => void;
  onDispatch: (s: Shipment) => void;
  onRefresh: () => void;
}

type SortKey = 'recent' | 'weight' | 'priority';

export const ShipmentsScreen: React.FC<ShipmentsScreenProps> = ({
  shipments,
  query,
  onCreate,
  onDispatch,
  onRefresh,
}) => {
  const [status, setStatus] = useState<ShipmentStatus | 'ALL'>('ALL');
  const [sort, setSort] = useState<SortKey>('recent');

  const filtered = useMemo(() => {
    let list = shipments;
    if (status !== 'ALL') list = list.filter((s) => s.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q)
      );
    }
    const priorityRank: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return [...list].sort((a, b) => {
      if (sort === 'weight') return b.weightKg - a.weightKg;
      if (sort === 'priority') return priorityRank[b.priority] - priorityRank[a.priority];
      return +new Date(b.createdAt) - +new Date(a.createdAt);
    });
  }, [shipments, status, query, sort]);

  const handleDelete = async (s: Shipment) => {
    if (!confirm(`Delete shipment ${s.trackingNumber}?`)) return;
    await RouteSphereApi.deleteShipment(s.id);
    onRefresh();
  };

  const counts = useMemo(() => {
    const base: Record<string, number> = { ALL: shipments.length };
    (['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'] as ShipmentStatus[]).forEach((k) => {
      base[k] = shipments.filter((s) => s.status === k).length;
    });
    return base;
  }, [shipments]);

  const tabs: (ShipmentStatus | 'ALL')[] = ['ALL', 'PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-ink-200 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-ink-400" />
          <h2 className="text-[14px] font-bold tracking-tight text-ink-900">Shipments</h2>
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
            {shipments.length}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="field appearance-none py-1.5 pl-8 pr-7 text-[12.5px]"
            >
              <option value="recent">Most recent</option>
              <option value="weight">Heaviest first</option>
              <option value="priority">Priority</option>
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-400" />
          </div>
          <button onClick={onCreate} className="btn-primary px-3 py-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New shipment</span>
          </button>
        </div>
      </div>

      {/* status tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-ink-200 px-3 py-2">
        {tabs.map((t) => {
          const active = status === t;
          const label = t === 'ALL' ? 'All' : shipmentStatusMeta[t].label;
          return (
            <button
              key={t}
              onClick={() => setStatus(t)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                active ? 'bg-ink-900 text-white' : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
              }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 text-[10px] ${
                  active ? 'bg-white/20' : 'bg-ink-100 text-ink-500'
                }`}
              >
                {counts[t] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No shipments match"
          description="Try a different filter or create a new shipment to get started."
          action={
            <button onClick={onCreate} className="btn-primary mt-1">
              <Plus className="h-3.5 w-3.5" /> New shipment
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-ink-200 bg-ink-50/60">
              <tr>
                <th className="th">Tracking</th>
                <th className="th">Route</th>
                <th className="th">Customer</th>
                <th className="th">Weight</th>
                <th className="th">Priority</th>
                <th className="th">Status</th>
                <th className="th">ETA</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((s, i) => (
                <tr
                  key={s.id}
                  className="group transition-colors hover:bg-ink-50 animate-rise"
                  style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
                >
                  <td className="td">
                    <span className="font-mono text-[12px] font-semibold text-ink-800">
                      {s.trackingNumber}
                    </span>
                    <span className="mt-0.5 block text-[10.5px] text-ink-400">
                      {relativeTime(s.createdAt)}
                    </span>
                  </td>
                  <td className="td">
                    <span className="flex flex-col gap-0.5">
                      <span className="max-w-[180px] truncate">{s.origin}</span>
                      <span className="flex items-center gap-1.5 text-ink-300">
                        <span className="h-px w-3 bg-ink-200" />
                        <span>→</span>
                        <span className="max-w-[160px] truncate text-ink-500">{s.destination}</span>
                      </span>
                    </span>
                  </td>
                  <td className="td">
                    <span className="block max-w-[160px] truncate text-ink-700">
                      {s.customerName}
                    </span>
                  </td>
                  <td className="td font-medium">{kg(s.weightKg)}</td>
                  <td className="td">
                    <StatusChip meta={priorityMeta[s.priority]} />
                  </td>
                  <td className="td">
                    <StatusChip meta={shipmentStatusMeta[s.status]} />
                  </td>
                  <td className="td text-ink-500">{shortDate(s.estimatedDelivery)}</td>
                  <td className="td">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {s.status === 'PENDING' ? (
                        <button
                          onClick={() => onDispatch(s)}
                          className="rounded-md p-1.5 text-brand-600 transition-colors hover:bg-brand-50"
                          title="Dispatch trip"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDelete(s)}
                        className="rounded-md p-1.5 text-ink-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
