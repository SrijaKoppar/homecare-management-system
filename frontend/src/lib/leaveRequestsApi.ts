import { apiUrl, apiHeaders } from '../config/api';

export interface LeaveRequest {
  id: string;
  organization_id: string;
  caregiver_id: string;
  caregiver_name?: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'denied';
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body.detail === 'string') return body.detail;
    if (Array.isArray(body.detail)) {
      return body.detail.map((d: { msg?: string }) => d.msg ?? JSON.stringify(d)).join(', ');
    }
    return JSON.stringify(body);
  } catch {
    return res.statusText || 'Request failed';
  }
}

export async function listLeaveRequests(status?: string): Promise<LeaveRequest[]> {
  const query: Record<string, string> = {};
  if (status && status !== 'all') {
    query.status = status;
  }
  const res = await fetch(apiUrl('/api/v1/leave-requests', query), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateLeaveRequestStatus(
  id: string,
  status: 'approved' | 'denied'
): Promise<LeaveRequest> {
  const res = await fetch(apiUrl(`/api/v1/leave-requests/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
