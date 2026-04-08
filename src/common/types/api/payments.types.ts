import { ApiResponse } from './common';

// ====================== TRANSACTIONS ======================

export interface TransactionKPIs {
  total_transactions?: number;
  total_amount?: number;
  completed_transactions?: number;
  pending_transactions?: number;
  failed_transactions?: number;
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
  total_payouts?: number;
  pending_payouts?: number;
  completed_payouts?: number;
  total_drivers?: number;
}

export interface PayoutScheduleItem {
  date: string;
  amount: number;
  driver_count: number;
  status: string;
}

export interface EarningsBreakdownResponse {
  total_earnings: number;
  base_fare: number;
  tips: number;
  bonuses: number;
  adjustments: number;
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
  total_fare_configs?: number;
  active_surcharges?: number;
  active_packages?: number;
  recent_changes?: number;
}

export interface RouteComparisonItem {
  route_name: string;
  base_fare: number;
  per_km: number;
  per_minute: number;
  total_trips?: number;
}

export interface RouteComparisonResponse {
  routes: RouteComparisonItem[];
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

export interface PricingHealthResponse {
  status: string;
  issues: string[];
  warnings: string[];
  last_check: string;
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
  service_type: string;
  display_name: string;
  is_active: boolean;
  base_fare: number;
  per_km: number;
  per_minute: number;
  minimum_fare: number;
  cancellation_fee: number;
  waiting_time_per_minute: number;
  metadata?: Record<string, any> | null;
}

export interface ServiceTypeConfigUpdate {
  display_name?: string;
  is_active?: boolean;
  base_fare?: number;
  per_km?: number;
  per_minute?: number;
  minimum_fare?: number;
  cancellation_fee?: number;
  waiting_time_per_minute?: number;
  metadata?: Record<string, any> | null;
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
  type: string;
  value: number;
  is_percentage: boolean;
  is_active: boolean;
  start_time?: string | null;
  end_time?: string | null;
  days_of_week?: string[] | null;
  applicable_to?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface SurchargeRuleListResponse {
  rules: SurchargeRule[];
}

export interface SurchargeRuleCreate {
  name: string;
  type: string;
  value: number;
  is_percentage: boolean;
  is_active?: boolean;
  start_time?: string | null;
  end_time?: string | null;
  days_of_week?: string[] | null;
  applicable_to?: string[] | null;
}

export interface SurchargeRuleUpdate {
  name?: string;
  type?: string;
  value?: number;
  is_percentage?: boolean;
  is_active?: boolean;
  start_time?: string | null;
  end_time?: string | null;
  days_of_week?: string[] | null;
  applicable_to?: string[] | null;
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
  validity_days: number;
  is_active: boolean;
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
  price?: number;
  rides_included?: number;
  validity_days?: number;
  is_active?: boolean;
  discount_percentage?: number | null;
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
  config_name: string;
  base_fare: number;
  per_km: number;
  per_minute: number;
  minimum_fare: number;
  cancellation_fee: number;
  waiting_time_per_minute: number;
  is_active: boolean;
  metadata?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRateCardRequest {
  config_name: string;
  base_fare: number;
  per_km: number;
  per_minute: number;
  minimum_fare: number;
  cancellation_fee: number;
  waiting_time_per_minute: number;
  is_active?: boolean;
  metadata?: Record<string, any> | null;
}

// ====================== PRICING LOGS ======================

export interface PricingLog {
  id: string;
  category: string;
  action: string;
  description: string;
  admin_id: string;
  admin_name: string;
  metadata?: Record<string, any> | null;
  created_at: string;
}

export interface PricingLogListResponse {
  logs: PricingLog[];
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
}

// ====================== COMMISSION SETTINGS ======================

export interface CommissionKPIs {
  platform_commission?: number;
  driver_earnings?: number;
  total_transactions?: number;
}

export interface CommissionConfigResponse {
  platform_commission_percentage: number;
  driver_earnings_percentage: number;
  minimum_commission_amount?: number | null;
  maximum_commission_amount?: number | null;
  is_active: boolean;
  updated_at: string;
  updated_by?: string | null;
}

export interface CommissionConfigUpdate {
  platform_commission_percentage?: number;
  driver_earnings_percentage?: number;
  minimum_commission_amount?: number | null;
  maximum_commission_amount?: number | null;
  is_active?: boolean;
}

// ====================== CANCELLATION POLICY ======================

export interface CancellationKPIs {
  total_cancellations?: number;
  total_fees_collected?: number;
  average_fee?: number;
}

export interface CancellationPolicyItem {
  user_type: string;
  time_before_pickup_minutes: number;
  fee_percentage: number;
  fee_amount?: number | null;
}

export interface CancellationPolicyResponse {
  policies: CancellationPolicyItem[];
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
