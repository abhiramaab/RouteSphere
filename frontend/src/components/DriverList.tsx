import React from 'react';
import { 
  Users, 
  Phone, 
  Award, 
  CheckCircle, 
  Clock, 
  Truck,
  Star
} from 'lucide-react';
import { Driver } from '../types';

interface DriverListProps {
  drivers: Driver[];
}

export const DriverList: React.FC<DriverListProps> = ({ drivers }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            Certified Fleet Drivers Directory ({drivers.length})
          </h3>
          <p className="text-xs text-slate-400">
            HOS compliance, safety ratings, and automated trip assignments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((d) => {
          const isAvailable = d.status === 'AVAILABLE';
          const isOnDuty = d.status === 'ON_DUTY';
          return (
            <div
              key={d.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm transition-all hover:border-indigo-500/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={d.avatarUrl}
                    alt={d.fullName}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">{d.fullName}</h4>
                    <span className="font-mono text-[10px] text-slate-400">
                      DL: {d.licenseNumber}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isAvailable
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isOnDuty
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {d.status.replace('_', ' ')}
                </span>
              </div>

              <div className="my-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-slate-950/60 p-2">
                  <div className="text-[10px] text-slate-500">Rating</div>
                  <div className="font-bold text-amber-400 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {d.rating.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-2">
                  <div className="text-[10px] text-slate-500">Trips</div>
                  <div className="font-mono font-bold text-slate-200">{d.tripsCompleted}</div>
                </div>
                <div className="rounded-xl bg-slate-950/60 p-2">
                  <div className="text-[10px] text-slate-500">Assigned</div>
                  <div className="font-mono text-[10px] font-semibold text-indigo-400 truncate">
                    {d.assignedVehiclePlate || 'None'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Phone className="h-3 w-3 text-slate-500" /> {d.phone}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
