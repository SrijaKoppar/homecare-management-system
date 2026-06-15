import { apiHeaders, apiUrl } from '../config/api';

export interface VisitPayload {
  organization_id: string;
  care_recipient_id: string;
  assigned_caregiver_id?: string;
  visit_type: 'personal_care' | 'nursing' | 'companionship' | 'respite' | 'other';
  scheduled_start: string;
  scheduled_end: string;
  timezone?: string;
  address_street?: string;
  address_city?: string;
  address_region?: string;
  address_postal_code?: string;
  address_country?: string;
  recurrence_rule?: string;
  parent_visit_id?: string;
  notes?: string;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
}

export interface VisitUpdatePayload extends Partial<VisitPayload> {}

export interface Visit extends VisitPayload {
  id: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  checked_in_at?: string;
  checked_out_at?: string;
  created_by_id?: string;
  created_at: string;
  updated_at: string;
}

const visitsPath = () => apiUrl('/api/v1/visits');

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

export async function listVisits(careRecipientId?: string): Promise<Visit[]> {
  let url = visitsPath();
  if (careRecipientId) {
    url += `?care_recipient_id=${encodeURIComponent(careRecipientId)}`;
  }
  const res = await fetch(url, { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  return Array.isArray(data) ? data : (data.items ?? []);
}

export async function getVisit(id: string): Promise<Visit> {
  const res = await fetch(apiUrl(`/api/v1/visits/${id}`), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createVisit(payload: VisitPayload): Promise<Visit> {
  const res = await fetch(visitsPath(), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateVisit(id: string, payload: VisitUpdatePayload): Promise<Visit> {
  const res = await fetch(apiUrl(`/api/v1/visits/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function startVisit(id: string): Promise<Visit> {
  const res = await fetch(apiUrl(`/api/v1/visits/${id}/start`), {
    method: 'POST',
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function endVisit(id: string): Promise<Visit> {
  const res = await fetch(apiUrl(`/api/v1/visits/${id}/end`), {
    method: 'POST',
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
