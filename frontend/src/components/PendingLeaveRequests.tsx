import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { API_BASE } from '../config/api';

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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Leave Requests
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review and manage caregiver leave requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as any)
            }
            className="input input-bordered p-2"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>

          <Button onClick={loadLeaves}>Refresh</Button>
        </div>
      </div>

      {/* List Container */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">

        {loading ? (
          <div className="p-6 text-center text-slate-500">
            Loading...
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No leave requests found.
          </div>
        ) : (
          leaves.map((l) => (
            <div
              key={l.id}
              className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Leave Info */}
                <div className="space-y-1">
                  <div className="text-sm">
                    Caregiver ID:
                    <span className="font-medium ml-1">
                      {l.caregiver_id}
                    </span>
                  </div>

                  <div className="text-sm text-slate-500">
                    {l.start_date ?? '—'} → {l.end_date ?? '—'}
                    {l.days ? ` (${l.days} days)` : ''}
                  </div>

                  <div className="text-sm text-slate-500">
                    Reason: {l.reason ?? '—'}
                  </div>

                  <div className="text-xs mt-1">
                    Status:
                    <span
                      className={`ml-1 capitalize font-medium ${
                        l.status === 'approved'
                          ? 'text-emerald-600'
                          : l.status === 'denied'
                          ? 'text-rose-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {l.status ?? 'pending'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={
                      actioningId === l.id ||
                      l.status === 'approved'
                    }
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
