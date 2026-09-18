import React from 'react';
import {
  BookOpen,
  Package,
  FileText,
  Building2,
  Navigation,
  Fuel,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Server,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

const Step: React.FC<{
  n: string;
  icon: React.ElementType;
  title: string;
  body: string;
  api?: string;
  accent: string;
}> = ({ n, icon: Icon, title, body, api, accent }) => (
  <div className="relative flex gap-3.5">
    <div className="flex flex-col items-center">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white ${accent}`}>
        {n}
      </span>
      <span className="mt-1 w-px flex-1 bg-ink-200" />
    </div>
    <div className="pb-5">
      <p className="flex items-center gap-2 text-[13px] font-bold text-ink-900">
        <Icon className="h-3.5 w-3.5 text-ink-400" />
        {title}
      </p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">{body}</p>
      {api ? (
        <code className="mt-1.5 inline-block rounded-md bg-ink-100 px-2 py-0.5 font-mono text-[10.5px] text-ink-600">
          {api}
        </code>
      ) : null}
    </div>
  </div>
);

export const DocumentationModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="How RouteSphere works"
      subtitle="Setup, the required workflow, and every feature"
      icon={BookOpen}
      width="lg"
    >
      <div className="space-y-6">
        {/* Connect */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[13px] font-bold text-ink-900">
            <Server className="h-4 w-4 text-brand-600" /> 1. Connect the backend
          </h3>
          <div className="space-y-2 rounded-xl border border-ink-200 bg-ink-50 p-4 text-[12.5px] leading-relaxed text-ink-600">
            <p>
              Start the Spring Boot API (defaults to <code className="rounded bg-ink-100 px-1 font-mono text-[11px]">http://localhost:8080</code>), then open{' '}
              <b>Backend settings</b> from the top-right menu and set the API URL. Click{' '}
              <b>Test connection</b> to confirm it is reachable.
            </p>
            <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                The backend must allow this origin via CORS (e.g. <code className="font-mono">http://localhost:5173</code>),
                otherwise login and all requests will fail.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />
              <span>
                Don&apos;t have a backend handy? Flip the <b>Demo / Live API</b> switch in the topbar
                to explore everything with local sample data.
              </span>
            </p>
          </div>
        </section>

        {/* Workflow */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-ink-900">
            <ArrowRight className="h-4 w-4 text-brand-600" /> 2. The creation order (important)
          </h3>
          <p className="mb-4 text-[12.5px] leading-relaxed text-ink-500">
            The data model is a chain. You cannot skip a link — the backend rejects requests that
            reference a missing parent. Follow this order:
          </p>

          <Step
            n="1"
            icon={Building2}
            title="Create a customer"
            body="Customers own invoices and shipments. Requires company, contact, email, address, city/state, 6-digit pincode and a valid GSTIN."
            api="POST /api/customer"
            accent="bg-brand-600"
          />
          <Step
            n="2"
            icon={FileText}
            title="Create an invoice"
            body="Every invoice belongs to a customer. Gives each shipment its billing reference and amount."
            api="POST /api/invoice"
            accent="bg-violet-600"
          />
          <Step
            n="3"
            icon={Package}
            title="Create a shipment"
            body="A shipment must reference an invoice (it is a required field), and inherits its customer from that invoice. Provide pickup/delivery, weight and priority."
            api="POST /api/shipment"
            accent="bg-emerald-600"
          />
          <Step
            n="4"
            icon={Navigation}
            title="Dispatch a trip"
            body="Assign an available driver and vehicle to a pending shipment. This creates the trip, moves the shipment to In transit, marks the driver On duty, and the vehicle In transit."
            api="POST /api/trip"
            accent="bg-cyan-600"
          />
          <Step
            n="5"
            icon={Fuel}
            title="Log fuel"
            body="Record refuel against a shipment. The backend derives the driver, vehicle and customer from that shipment automatically."
            api="POST /api/fuellog"
            accent="bg-amber-600"
          />
          <Step
            n="6"
            icon={Wrench}
            title="Log maintenance"
            body="Record vehicle service history with cost, last/next service dates and remarks, and set the vehicle status."
            api="POST /api/maintenance"
            accent="bg-rose-600"
          />
        </section>

        {/* Feature guide */}
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-ink-900">
            <Package className="h-4 w-4 text-brand-600" /> 3. Feature guide
          </h3>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {[
              { t: 'Overview', d: 'Live KPIs, in-progress routes, available drivers and recent shipments.' },
              { t: 'Shipments', d: 'Filter by status, sort, dispatch pending loads, or delete. Search from the topbar.' },
              { t: 'Trips & dispatch', d: 'See every trip with route progress. Dispatch from here or from a pending shipment.' },
              { t: 'Fleet', d: 'Vehicle cards with utilization, odometer, efficiency and capacity. Filter by status.' },
              { t: 'Drivers', d: 'Directory with availability, rating and experience. Onboard new drivers.' },
              { t: 'Customers', d: 'Company records that anchor invoices and shipments.' },
              { t: 'Invoices', d: 'Collections summary and full billing table. Create new invoices here.' },
              { t: 'Fuel logs', d: 'Consumption and spend, with per-litre rate calculated live.' },
              { t: 'Maintenance', d: 'Service history per vehicle with next-service tracking.' },
              { t: 'Create menu', d: 'Use the topbar "Create" button for quick access to every create action.' },
            ].map((f) => (
              <div key={f.t} className="rounded-lg border border-ink-200 p-3">
                <p className="text-[12.5px] font-semibold text-ink-800">{f.t}</p>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-500">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section>
          <h3 className="mb-2 flex items-center gap-2 text-[13px] font-bold text-ink-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> 4. Authentication &amp; roles
          </h3>
          <div className="space-y-2 text-[12.5px] leading-relaxed text-ink-600">
            <p>
              Sign in with a backend user (JWT). Register with a role, or use demo mode. Roles gate
              what the API accepts:
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { r: 'ADMIN', d: 'User management via /api/user' },
                { r: 'DISPATCHER', d: 'Customers, drivers, vehicles, trips, shipments, invoices' },
                { r: 'DRIVER', d: 'Fuel logs and maintenance only' },
              ].map((x) => (
                <div key={x.r} className="rounded-lg border border-ink-200 p-3">
                  <p className="font-mono text-[11.5px] font-bold text-ink-800">{x.r}</p>
                  <p className="mt-0.5 text-[11px] text-ink-500">{x.d}</p>
                </div>
              ))}
            </div>
            <p className="text-[11.5px] text-ink-400">
              If a create action returns 403, your logged-in role does not permit it.
            </p>
          </div>
        </section>
      </div>
    </Modal>
  );
};
