import React, { useEffect, useRef, useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  Package,
  Navigation,
  Truck,
  UserPlus,
  Settings2,
  LogOut,
  ChevronDown,
  Wifi,
  WifiOff,
  Building2,
  FileText,
  Fuel,
  Wrench,
  BookOpen,
} from 'lucide-react';
import { RouteSphereApi, type Session } from '../../api';
import { Avatar } from '../ui/atoms';
import { avatarTone } from '../../lib/format';

interface TopbarProps {
  onOpenMobile: () => void;
  onOpenCreateShipment: () => void;
  onOpenCreateDriver: () => void;
  onOpenCreateVehicle: () => void;
  onCreateInvoice: () => void;
  onCreateCustomer: () => void;
  onCreateFuel: () => void;
  onCreateMaintenance: () => void;
  onOpenDispatch: () => void;
  onOpenSettings: () => void;
  onOpenDocs: () => void;
  onLogout: () => void;
  session: Session | null;
  demoMode: boolean;
  onToggleDemoMode: (v: boolean) => void;
  query: string;
  onQueryChange: (q: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobile,
  onOpenCreateShipment,
  onOpenCreateDriver,
  onOpenCreateVehicle,
  onCreateInvoice,
  onCreateCustomer,
  onCreateFuel,
  onCreateMaintenance,
  onOpenDispatch,
  onOpenSettings,
  onOpenDocs,
  onLogout,
  session,
  demoMode,
  onToggleDemoMode,
  query,
  onQueryChange,
}) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setCreateOpen(false);
        setUserOpen(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  const createItems = [
    { icon: Building2, label: 'New customer', hint: 'POST /api/customer', fn: onCreateCustomer },
    { icon: FileText, label: 'New invoice', hint: 'POST /api/invoice', fn: onCreateInvoice },
    { icon: Package, label: 'New shipment', hint: 'POST /api/shipment', fn: onOpenCreateShipment },
    { icon: Navigation, label: 'Dispatch trip', hint: 'POST /api/trip', fn: onOpenDispatch },
    { icon: Truck, label: 'Register vehicle', hint: 'POST /api/vehicle', fn: onOpenCreateVehicle },
    { icon: UserPlus, label: 'Onboard driver', hint: 'POST /api/driver', fn: onOpenCreateDriver },
    { icon: Fuel, label: 'Log fuel', hint: 'POST /api/fuellog', fn: onCreateFuel },
    { icon: Wrench, label: 'Log maintenance', hint: 'POST /api/maintenance', fn: onCreateMaintenance },
  ];

  return (
    <header
      ref={ref}
      className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-ink-200 bg-white/85 px-3 backdrop-blur-md sm:px-5"
    >
      <button
        onClick={onOpenMobile}
        className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      <div className="relative hidden flex-1 sm:block sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search shipments, drivers, vehicles…"
          className="field py-1.5 pl-9 text-[13px]"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => onToggleDemoMode(!demoMode)}
          className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] font-semibold transition-colors sm:flex ${
            demoMode
              ? 'border-amber-200 bg-amber-50 text-amber-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
          title="Toggle demo data vs live API"
        >
          {demoMode ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
          {demoMode ? 'Demo' : 'Live API'}
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setCreateOpen((v) => !v);
              setUserOpen(false);
            }}
            className="btn-primary px-3 py-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="hidden h-3 w-3 opacity-70 sm:inline" />
          </button>
          {createOpen ? (
            <div className="absolute right-0 top-11 z-50 max-h-[70vh] w-64 animate-pop-in overflow-y-auto rounded-xl border border-ink-200 bg-white p-1.5 shadow-pop">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                Create
              </div>
              {createItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setCreateOpen(false);
                    item.fn();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-ink-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink-100 text-ink-600">
                    <item.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] font-semibold text-ink-800">
                      {item.label}
                    </span>
                    <span className="block truncate font-mono text-[10px] text-ink-400">
                      {item.hint}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <a
          href="https://github.com/abhiramaab/RouteSphere"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-lg border border-ink-200 p-2 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800 sm:block"
          title="GitHub repository"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>

        <div className="relative">
          <button
            onClick={() => {
              setUserOpen((v) => !v);
              setCreateOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-1.5 transition-colors hover:bg-ink-100"
          >
            <Avatar
              name={session?.email || 'Demo User'}
              toneClass={avatarTone(session?.email || 'Demo User')}
              size="sm"
            />
            <ChevronDown className="hidden h-3 w-3 text-ink-400 sm:block" />
          </button>
          {userOpen ? (
            <div className="absolute right-0 top-11 z-50 w-60 animate-pop-in rounded-xl border border-ink-200 bg-white p-1.5 shadow-pop">
              <div className="border-b border-ink-100 px-2.5 py-2">
                <p className="truncate text-[12.5px] font-semibold text-ink-800">
                  {session?.email || 'Demo session'}
                </p>
                <p className="text-[11px] text-ink-400">
                  Role · {session?.role || 'DISPATCHER'}
                </p>
              </div>
              <button
                onClick={() => {
                  setUserOpen(false);
                  onOpenDocs();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-ink-700 transition-colors hover:bg-ink-50"
              >
                <BookOpen className="h-3.5 w-3.5 text-ink-400" /> How it works
              </button>
              <button
                onClick={() => {
                  setUserOpen(false);
                  onOpenSettings();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-ink-700 transition-colors hover:bg-ink-50"
              >
                <Settings2 className="h-3.5 w-3.5 text-ink-400" /> Backend settings
              </button>
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
