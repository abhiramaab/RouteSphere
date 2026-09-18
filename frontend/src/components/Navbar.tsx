import React, { useState } from 'react';
import { 
  Truck, 
  Layers, 
  Server, 
  ExternalLink, 
  Radio, 
  Settings2,
  Sparkles
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
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white">RouteSphere</span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                Logistics Core
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Fleet Management & Dispatch Orchestration</p>
          </div>
        </div>

        {/* Center: Live Architecture & Mode Status */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse" />
            <span className="font-semibold">Engine Active</span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 font-mono">Java 21 / Spring Boot 3</span>
          <span className="text-slate-600">•</span>
          <button 
            onClick={() => onToggleDemoMode(!isDemoMode)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition-all ${
              isDemoMode 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <Sparkles className="h-2.5 w-2.5" />
            {isDemoMode ? 'Interactive Demo Mode' : 'Connected to Live API'}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              <span className="text-base leading-none font-black">+</span>
              <span>Create / Dispatch</span>
            </button>

            {showCreateMenu && (
              <div className="absolute right-0 top-11 w-56 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800 mb-1">
                  Direct REST Actions
                </div>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenCreateShipment(); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <span>📦</span>
                  <div className="text-left">
                    <div>New Shipment</div>
                    <div className="text-[10px] opacity-70 font-mono">POST /api/shipments</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenDispatch(); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <span>🚀</span>
                  <div className="text-left">
                    <div>Dispatch Trip</div>
                    <div className="text-[10px] opacity-70 font-mono">POST /api/trips</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenCreateVehicle(); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <span>🚚</span>
                  <div className="text-left">
                    <div>Register Vehicle</div>
                    <div className="text-[10px] opacity-70 font-mono">POST /api/vehicles</div>
                  </div>
                </button>
                <button
                  onClick={() => { setShowCreateMenu(false); onOpenCreateDriver(); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <span>👤</span>
                  <div className="text-left">
                    <div>Onboard Driver</div>
                    <div className="text-[10px] opacity-70 font-mono">POST /api/drivers</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-all shadow-sm"
          >
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span>Architecture & Design</span>
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="API Backend Settings"
          >
            <Settings2 className="h-4 w-4" />
          </button>

          <a
            href="https://github.com/abhiramaab/RouteSphere"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="h-3 w-3 text-slate-500" />
          </a>
        </div>
      </div>

      {/* Backend Settings Popover */}
      {showConfig && (
        <div className="absolute right-4 top-18 w-80 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl z-50">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Server className="h-4 w-4 text-indigo-400" /> Backend Endpoint
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            Connect to your local or deployed Spring Boot server:
          </p>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="e.g. http://localhost:8080 or Railway URL"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none mb-3"
          />
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isDemoMode} 
                onChange={(e) => onToggleDemoMode(e.target.checked)} 
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              Demo Data Fallback
            </label>
            <button
              onClick={handleSaveConfig}
              className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              Save & Reconnect
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
