import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  change?: {
    value: string | number;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export function StatCard({ title, value, change, icon: Icon, iconColor, iconBgColor }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate the value count-up
  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(value / 50); // Adjust animation speed
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(start);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <Card className="relative overflow-hidden border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-scale-in">
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-100/20 dark:to-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{displayValue}</p>
            {change && (
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    change.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  )}
                >
                  {change.trend === 'up' ? '↑' : '↓'} {change.value}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">vs last week</span>
              </div>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
            iconBgColor
          )}>
            <Icon className={cn("h-6 w-6 transition-transform duration-300", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
