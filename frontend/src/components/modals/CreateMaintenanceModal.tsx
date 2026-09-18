import React, { useEffect, useState } from 'react';
import { Wrench, Loader2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Vehicle, Maintenance } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    serviceType: string;
    serviceCost: number;
    lastServiceDate: string;
    nextServiceDate?: string;
    remarks?: string;
    vehicleId: number;
    vehicleStatus: Maintenance['vehicleStatus'];
  }) => Promise<void>;
  vehicles: Vehicle[];
}

export const CreateMaintenanceModal: React.FC<Props> = ({ open, onClose, onSubmit, vehicles }) => {
  const [serviceType, setServiceType] = useState('');
  const [serviceCost, setServiceCost] = useState('');
  const [lastServiceDate, setLastServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [vehicleId, setVehicleId] = useState<number | ''>('');
  const [vehicleStatus, setVehicleStatus] = useState<Maintenance['vehicleStatus']>('UNDER_SERVICE');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && vehicleId === '' && vehicles.length) setVehicleId(vehicles[0].id);
  }, [open, vehicles, vehicleId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!vehicleId) {
      setError('Select a vehicle. Maintenance is recorded against a vehicle.');
      return;
    }
    setBusy(true);
    try {
      await onSubmit({
        serviceType,
        serviceCost: Number(serviceCost) || 0,
        lastServiceDate,
        nextServiceDate: nextServiceDate || undefined,
        remarks: remarks || undefined,
        vehicleId: Number(vehicleId),
        vehicleStatus,
      });
      setServiceType('');
      setServiceCost('');
      setRemarks('');
      setNextServiceDate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create maintenance record.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log maintenance"
      subtitle="Record vehicle service history"
      icon={Wrench}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} disabled={busy || !vehicles.length} className="btn-primary">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Save record
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label">Vehicle (required)</label>
          <select
            className="field"
            value={vehicleId}
            onChange={(e) => setVehicleId(Number(e.target.value))}
            disabled={!vehicles.length}
          >
            {vehicles.length === 0 ? <option value="">No vehicles available</option> : null}
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plateNumber} · {v.model}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Service type</label>
            <input
              className="field"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              placeholder="Brake pad replacement"
              required
            />
          </div>
          <div>
            <label className="field-label">Service cost (₹)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="field"
              value={serviceCost}
              onChange={(e) => setServiceCost(e.target.value)}
              placeholder="18500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Last service date</label>
            <input
              type="date"
              className="field"
              value={lastServiceDate}
              onChange={(e) => setLastServiceDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label">Next service date</label>
            <input
              type="date"
              className="field"
              value={nextServiceDate}
              onChange={(e) => setNextServiceDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="field-label">Vehicle status after service</label>
          <select
            className="field"
            value={vehicleStatus}
            onChange={(e) => setVehicleStatus(e.target.value as Maintenance['vehicleStatus'])}
          >
            <option value="UNDER_SERVICE">Under service</option>
            <option value="AVAILABLE">Available</option>
            <option value="IN_TRANSIT">In transit</option>
          </select>
        </div>

        <div>
          <label className="field-label">Remarks</label>
          <textarea
            className="field min-h-[72px] resize-none"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Front and rear pads replaced, discs resurfaced."
          />
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
