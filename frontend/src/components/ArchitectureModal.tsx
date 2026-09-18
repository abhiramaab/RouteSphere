import React from 'react';
import { 
  Layers, 
  Database, 
  ShieldCheck, 
  Radio, 
  Mail, 
  Server, 
  X, 
  ArrowRight,
  Workflow
} from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div className="my-8 w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2 text-indigo-400">
            <Layers className="h-5 w-5" />
            <div>
              <h3 className="text-base font-bold text-white">RouteSphere Architecture & System Design</h3>
              <p className="text-xs text-slate-400">Clean Domain-Driven Modular Monolith with Microservice Boundary Isolation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Workflow className="h-4 w-4 text-indigo-400" /> Modular Domain Architecture
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Edge / Gateway */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-4 w-4" /> Security & Ingress
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• JWT Stateless Filter Chain</li>
                  <li>• Role-Based Access (ADMIN, DRIVER, DISPATCHER)</li>
                  <li>• Swagger / OpenAPI Docs</li>
                </ul>
              </div>
              <div className="mt-3 text-[10px] font-mono text-indigo-400">AuthController / JwtFilter</div>
            </div>

            {/* Core Domain Engine */}
            <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-purple-300 flex items-center gap-1.5 mb-1">
                  <Server className="h-4 w-4" /> Core Business Services
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• Shipment State Machine</li>
                  <li>• Trip Dispatch & Allocation</li>
                  <li>• Fleet Asset Telematics</li>
                  <li>• Fuel Efficiency Logs</li>
                </ul>
              </div>
              <div className="mt-3 text-[10px] font-mono text-purple-400">Spring Data JPA / Hibernate</div>
            </div>

            {/* Persistence & Events */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
                  <Database className="h-4 w-4" /> Persistence & Async
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1">
                  <li>• MySQL Relational Store</li>
                  <li>• ACID Transaction Boundary</li>
                  <li>• Resend Email API Integration</li>
                  <li>• Automated Invoicing Engine</li>
                </ul>
              </div>
              <div className="mt-3 text-[10px] font-mono text-emerald-400">HikariCP + Resend API</div>
            </div>
          </div>
        </div>

        {/* Deep Dive Details */}
        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800">
            <h4 className="font-bold text-white mb-1">1. Why a Modular Monolith with Clean Boundaries?</h4>
            <p className="text-slate-400 leading-relaxed">
              RouteSphere is architected with clear bounded contexts (Shipment, Fleet, Dispatch, Billing) sharing internal interfaces. This eliminates network serialization overhead, cross-service distributed transaction locks, and operational complexity while allowing seamless extraction into independent microservices (via Spring Cloud Gateway + Eureka) as scale demands.
            </p>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800">
            <h4 className="font-bold text-white mb-1">2. Transaction Management & Data Consistency</h4>
            <p className="text-slate-400 leading-relaxed">
              When a trip is dispatched, the system performs an atomic transaction: updating the shipment status to `IN_TRANSIT`, updating driver status to `ON_DUTY`, validating vehicle capacity limits, and creating the `Trip` entity. This prevents race conditions like double-booking a single driver or vehicle.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-colors"
          >
            Close System Design
          </button>
        </div>
      </div>
    </div>
  );
};
