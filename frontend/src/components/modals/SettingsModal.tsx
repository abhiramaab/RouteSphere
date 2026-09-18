import React, { useState } from 'react';
import { Settings2, Server, Loader2, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { RouteSphereApi } from '../../api';

interface Props {
  open: boolean;
  onClose: () => void;
  demoMode: boolean;
  onToggleDemoMode: (v: boolean) => void;
  onSaved: () => void;
}

export const SettingsModal: React.FC<Props> = ({
  open,
  onClose,
  demoMode,
  onToggleDemoMode,
  onSaved,
}) => {
  const [apiUrl, setApiUrl] = useState(RouteSphereApi.getApiUrl());
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<'ok' | 'fail' | null>(null);

  const save = () => {
    RouteSphereApi.setApiUrl(apiUrl);
    onSaved();
    onClose();
  };

  const test = async () => {
    RouteSphereApi.setApiUrl(apiUrl);
    setChecking(true);
    setResult(null);
    RouteSphereApi.setDemoMode(false);
    const ok = await RouteSphereApi.pingApi();
    setResult(ok ? 'ok' : 'fail');
    setChecking(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Backend settings"
      subtitle="Connect to the Spring Boot REST API"
      icon={Settings2}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">
            Close
          </button>
          <button onClick={save} className="btn-primary">
            Save
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="field-label flex items-center gap-1.5">
            <Server className="h-3.5 w-3.5 text-ink-400" /> API base URL
          </label>
          <input
            className="field font-mono text-[12.5px]"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:8080"
          />
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-ink-200 px-4 py-3">
          <span>
            <span className="block text-[12.5px] font-semibold text-ink-800">Demo data mode</span>
            <span className="block text-[11.5px] text-ink-500">
              Fall back to bundled sample data instead of the live API
            </span>
          </span>
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => onToggleDemoMode(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
          />
        </label>

        <div className="flex items-center gap-2">
          <button onClick={test} className="btn-ghost" disabled={checking}>
            {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Test connection
          </button>
          {result === 'ok' ? (
            <span className="flex items-center gap-1 text-[12px] font-medium text-emerald-600">
              <Check className="h-3.5 w-3.5" /> Reachable
            </span>
          ) : null}
          {result === 'fail' ? (
            <span className="text-[12px] font-medium text-rose-600">Could not reach API</span>
          ) : null}
        </div>

        <p className="rounded-lg bg-ink-50 px-3 py-2.5 font-mono text-[10.5px] leading-relaxed text-ink-500">
          Endpoints: POST /api/auth/login · GET/POST /api/shipment · /api/driver · /api/vehicle ·
          /api/trip · /api/invoice · /api/customer
        </p>
      </div>
    </Modal>
  );
};
