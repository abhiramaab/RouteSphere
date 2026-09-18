import React from 'react';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Truck, 
  AlertCircle 
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
      gradient: 'from-blue-500/10 to-indigo-500/10',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Fleet Utilization',
      value: `${metrics.fleetUtilizationPercent}%`,
      subtext: '34 of 39 haulage vehicles active',
      icon: Truck,
      gradient: 'from-indigo-500/10 to-purple-500/10',
      border: 'border-indigo-500/20',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'On-Time Delivery SLA',
      value: `${metrics.onTimeDeliveryRate}%`,
      subtext: 'Zero critical route delays',
      icon: Clock,
      gradient: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Monthly Freight Billed',
      value: `₹${(metrics.totalRevenueMonthly / 1000).toFixed(1)}k`,
      subtext: 'Automated invoice generation',
      icon: DollarSign,
      gradient: 'from-amber-500/10 to-orange-500/10',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border ${card.border} bg-gradient-to-br ${card.gradient} bg-slate-900/60 p-5 backdrop-blur-sm transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`rounded-xl bg-slate-800/80 p-2 ${card.iconColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black tracking-tight text-white">
                {card.value}
              </div>
              <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-400 inline" />
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
