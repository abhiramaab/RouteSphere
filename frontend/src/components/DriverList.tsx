import React from 'react';
import { 
  Users, 
  Phone, 
  Star,
  Plus
} from 'lucide-react';
import { Driver } from '../types';

interface DriverListProps {
  drivers: Driver[];
  onOpenCreateDriver?: () => void;
}

export const DriverList: React.FC<DriverListProps> = ({ drivers, onOpenCreateDriver }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Drivers Directory ({drivers.length})
          </h3>
          <p className="text-xs text-slate-500">
            Certified commercial vehicle operators & status tracking
          </p>
        </div>

        {onOpenCreateDriver && (
          <button
            onClick={onOpenCreateDriver}
            className="flex items-center gap-1.5 self-start sm:self-center rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Onboard Driver</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((d) => {
          const isAvailable = d.status === 'AVAILABLE';
          const isOnDuty = d.status === 'ON_DUTY';
          return (
            <div
              key={d.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={d.avatarUrl}
                    alt={d.fullName}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{d.fullName}</h4>
                    <span className="font-mono text-[11px] text-slate-400">
                      DL: {d.licenseNumber}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isOnDuty
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {d.status === 'AVAILABLE' ? 'Available' : d.status === 'ON_DUTY' ? 'On Duty' : 'Off Duty'}
                </span>
              </div>

              <div className="my-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-slate-50 p-2">
                  <div className="text-[10px] text-slate-400">Rating</div>
                  <div className="font-bold text-slate-800 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    {d.rating.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <div className="text-[10px] text-slate-400">Trips</div>
                  <div className="font-mono font-bold text-slate-800">{d.tripsCompleted}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <div className="text-[10px] text-slate-400">Vehicle</div>
                  <div className="font-mono text-[11px] font-semibold text-blue-700 truncate">
                    {d.assignedVehiclePlate || 'None'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> {d.phone}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
