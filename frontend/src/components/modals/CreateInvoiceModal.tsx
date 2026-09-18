import React, { useEffect, useState } from 'react';
import { FileText, Loader2, AlertCircle, Plus } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Invoice, Customer } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    invoiceNumber: string;
    invoiceDate: string;
    gstAmount: number;
    paymentStatus: Invoice['status'];
    customerId: number;
  }) => Promise<void>;
  customers: Customer[];
  onCreateCustomer: () => void;
}

const nextInvoiceNumber = () => `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;

export const CreateInvoiceModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  customers,
  onCreateCustomer,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState(nextInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [gstAmount, setGstAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<Invoice['status']>('PENDING');
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && customerId === '' && customers.length) setCustomerId(customers[0].id);
    if (open) setInvoiceNumber(nextInvoiceNumber());
  }, [open, customers, customerId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customerId) {
      setError('Select a customer. An invoice must belong to one.');
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        invoiceNumber,
        invoiceDate,
        gstAmount: Number(gstAmount) || 0,
        paymentStatus,
        customerId: Number(customerId),
      });
      setGstAmount('');
      setPaymentStatus('PENDING');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create invoice.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New invoice"
      subtitle="Invoices are required before shipments"
      icon={FileText}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} disabled={busy || !customers.length} className="btn-primary">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Create invoice
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {customers.length === 0 ? (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              No customers yet. Create a customer first.
              <button
                onClick={onCreateCustomer}
                className="mt-1.5 flex items-center gap-1 font-semibold text-amber-900 underline"
              >
                <Plus className="h-3.5 w-3.5" /> Create a customer
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Invoice number</label>
            <input
              className="field font-mono"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label">Invoice date</label>
            <input
              type="date"
              className="field"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Amount / GST (₹)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="field"
              value={gstAmount}
              onChange={(e) => setGstAmount(e.target.value)}
              placeholder="142500"
              required
            />
          </div>
          <div>
            <label className="field-label">Payment status</label>
            <select
              className="field"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as Invoice['status'])}
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        <div>
          <label className="field-label">Customer (required)</label>
          <select
            className="field"
            value={customerId}
            onChange={(e) => setCustomerId(Number(e.target.value))}
            disabled={!customers.length}
          >
            {customers.length === 0 ? <option value="">No customers available</option> : null}
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName} · {c.city}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12.5px] text-rose-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}
      </form>
    </Modal>
  );
};
