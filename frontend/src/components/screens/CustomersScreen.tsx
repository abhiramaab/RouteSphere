import React, { useMemo, useState } from 'react';
import { Building2, Plus, Mail, MapPin, FileText } from 'lucide-react';
import { Customer } from '../../types';
import { EmptyState } from '../ui/atoms';

interface Props {
  customers: Customer[];
  query: string;
  onCreate: () => void;
  onCreateInvoice: () => void;
}

export const CustomersScreen: React.FC<Props> = ({
  customers,
  query,
  onCreate,
  onCreateInvoice,
}) => {
  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.contactPerson.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }, [customers, query]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] text-ink-500">
          {customers.length} customer{customers.length === 1 ? '' : 's'} · each invoice and
          shipment belongs to a customer
        </p>
        <div className="flex gap-2">
          <button onClick={onCreateInvoice} className="btn-ghost px-3 py-1.5">
            <FileText className="h-3.5 w-3.5" /> New invoice
          </button>
          <button onClick={onCreate} className="btn-primary px-3 py-1.5">
            <Plus className="h-3.5 w-3.5" /> New customer
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <EmptyState
            icon={Building2}
            title="No customers yet"
            description="Customers are the root of the data model. Create one to start billing."
            action={
              <button onClick={onCreate} className="btn-primary mt-1">
                <Plus className="h-3.5 w-3.5" /> New customer
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => (
            <div
              key={c.id}
              className="panel animate-rise p-4 transition-shadow hover:shadow-lift"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Building2 className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-ink-900">
                    {c.companyName}
                  </p>
                  <p className="truncate text-[11.5px] text-ink-500">{c.contactPerson || '—'}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 border-t border-ink-100 pt-3 text-[12px] text-ink-600">
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-ink-400" />
                  <span className="truncate">{c.email || '—'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-ink-400" />
                  <span className="truncate">
                    {[c.city, c.state].filter(Boolean).join(', ') || '—'}
                  </span>
                </p>
                {c.gst ? (
                  <p className="font-mono text-[10.5px] text-ink-400">GST {c.gst}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
