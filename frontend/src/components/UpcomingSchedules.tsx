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

  const getServiceTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'physical therapy':
        return 'bg-blue-100 text-blue-700';
      case 'nursing':
        return 'bg-emerald-100 text-emerald-700';
      case 'personal care':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Upcoming Schedules
          </h1>
          <p className="text-slate-500 mt-1">
            View and manage upcoming visits and care schedules.
          </p>
        </div>

        <Button onClick={fetchSchedules} variant="outline" className="border-slate-200 hover:bg-slate-50">
          Refresh
        </Button>
      </div>

      {/* Schedules Container */}
      <div className="space-y-3">

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"></div>
            Loading schedules...
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No upcoming schedules.</p>
            <p className="text-sm mt-1">All your schedules are up to date.</p>
          </div>
        ) : (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-slate-300 transition-smooth"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                {/* Schedule Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 text-lg">
                        {schedule.patientName}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        With {schedule.caregiverName}
                      </div>
                    </div>

                    <Badge className={`${getServiceTypeColor(schedule.serviceType)} border-0`}>
                      {schedule.serviceType}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{schedule.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{schedule.location}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => console.log('Edit', schedule.id)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancel(schedule.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
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
