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
    <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Operations
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
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

        {/* System Architecture Callout */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
            <Cpu className="h-4 w-4 text-blue-600" />
            <span>Modular Monolith</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
            Spring Data JPA bounded contexts with clean microservice boundaries.
          </p>
          <button
            onClick={onOpenArchitecture}
            className="w-full rounded-lg bg-white border border-slate-200 py-1.5 text-center text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
          >
            Architecture Details
          </button>
        </div>
      </div>

      {/* Security Status */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-800 mb-1">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Spring Security 6</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Stateless JWT filter chain & role-based endpoints.
        </p>
      </div>
    </aside>
  );
};
