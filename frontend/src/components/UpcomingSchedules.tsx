import { useEffect, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, MapPin, Pencil, X } from 'lucide-react';
import { apiHeaders, apiUrl } from '../config/api';
import { listPersons, type Person } from '../lib/personsApi';
import { useNavigate } from 'react-router-dom';
import { notifyError } from "../lib/notify";

interface Schedule {
  id: string;
  patientName: string;
  caregiverName: string;
  date: string;
  time: string;
  location: string;
  serviceType: string;
}

interface VisitApi {
  id: string;
  care_recipient_id: string;
  assigned_caregiver_id?: string | null;
  visit_type: string;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  address_street?: string | null;
  address_city?: string | null;
}

function formatVisitType(type: string): string {
  return type.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function personLabel(id: string | null | undefined, people: Map<string, Person>): string {
  if (!id) return 'Unassigned';
  const p = people.get(id);
  if (!p) return 'Unknown';
  return p.display_name || `${p.first_name} ${p.last_name}`;
}

function formatLocation(v: VisitApi): string {
  const parts = [v.address_street, v.address_city].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}

export function UpcomingSchedules() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const [visitsRes, people] = await Promise.all([
        fetch(apiUrl('/api/v1/visits'), { headers: apiHeaders() }),
        listPersons().catch(() => [] as Person[]),
      ]);
      if (!visitsRes.ok) {
        setSchedules([]);
        return;
      }
      const visits: VisitApi[] = await visitsRes.json();
      const peopleMap = new Map(people.map((p) => [p.id, p]));
      const now = Date.now();
      const upcoming = visits
        .filter(
          (v) =>
            (v.status === 'scheduled' || v.status === 'in_progress') &&
            new Date(v.scheduled_start).getTime() >= now - 86400000
        )
        .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime())
        .slice(0, 10);
      setSchedules(
        upcoming.map((v) => {
          const start = new Date(v.scheduled_start);
          const end = new Date(v.scheduled_end);
          return {
            id: v.id,
            patientName: personLabel(v.care_recipient_id, peopleMap),
            caregiverName: personLabel(v.assigned_caregiver_id, peopleMap),
            date: start.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }),
            time: `${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} – ${end.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`,
            location: formatLocation(v),
            serviceType: formatVisitType(v.visit_type),
          };
        })
      );
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this visit?')) return;
    try {
      const res = await fetch(apiUrl(`/api/v1/visits/${id}`), {
        method: 'PATCH',
        headers: apiHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (!res.ok) throw new Error('Cancel failed');
      fetchSchedules();
    } catch {
      notifyError('Cancel failed');
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'nursing':
        return 'bg-emerald-100 text-emerald-700';
      case 'personal care':
        return 'bg-purple-100 text-purple-700';
      case 'companionship':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Upcoming Schedules</h2>
          <p className="text-slate-500 mt-1 text-sm">Upcoming visits from your organization schedule.</p>
        </div>
        <Button onClick={fetchSchedules} variant="outline" className="border-slate-200 hover:bg-slate-50">
          Refresh
        </Button>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4" />
            Loading schedules...
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No upcoming visits</p>
            <p className="text-sm mt-1">Create visits from the Schedule page.</p>
          </div>
        ) : (
          schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 text-lg">{schedule.patientName}</div>
                      <div className="text-sm text-slate-500 mt-1">With {schedule.caregiverName}</div>
                    </div>
                    <Badge className={`${getServiceTypeColor(schedule.serviceType)} border-0`}>
                      {schedule.serviceType}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/schedule/${schedule.id}/edit`)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleCancel(schedule.id)}>
                    <X className="h-4 w-4 mr-1" /> Cancel
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
