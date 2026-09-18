import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { toneClasses, dotClasses, type StatusMeta } from '../../lib/format';

export const StatusChip: React.FC<{ meta: StatusMeta; className?: string }> = ({
  meta,
  className = '',
}) => (
  <span className={`chip ${toneClasses[meta.tone]} ${className}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${dotClasses[meta.tone]}`} />
    {meta.label}
  </span>
);

export const Avatar: React.FC<{
  name: string;
  toneClass: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ name, toneClass, size = 'md' }) => {
  const sizes = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-[12px]',
    lg: 'h-12 w-12 text-[15px]',
  };
  const label = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${sizes[size]} ${toneClass}`}
      aria-hidden
    >
      {label || '?'}
    </span>
  );
};

export const StatDelta: React.FC<{ value: string; positive?: boolean }> = ({
  value,
  positive = true,
}) => (
  <span
    className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
      positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
    }`}
  >
    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-current">
      {positive ? <path d="M6 2l4 6H2z" /> : <path d="M6 10L2 4h8z" />}
    </svg>
    {value}
  </span>
);

export const EmptyState: React.FC<{
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-[14px] font-semibold text-ink-800">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-[12.5px] text-ink-500">{description}</p>
    </div>
    {action}
  </div>
);

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-ink-100 ${className}`} />
);

export const SectionHeading: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-[19px] font-bold tracking-tight text-ink-900">{title}</h1>
      {description ? (
        <p className="mt-0.5 text-[13px] text-ink-500">{description}</p>
      ) : null}
    </div>
    {action}
  </div>
);

/** Minimal inline sparkline from numeric values */
export const Sparkline: React.FC<{
  values: number[];
  className?: string;
  stroke?: string;
  fill?: string;
}> = ({ values, className = '', stroke = '#3569f0', fill = 'rgba(53,105,240,0.12)' }) => {
  if (!values.length) return null;
  const w = 100;
  const h = 32;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className}>
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
