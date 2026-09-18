import React, { useState } from 'react';
import { Truck, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    plateNumber: string;
    model: string;
    capacityKg: number;
    type: 'TRUCK' | 'VAN' | 'SEMI_TRUCK' | 'TRAILER';
    fuelType?: string;
  }) => Promise<void>;
}

export const CreateVehicleModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState<'TRUCK' | 'VAN' | 'SEMI_TRUCK' | 'TRAILER'>('TRUCK');
  const [fuel, setFuel] = useState('DIESEL');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({
        plateNumber: plate,
        model,
        capacityKg: Number(capacity) || 0,
        type,
        fuelType: fuel,
      });
      setPlate('');
      setModel('');
      setCapacity('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register vehicle"
      subtitle="Add a vehicle to the fleet"
      icon={Truck}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} disabled={busy} className="btn-primary">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Register vehicle
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Plate number</label>
            <input
              className="field font-mono"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="KA-01-MJ-4821"
              required
            />
          </div>
          <div>
            <label className="field-label">Vehicle type</label>
            <select
              className="field"
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
            >
              <option value="TRUCK">Truck</option>
              <option value="SEMI_TRUCK">Semi truck</option>
              <option value="VAN">Van</option>
              <option value="TRAILER">Trailer</option>
            </select>
          </div>
        </div>
        <div>
          <label className="field-label">Model</label>
          <input
            className="field"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="BharatBenz 2823R Heavy Truck"
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Capacity (kg)</label>
            <input
              type="number"
              min={1}
              className="field"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="18000"
              required
            />
          </div>
          <div>
            <label className="field-label">Fuel type</label>
            <select className="field" value={fuel} onChange={(e) => setFuel(e.target.value)}>
              <option value="DIESEL">Diesel</option>
              <option value="PETROL">Petrol</option>
              <option value="CNG">CNG</option>
              <option value="ELECTRIC">Electric</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};
