import { apiHeaders, apiUrl } from '../config/api';

export type PersonRole =
  | 'care_recipient'
  | 'family_viewer'
  | 'family_editor'
  | 'caregiver'
  | 'supervisor'
  | 'agency_admin'
  | 'system_admin';

export interface PersonPayload {
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  phone?: string;
  organization_id?: string;
  role?: PersonRole;
  title?: string;
  location_id?: string;
  password?: string;
  status?: 'active' | 'invited' | 'inactive';
}

export interface Person {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string | null;
  phone?: string | null;
  status: string;
  membership_id?: string | null;
  role?: PersonRole | null;
  membership_status?: string | null;
  title?: string | null;
  location_id?: string | null;
}

export interface PersonUpdatePayload {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  phone?: string;
  role?: PersonRole;
  title?: string | null;
  location_id?: string | null;
  membership_status?: 'active' | 'inactive' | 'invited';
}

const personsPath = () => apiUrl('/api/v1/persons');

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

export async function listPersons(params: { role?: PersonRole; search?: string } = {}): Promise<Person[]> {
  const res = await fetch(apiUrl('/api/v1/persons', params), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  return Array.isArray(data) ? data : (data.items ?? []);
}

export async function getPerson(id: string): Promise<Person> {
  const res = await fetch(apiUrl(`/api/v1/persons/${id}`), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createPerson(payload: PersonPayload): Promise<Person> {
  const res = await fetch(personsPath(), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updatePerson(id: string, payload: PersonUpdatePayload): Promise<Person> {
  const res = await fetch(apiUrl(`/api/v1/persons/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function deletePerson(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/v1/persons/${id}`), {
    method: 'DELETE',
    headers: apiHeaders(),
  });
  if (!res.ok) throw new Error(await parseError(res));
}

export function buildDisplayName(
  firstName: string,
  lastName: string,
  middleName?: string
): string {
  return [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
}

export function toPersonPayload(form: {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone?: string;
}): PersonPayload {
  const email = form.email.trim();
  if (!email) {
    throw new Error('Email is required');
  }
  return {
    email,
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    display_name: buildDisplayName(form.firstName, form.lastName, form.middleName),
    phone: form.phone?.trim() || undefined,
  };
}

export function roleLabel(role?: string | null): string {
  switch (role) {
    case 'care_recipient':
      return 'Care Recipient';
    case 'family_viewer':
      return 'Family Viewer';
    case 'family_editor':
      return 'Family Editor';
    case 'caregiver':
      return 'Caregiver';
    case 'supervisor':
      return 'Supervisor';
    case 'agency_admin':
      return 'Agency Admin';
    case 'system_admin':
      return 'System Admin';
    default:
      return 'Unassigned';
  }
}
