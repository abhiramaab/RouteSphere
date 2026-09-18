import React, { useState } from 'react';
import { Navigation, Loader2, User, Truck, MapPin } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Shipment, Driver, Vehicle } from '../../types';

interface Props {
  shipment: Shipment | null;
  drivers: Driver[];
  vehicles: Vehicle[];
  onClose: () => void;
  onConfirm: (data: { shipmentId: number; driverId: number; vehicleId: number }) => Promise<void>;
}

export const TripDispatchModal: React.FC<Props> = ({
  shipment,
  drivers,
  vehicles,
  onClose,
  onConfirm,
}) => {
  const availableDrivers = drivers.filter((d) => d.status === 'AVAILABLE');
  const activeVehicles = vehicles.filter((v) => v.status === 'AVAILABLE');
  const [driverId, setDriverId] = useState<number | ''>(availableDrivers[0]?.id ?? '');
  const [vehicleId, setVehicleId] = useState<number | ''>(activeVehicles[0]?.id ?? '');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!shipment || !driverId || !vehicleId) return;
    setBusy(true);
    try {
      await onConfirm({
        shipmentId: shipment.id,
        driverId: Number(driverId),
        vehicleId: Number(vehicleId),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={Boolean(shipment)}
      onClose={onClose}
      title="Dispatch trip"
      subtitle="Assign a driver and vehicle"
      icon={Navigation}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={busy || !driverId || !vehicleId}
            className="btn-primary"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Confirm dispatch
          </button>
        </>
      }
    >
      {shipment ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
            <p className="font-mono text-[12px] font-semibold text-ink-800">
              {shipment.trackingNumber}
            </p>
            <div className="mt-1.5 flex items-center gap-2 text-[12.5px] text-ink-600">
              <MapPin className="h-3.5 w-3.5 text-ink-400" />
              <span className="truncate">{shipment.origin}</span>
              <span className="text-ink-300">→</span>
              <span className="truncate">{shipment.destination}</span>
            </div>
          </div>

          <div>
            <label className="field-label flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-ink-400" /> Driver
            </label>
            {availableDrivers.length === 0 ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] text-amber-700">
                No available drivers. Free up a driver before dispatching.
              </p>
            ) : (
              <select
                className="field"
                value={driverId}
                onChange={(e) => setDriverId(Number(e.target.value))}
              >
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fullName} · ★ {d.rating}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="field-label flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-ink-400" /> Vehicle
            </label>
            {activeVehicles.length === 0 ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] text-amber-700">
                No active vehicles available.
              </p>
            ) : (
              <select
                className="field"
                value={vehicleId}
                onChange={(e) => setVehicleId(Number(e.target.value))}
              >
                {activeVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} · {v.model}
                  </option>
                ))}
              </select>
            )}
          </div>

          <p className="rounded-lg bg-brand-50 px-3 py-2.5 text-[12px] leading-relaxed text-brand-700">
            Confirming will create a trip, set the shipment to <b>In transit</b>, and mark the
            driver <b>On duty</b>.
          </p>
        </div>
      ) : null}
    </Modal>
  );
};
