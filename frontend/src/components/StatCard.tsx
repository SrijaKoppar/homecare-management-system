import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  change?: {
    value: string | number;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg p-6">
      <div className="flex justify-between items-start">

        {/* Text Section */}
        <div className="space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="text-3xl font-semibold text-slate-900 dark:text-white">
            {value}
          </p>

          {change && (
            <p
              className={cn(
                "text-xs font-medium",
                change.trend === 'up'
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              )}
            >
              {change.trend === 'up' ? '↑' : '↓'} {change.value}%
            </p>
          )}
        </div>

        {/* Icon */}
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
          <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </div>

      </div>
    </Card>
  );
}

export default StatCard;
