import { useEffect, useState } from 'react';
import { Clock, Calendar, Check, X, AlertCircle } from 'lucide-react';
import { listLeaveRequests, updateLeaveRequestStatus, type LeaveRequest } from '../lib/leaveRequestsApi';
import { format } from 'date-fns';
import { notifyError } from "../lib/notify";

interface PendingLeaveRequestsProps {
  onStatusChanged?: () => void;
}

export function PendingLeaveRequests({ onStatusChanged }: PendingLeaveRequestsProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'denied'>('all');
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listLeaveRequests(filterStatus);
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const handleAction = async (id: string, action: 'approved' | 'denied') => {
    setActioningId(id);
    try {
      await updateLeaveRequestStatus(id, action);
      // Refresh list
      fetchRequests();
      // Notify parent to refresh stats
      if (onStatusChanged) {
        onStatusChanged();
      }
    } catch (err) {
      console.error(err);
      notifyError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActioningId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'denied':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const formatDateRange = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')}`;
    } catch {
      return `${start} – ${end}`;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Leave Requests</h2>
          <p className="text-slate-500 mt-1 text-sm">
            Review and manage caregiver leave requests.
          </p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-sm font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
          <div className="animate-spin w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-3"></div>
          Loading requests...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="font-medium">Error loading requests</p>
          <p className="text-xs mt-1 text-red-400">{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
          <Clock className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No leave requests found</p>
          <p className="text-sm mt-1 text-slate-500">
            {filterStatus === 'all'
              ? 'No requests have been submitted.'
              : `No ${filterStatus} requests found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-smooth flex flex-col gap-3"
            >
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {req.caregiver_name || 'Caregiver'}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDateRange(req.start_date, req.end_date)}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)} capitalize`}>
                  {req.status}
                </span>
              </div>

              {req.reason && (
                <p className="text-sm text-slate-600 bg-slate-50 p-2.5 rounded-md italic">
                  "{req.reason}"
                </p>
              )}

              {req.status === 'pending' && (
                <div className="flex justify-end gap-2 mt-1 pt-2 border-t border-slate-100">
                  <button
                    disabled={actioningId !== null}
                    onClick={() => handleAction(req.id, 'denied')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-smooth disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Deny
                  </button>
                  <button
                    disabled={actioningId !== null}
                    onClick={() => handleAction(req.id, 'approved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-smooth shadow-sm hover:shadow disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingLeaveRequests;
