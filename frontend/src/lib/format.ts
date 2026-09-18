import type {
  ShipmentStatus,
  ShipmentPriority,
  DriverStatus,
  VehicleStatus,
  TripStatus,
  PaymentStatus,
} from '../types';

export const inr = (n: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);

export const compactInr = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n}`;
};

export const kg = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}t` : `${n}kg`;

export const shortDate = (iso: string) => {
  if (!iso || iso === '—') return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const relativeTime = (iso: string) => {
  if (!iso || iso === '—') return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diff = d.getTime() - Date.now();
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (abs < 3600_000) return rtf.format(Math.round(diff / 60000), 'minute');
  if (abs < 86400_000) return rtf.format(Math.round(diff / 3600_000), 'hour');
  return rtf.format(Math.round(diff / 86400_000), 'day');
};

type Tone = 'green' | 'amber' | 'red' | 'blue' | 'slate' | 'violet';

export const toneClasses: Record<Tone, string> = {
  green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  red: 'border-rose-200 bg-rose-50 text-rose-700',
  blue: 'border-brand-200 bg-brand-50 text-brand-700',
  slate: 'border-ink-200 bg-ink-100 text-ink-600',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
};

export const dotClasses: Record<Tone, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-rose-500',
  blue: 'bg-brand-500',
  slate: 'bg-ink-400',
  violet: 'bg-violet-500',
};

export interface StatusMeta {
  label: string;
  tone: Tone;
}

export const shipmentStatusMeta: Record<ShipmentStatus, StatusMeta> = {
  PENDING: { label: 'Pending', tone: 'amber' },
  IN_TRANSIT: { label: 'In transit', tone: 'blue' },
  DELIVERED: { label: 'Delivered', tone: 'green' },
  CANCELLED: { label: 'Cancelled', tone: 'red' },
};

export const priorityMeta: Record<ShipmentPriority, StatusMeta> = {
  NORMAL: { label: 'Normal', tone: 'slate' },
  EXPRESS: { label: 'Express', tone: 'violet' },
  URGENT: { label: 'Urgent', tone: 'red' },
};

export const driverStatusMeta: Record<DriverStatus, StatusMeta> = {
  AVAILABLE: { label: 'Available', tone: 'green' },
  ON_DUTY: { label: 'On duty', tone: 'blue' },
  OFF_DUTY: { label: 'Off duty', tone: 'slate' },
};

export const vehicleStatusMeta: Record<VehicleStatus, StatusMeta> = {
  ACTIVE: { label: 'Active', tone: 'green' },
  IN_MAINTENANCE: { label: 'Maintenance', tone: 'amber' },
  DECOMMISSIONED: { label: 'Retired', tone: 'red' },
};

export const tripStatusMeta: Record<TripStatus, StatusMeta> = {
  SCHEDULED: { label: 'Scheduled', tone: 'slate' },
  DISPATCHED: { label: 'Dispatched', tone: 'violet' },
  IN_PROGRESS: { label: 'In progress', tone: 'blue' },
  COMPLETED: { label: 'Completed', tone: 'green' },
  CANCELLED: { label: 'Cancelled', tone: 'red' },
};

export const paymentStatusMeta: Record<PaymentStatus, StatusMeta> = {
  PAID: { label: 'Paid', tone: 'green' },
  PENDING: { label: 'Pending', tone: 'amber' },
  OVERDUE: { label: 'Overdue', tone: 'red' },
};

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

/** Deterministic avatar background from a name */
export const avatarTone = (name: string) => {
  const tones = [
    'bg-brand-100 text-brand-700',
    'bg-emerald-100 text-emerald-700',
    'bg-violet-100 text-violet-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return tones[h % tones.length];
};
