import { apiUrl, apiHeaders } from '../config/api';

export interface Conversation {
  id: string;
  organization_id: string;
  care_recipient_id: string | null;
  title: string | null;
  type: 'care_circle' | 'direct' | 'group';
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  attachments: any;
  status: string;
  created_at: string;
}

export interface ConversationCreate {
  organization_id: string;
  care_recipient_id?: string | null;
  title?: string | null;
  type: 'care_circle' | 'direct' | 'group';
  participants: string[];
}

export interface ConversationUpdate {
  title?: string | null;
  type?: 'care_circle' | 'direct' | 'group';
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

export async function listConversations(careRecipientId?: string): Promise<Conversation[]> {
  const url = careRecipientId
    ? apiUrl('/api/v1/conversations', { care_recipient_id: careRecipientId })
    : apiUrl('/api/v1/conversations');
  const res = await fetch(url, { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function getConversation(id: string): Promise<Conversation> {
  const res = await fetch(apiUrl(`/api/v1/conversations/${id}`), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function createConversation(data: ConversationCreate): Promise<Conversation> {
  const res = await fetch(apiUrl('/api/v1/conversations'), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function listConversationParticipants(id: string): Promise<ConversationParticipant[]> {
  const res = await fetch(apiUrl(`/api/v1/conversations/${id}/participants`), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  const res = await fetch(apiUrl(`/api/v1/conversations/${conversationId}/messages`), { headers: apiHeaders() });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function sendMessage(conversationId: string, body: string): Promise<Message> {
  const res = await fetch(apiUrl(`/api/v1/conversations/${conversationId}/messages`), {
    method: 'POST',
    headers: apiHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
