import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fullName: string;
    phone: string;
    licenseNumber: string;
    experienceYears?: number;
  }) => Promise<void>;
}

export const CreateDriverModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');
  const [experience, setExperience] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({
        fullName,
        phone,
        licenseNumber: license,
        experienceYears: Number(experience) || undefined,
      });
      setFullName('');
      setPhone('');
      setLicense('');
      setExperience('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Onboard driver"
      subtitle="Add a driver to the directory"
      icon={UserPlus}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button onClick={submit} disabled={busy} className="btn-primary">
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Onboard driver
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label">Full name</label>
          <input
            className="field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Rajesh Kumar Verma"
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">Phone</label>
            <input
              className="field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98451 22891"
              required
            />
          </div>
          <div>
            <label className="field-label">Experience (years)</label>
            <input
              type="number"
              min={0}
              className="field"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="5"
            />
          </div>
        </div>
        <div>
          <label className="field-label">License number</label>
          <input
            className="field font-mono"
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            placeholder="KA-01-2018-092841"
            required
          />
        </div>
      </form>
    </Modal>
  );
};
