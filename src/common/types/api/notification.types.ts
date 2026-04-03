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

export interface StandardResponse<T = any> {
    success: boolean;
    message?: string | null;
    data: T | null;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface ValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
    input?: any;
    ctx?: Record<string, any>;
}

export interface HTTPValidationError {
    detail?: ValidationError[];
}