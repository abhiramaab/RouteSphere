import React from 'react';
import { 
  Layers, 
  Database, 
  ShieldCheck, 
  Server, 
  X, 
  Workflow
} from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="my-8 w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2 text-blue-600">
            <Layers className="h-5 w-5" />
            <div>
              <h3 className="text-base font-bold text-slate-900">RouteSphere Architecture</h3>
              <p className="text-xs text-slate-500">Domain-Driven Modular Monolith with Clean Boundaries</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Architecture Grid */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Workflow className="h-4 w-4 text-blue-600" /> Bounded Context Architecture
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Ingress */}
            <div className="rounded-lg border border-slate-200 bg-white p-3.5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Ingress & Security
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li>• JWT Stateless Filter Chain</li>
                  <li>• Role-Based Access Control</li>
                  <li>• Swagger / OpenAPI Docs</li>
                </ul>
              </div>
              <div className="mt-3 text-[11px] font-mono text-blue-700">AuthController / JwtFilter</div>
            </div>

            {/* Core Domain */}
            <div className="rounded-lg border border-slate-200 bg-white p-3.5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <Server className="h-4 w-4 text-blue-600" /> Domain Services
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li>• Shipment State Machine</li>
                  <li>• Trip Dispatch & Allocation</li>
                  <li>• Vehicle Telematics</li>
                  <li>• Driver Lifecycle</li>
                </ul>
              </div>
              <div className="mt-3 text-[11px] font-mono text-blue-700">Spring Data JPA / Services</div>
            </div>

            {/* Storage & Events */}
            <div className="rounded-lg border border-slate-200 bg-white p-3.5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <Database className="h-4 w-4 text-blue-600" /> Persistence & Events
                </div>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li>• MySQL Relational DB</li>
                  <li>• ACID Transaction Boundary</li>
                  <li>• Resend Email API Integration</li>
                  <li>• Billing & Invoicing Ledger</li>
                </ul>
              </div>
              <div className="mt-3 text-[11px] font-mono text-blue-700">HikariCP + Resend API</div>
            </div>
          </div>
        </div>

        {/* System Decisions */}
        <div className="space-y-3 text-xs text-slate-700">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">1. Modular Monolith Architecture</h4>
            <p className="text-slate-600 leading-relaxed">
              RouteSphere isolates domains (Shipment, Fleet, Dispatch, Invoices) with clear interface boundaries inside a single deployable unit. This provides full transaction safety without the network latency and distributed coordination overhead of microservices, while remaining ready for decomposition if traffic requires.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1">2. Transaction Integrity in Dispatch</h4>
            <p className="text-slate-600 leading-relaxed">
              When a trip is dispatched via `TripController`, the system coordinates driver availability, vehicle capacity checks, and shipment state transitions in a single atomic boundary to prevent double-booking.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
