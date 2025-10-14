import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, Edit2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface Schedule {
  id: string;
  patientName: string;
  caregiverName: string;
  date: string;
  time: string;
  location: string;
  serviceType: string;
}

const initialSchedules: Schedule[] = [
  {
    id: '1',
    patientName: 'Margaret Thompson',
    caregiverName: 'Sarah Johnson',
    date: 'Today',
    time: '10:00 AM - 2:00 PM',
    location: '142 Oak Street, Springfield',
    serviceType: 'Personal Care'
  },
  {
    id: '2',
    patientName: 'Robert Chen',
    caregiverName: 'Michael Davis',
    date: 'Today',
    time: '2:30 PM - 6:30 PM',
    location: '89 Maple Avenue, Riverside',
    serviceType: 'Companion Care'
  }
];

const serviceTypeColors: Record<string, string> = {
  'Personal Care': 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  'Companion Care': 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'Medical Assistance': 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
};

export function UpcomingSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

  const handleEdit = (id: string) => {
    console.log('Edit schedule:', id);
    // Example: open modal to edit schedule
  };

  const handleCancel = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // Optional: simulate new schedule arriving every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newSchedule: Schedule = {
        id: (schedules.length + 1).toString(),
        patientName: 'New Patient',
        caregiverName: 'New Caregiver',
        date: 'Tomorrow',
        time: '1:00 PM - 3:00 PM',
        location: '123 New Street',
        serviceType: 'Medical Assistance'
      };
      setSchedules(prev => [newSchedule, ...prev]);
    }, 10000);

    return () => clearInterval(interval);
  }, [schedules]);

  return (
    <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-800/30 animate-slide-in-bottom">
      <CardHeader className="border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/30">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          Upcoming Schedules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedules.map(schedule => (
          <div
            key={schedule.id}
            className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/50 transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/5 hover:border-emerald-200 dark:hover:border-emerald-900/50 group animate-fade-in"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{schedule.patientName}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Caregiver: {schedule.caregiverName}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shadow-sm transition-all duration-300 group-hover:shadow-md",
                      serviceTypeColors[schedule.serviceType] || 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {schedule.serviceType}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{schedule.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{schedule.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{schedule.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(schedule.id)}
                  className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-950 dark:hover:to-teal-950 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/20"
                >
                  <Edit2 className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancel(schedule.id)}
                  className="hover:bg-gradient-to-r hover:from-rose-50 hover:to-red-50 dark:hover:from-rose-950 dark:hover:to-red-950 hover:text-rose-700 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 hover:shadow-md hover:shadow-rose-500/20"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ))}
        {schedules.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-4">No upcoming schedules</p>
        )}
      </CardContent>
    </Card>
  );
}
