import React, { useState } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Customer } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    companyName: string;
    contactPerson: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    gst: string;
  }) => Promise<void>;
}

export const CreateCustomerModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    gst: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await onSubmit(form);
      setForm({
        companyName: '',
        contactPerson: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        gst: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create customer.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New customer"
      subtitle="Customers own invoices and shipments"
      icon={Building2}
      width="lg"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} disabled={busy} className="btn-primary">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Create customer
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Company name</label>
            <input className="field" value={form.companyName} onChange={set('companyName')} placeholder="Acme Logistics" required />
          </div>
          <div>
            <label className="field-label">Contact person</label>
            <input className="field" value={form.contactPerson} onChange={set('contactPerson')} placeholder="Rakesh Nair" required />
          </div>
        </div>
        <div>
          <label className="field-label">Email</label>
          <input type="email" className="field" value={form.email} onChange={set('email')} placeholder="ops@acme.com" required />
        </div>
        <div>
          <label className="field-label">Address</label>
          <input className="field" value={form.address} onChange={set('address')} placeholder="12 Industrial Layout" required />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label">City</label>
            <input className="field" value={form.city} onChange={set('city')} placeholder="Bengaluru" required />
          </div>
          <div>
            <label className="field-label">State</label>
            <input className="field" value={form.state} onChange={set('state')} placeholder="Karnataka" required />
          </div>
          <div>
            <label className="field-label">Pincode</label>
            <input className="field" value={form.pincode} onChange={set('pincode')} placeholder="560100" required />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Country</label>
            <input className="field" value={form.country} onChange={set('country')} required />
          </div>
          <div>
            <label className="field-label">GST number</label>
            <input
              className="field font-mono"
              value={form.gst}
              onChange={set('gst')}
              placeholder="29ABCDE1234F1Z5"
              required
            />
          </div>
        </div>
        <p className="rounded-lg bg-ink-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-ink-500">
          Validation follows the backend: city/state/country letters only, 6-digit pincode, and a
          valid 15-character GSTIN. A mismatch will be rejected by the server.
        </p>
        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-[12.5px] text-rose-700">
            {error}
          </div>
        ) : null}
      </form>
    </Modal>
  );
};
