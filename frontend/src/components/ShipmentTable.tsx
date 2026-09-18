import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Shipment, ShipmentStatus, ShipmentPriority } from '../types';

interface ShipmentTableProps {
  shipments: Shipment[];
  onCreateShipment: (shipment: Partial<Shipment>) => void;
  onDispatchTrip?: (shipment: Shipment) => void;
  forceOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onCreateShipment,
  onDispatchTrip,
  forceOpenModal,
  onCloseModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalActive = forceOpenModal || isModalOpen;

  // Form State
  const [origin, setOrigin] = useState('Bengaluru Hub');
  const [destination, setDestination] = useState('Hyderabad DC');
  const [customerName, setCustomerName] = useState('');
  const [weightKg, setWeightKg] = useState('2500');
  const [priority, setPriority] = useState<ShipmentPriority>('NORMAL');

  const filtered = shipments.filter((s) => {
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    onCreateShipment({
      origin,
      destination,
      customerName,
      customerEmail: `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      weightKg: Number(weightKg) || 1000,
      priority,
    });
    setIsModalOpen(false);
    setCustomerName('');
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
            <Clock className="h-3 w-3" /> In Transit
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-3 w-3" /> Pending Dispatch
          </span>
        );
      default:
        return <span className="text-xs text-slate-400">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: ShipmentPriority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">URGENT</span>;
      case 'EXPRESS':
        return <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">EXPRESS</span>;
      default:
        return <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">NORMAL</span>;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Package className="h-4 w-4 text-indigo-400" />
            Shipment Manifest ({filtered.length})
          </h3>
          <p className="text-xs text-slate-400">
            Managed via Spring Data JPA with dynamic query specifications & event updates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search tracking, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
          </select>

          {/* Create Shipment Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800/80">
            <tr>
              <th className="px-5 py-3">Tracking Code</th>
              <th className="px-4 py-3">Client / Consignee</th>
              <th className="px-4 py-3">Route Corridor</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="px-5 py-3.5 font-mono font-bold text-indigo-300">
                  {shipment.trackingNumber}
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-slate-200">{shipment.customerName}</div>
                  <div className="text-[10px] text-slate-500">{shipment.customerEmail}</div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="text-slate-300 font-medium">{shipment.origin}</div>
                  <div className="text-[10px] text-slate-500">↳ {shipment.destination}</div>
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-300">
                  {shipment.weightKg.toLocaleString()} kg
                </td>
                <td className="px-4 py-3.5">
                  {getPriorityBadge(shipment.priority)}
                </td>
                <td className="px-4 py-3.5">
                  {getStatusBadge(shipment.status)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  {shipment.status === 'PENDING' ? (
                    <button
                      onClick={() => onDispatchTrip?.(shipment)}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-500/30 transition-all"
                    >
                      Dispatch Trip <ArrowUpRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500">Live Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Shipment Modal */}
      {modalActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-400" />
              Register New Freight Shipment
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Directly invokes Spring Boot ShipmentController
            </p>
            <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/20 p-2.5 mb-4 text-[11px] font-mono text-indigo-300">
              Endpoint: POST /api/shipments
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Consignee</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Motors Supply Chain"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Origin Hub</label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cargo Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ShipmentPriority)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="EXPRESS">EXPRESS</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); onCloseModal?.(); }}
                  className="rounded-xl border border-slate-800 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
                >
                  Create & Generate Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
