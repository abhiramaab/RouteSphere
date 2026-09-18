import React, { useMemo, useState } from 'react';
import { Receipt, Search, Download, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Invoice, PaymentStatus } from '../../types';
import { paymentStatusMeta, inr, shortDate } from '../../lib/format';
import { StatusChip, EmptyState, Sparkline } from '../ui/atoms';

interface InvoicesScreenProps {
  invoices: Invoice[];
  query: string;
}

export const InvoicesScreen: React.FC<InvoicesScreenProps> = ({ invoices, query }) => {
  const [status, setStatus] = useState<PaymentStatus | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    let list = invoices;
    if (status !== 'ALL') list = list.filter((i) => i.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.customerName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [invoices, status, query]);

  const totals = useMemo(() => {
    const paid = invoices.filter((i) => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
    const pending = invoices.filter((i) => i.status === 'PENDING').reduce((s, i) => s + i.amount, 0);
    const overdue = invoices.filter((i) => i.status === 'OVERDUE').reduce((s, i) => s + i.amount, 0);
    return { paid, pending, overdue };
  }, [invoices]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Collected', value: totals.paid, tone: 'text-emerald-700 bg-emerald-50', icon: CheckCircle2 },
          { label: 'Pending', value: totals.pending, tone: 'text-amber-700 bg-amber-50', icon: Clock },
          { label: 'Overdue', value: totals.overdue, tone: 'text-rose-700 bg-rose-50', icon: TrendingUp },
        ].map((s, i) => (
          <div key={s.label} className="panel animate-rise p-4" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.tone}`}>
                <s.icon className="h-4.5 w-4.5" />
              </span>
              <Sparkline
                values={[12, 18, 15, 22, 26, 24, 30, 34]}
                className="h-8 w-24"
                stroke={i === 0 ? '#0f9d6e' : i === 1 ? '#c47f17' : '#d64545'}
                fill="transparent"
              />
            </div>
            <p className="mt-3 text-[22px] font-bold leading-none text-ink-900">{inr(s.value)}</p>
            <p className="mt-1.5 text-[12px] font-medium text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="panel-header">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-ink-400" />
            <h2 className="text-[14px] font-bold tracking-tight text-ink-900">Invoices</h2>
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-500">
              {invoices.length}
            </span>
          </div>
          <div className="flex gap-1">
            {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  status === s ? 'bg-ink-900 text-white' : 'text-ink-500 hover:bg-ink-100'
                }`}
              >
                {s === 'ALL' ? 'All' : paymentStatusMeta[s].label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No invoices found"
            description="Invoices appear here once shipments are billed."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-ink-200 bg-ink-50/60">
                <tr>
                  <th className="th">Invoice</th>
                  <th className="th">Customer</th>
                  <th className="th">Amount</th>
                  <th className="th">Issued</th>
                  <th className="th">Due</th>
                  <th className="th">Status</th>
                  <th className="th text-right">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((inv, i) => (
                  <tr
                    key={inv.id}
                    className="group transition-colors hover:bg-ink-50 animate-rise"
                    style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                  >
                    <td className="td font-mono text-[12px] font-semibold text-ink-800">
                      {inv.invoiceNumber}
                    </td>
                    <td className="td max-w-[180px] truncate">{inv.customerName}</td>
                    <td className="td font-semibold text-ink-900">{inr(inv.amount)}</td>
                    <td className="td text-ink-500">{shortDate(inv.issuedDate)}</td>
                    <td className="td text-ink-500">{shortDate(inv.dueDate)}</td>
                    <td className="td">
                      <StatusChip meta={paymentStatusMeta[inv.status]} />
                    </td>
                    <td className="td">
                      <button
                        className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-medium text-ink-500 opacity-0 transition-all hover:bg-ink-100 hover:text-ink-800 group-hover:opacity-100"
                        title="Download invoice"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
