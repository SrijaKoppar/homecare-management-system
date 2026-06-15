export interface Task {
  id: string;
  organization_id: string;
  care_recipient_id: string;
  care_plan_id: string | null;
  visit_id: string | null;
  assignment_24x7_id: string | null;
  task_date: string;
  title: string;
  description: string | null;
  category: string | null;
  frequency: string | null;
  notes: string | null;
  sort_order: number | null;
  status: 'pending' | 'completed' | 'skipped' | 'declined';
  completed_at: string | null;
  completed_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  organization_id: string;
  care_recipient_id: string;
  care_plan_id?: string | null;
  visit_id?: string | null;
  assignment_24x7_id?: string | null;
  task_date: string;
  title: string;
  description?: string | null;
  category?: string | null;
  frequency?: string | null;
  notes?: string | null;
  sort_order?: number | null;
  status?: 'pending' | 'completed' | 'skipped' | 'declined';
}

export interface TaskUpdate {
  care_plan_id?: string | null;
  visit_id?: string | null;
  assignment_24x7_id?: string | null;
  task_date?: string;
  title?: string;
  description?: string | null;
  category?: string | null;
  frequency?: string | null;
  status?: 'pending' | 'completed' | 'skipped' | 'declined';
  notes?: string | null;
  sort_order?: number | null;
}

export async function listTasks(params: { care_recipient_id?: string, visit_id?: string, assignment_24x7_id?: string } = {}): Promise<Task[]> {
  const query = new URLSearchParams();
  if (params.care_recipient_id) query.append('care_recipient_id', params.care_recipient_id);
  if (params.visit_id) query.append('visit_id', params.visit_id);
  if (params.assignment_24x7_id) query.append('assignment_24x7_id', params.assignment_24x7_id);
  
  const qs = query.toString();
  const url = `/api/v1/tasks${qs ? `?${qs}` : ''}`;
  const res = await fetch(apiUrl(url), { headers: apiHeaders() });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function getTask(id: string): Promise<Task> {
  const res = await fetch(apiUrl(`/api/v1/tasks/${id}`), { headers: apiHeaders() });
  if (!res.ok) throw new Error('Failed to get task');
  return res.json();
}

export async function createTask(data: TaskCreate): Promise<Task> {
  const res = await fetch(apiUrl(`/api/v1/tasks`), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create task');
  }
  return res.json();
}

export async function updateTask(id: string, data: TaskUpdate): Promise<Task> {
  const res = await fetch(apiUrl(`/api/v1/tasks/${id}`), {
    method: 'PATCH',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update task');
  }
  return res.json();
}
import { apiHeaders, apiUrl } from '../config/api';
