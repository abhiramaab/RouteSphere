import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  width = 'md',
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${widths[width]} animate-pop-in rounded-t-2xl border border-ink-200 bg-white shadow-pop sm:rounded-2xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-ink-200 px-5 py-4">
          <div className="flex items-center gap-3">
            {Icon ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-4.5 w-4.5" strokeWidth={2} />
              </span>
            ) : null}
            <div>
              <h2 className="text-[15px] font-bold tracking-tight text-ink-900">{title}</h2>
              {subtitle ? <p className="text-[12px] text-ink-500">{subtitle}</p> : null}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-ink-200 bg-ink-50/60 px-5 py-3.5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
};
