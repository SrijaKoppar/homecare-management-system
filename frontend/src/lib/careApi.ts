import { apiHeaders, apiUrl } from '../config/api';

export interface CareRelationship {
  id: string;
  care_recipient_id: string;
  related_user_id: string;
  organization_id: string;
  role: string;
  is_24x7_caregiver: boolean;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  status: 'active' | 'inactive' | 'ended';
  created_at: string;
  updated_at: string;
}

export interface CareRelationshipCreate {
  care_recipient_id: string;
  related_user_id: string;
  organization_id: string;
  role: string;
  is_24x7_caregiver?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  status?: 'active' | 'inactive' | 'ended';
}

export interface CareRelationshipUpdate {
  role?: string;
  is_24x7_caregiver?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  status?: 'active' | 'inactive' | 'ended';
}

export interface CareArrangement {
  id: string;
  care_recipient_id: string;
  organization_id: string;
  mode: 'visits_only' | 'caregiver_24x7_only' | 'caregiver_24x7_plus_visits';
  effective_from: string;
  effective_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function listCareRelationships(careRecipientId?: string): Promise<CareRelationship[]> {
  const url = careRecipientId
    ? apiUrl('/api/v1/care-relationships', { care_recipient_id: careRecipientId })
    : apiUrl('/api/v1/care-relationships');
  const res = await fetch(url, { headers: apiHeaders() });
  if (!res.ok) {
    throw new Error('Failed to fetch care relationships');
  }
  return res.json();
}

export async function createCareRelationship(data: CareRelationshipCreate): Promise<CareRelationship> {
  const res = await fetch(apiUrl(`/api/v1/care-relationships`), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create care relationship');
  }
  return res.json();
}

export async function updateCareRelationship(id: string, data: CareRelationshipUpdate): Promise<CareRelationship> {
  const res = await fetch(apiUrl(`/api/v1/care-relationships/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update care relationship');
  }
  return res.json();
}

export async function getCareRelationship(id: string): Promise<CareRelationship> {
  const res = await fetch(apiUrl(`/api/v1/care-relationships/${id}`), { headers: apiHeaders() });
  if (!res.ok) {
    throw new Error('Failed to get care relationship');
  }
  return res.json();
}

export async function listCareArrangements(careRecipientId?: string): Promise<CareArrangement[]> {
  const url = careRecipientId
    ? apiUrl('/api/v1/care-arrangements', { care_recipient_id: careRecipientId })
    : apiUrl('/api/v1/care-arrangements');
  const res = await fetch(url, { headers: apiHeaders() });
  if (!res.ok) {
    throw new Error('Failed to fetch care arrangements');
  }
  return res.json();
}
