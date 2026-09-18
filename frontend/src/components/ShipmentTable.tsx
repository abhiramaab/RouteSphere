import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  X
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
    onCloseModal?.();
    setCustomerName('');
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3" /> In Transit
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
            <AlertCircle className="h-3 w-3" /> Pending
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: ShipmentPriority) => {
    switch (priority) {
      case 'URGENT':
        return <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">URGENT</span>;
      case 'EXPRESS':
        return <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">EXPRESS</span>;
      default:
        return <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">NORMAL</span>;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-600" />
            Shipments Directory ({filtered.length})
          </h3>
          <p className="text-xs text-slate-500">
            Spring Data JPA query specifications & lifecycle tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tracking, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
          </select>

          {/* Create Shipment Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Tracking Code</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Route Corridor</th>
              <th className="px-4 py-3">Weight</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 font-mono font-semibold text-blue-700">
                  {shipment.trackingNumber}
                </td>
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-slate-900">{shipment.customerName}</div>
                  <div className="text-[11px] text-slate-400">{shipment.customerEmail}</div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="text-slate-800 font-medium">{shipment.origin}</div>
                  <div className="text-[11px] text-slate-400">→ {shipment.destination}</div>
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-700">
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
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Dispatch Trip <ArrowUpRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Shipment Modal */}
      {modalActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Register New Shipment
              </h3>
              <button onClick={() => { setIsModalOpen(false); onCloseModal?.(); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5 mb-4 text-xs font-mono text-blue-700">
              Endpoint: POST /api/shipments
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Consignee</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Motors Supply Chain"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Origin Hub</label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ShipmentPriority)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="EXPRESS">EXPRESS</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); onCloseModal?.(); }}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                >
                  Create Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
