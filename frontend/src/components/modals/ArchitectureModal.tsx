import React from 'react';
import { Cpu, ShieldCheck, Database, Layers, ArrowDown } from 'lucide-react';
import { Modal } from '../ui/Modal';

export const ArchitectureModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const contexts = [
    'Customer',
    'Driver',
    'Vehicle',
    'Shipment',
    'Trip',
    'Invoice',
    'Fuel log',
    'Maintenance',
    'User',
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="System architecture"
      subtitle="Spring Boot 3 modular monolith"
      icon={Cpu}
      width="lg"
    >
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 p-5">
          {[
            { label: 'React client', sub: 'Vite · TypeScript', tone: 'bg-white' },
            { label: 'Spring Security · JWT filter', sub: 'Stateless auth + RBAC', tone: 'bg-white' },
            { label: 'REST controllers', sub: '9 bounded contexts', tone: 'bg-white' },
            { label: 'Service layer', sub: 'Business rules', tone: 'bg-white' },
            { label: 'Spring Data JPA', sub: 'Repositories', tone: 'bg-white' },
            { label: 'MySQL', sub: 'Persistence', tone: 'bg-brand-600 text-white' },
          ].map((n, i) => (
            <React.Fragment key={n.label}>
              <div
                className={`w-full max-w-sm animate-rise rounded-lg border border-ink-200 px-4 py-2.5 text-center shadow-card ${n.tone}`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <p className="text-[12.5px] font-semibold">{n.label}</p>
                <p className="text-[10.5px] opacity-70">{n.sub}</p>
              </div>
              {i < 5 ? <ArrowDown className="h-3.5 w-3.5 text-ink-300" /> : null}
            </React.Fragment>
          ))}
        </div>

        <div>
          <h4 className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold text-ink-800">
            <Layers className="h-3.5 w-3.5 text-brand-600" /> Domain contexts
          </h4>
          <div className="flex flex-wrap gap-2">
            {contexts.map((c) => (
              <span
                key={c}
                className="rounded-md border border-ink-200 bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink-600"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-ink-200 p-4">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-ink-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Authentication
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-ink-500">
              BCrypt passwords, signed JWTs, role-based endpoint guards for ADMIN, DISPATCHER and
              DRIVER.
            </p>
          </div>
          <div className="rounded-xl border border-ink-200 p-4">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold text-ink-800">
              <Database className="h-3.5 w-3.5 text-brand-600" /> Data model
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-ink-500">
              Customer → Shipments → Invoice / Trip → Fuel logs, with vehicle maintenance history.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
