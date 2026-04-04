import { ApiResponse } from './common';

export interface BroadcastKPIs {
  total_sent?: number;
  category_1_count?: number;
  category_1_label?: string;
  category_2_count?: number;
  category_2_label?: string;
  total_delivered?: number;
}

export interface BroadcastResponse {
  id: string;
  broadcast_type: string;
  notification_type: string;
  title: string;
  message: string;
  audience_segment: string;
  sent_to_count: number;
  delivered_count: number;
  created_by_id: string;
  sent_at: string;
  created_at: string;
}

export interface BroadcastListResponse {
  items: BroadcastResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface SendBroadcastRequest {
  notification_type: string;
  title: string;
  message: string;
  audience_segment: string;
  sent_to_count?: number;
}

export interface SupportKPIs {
  total_tickets?: number;
  open?: number;
  resolved?: number;
  ride_disputes?: number;
}

export interface SupportTicketItem {
  id: string;
  ticket_id: string;
  ticket_type?: string | null;
  subject: string;
  rider_name?: string | null;
  driver_name?: string | null;
  priority: string;
  status: string;
  created_at: string;
}

export interface SupportTicketListResponse {
  items: SupportTicketItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface SupportTicketResponse {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  description: string;
  status: string;
  priority: string;
  response?: string | null;
  resolved_at?: string | null;
  created_at: string;
}

export interface ResolveTicketRequest {
  response?: string | null;
}

export interface ContactLogKPIs {
  phone_calls?: number;
  live_chats?: number;
  emails_sent?: number;
}

export interface ContactLogItem {
  id: string;
  user_name: string;
  user_role: string;
  channel: string;
  description: string;
  agent_name: string;
  duration_seconds?: number | null;
  outcome: string;
  created_at: string;
}

export interface ContactLogListResponse {
  items: ContactLogItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateContactLogRequest {
  user_id: string;
  user_name: string;
  user_role: string;
  channel: string;
  description: string;
  agent_name: string;
  duration_seconds?: number | null;
  outcome: string;
}

// ─── Payloads ───────────────────────────────────────────────────────────────

export interface BroadcastListPayload {
  page?: number;
  page_size?: number;
}

export interface SupportTicketListPayload {
  status?: string | null;
  search?: string | null;
  page?: number;
  page_size?: number;
}

export interface ReopenTicketPayload {
  ticketId: string;
}

export interface ResolveTicketPayload {
  ticketId: string;
  response?: string | null;
}

export interface ContactLogListPayload {
  page?: number;
  page_size?: number;
}

// ─── Wrapped Response Aliases ───────────────────────────────────────────────

export type ApiBroadcastKpisResponse = ApiResponse<BroadcastKPIs>;
export type ApiBroadcastListResponse = ApiResponse<BroadcastListResponse>;
export type ApiBroadcastResponse = ApiResponse<BroadcastResponse>;
export type ApiSupportKpisResponse = ApiResponse<SupportKPIs>;
export type ApiSupportTicketListResponse =
  ApiResponse<SupportTicketListResponse>;
export type ApiSupportTicketActionResponse = ApiResponse<Record<string, any>>;
export type ApiContactKpisResponse = ApiResponse<ContactLogKPIs>;
export type ApiContactLogListResponse = ApiResponse<ContactLogListResponse>;
export type ApiContactLogResponse = ApiResponse<ContactLogItem>;
