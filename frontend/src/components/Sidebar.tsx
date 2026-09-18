import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Navigation, 
  Truck, 
  Users, 
  Receipt, 
  Cpu,
  ShieldCheck
} from 'lucide-react';

export type NavTab = 'overview' | 'shipments' | 'trips' | 'fleet' | 'drivers' | 'invoices';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenArchitecture: () => void;
  shipmentsCount: number;
  activeTripsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenArchitecture,
  shipmentsCount,
  activeTripsCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Fleet Overview', icon: LayoutDashboard },
    { id: 'shipments', label: 'Shipments', icon: Package, badge: shipmentsCount },
    { id: 'trips', label: 'Trips & Dispatch', icon: Navigation, badge: activeTripsCount },
    { id: 'fleet', label: 'Fleet & Vehicles', icon: Truck },
    { id: 'drivers', label: 'Drivers Directory', icon: Users },
    { id: 'invoices', label: 'Invoices & Billing', icon: Receipt },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Operations Control
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Architecture Quick Banner */}
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 to-slate-900/60 p-3.5">
          <div className="flex items-center gap-2 text-indigo-400 mb-1.5">
            <Cpu className="h-4 w-4" />
            <span className="text-xs font-bold">System Topology</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Inspect Spring Boot modular monolith boundaries, JPA schema, & event pipeline.
          </p>
          <button
            onClick={onOpenArchitecture}
            className="w-full rounded-lg bg-indigo-500/10 border border-indigo-500/30 py-1.5 text-center text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all"
          >
            View System Design →
          </button>
        </div>
      </div>

      {/* Security & Health Status */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Security & Auth</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Stateless JWT Filter Chains, BCrypt hashing, & Role-based Authorization.
        </p>
      </div>
    </aside>
  );
};
