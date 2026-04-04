// ====================== ADMIN INCIDENTS ======================
export interface IncidentKPIs {
    total: number;
    driver_complaints: number;
    rider_complaints: number;
    accidents: number;
}

export interface IncidentResponse {
    id: string;
    incident_number: number;
    incident_type: string;
    severity: string;
    status: string;
    subject_name: string;
    subject_id?: string | null;
    subject_type: string;
    filed_by_name: string;
    filed_by_id?: string | null;
    filed_by_role: string;
    ride_id?: string | null;
    description: string;
    created_at: string;
    updated_at: string;
    notes: IncidentNoteResponse[];
}

export interface IncidentNoteResponse {
    id: string;
    incident_id: string;
    author_id: string;
    author_name: string;
    content: string;
    created_at: string;
}

export interface CreateIncidentRequest {
    incident_type: string;
    severity: string;
    subject_name: string;
    subject_id?: string | null;
    subject_type: string;
    ride_id?: string | null;
    description: string;
}

export interface UpdateIncidentStatusRequest {
    status: string;
}

export interface CreateIncidentNoteRequest {
    content: string;
}

// ====================== ADMIN SAFETY ALERTS ======================
export interface AlertKPIs {
    active: number;
    route_deviations: number;
    late_arrivals: number;
    resolved_today: number;
}

export interface SafetyAlertResponse {
    id: string;
    alert_number: number;
    category: string;
    severity: string;
    description: string;
    driver_id?: string | null;
    driver_name?: string | null;
    ride_id?: string | null;
    trip_display_id?: string | null;
    city?: string | null;
    status: string;
    acknowledged_at?: string | null;
    acknowledged_by?: string | null;
    resolved_at?: string | null;
    created_at: string;
}

// ====================== ADMIN INVESTIGATIONS ======================
export interface InvestigationKPIs {
    active: number;
    assigned: number;
    unassigned: number;
    avg_duration_days: number;
}

export interface InvestigationResponse {
    id: string;
    investigation_number: number;
    incident_id: string;
    incident_number: number;
    incident_type: string;
    priority: string;
    status: string;
    subject_name: string;
    assigned_to_id?: string | null;
    assigned_to_name?: string | null;
    progress_percent: number;
    opened_at: string;
    completed_at?: string | null;
    created_at: string;
    updated_at: string;
    notes: InvestigationNoteResponse[];
}

export interface InvestigationNoteResponse {
    id: string;
    investigation_id: string;
    author_id: string;
    author_name: string;
    content: string;
    created_at: string;
}

export interface AssignInvestigatorRequest {
    assigned_to_id: string;
    assigned_to_name: string;
}

export interface UpdateInvestigationStatusRequest {
    status: string;
}

export interface UpdateProgressRequest {
    progress_percent: number;
}

export interface CreateInvestigationNoteRequest {
    content: string;
}

// ====================== ADMIN DISCIPLINARY ACTIONS ======================
export interface DisciplinaryKPIs {
    total: number;
    suspensions: number;
    warnings: number;
    reinstated: number;
}

export interface DisciplinaryActionResponse {
    id: string;
    action_number: number;
    incident_id?: string | null;
    incident_number?: number | null;
    investigation_id?: string | null;
    action_type: string;
    severity: string;
    status: string;
    subject_name: string;
    subject_id: string;
    subject_type: string;
    issued_by_name: string;
    issued_by_id: string;
    duration_text: string;
    duration_days?: number | null;
    issued_at: string;
    expires_at?: string | null;
    reinstated_at?: string | null;
    reason?: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateDisciplinaryActionRequest {
    incident_id?: string | null;
    incident_number?: number | null;
    investigation_id?: string | null;
    action_type: string;
    severity: string;
    subject_name: string;
    subject_id: string;
    subject_type: string;
    duration_text: string;
    duration_days?: number | null;
    expires_at?: string | null;
    reason?: string | null;
}

// ====================== ADMIN ANALYTICS ======================
export interface DashboardKPIs {
    total_bookings: KPIChange;
    active_clients: KPIChange;
    registered_facilities: KPIChange;
    revenue: KPIChange;
}

export interface KPIChange {
    value: number;
    change_percent: number;
    trend: string;
}
