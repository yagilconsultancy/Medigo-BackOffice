import { ApiResponse } from "./common";

export interface DashboardMetric {
    value: number;
    change_percent: number;
    trend: "up" | "down" | "stable"; 
}

export interface DashboardKPIs {
    total_bookings: DashboardMetric;
    active_clients: DashboardMetric;
    registered_facilities: DashboardMetric;
    revenue: DashboardMetric;
}

export type DashboardKPIsResponse = ApiResponse<DashboardKPIs>;

export interface TripVolumeTrendPoint {
    date: string;           // "2026-04-01" or ISO datetime
    total_trips: number;
    completed_trips: number;
    cancelled_trips: number;
    dialysis_trips?: number;
}

export interface TripVolumeTrendResponse {
    items: TripVolumeTrendPoint[];
    total_trips: number;
    period: string;         // e.g. "last_30_days", "this_month"
}

export type TripVolumeTrendResponseWrapped = ApiResponse<TripVolumeTrendResponse>;

export interface TripStatusDistributionItem {
    status: string;         // "scheduled", "in_progress", "completed", "cancelled", etc.
    count: number;
    percentage: number;
}

export interface TripStatusDistributionResponse {
    items: TripStatusDistributionItem[];
    total_trips: number;
}

export type TripStatusDistributionResponseWrapped = ApiResponse<TripStatusDistributionResponse>;

export interface TopDriverItem {
    driver_id: string;
    driver_name: string;
    driver_phone?: string | null;
    total_trips: number;
    completed_trips: number;
    avg_rating: number;
    revenue_generated: number;
    completion_rate: number;
}

export interface TopDriversResponse {
    items: TopDriverItem[];
    limit: number;
}

export type TopDriversResponseWrapped = ApiResponse<TopDriversResponse>;

export interface RecentActivityItem {
    id: string;
    activity_type: string;      // "booking_created", "status_changed", "incident_reported", etc.
    title: string;
    description?: string | null;
    timestamp: string;          // ISO date-time
    entity_id?: string | null;  // ride_id, driver_id, etc.
    entity_type?: string | null;
    changed_by?: string | null;
}

export interface RecentActivityResponse {
    items: RecentActivityItem[];
    total: number;
}

export type RecentActivityResponseWrapped = ApiResponse<RecentActivityResponse>;

export interface TransportDistributionItem {
    transport_type: string;     // "standard", "wheelchair", "stretcher", "dialysis", etc.
    count: number;
    percentage: number;
}

export interface TransportDistributionResponse {
    items: TransportDistributionItem[];
    total_trips: number;
}

export type TransportDistributionResponseWrapped = ApiResponse<TransportDistributionResponse>;

export interface TopFleetPartnerItem {
    fleet_id: string;
    fleet_name: string;
    total_trips: number;
    completed_trips: number;
    revenue_generated: number;
    avg_rating: number;
    vehicle_count?: number;
}

export interface TopFleetPartnersResponse {
    items: TopFleetPartnerItem[];
    limit: number;
}

export type TopFleetPartnersResponseWrapped = ApiResponse<TopFleetPartnersResponse>;

// ====================== ANALYTICS QUERY PARAMS ======================

/**
 * Base query parameters used across most analytics endpoints
 */
export interface AnalyticsQueryParams {
    start_date?: string | null;      // ISO date string e.g. "2026-04-01"
    end_date?: string | null;        // ISO date string
    period?: "today" | "week" | "month" | "quarter" | "year" | string;
    limit?: number;
    page?: number;
}

/**
 * Parameters for Trip Volume Trend
 */
export interface TripVolumeTrendParams extends AnalyticsQueryParams {
    group_by?: "day" | "week" | "month";   // how to group the trend data
}

/**
 * Parameters for Top Performing Drivers
 */
export interface TopDriversParams extends AnalyticsQueryParams {
    limit?: number;                        // default usually 10
    min_trips?: number;                    // optional filter
}

/**
 * Parameters for Recent Activity Feed
 */
export interface RecentActivityParams extends AnalyticsQueryParams {
    limit?: number;
    activity_type?: string;                // e.g. "booking_created", "status_changed", "incident_reported"
}

/**
 * Parameters for Transport Type Distribution (usually no extra params)
 */
export interface TransportDistributionParams extends AnalyticsQueryParams {}

/**
 * Parameters for Top Fleet Partners
 */
export interface TopFleetPartnersParams extends AnalyticsQueryParams {
    limit?: number;
}