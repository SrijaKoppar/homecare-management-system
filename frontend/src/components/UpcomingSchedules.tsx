import React, { useEffect, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, Pencil, X } from 'lucide-react';
import { API_BASE } from '../config/api';

interface Schedule {
  id: string;
  patientName: string;
  caregiverName: string;
  date: string;
  time: string;
  location: string;
  serviceType: string;
}

export function UpcomingSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/schedules?upcoming=true`);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setSchedules(json.items ?? json ?? []);
    } catch (err) {
      console.error('Failed to fetch schedules', err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this schedule?')) return;
    try {
      await fetch(`${API_BASE}/api/schedules/${id}`, {
        method: 'DELETE',
      });
      fetchSchedules();
    } catch {
      alert('Cancel failed');
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Upcoming Schedules
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and manage upcoming visits and care schedules.
          </p>
        </div>

        <Button onClick={fetchSchedules}>
          Refresh
        </Button>
      </div>

      {/* List Container */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">

        {loading ? (
          <div className="p-6 text-center text-slate-500">
            Loading schedules...
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No upcoming schedules.
          </div>
        ) : (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Left Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {schedule.patientName}
                      </div>
                      <div className="text-sm text-slate-500">
                        Caregiver: {schedule.caregiverName}
                      </div>
                    </div>

                    <Badge variant="outline">
                      {schedule.serviceType}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {schedule.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {schedule.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {schedule.location}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => console.log('Edit', schedule.id)}
                  >
                    <Pencil size={14} className="mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancel(schedule.id)}
                  >
                    <X size={14} className="mr-1" />
                    Cancel
                  </Button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UpcomingSchedules;
