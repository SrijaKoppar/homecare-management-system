import { apiUrl } from '../config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  organization_name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_id: string;
  organization_id: string;
  role: string;
  email: string;
  display_name?: string | null;
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

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(apiUrl('/api/v1/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function signup(payload: SignupRequest): Promise<LoginResponse> {
  const res = await fetch(apiUrl('/api/v1/auth/signup'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
