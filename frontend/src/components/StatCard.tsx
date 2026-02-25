import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  change?: {
    value: string | number;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-orange-600',
  iconBgColor = 'bg-orange-100',
}: StatCardProps) {
  return (
    <Card className="border border-slate-200 bg-white rounded-xl p-6 hover:shadow-md transition-smooth hover:border-slate-300">
      <div className="flex justify-between items-start gap-4">

        {/* Text Section */}
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <div className="space-y-1">
            <p className="text-4xl font-bold text-slate-900">
              {value.toLocaleString()}
            </p>

            {change && (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-full",
                  change.trend === 'up'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                )}>
                  {change.trend === 'up' ? '↑' : '↓'} {change.value}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Icon */}
        <div className={cn('p-3 rounded-lg flex-shrink-0', iconBgColor)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>

      </div>
    </Card>
  );
}

export default StatCard;
