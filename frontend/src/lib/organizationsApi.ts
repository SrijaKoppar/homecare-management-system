import { apiHeaders, apiUrl } from '../config/api';

export interface Organization {
  id: string;
  name: string;
  type: string;
  slug?: string | null;
  primary_phone?: string | null;
  primary_email?: string | null;
  address_street?: string | null;
  address_city?: string | null;
  address_region?: string | null;
  address_postal_code?: string | null;
  address_country?: string | null;
  timezone: string;
  status: string;
}

export interface OrganizationUpdate {
  name?: string;
  primary_phone?: string;
  primary_email?: string;
  address_street?: string;
  address_city?: string;
  address_region?: string;
  address_postal_code?: string;
  address_country?: string;
  timezone?: string;
}

export interface Location {
  id: string;
  organization_id: string;
  name: string;
  address_street?: string | null;
  address_city?: string | null;
  address_region?: string | null;
  address_postal_code?: string | null;
  address_country?: string | null;
  timezone?: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocationCreate {
  organization_id: string;
  name: string;
  address_street?: string;
  address_city?: string;
  address_region?: string;
  address_postal_code?: string;
  address_country?: string;
  timezone?: string;
  is_default?: boolean;
}

export interface LocationUpdate {
  name?: string;
  address_street?: string;
  address_city?: string;
  address_region?: string;
  address_postal_code?: string;
  address_country?: string;
  timezone?: string;
  is_default?: boolean;
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

export async function getOrganization(id: string): Promise<Organization> {
  const res = await fetch(apiUrl(`/api/v1/organizations/${id}`), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateOrganization(id: string, payload: OrganizationUpdate): Promise<Organization> {
  const res = await fetch(apiUrl(`/api/v1/organizations/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function listLocations(): Promise<Location[]> {
  const res = await fetch(apiUrl('/api/v1/locations'), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createLocation(payload: LocationCreate): Promise<Location> {
  const res = await fetch(apiUrl('/api/v1/locations'), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateLocation(id: string, payload: LocationUpdate): Promise<Location> {
  const res = await fetch(apiUrl(`/api/v1/locations/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function deleteLocation(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/v1/locations/${id}`), {
    method: 'DELETE',
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
}
