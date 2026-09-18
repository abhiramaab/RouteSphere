import React from 'react';
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowDownToLine 
} from 'lucide-react';
import { Invoice } from '../types';

interface InvoiceListProps {
  invoices: Invoice[];
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" /> Paid
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" /> Due Soon
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-3 w-3" /> Overdue
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Receipt className="h-4 w-4 text-indigo-400" />
            Freight Invoices & Billing Ledger ({invoices.length})
          </h3>
          <p className="text-xs text-slate-400">
            Automated billing linked to completed trips with Resend email triggers
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800/80">
            <tr>
              <th className="px-5 py-3">Invoice #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Shipment Ref</th>
              <th className="px-4 py-3">Issued Date</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3 font-mono">Amount (INR)</th>
              <th className="px-4 py-3">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="px-5 py-3.5 font-mono font-bold text-indigo-300">
                  {inv.invoiceNumber}
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-200">
                  {inv.customerName}
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-400">
                  {inv.shipmentTracking}
                </td>
                <td className="px-4 py-3.5 text-slate-400">{inv.issuedDate}</td>
                <td className="px-4 py-3.5 text-slate-400">{inv.dueDate}</td>
                <td className="px-4 py-3.5 font-mono font-bold text-slate-100">
                  ₹{inv.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3.5">{getStatusBadge(inv.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
