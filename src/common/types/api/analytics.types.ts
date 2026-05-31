import { ApiResponse } from './common';

export interface DashboardMetric {
  value: number;
  change_percent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface DashboardKPIs {
  total_bookings: DashboardMetric;
  active_clients: DashboardMetric;
  registered_facilities: DashboardMetric;
  revenue: DashboardMetric;
}

export type DashboardKPIsResponse = ApiResponse<DashboardKPIs>;

export interface TripVolumeTrendPoint {
  date: string; // "2026-03-25"
  count: number;
}

export interface TripVolumeTrendResponse {
  period_days: number;
  data: TripVolumeTrendPoint[];
  total: number;
}

export type TripVolumeTrendResponseWrapped =
  ApiResponse<TripVolumeTrendResponse>;

export interface TripStatusDistributionItem {
  status: string; // "scheduled", "in_progress", "completed", "cancelled", etc.
  count: number;
  percentage: number;
}

export interface TripStatusDistributionResponse {
  items: TripStatusDistributionItem[];
  total_trips: number;
}

export type TripStatusDistributionResponseWrapped =
  ApiResponse<TripStatusDistributionResponse>;

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
  event_type: string; // "status_change", "booking_created", etc.
  title: string;
  description?: string | null;
  ride_id?: string | null;
  rider_name?: string | null;
  passenger_name?: string | null;
  timestamp: string; // ISO date-time
}

export interface RecentActivityResponse {
  activities: RecentActivityItem[];
}

export type RecentActivityResponseWrapped = ApiResponse<RecentActivityResponse>;

export interface TransportDistributionItem {
  transport_type: string; // "standard", "wheelchair", "stretcher", "dialysis", etc.
  count: number;
  percentage: number;
}

export interface TransportDistributionBookingSource {
  client_bookings_percent: number;
  facility_bookings_percent: number;
}

export interface TransportDistributionResponse {
  period_days: number;
  total: number;
  distribution: TransportDistributionItem[];
  booking_source: TransportDistributionBookingSource;
}

export type TransportDistributionResponseWrapped =
  ApiResponse<TransportDistributionResponse>;

export interface TopFleetPartnerItem {
  rank: number;
  fleet_id: string;
  fleet_name: string;
  logo_url?: string | null;
  vehicle_count: number;
  total_trips: number;
  average_rating: number;
}

export interface TopFleetPartnersResponse {
  period_days: number;
  partners: TopFleetPartnerItem[];
}

export type TopFleetPartnersResponseWrapped =
  ApiResponse<TopFleetPartnersResponse>;

// ─── Booking Channels ─────────────────────────────────────────────────────────

export interface BookingChannelItem {
  channel: string; // "mobile_app", "website_client", "website_facility"
  count: number;
  percentage: number;
  growth_percent: number;
}

export interface BookingChannelsResponse {
  period_days: number;
  total: number;
  channels: BookingChannelItem[];
}

export type BookingChannelsResponseWrapped =
  ApiResponse<BookingChannelsResponse>;

// ─── Service Quality ──────────────────────────────────────────────────────────

export interface ServiceQualityResponse {
  avg_pickup_time_minutes: number;
  avg_trip_distance_km: number;
  service_rating: number;
  completion_rate_percent: number;
}

export type ServiceQualityResponseWrapped = ApiResponse<ServiceQualityResponse>;

// ─── Top Facilities ───────────────────────────────────────────────────────────

export interface TopFacilityItem {
  rank: number;
  facility_id: string;
  facility_name: string;
  facility_type?: string | null;
  total_bookings: number;
  acceptance_rate: number;
}

export interface TopFacilitiesResponse {
  period_days: number;
  total_facilities: number;
  type_counts: Record<string, number>;
  facilities: TopFacilityItem[];
}

export type TopFacilitiesResponseWrapped = ApiResponse<TopFacilitiesResponse>;

// ====================== ANALYTICS QUERY PARAMS ======================

/**
 * Base query parameters used across most analytics endpoints
 */
export interface AnalyticsQueryParams {
  days?: number;
  start_date?: string | null;
  end_date?: string | null;
  period?: string;
  limit?: number;
  page?: number;
}

/**
 * Parameters for Trip Volume Trend
 */
export interface TripVolumeTrendParams extends AnalyticsQueryParams {
  days?: number; // 7, 30, or 90
}

/**
 * Parameters for Top Performing Drivers
 */
export interface TopDriversParams extends AnalyticsQueryParams {
  limit?: number; // default usually 10
  min_trips?: number; // optional filter
}

/**
 * Parameters for Recent Activity Feed
 */
export interface RecentActivityParams extends AnalyticsQueryParams {
  limit?: number;
  activity_type?: string; // e.g. "booking_created", "status_changed", "incident_reported"
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

export interface BookingChannelParams extends AnalyticsQueryParams {}

export interface TopFacilitiesParams extends AnalyticsQueryParams {}
