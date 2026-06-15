import { apiUrl, apiHeaders } from '../config/api';

// =====================================================================
// Visit Notes (Scheduled Visits)
// =====================================================================

export interface VisitNote {
  id: string;
  visit_id: string;
  author_id: string;
  summary: string | null;
  mood: string | null;
  incidents: string | null;
  next_steps: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisitNoteCreate {
  visit_id: string;
  author_id: string;
  summary?: string | null;
  mood?: string | null;
  incidents?: string | null;
  next_steps?: string | null;
}

export interface VisitNoteUpdate {
  summary?: string | null;
  mood?: string | null;
  incidents?: string | null;
  next_steps?: string | null;
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

export async function listVisitNotes(visitId?: string): Promise<VisitNote[]> {
  const url = visitId
    ? apiUrl('/api/v1/visit-notes', { visit_id: visitId })
    : apiUrl('/api/v1/visit-notes');
  const res = await fetch(url, { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createVisitNote(data: VisitNoteCreate): Promise<VisitNote> {
  const res = await fetch(apiUrl('/api/v1/visit-notes'), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateVisitNote(id: string, data: VisitNoteUpdate): Promise<VisitNote> {
  const res = await fetch(apiUrl(`/api/v1/visit-notes/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

// =====================================================================
// Care Notes (24/7 Assignments Daily Notes)
// =====================================================================

export interface CareNote {
  id: string;
  care_recipient_id: string;
  organization_id: string;
  assignment_24x7_id: string | null;
  author_id: string;
  note_date: string;
  summary: string | null;
  mood: string | null;
  next_steps: string | null;
  created_at: string;
  updated_at: string;
}

export interface CareNoteCreate {
  care_recipient_id: string;
  organization_id: string;
  assignment_24x7_id?: string | null;
  author_id: string;
  note_date: string;
  summary?: string | null;
  mood?: string | null;
  next_steps?: string | null;
}

export interface CareNoteUpdate {
  summary?: string | null;
  mood?: string | null;
  next_steps?: string | null;
}

export async function listCareNotes(params: { care_recipient_id?: string, assignment_24x7_id?: string } = {}): Promise<CareNote[]> {
  const query: Record<string, string> = {};
  if (params.care_recipient_id) query.care_recipient_id = params.care_recipient_id;
  if (params.assignment_24x7_id) query.assignment_24x7_id = params.assignment_24x7_id;

  const res = await fetch(apiUrl('/api/v1/care-notes', query), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createCareNote(data: CareNoteCreate): Promise<CareNote> {
  const res = await fetch(apiUrl('/api/v1/care-notes'), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateCareNote(id: string, data: CareNoteUpdate): Promise<CareNote> {
  const res = await fetch(apiUrl(`/api/v1/care-notes/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
