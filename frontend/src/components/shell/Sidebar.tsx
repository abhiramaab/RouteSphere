import React from 'react';
import {
  LayoutDashboard,
  Package,
  Navigation,
  Truck,
  Users,
  Receipt,
  Cpu,
  ChevronLeft,
  X,
  Building2,
  Fuel,
  Wrench,
  BookOpen,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'shipments'
  | 'trips'
  | 'fleet'
  | 'drivers'
  | 'customers'
  | 'invoices'
  | 'fuel'
  | 'maintenance';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenArchitecture: () => void;
  onOpenDocs: () => void;
  shipmentsCount: number;
  activeTripsCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'shipments', label: 'Shipments', icon: Package },
  { id: 'trips', label: 'Trips & dispatch', icon: Navigation },
  { id: 'fleet', label: 'Fleet', icon: Truck },
  { id: 'drivers', label: 'Drivers', icon: Users },
  { id: 'customers', label: 'Customers', icon: Building2 },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'fuel', label: 'Fuel logs', icon: Fuel },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenArchitecture,
  onOpenDocs,
  shipmentsCount,
  activeTripsCount,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const badges: Partial<Record<NavTab, number>> = {
    shipments: shipmentsCount,
    trips: activeTripsCount,
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Truck className="h-4 w-4" />
        </div>
        {!collapsed ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold tracking-tight text-ink-900">
              RouteSphere
            </p>
            <p className="truncate text-[10.5px] text-ink-400">Logistics console</p>
          </div>
        ) : null}
        <button
          onClick={onCloseMobile}
          className="ml-auto rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 md:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-2.5 py-2">
        {NAV.map((item, i) => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          const badge = badges[item.id];
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              style={{ animationDelay: `${i * 30}ms` }}
              className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors animate-slide-in-left ${
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${active ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-600'}`}
                strokeWidth={2}
              />
              {!collapsed ? (
                <>
                  <span className="flex-1 truncate text-left">{item.label}</span>
                  {badge !== undefined && badge > 0 ? (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'
                      }`}
                    >
                      {badge}
                    </span>
                  ) : null}
                </>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="space-y-2 p-3">
        {!collapsed ? (
          <div className="rounded-xl border border-ink-200 bg-ink-50 p-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-brand-600" />
              <span className="text-[11.5px] font-semibold text-ink-800">Modular monolith</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
              Spring Boot 3, 9 bounded contexts, JWT-secured REST.
            </p>
            <button
              onClick={onOpenArchitecture}
              className="mt-2.5 w-full rounded-md border border-ink-200 bg-white py-1.5 text-[11.5px] font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              View architecture
            </button>
            <button
              onClick={onOpenDocs}
              className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-600 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-brand-700"
            >
              <BookOpen className="h-3.5 w-3.5" /> How it works
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenDocs}
            className="flex w-full items-center justify-center rounded-lg border border-ink-200 py-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800"
            title="How it works"
          >
            <BookOpen className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={onToggleCollapse}
          className="hidden w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-800 md:flex"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
          {!collapsed ? 'Collapse' : null}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <aside
        className={`hidden shrink-0 border-r border-ink-200 bg-white transition-[width] duration-200 md:block ${
          collapsed ? 'w-[68px]' : 'w-[232px]'
        }`}
      >
        {content}
      </aside>

      {/* mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink-900/40 animate-fade-in" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 h-full w-[240px] animate-slide-in-left border-r border-ink-200 bg-white">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
};
