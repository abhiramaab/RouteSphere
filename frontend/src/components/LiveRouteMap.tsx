import React from 'react';
import { 
  Navigation, 
  Clock, 
  Truck, 
  Plus
} from 'lucide-react';
import { Trip } from '../types';

interface LiveRouteMapProps {
  trips: Trip[];
  onSelectTrip?: (trip: Trip) => void;
  onOpenDispatch?: () => void;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({ trips, onSelectTrip, onOpenDispatch }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-600" />
            Active Freight Corridors
          </h3>
          <p className="text-xs text-slate-500">
            Real-time fleet tracking across national transit routes
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          {onOpenDispatch && (
            <button
              onClick={onOpenDispatch}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Dispatch Trip</span>
            </button>
          )}
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200">
            {trips.length} Active Trips
          </span>
        </div>
      </div>

      {/* Corridors List */}
      <div className="space-y-3">
        {trips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => onSelectTrip?.(trip)}
            className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer"
          >
            {/* Top Info */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700">
                  {trip.tripCode}
                </span>
                <span className="rounded bg-white px-2 py-0.5 font-mono text-[11px] text-slate-600 border border-slate-200">
                  {trip.trackingNumber}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono font-medium text-slate-800">{trip.vehiclePlate}</span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-800 font-medium">{trip.driverName}</span>
              </div>
            </div>

            {/* Route Line & Progress */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Origin */}
              <div className="md:col-span-3">
                <div className="text-xs font-semibold text-slate-900">{trip.origin}</div>
                <div className="text-[11px] text-slate-500">Origin Hub</div>
              </div>

              {/* Progress Bar */}
              <div className="md:col-span-6 px-1">
                <div className="flex justify-between text-[11px] mb-1 text-slate-600">
                  <span className="font-medium text-blue-700 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ETA: {trip.eta}
                  </span>
                  <span className="font-mono">
                    {trip.progressPercent}% ({Math.round((trip.distanceKm * trip.progressPercent) / 100)} / {trip.distanceKm} km)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${trip.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="md:col-span-3 text-left md:text-right">
                <div className="text-xs font-semibold text-slate-900">{trip.destination}</div>
                <div className="text-[11px] text-slate-500">Destination Hub</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
