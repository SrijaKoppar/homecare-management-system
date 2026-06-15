import { apiUrl, apiHeaders } from '../config/api';

export interface Assignment24x7 {
  id: string;
  care_recipient_id: string;
  organization_id: string;
  caregiver_id: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  type: 'primary' | 'relief';
  notes: string | null;
  status: 'active' | 'ended' | 'cancelled';
  created_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Assignment24x7Create {
  care_recipient_id: string;
  organization_id: string;
  caregiver_id: string;
  start_date: string;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  type?: 'primary' | 'relief';
  notes?: string;
  status?: 'active' | 'ended' | 'cancelled';
}

export interface Assignment24x7Update {
  caregiver_id?: string;
  start_date?: string;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  type?: 'primary' | 'relief';
  notes?: string;
  status?: 'active' | 'ended' | 'cancelled';
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

export async function listAssignments24x7(params: { care_recipient_id?: string, caregiver_id?: string } = {}): Promise<Assignment24x7[]> {
  const query: Record<string, string> = {};
  if (params.care_recipient_id) query.care_recipient_id = params.care_recipient_id;
  if (params.caregiver_id) query.caregiver_id = params.caregiver_id;
  
  const res = await fetch(apiUrl('/api/v1/assignments-24x7', query), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function getAssignment24x7(id: string): Promise<Assignment24x7> {
  const res = await fetch(apiUrl(`/api/v1/assignments-24x7/${id}`), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createAssignment24x7(data: Assignment24x7Create): Promise<Assignment24x7> {
  const res = await fetch(apiUrl('/api/v1/assignments-24x7'), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateAssignment24x7(id: string, data: Assignment24x7Update): Promise<Assignment24x7> {
  const res = await fetch(apiUrl(`/api/v1/assignments-24x7/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function deleteAssignment24x7(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/v1/assignments-24x7/${id}`), {
    method: 'DELETE',
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
}
