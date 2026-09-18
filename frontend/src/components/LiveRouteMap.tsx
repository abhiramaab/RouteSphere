import React from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Trip } from '../types';

interface LiveRouteMapProps {
  trips: Trip[];
  onSelectTrip?: (trip: Trip) => void;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({ trips, onSelectTrip }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Navigation className="h-4 w-4 text-indigo-400" />
            Active Transit Corridors & Telematics
          </h3>
          <p className="text-xs text-slate-400">
            Real-time fleet GPS tracking across primary national freight corridors
          </p>
        </div>
        <span className="self-start sm:self-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
          ● 3 Trips En Route
        </span>
      </div>

      {/* Corridors Grid */}
      <div className="space-y-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => onSelectTrip?.(trip)}
            className="group cursor-pointer rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-indigo-500/40 hover:bg-slate-900/80"
          >
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-400">
                  {trip.tripCode}
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                  {trip.trackingNumber}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Truck className="h-3 w-3 text-slate-400" />
                  <span className="font-mono text-slate-200">{trip.vehiclePlate}</span>
                </span>
                <span>•</span>
                <span className="text-slate-300 font-medium">{trip.driverName}</span>
              </div>
            </div>

            {/* Route Node Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Origin */}
              <div className="md:col-span-3 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
                <div>
                  <div className="text-xs font-bold text-slate-200">{trip.origin}</div>
                  <div className="text-[10px] text-slate-500">Origin Hub</div>
                </div>
              </div>

              {/* Progress Bar & Telematics */}
              <div className="md:col-span-6 px-2">
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-indigo-300 font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ETA: {trip.eta}
                  </span>
                  <span className="font-mono text-slate-400 font-medium">
                    {trip.progressPercent}% ({Math.round((trip.distanceKm * trip.progressPercent) / 100)} / {trip.distanceKm} km)
                  </span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${trip.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-2">
                <div className="text-left md:text-right">
                  <div className="text-xs font-bold text-slate-200">{trip.destination}</div>
                  <div className="text-[10px] text-slate-500">Destination Hub</div>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-indigo-400 ring-4 ring-indigo-500/20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
