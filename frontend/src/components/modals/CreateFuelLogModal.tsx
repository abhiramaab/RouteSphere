import React, { useEffect, useState } from 'react';
import { Fuel, Loader2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Shipment } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fuelQuantity: number;
    fuelCost: number;
    fuelStation: string;
    shipmentId: number;
  }) => Promise<void>;
  shipments: Shipment[];
}

export const CreateFuelLogModal: React.FC<Props> = ({ open, onClose, onSubmit, shipments }) => {
  const [fuelQuantity, setFuelQuantity] = useState('');
  const [fuelCost, setFuelCost] = useState('');
  const [fuelStation, setFuelStation] = useState('');
  const [shipmentId, setShipmentId] = useState<number | ''>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && shipmentId === '' && shipments.length) setShipmentId(shipments[0].id);
  }, [open, shipments, shipmentId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!shipmentId) {
      setError('Select a shipment. Fuel logs are recorded against a shipment.');
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        fuelQuantity: Number(fuelQuantity) || 0,
        fuelCost: Number(fuelCost) || 0,
        fuelStation,
        shipmentId: Number(shipmentId),
      });
      setFuelQuantity('');
      setFuelCost('');
      setFuelStation('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create fuel log.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log fuel"
      subtitle="Record a refuel against a shipment"
      icon={Fuel}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} disabled={busy || !shipments.length} className="btn-primary">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Save fuel log
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Fuel quantity (litres)</label>
            <input
              type="number"
              min={0.1}
              max={1000}
              step="0.1"
              className="field"
              value={fuelQuantity}
              onChange={(e) => setFuelQuantity(e.target.value)}
              placeholder="220.5"
              required
            />
          </div>
          <div>
            <label className="field-label">Fuel cost (₹)</label>
            <input
              type="number"
              min={1}
              max={100000}
              step="0.01"
              className="field"
              value={fuelCost}
              onChange={(e) => setFuelCost(e.target.value)}
              placeholder="19845"
              required
            />
          </div>
        </div>
        <div>
          <label className="field-label">Fuel station</label>
          <input
            className="field"
            value={fuelStation}
            onChange={(e) => setFuelStation(e.target.value)}
            placeholder="HP Petrol Pump, Nelamangala"
            required
          />
        </div>
        <div>
          <label className="field-label">Shipment (required)</label>
          <select
            className="field"
            value={shipmentId}
            onChange={(e) => setShipmentId(Number(e.target.value))}
            disabled={!shipments.length}
          >
            {shipments.length === 0 ? <option value="">No shipments available</option> : null}
            {shipments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.trackingNumber} · {s.origin} → {s.destination}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11.5px] text-ink-400">
            Driver, vehicle and customer are derived from the shipment on the backend.
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
