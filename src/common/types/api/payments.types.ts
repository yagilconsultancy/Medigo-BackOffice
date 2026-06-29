import { ApiResponse } from './common';

// ====================== TRANSACTIONS ======================

export interface TransactionKPIs {
  total_transactions?: number;
  total_amount?: number;
  total_collected?: number;
  settled_count?: number;
  pending_count?: number;
}

export interface PaymentMethodBreakdownItem {
  method: string;
  count: number;
  total_amount: number;
  percentage?: number;
}

export interface AdminTransactionResponse {
  id: string;
  transaction_id: string;
  booking_id?: string | null;
  user_name: string;
  user_type: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface AdminTransactionDetailResponse {
  id: string;
  transaction_id: string;
  booking_id?: string | null;
  user_id: string;
  user_name: string;
  user_type: string;
  amount: number;
  payment_method: string;
  status: string;
  description?: string | null;
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionListPayload {
  status?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}

// ====================== REVENUE ======================

export interface RevenueKPIs {
  total_revenue?: number;
  average_transaction?: number;
  growth_percentage?: number;
  total_rides?: number;
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  rides: number;
}

export interface RevenueByRideTypeItem {
  ride_type: string;
  revenue: number;
  count: number;
  percentage?: number;
}

export interface RevenueByCityItem {
  city: string;
  revenue: number;
  rides: number;
  percentage?: number;
}

export interface RevenueDistributionResponse {
  driver_earnings: number;
  platform_fees: number;
  taxes: number;
  other: number;
}

export interface RevenueQueryPayload {
  period?: string; // 'daily' | 'monthly' | 'yearly'
}

// ====================== PAYOUTS ======================

export interface PayoutKPIs {
  total_earnings?: number;
  active_drivers?: number;
  payouts_pending_count?: number;
  payouts_pending_total?: number;
  payouts_completed_total?: number;
}

export interface PayoutScheduleItem {
  date: string;
  amount: number;
  driver_count: number;
  status: string;
}

export interface EarningsBreakdownResponse {
  gross_ride_revenue: number;
  platform_commission: number;
  driver_payouts: number;
}

export interface MonthlyEarningsPoint {
  month: string;
  earnings: number;
  driver_count: number;
}

export interface SpecialtyPayoutItem {
  specialty: string;
  total_earnings: number;
  driver_count: number;
  percentage?: number;
}

export interface DriverEarningsRow {
  id: string;
  driver_id: string;
  driver_name: string;
  specialty?: string | null;
  fleet_name?: string | null;
  total_earnings: number;
  completed_rides: number;
  pending_payout: number;
  status: string;
}

export interface PayoutConfirmationResponse {
  driver_id: string;
  driver_name: string;
  total_earnings: number;
  breakdown: {
    base_fare: number;
    tips: number;
    bonuses: number;
    adjustments: number;
  };
  completed_rides: number;
  account_details?: {
    account_holder: string;
    account_number: string;
    bank_name: string;
  } | null;
}

export interface DriverEarningsListPayload {
  search?: string | null;
  is_caregiver?: boolean;
  specialty?: string | null;
  fleet_id?: string | null;
  status?: string | null;
  page?: number;
  limit?: number;
}

export interface PayoutKpisQueryPayload {
  is_caregiver?: boolean;
}

export interface EarningsBreakdownQueryPayload {
  is_caregiver?: boolean;
}

// ====================== REFUNDS ======================

export interface RefundKPIs {
  total_refunds?: number;
  pending_refunds?: number;
  approved_refunds?: number;
  rejected_refunds?: number;
  total_refund_amount?: number;
}

export interface RefundRequestListItem {
  id: string;
  refund_id: string;
  booking_id: string;
  user_name: string;
  amount: number;
  reason: string;
  status: string;
  created_at: string;
}

export interface RefundDetailResponse {
  id: string;
  refund_id: string;
  booking_id: string;
  transaction_id?: string | null;
  user_id: string;
  user_name: string;
  amount: number;
  reason: string;
  status: string;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  processed_at?: string | null;
  processed_by?: string | null;
}

export interface RefundListPayload {
  status?: string | null;
  search?: string | null;
  page?: number;
  limit?: number;
}

export interface CreateRefundRequest {
  booking_id: string;
  amount: number;
  reason: string;
}

export interface ApproveRefundRequest {
  admin_notes?: string | null;
}

export interface RejectRefundRequest {
  admin_notes: string;
}

// ====================== PAGINATED RESPONSE ======================

export interface PaginatedTransactionResponse {
  items: AdminTransactionResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedDriverEarningsResponse {
  items: DriverEarningsRow[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedRefundResponse {
  items: RefundRequestListItem[];
  total: number;
  page: number;
  limit: number;
}

// ====================== WRAPPED RESPONSE ALIASES ======================

export type ApiTransactionKPIsResponse = ApiResponse<TransactionKPIs>;
export type ApiPaymentMethodBreakdownResponse = ApiResponse<
  PaymentMethodBreakdownItem[]
>;
export type ApiTransactionListResponse =
  ApiResponse<PaginatedTransactionResponse>;
export type ApiTransactionDetailResponse =
  ApiResponse<AdminTransactionDetailResponse>;

export type ApiRevenueKPIsResponse = ApiResponse<RevenueKPIs>;
export type ApiRevenueTrendResponse = ApiResponse<RevenueTrendPoint[]>;
export type ApiRevenueByRideTypeResponse = ApiResponse<RevenueByRideTypeItem[]>;
export type ApiRevenueByCityResponse = ApiResponse<RevenueByCityItem[]>;
export type ApiRevenueDistributionResponse =
  ApiResponse<RevenueDistributionResponse>;

export type ApiPayoutKPIsResponse = ApiResponse<PayoutKPIs>;
export type ApiPayoutScheduleResponse = ApiResponse<PayoutScheduleItem[]>;
export type ApiEarningsBreakdownResponse =
  ApiResponse<EarningsBreakdownResponse>;
export type ApiMonthlyDistributionResponse = ApiResponse<
  MonthlyEarningsPoint[]
>;
export type ApiPayoutsBySpecialtyResponse = ApiResponse<SpecialtyPayoutItem[]>;
export type ApiDriverEarningsListResponse =
  ApiResponse<PaginatedDriverEarningsResponse>;
export type ApiPayoutDetailResponse = ApiResponse<PayoutConfirmationResponse>;
export type ApiProcessPayoutResponse = ApiResponse<Record<string, any>>;

export type ApiRefundKPIsResponse = ApiResponse<RefundKPIs>;
export type ApiRefundListResponse = ApiResponse<PaginatedRefundResponse>;
export type ApiRefundDetailResponse = ApiResponse<RefundDetailResponse>;

// ====================== PRICING DASHBOARD ======================

export interface PricingDashboardKPIs {
  monthly_revenue?: string | number;
  avg_trip_fare?: string | number;
  active_service_types?: number | string;
  premium_ride_percent?: string | number;
}

export interface RouteComparisonItem {
  route: string;
  standard: number | string | null;
  wheelchair_wav: number | string | null;
  stretcher: number | string | null;
}

export interface RouteComparisonResponse {
  routes: RouteComparisonItem[];
}

export interface PricingHealthItem {
  label: string;
  status: string;
  detail: string;
}

export interface PricingHealthResponse {
  items: PricingHealthItem[];
}

export interface RecentPricingChange {
  id: string;
  category: string;
  change_type: string;
  description: string;
  admin_name: string;
  created_at: string;
}

export interface RecentChangesResponse {
  changes: RecentPricingChange[];
  total: number;
}

export interface RecentChangesQueryPayload {
  limit?: number;
}

// ====================== FARE CONFIGURATION ======================

export interface ServiceTypeItem {
  service_type: string;
  display_name: string;
  is_active: boolean;
  base_fare: number;
  per_km: number;
  per_minute: number;
}

export interface ServiceTypeListResponse {
  service_types: ServiceTypeItem[];
}

export interface ServiceTypeConfigResponse {
  id: string;
  service_type: string;
  display_name: string;
  config: Record<string, any>; // Flexible config structure - can contain any fare configuration data
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceTypeConfigUpdate {
  name: string;
  config: Record<string, any>;
  notes?: string;
}

export interface RoutePrice {
  route_id: string;
  route_name: string;
  base_fare: number;
  per_km: number;
  per_minute: number;
}

export interface RoutePricingResponse {
  service_type: string;
  routes: RoutePrice[];
}

export interface RoutePricingUpdate {
  routes: RoutePrice[];
}

export interface CommissionViewResponse {
  service_type: string;
  platform_commission_percentage: number;
  driver_earnings_percentage: number;
  estimated_driver_earnings: number;
  estimated_platform_fee: number;
}

// ====================== SURCHARGES ======================

export interface SurchargeKPIs {
  total_rules?: number;
  active_rules?: number;
  total_surcharge_amount?: number;
}

export interface SurchargeRule {
  id: string;
  name: string;
  description?: string;
  surcharge_type: string;
  multiplier: string;
  flat_amount: string;
  schedule?: {
    periods: Array<{
      start: string;
      end: string;
      days: number[];
      amount?: number;
    }>;
  } | null;
  applies_to: string[];
  is_active: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface SurchargeRuleListResponse {
  rules: SurchargeRule[];
}

export interface SurchargeRuleCreate {
  name: string;
  description?: string;
  surcharge_type: string;
  multiplier: number;
  flat_amount: number;
  schedule?: {
    periods: Array<{
      start: string;
      end: string;
      days: number[];
      amount?: number;
    }>;
  } | null;
  applies_to: string[];
  is_active?: boolean;
  sort_order?: number;
}

export interface SurchargeRuleUpdate {
  name?: string;
  description?: string;
  surcharge_type?: string;
  multiplier?: number;
  flat_amount?: number;
  schedule?: {
    periods: Array<{
      start: string;
      end: string;
      days: number[];
      amount?: number;
    }>;
  } | null;
  applies_to?: string[];
  is_active?: boolean;
  sort_order?: number;
}

export interface SurchargeRuleResponse {
  rule: SurchargeRule;
}

// ====================== RIDE PACKAGES ======================

export interface PackageKPIs {
  total_packages?: number;
  active_packages?: number;
  total_sales?: number;
}

export interface RidePackage {
  id: string;
  name: string;
  package_type: string;
  description?: string | null;
  price: number;
  rides_included: number;
  ride_count?: number | null;
  is_unlimited?: boolean;
  validity_days: number;
  is_active: boolean;
  active_subscribers?: number;
  sort_order?: number;
  discount_percent?: number | string | null;
  discount_percentage?: number | null;
  created_at: string;
  updated_at: string;
}

export interface RidePackageListResponse {
  packages: RidePackage[];
}

export interface RidePackageCreate {
  name: string;
  package_type: string;
  description?: string | null;
  price: number;
  rides_included: number;
  validity_days: number;
  is_active?: boolean;
  discount_percentage?: number | null;
}

export interface RidePackageUpdate {
  name?: string;
  description?: string | null;
  package_type?: string;
  price?: number;
  ride_count?: number | null;
  is_unlimited?: boolean;
  discount_percent?: number | null;
  validity_days?: number;
  sort_order?: number;
  is_active?: boolean;
}

export interface RidePackageResponse {
  package: RidePackage;
}

export interface PackageListQueryPayload {
  package_type?: string | null;
}

// ====================== PRICING CONFIGURATION ======================

export interface RateCardResponse {
  id?: string;
  version?: number;
  name: string;
  config: {
    fees: {
      surcharge_flat_per_trip: number;
      insurance_payment_gateway_fee: number;
    };
    timezone: string;
    base_fare: {
      flat_rate: number;
      distance_threshold_km: number;
      per_km_beyond_threshold: number;
    };
    wait_time: {
      free_minutes: number;
      per_minute_after_free: number;
    };
    highway_407_tolls: {
      milton_brampton: number;
      milton_oakville: number;
      milton_mississauga: number;
    };
    holiday_surcharge: number;
    max_surcharge_cap: number;
    weather_surcharges: {
      heavy_snow: number;
      light_snow: number;
      post_storm: number;
    };
    weekend_surcharges: {
      sunday: number;
      saturday: number;
    };
    platform_fee_percent: number;
    rush_hour_surcharges: Array<{
      end: string;
      days: number[];
      name: string;
      start: string;
      amount: number;
    }>;
    time_of_day_surcharges: Array<{
      end: string;
      name: string;
      start: string;
      amount: number;
    }>;
  };
  is_active: boolean;
  created_by?: string;
  notes?: string;
  created_at?: string;
}

export interface CreateRateCardRequest {
  name: string;
  config: {
    timezone: string;
    base_fare: {
      flat_rate: number;
      distance_threshold_km: number;
      per_km_beyond_threshold: number;
    };
    fees: {
      surcharge_flat_per_trip: number;
      insurance_payment_gateway_fee: number;
    };
    wait_time: {
      free_minutes: number;
      per_minute_after_free: number;
    };
    max_surcharge_cap: number;
    platform_fee_percent: number;
    weather_surcharges: {
      light_snow: number;
      heavy_snow: number;
      post_storm: number;
    };
    rush_hour_surcharges: Array<{
      end: string;
      days: number[];
      name: string;
      start: string;
      amount: number;
    }>;
    time_of_day_surcharges: Array<{
      end: string;
      name: string;
      start: string;
      amount: number;
    }>;
    weekend_surcharges: {
      saturday: number;
      sunday: number;
    };
    holiday_surcharge: number;
    highway_407_tolls: {
      milton_oakville: number;
      milton_brampton: number;
      milton_mississauga: number;
    };
  };
  notes?: string;
}

// ====================== PRICING LOGS ======================

export interface PricingLog {
  id: string;
  log_number: number;
  admin_id: string;
  admin_name: string;
  category: string;
  city: string | null;
  change_description: string;
  before_value: string | null;
  after_value: string | null;
  created_at: string;
}

export interface PricingLogListResponse {
  items: PricingLog[];
  total: number;
  page: number;
  page_size: number;
}

export interface PricingLogsQueryPayload {
  page?: number;
  page_size?: number;
  category?: string | null;
  search?: string | null;
}

export interface PricingLogExportResponse {
  download_url: string;
  filename: string;
}

export interface PricingLogsExportQueryPayload {
  category?: string | null;
  search?: string | null;
}

// ====================== COMMISSION SETTINGS ======================

export interface CommissionKPIs {
  platform_commission?: number;
  driver_earnings?: number;
  fleet_commission?: number;
  caregiver_payout?: number;
  reserve_buffer?: number;
  total_transactions?: number;
}

export interface CommissionConfigResponse {
  platform_percent: number | string;
  driver_percent: number | string;
  fleet_percent: number | string;
  caregiver_percent: number | string;
  reserve_percent: number | string;
  is_active: boolean;
  updated_at: string;
  updated_by?: string | null;
}

export interface CommissionConfigUpdate {
  platform_percent: number;
  driver_percent: number;
  fleet_percent: number;
  caregiver_percent: number;
  reserve_percent: number;
}

// ====================== CANCELLATION POLICY ======================

export interface CancellationKPIs {
  total_cancellations?: number;
  total_fees_collected?: number;
  average_fee?: number;
}

export interface CancellationPolicyItem {
  id: string;
  service_type: string;
  cancellation_window: string;
  fee: string | number;
  who_receives: string;
  notes: string;
  sort_order: number;
  is_active: boolean;
}

export interface CancellationPolicyByServiceType {
  service_type: string;
  policies: CancellationPolicyItem[];
}

export interface CancellationPolicyResponse {
  matrix: CancellationPolicyItem[];
  by_service_type: CancellationPolicyByServiceType[];
}

export interface CancellationPolicyBulkUpdate {
  policies: CancellationPolicyItem[];
}

// ====================== WRAPPED RESPONSE ALIASES FOR PRICING ======================

export type ApiPricingDashboardKPIsResponse = ApiResponse<PricingDashboardKPIs>;
export type ApiRouteComparisonResponse = ApiResponse<RouteComparisonResponse>;
export type ApiRecentChangesResponse = ApiResponse<RecentChangesResponse>;
export type ApiPricingHealthResponse = ApiResponse<PricingHealthResponse>;

export type ApiServiceTypeListResponse = ApiResponse<ServiceTypeListResponse>;
export type ApiServiceTypeConfigResponse =
  ApiResponse<ServiceTypeConfigResponse>;
export type ApiRoutePricingResponse = ApiResponse<RoutePricingResponse>;
export type ApiCommissionViewResponse = ApiResponse<CommissionViewResponse>;

export type ApiSurchargeKPIsResponse = ApiResponse<SurchargeKPIs>;
export type ApiSurchargeRuleListResponse =
  ApiResponse<SurchargeRuleListResponse>;
export type ApiSurchargeRuleResponse = ApiResponse<SurchargeRuleResponse>;

export type ApiPackageKPIsResponse = ApiResponse<PackageKPIs>;
export type ApiRidePackageListResponse = ApiResponse<RidePackageListResponse>;
export type ApiRidePackageResponse = ApiResponse<RidePackageResponse>;

export type ApiRateCardResponse = ApiResponse<RateCardResponse>;

export type ApiPricingLogListResponse = ApiResponse<PricingLogListResponse>;
export type ApiPricingLogExportResponse = ApiResponse<PricingLogExportResponse>;

export type ApiCommissionKPIsResponse = ApiResponse<CommissionKPIs>;
export type ApiCommissionConfigResponse = ApiResponse<CommissionConfigResponse>;

export type ApiCancellationKPIsResponse = ApiResponse<CancellationKPIs>;
export type ApiCancellationPolicyResponse =
  ApiResponse<CancellationPolicyResponse>;
