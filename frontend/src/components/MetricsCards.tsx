import React from 'react';
import { 
  Package, 
  Clock, 
  IndianRupee, 
  Truck 
} from 'lucide-react';
import { LogisticsMetrics } from '../types';

interface MetricsCardsProps {
  metrics: LogisticsMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Active Shipments',
      value: metrics.activeShipments,
      subtext: '+12% from last week',
      icon: Package,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Fleet Utilization',
      value: `${metrics.fleetUtilizationPercent}%`,
      subtext: '34 of 39 haulage units active',
      icon: Truck,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'On-Time Delivery SLA',
      value: `${metrics.onTimeDeliveryRate}%`,
      subtext: 'Zero route delays reported',
      icon: Clock,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Freight Billed (Monthly)',
      value: `₹${(metrics.totalRevenueMonthly / 1000).toFixed(1)}k`,
      subtext: 'Automated invoice generation',
      icon: IndianRupee,
      iconBg: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`rounded-lg p-2 ${card.iconBg}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                {card.value}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
