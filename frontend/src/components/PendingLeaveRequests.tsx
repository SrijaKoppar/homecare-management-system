import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { API_BASE } from '../config/api';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

type LeaveRequest = {
  id: number;
  caregiver_id: number;
  start_date: string | null;
  end_date: string | null;
  reason?: string | null;
  days?: number | null;
  status?: string | null;
};

export function PendingLeaveRequests() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] =
    useState<'all' | 'pending' | 'approved' | 'denied'>('all');

  const loadLeaves = async () => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE}/api/leave-requests`);
      if (filterStatus !== 'all')
        url.searchParams.set('status', filterStatus);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setLeaves(data ?? []);
    } catch (err) {
      console.error(err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
    // eslint-disable-next-line
  }, [filterStatus]);

  const performAction = async (
    id: number,
    action: 'approve' | 'deny'
  ) => {
    if (!confirm(`Confirm ${action}?`)) return;

    setActioningId(id);
    try {
      const res = await fetch(
        `${API_BASE}/api/leave-requests/${id}/${action}`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error(await res.text());
      loadLeaves();
    } catch {
      alert('Action failed');
    } finally {
      setActioningId(null);
    }
  };

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      case 'denied':
        return (
          <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Denied
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Leave Requests
          </h1>
          <p className="text-slate-500 mt-1">
            Review and manage caregiver leave requests.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as any)
            }
            className="px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-orange-500 focus:bg-slate-50 transition-smooth"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>

          <Button onClick={loadLeaves} variant="outline" className="border-slate-200 hover:bg-slate-50">
            Refresh
          </Button>
        </div>
      </div>

      {/* Cards Container */}
      <div className="space-y-3">

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin w-8 h-8 border-2 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"></div>
            Loading requests...
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No leave requests found.</p>
            <p className="text-sm mt-1">Check back later for new requests.</p>
          </div>
        ) : (
          leaves.map((l) => (
            <div
              key={l.id}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-slate-300 transition-smooth"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                {/* Leave Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        Caregiver #{l.caregiver_id}
                      </p>
                      <p className="text-sm text-slate-500">
                        {l.start_date} → {l.end_date}
                        {l.days ? ` • ${l.days} days` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="ml-13 space-y-2">
                    <div className="text-sm">
                      <span className="text-slate-600">Reason: </span>
                      <span className="text-slate-900 font-medium">{l.reason || 'Not specified'}</span>
                    </div>
                    <div>
                      {getStatusBadge(l.status)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:ml-4">
                  <Button
                    size="sm"
                    disabled={
                      actioningId === l.id ||
                      l.status === 'approved'
                    }
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                    onClick={() =>
                      performAction(l.id, 'approve')
                    }
                  >
                    {actioningId === l.id
                      ? 'Working...'
                      : 'Approve'}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={
                      actioningId === l.id ||
                      l.status === 'denied'
                    }
                    onClick={() =>
                      performAction(l.id, 'deny')
                    }
                  >
                    {actioningId === l.id
                      ? 'Working...'
                      : 'Deny'}
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

export default PendingLeaveRequests;
