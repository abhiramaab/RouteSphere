import React from 'react';
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertTriangle
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
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Paid
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3" /> Due Soon
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 border border-rose-200">
            <AlertTriangle className="h-3 w-3" /> Overdue
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="h-4 w-4 text-blue-600" />
            Freight Invoices & Ledger ({invoices.length})
          </h3>
          <p className="text-xs text-slate-500">
            Automated billing ledger with Resend email notification triggers
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
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
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5 font-mono font-semibold text-blue-700">
                  {inv.invoiceNumber}
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-800">
                  {inv.customerName}
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-500">
                  {inv.shipmentTracking}
                </td>
                <td className="px-4 py-3.5 text-slate-600">{inv.issuedDate}</td>
                <td className="px-4 py-3.5 text-slate-600">{inv.dueDate}</td>
                <td className="px-4 py-3.5 font-mono font-semibold text-slate-900">
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
