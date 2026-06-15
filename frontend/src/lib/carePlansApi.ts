import { apiUrl, apiHeaders } from '../config/api';

export interface CarePlan {
  id: string;
  care_recipient_id: string;
  organization_id: string;
  name: string;
  goals: string | null;
  focus_areas: string[] | null;
  template_id: string | null;
  effective_from: string;
  effective_to: string | null;
  status: string;
  created_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CarePlanCreate {
  care_recipient_id: string;
  organization_id: string;
  name: string;
  goals?: string;
  focus_areas?: string[];
  template_id?: string;
  effective_from: string;
  effective_to?: string;
  status?: string;
}

export interface CarePlanUpdate {
  name?: string;
  goals?: string;
  focus_areas?: string[];
  template_id?: string;
  effective_from?: string;
  effective_to?: string;
  status?: string;
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

export async function listCarePlans(careRecipientId?: string): Promise<CarePlan[]> {
  const url = careRecipientId
    ? apiUrl('/api/v1/care-plans', { care_recipient_id: careRecipientId })
    : apiUrl('/api/v1/care-plans');
  const res = await fetch(url, { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function getCarePlan(id: string): Promise<CarePlan> {
  const res = await fetch(apiUrl(`/api/v1/care-plans/${id}`), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createCarePlan(data: CarePlanCreate): Promise<CarePlan> {
  const res = await fetch(apiUrl('/api/v1/care-plans'), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateCarePlan(id: string, data: CarePlanUpdate): Promise<CarePlan> {
  const res = await fetch(apiUrl(`/api/v1/care-plans/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function deleteCarePlan(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/v1/care-plans/${id}`), {
    method: 'DELETE',
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
}
