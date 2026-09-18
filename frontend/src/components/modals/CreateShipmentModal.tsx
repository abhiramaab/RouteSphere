import React, { useState } from 'react';
import { Package, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Shipment } from '../../types';
import { Customer } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Shipment>) => Promise<void>;
  customers: Customer[];
}

export const CreateShipmentModal: React.FC<Props> = ({ open, onClose, onSubmit, customers }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [priority, setPriority] = useState<Shipment['priority']>('NORMAL');
  const [customerId, setCustomerId] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const customer = customers.find((c) => String(c.id) === customerId);
      await onSubmit({
        origin,
        destination,
        weightKg: Number(weight) || 0,
        priority,
        customerId: customer?.id,
        customerName: customer?.companyName,
        customerEmail: customer?.email,
      });
      setOrigin('');
      setDestination('');
      setWeight('');
      setPriority('NORMAL');
      setCustomerId('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New shipment"
      subtitle="Create a shipment for dispatch"
      icon={Package}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} disabled={busy} className="btn-primary">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Create shipment
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
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
              <option value="NORMAL">Normal</option>
              <option value="EXPRESS">Express</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
        <div>
          <label className="field-label">Customer</label>
          <select
            className="field"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">No customer (walk-in)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName} — {c.city}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};
