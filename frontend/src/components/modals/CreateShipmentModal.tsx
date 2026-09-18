import React, { useEffect, useMemo, useState } from 'react';
import { Package, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Shipment, Invoice } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Shipment> & { invoiceId: number }) => Promise<void>;
  invoices: Invoice[];
  onCreateInvoice: () => void;
}

export const CreateShipmentModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  invoices,
  onCreateInvoice,
}) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [priority, setPriority] = useState<Shipment['priority']>('MEDIUM');
  const [invoiceId, setInvoiceId] = useState<number | ''>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && invoiceId === '' && invoices.length) {
      setInvoiceId(invoices[0].id);
    }
  }, [open, invoices, invoiceId]);

  const selected = useMemo(
    () => invoices.find((i) => i.id === invoiceId),
    [invoices, invoiceId]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!invoiceId) {
      setError('Select an invoice. A shipment must be billed against one.');
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        origin,
        destination,
        weightKg: Number(weight) || 0,
        priority,
        invoiceId: Number(invoiceId),
        customerId: selected?.customerId,
        customerName: selected?.customerName,
      });
      setOrigin('');
      setDestination('');
      setWeight('');
      setPriority('MEDIUM');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create shipment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New shipment"
      subtitle="A shipment is always billed against an invoice"
      icon={Package}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} disabled={busy || !invoices.length} className="btn-primary">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Create shipment
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {invoices.length === 0 ? (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] text-amber-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              No invoices exist yet. Create a customer, then an invoice, before creating a
              shipment.
              <button
                onClick={onCreateInvoice}
                className="mt-1.5 flex items-center gap-1 font-semibold text-amber-900 underline"
              >
                <FileText className="h-3.5 w-3.5" /> Create an invoice
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Pickup location</label>
            <input
              className="field"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Bengaluru Hub"
              required
            />
          </div>
          <div>
            <label className="field-label">Delivery location</label>
            <input
              className="field"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Mumbai Terminal"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Weight (kg)</label>
            <input
              type="number"
              min={1}
              className="field"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="1500"
              required
            />
          </div>
          <div>
            <label className="field-label">Priority</label>
            <select
              className="field"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Shipment['priority'])}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="field-label flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-ink-400" /> Invoice (required)
          </label>
          <select
            className="field"
            value={invoiceId}
            onChange={(e) => setInvoiceId(Number(e.target.value))}
            disabled={!invoices.length}
          >
            {invoices.length === 0 ? <option value="">No invoices available</option> : null}
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.invoiceNumber} · {inv.customerName} · ₹{inv.amount.toLocaleString('en-IN')}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11.5px] text-ink-400">
            The shipment inherits its customer from this invoice.
          </p>
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
