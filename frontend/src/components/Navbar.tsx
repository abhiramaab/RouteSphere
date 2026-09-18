import React, { useState } from 'react';
import { 
  Truck, 
  Layers, 
  Server, 
  ExternalLink, 
  Settings2,
  Package,
  Navigation,
  UserPlus
} from 'lucide-react';
import { RouteSphereApi } from '../api';

interface NavbarProps {
  onOpenArchitecture: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: (val: boolean) => void;
  onOpenCreateShipment: () => void;
  onOpenCreateDriver: () => void;
  onOpenCreateVehicle: () => void;
  onOpenDispatch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenArchitecture, 
  isDemoMode, 
  onToggleDemoMode,
  onOpenCreateShipment,
  onOpenCreateDriver,
  onOpenCreateVehicle,
  onOpenDispatch
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [apiUrl, setApiUrl] = useState(RouteSphereApi.getApiUrl());

  const handleSaveConfig = () => {
    RouteSphereApi.setApiUrl(apiUrl);
    setShowConfig(false);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">RouteSphere</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200">
                Fleet & Logistics
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Modular Logistics Operations Platform</p>
          </div>
        </div>

        {/* Center: System Status */}
        <div className="hidden md:flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Java 21 / Spring Boot 3</span>
          </div>
          <span className="text-slate-300">|</span>
          <button 
            onClick={() => onToggleDemoMode(!isDemoMode)}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
              isDemoMode 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isDemoMode ? 'Demo Mode' : 'Live API'}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span className="text-sm leading-none font-bold">+</span>
              <span>Create / Dispatch</span>
            </button>

            {showCreateMenu && (
              <div className="absolute right-0 top-10 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
                <div className="px-3 py-1 text-[10px] font-semibold uppercase text-slate-400 border-b border-slate-100 mb-1">
                  Actions
                </div>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenCreateShipment(); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition-colors"
                >
                  <Package className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="font-medium">New Shipment</div>
                    <div className="text-[10px] text-slate-400 font-mono">POST /api/shipments</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenDispatch(); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition-colors"
                >
                  <Navigation className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="font-medium">Dispatch Trip</div>
                    <div className="text-[10px] text-slate-400 font-mono">POST /api/trips</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenCreateVehicle(); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition-colors"
                >
                  <Truck className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="font-medium">Register Vehicle</div>
                    <div className="text-[10px] text-slate-400 font-mono">POST /api/vehicles</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenCreateDriver(); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left transition-colors"
                >
                  <UserPlus className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="font-medium">Onboard Driver</div>
                    <div className="text-[10px] text-slate-400 font-mono">POST /api/drivers</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-slate-500" />
            <span>Architecture</span>
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            title="API Backend Settings"
          >
            <Settings2 className="h-4 w-4" />
          </button>

          <a
            href="https://github.com/abhiramaab/RouteSphere"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Backend Settings Popover */}
      {showConfig && (
        <div className="absolute right-4 top-18 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-50">
          <h4 className="text-sm font-semibold text-slate-900 mb-1 flex items-center gap-2">
            <Server className="h-4 w-4 text-blue-600" /> Backend Endpoint
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Connect to your Spring Boot REST server:
          </p>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="e.g. http://localhost:8080"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-mono text-slate-800 focus:border-blue-500 focus:outline-none mb-3"
          />
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isDemoMode} 
                onChange={(e) => onToggleDemoMode(e.target.checked)} 
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Demo Data Fallback
            </label>
            <button
              onClick={handleSaveConfig}
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
