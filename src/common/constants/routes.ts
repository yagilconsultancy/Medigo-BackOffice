const API_VERSION = 'v1';

// API Routes Specification
export const ROUTES_SPEC = {
  // Base
  ping: `/${API_VERSION}/ping`,

  // Auth
  register: `/${API_VERSION}/auth/register`,
  verifyOtp: `/${API_VERSION}/auth/verify-otp`,
  login: `/${API_VERSION}/auth/login`,
  adminLogin: `/${API_VERSION}/auth/admin/login`,
  adminRefresh: `/${API_VERSION}/auth/refresh`,
  adminLogout: `/${API_VERSION}/auth/logout`,
  changePassword: `/${API_VERSION}/auth/change-password`,
  resendOtp: `/${API_VERSION}/auth/resend-otp`,
  forgotPassword: `/${API_VERSION}/auth/forgot-password`,
  resetPassword: `/${API_VERSION}/auth/reset-password`,
  verifyDriverInvite: `/${API_VERSION}/auth/driver/verify-invite`,
  registerDriver: `/${API_VERSION}/auth/driver/register`,
  verifyAdminInvite: `/${API_VERSION}/auth/admin/verify-invite`,
  registerAdmin: `/${API_VERSION}/auth/admin/register`,
  listActiveSessions: `/${API_VERSION}/auth/sessions`,
  revokeAllAuthSessions: `/${API_VERSION}/auth/sessions`,
  revokeAuthSession: (sessionId: string) =>
    `/${API_VERSION}/auth/sessions/${sessionId}`,

  // System logs
  getUserProfile: `/${API_VERSION}/users/me`,
  getActivityKPI: `/${API_VERSION}/auth/admin/activity-logs/kpis`,
  getActivityList: `/${API_VERSION}/auth/admin/activity-logs`,
  getExportActivity: `/${API_VERSION}/auth/admin/activity-logs/export`,
  getLoginHistoryKpi: `/${API_VERSION}/auth/admin/login-history/kpis`,
  getLoginHistory: `/${API_VERSION}/auth/admin/login-history`,
  getExportLoginHistory: `/${API_VERSION}/auth/admin/login-history/export`,
  getSecurityKpi: `/${API_VERSION}/auth/admin/security/kpis`,
  SecurityData: `/${API_VERSION}/auth/admin/security/settings`,
  getSecurityData: `/${API_VERSION}/auth/admin/security/settings`,
  updateSecuritySettings: `/${API_VERSION}/auth/admin/security/settings`,
  // Admin Sessions
  getActiveSessions: `/${API_VERSION}/users/admin/sessions`,
  revokeSession: (sessionId: string) =>
    `/${API_VERSION}/users/admin/sessions/${sessionId}`,

  // Admin Invitations
  inviteAdmin: `/${API_VERSION}/users/admin/admins/invite`,
  getAdminInvitations: `/${API_VERSION}/users/admin/admins/invitations`,
  revokeAdminInvitation: (invitationId: string) =>
    `/${API_VERSION}/users/admin/admins/invitations/${invitationId}`,

  // Get all rides with filters (admin dashboard)
  getAllRides: `/${API_VERSION}/rides/admin/rides`,

  // Get pending rides awaiting assignment
  getPendingRides: `/${API_VERSION}/rides/admin/rides/pending`,

  // Admin directly assign driver to a ride
  adminAssignDriver: (rideId: string) =>
    `/${API_VERSION}/rides/admin/rides/${rideId}/assign-driver`,

  // Get all bookings with status, ride type, and search filters
  getAllBookings: `/${API_VERSION}/rides/admin/bookings`,

  // Get pending bookings (awaiting admin approval)
  getPendingBookings: `/${API_VERSION}/rides/admin/bookings/pending`,

  // Get pending bookings KPIs
  getPendingBookingsKpis: `/${API_VERSION}/rides/admin/bookings/pending/kpis`,

  // Get scheduled trips (future/recurring bookings)
  getScheduledTrips: `/${API_VERSION}/rides/admin/bookings/scheduled`,

  // Get scheduled trips KPIs
  getScheduledTripsKpis: `/${API_VERSION}/rides/admin/bookings/scheduled/kpis`,

  // Get cancelled trips
  getCancelledTrips: `/${API_VERSION}/rides/admin/bookings/cancelled`,

  // Get cancelled trips KPIs
  getCancelledTripsKpis: `/${API_VERSION}/rides/admin/bookings/cancelled/kpis`,

  // Get full booking detail (with notes, timeline, fare, etc.)
  getBookingDetail: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}`,

  // Approve a booking (REQUESTED → CONFIRMED)
  approveBooking: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}/approve`,

  // Decline a booking
  declineBooking: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}/decline`,

  // Assign driver to a booking
  assignDriverToBooking: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}/assign-driver`,

  assignCareAssistantToBooking: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}/assign-caregiver`,

  // Reassign driver on an active booking
  reassignDriver: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}/reassign-driver`,

  // Get list of available drivers for assignment
  getAvailableDrivers: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}/available-drivers`,

  // Admin cancel a trip
  adminCancelTrip: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}/cancel`,

  // Get all admin notes for a booking
  getBookingNotes: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}/notes`,

  // Add a new admin note to a booking
  addBookingNote: (rideId: string) =>
    `/${API_VERSION}/rides/admin/bookings/${rideId}/notes`,

  // ====================== ADMIN ANALYTICS ======================

  getDashboardOverview: `/${API_VERSION}/rides/analytics/overview`,

  // Trip volume trend
  getTripVolumeTrend: `/${API_VERSION}/rides/analytics/trip-volume`,

  // Trip status distribution
  getTripStatusDistribution: `/${API_VERSION}/rides/analytics/trip-status`,

  // Top performing drivers
  getTopDrivers: `/${API_VERSION}/rides/analytics/top-drivers`,

  // Recent activity feed
  getRecentActivity: `/${API_VERSION}/rides/analytics/recent-activity`,

  // Transport type distribution
  getTransportDistribution: `/${API_VERSION}/rides/analytics/transport-distribution`,

  // Top fleet partners
  getTopFleetPartners: `/${API_VERSION}/rides/analytics/top-fleet-partners`,

  // Booking channel breakdown
  getBookingChannels: `/${API_VERSION}/rides/analytics/booking-channels`,

  // Service quality metrics
  getServiceQuality: `/${API_VERSION}/rides/analytics/service-quality`,

  // Top facilities
  getTopFacilities: `/${API_VERSION}/rides/analytics/top-facilities`,

  // ====================== ADMIN INCIDENTS ======================

  // Incident KPIs
  getIncidentKpis: `/${API_VERSION}/rides/admin/incidents/kpis`,

  // List all incidents
  listIncidents: `/${API_VERSION}/rides/admin/incidents`,

  // Create a new incident
  createIncident: `/${API_VERSION}/rides/admin/incidents`,

  // Get incident detail
  getIncidentDetail: (incidentId: string) =>
    `/${API_VERSION}/rides/admin/incidents/${incidentId}`,

  // Update incident status
  updateIncidentStatus: (incidentId: string) =>
    `/${API_VERSION}/rides/admin/incidents/${incidentId}/status`,

  // Get incident notes
  getIncidentNotes: (incidentId: string) =>
    `/${API_VERSION}/rides/admin/incidents/${incidentId}/notes`,

  // Add note to incident
  addIncidentNote: (incidentId: string) =>
    `/${API_VERSION}/rides/admin/incidents/${incidentId}/notes`,

  // Alert KPIs
  getAlertKpis: `/${API_VERSION}/rides/admin/alerts/kpis`,

  // Get alert feed
  getAlertFeed: `/${API_VERSION}/rides/admin/alerts/feed`,

  // Get single alert detail
  getAlertDetail: (alertId: string) =>
    `/${API_VERSION}/rides/admin/alerts/${alertId}`,

  // Acknowledge an alert
  acknowledgeAlert: (alertId: string) =>
    `/${API_VERSION}/rides/admin/alerts/${alertId}/acknowledge`,

  // Resolve an alert
  resolveAlert: (alertId: string) =>
    `/${API_VERSION}/rides/admin/alerts/${alertId}/resolve`,

  // Investigation KPIs
  getInvestigationKpis: `/${API_VERSION}/rides/admin/investigations/kpis`,

  // List investigations
  listInvestigations: `/${API_VERSION}/rides/admin/investigations`,

  // Get investigation detail
  getInvestigationDetail: (invId: string) =>
    `/${API_VERSION}/rides/admin/investigations/${invId}`,

  // Assign investigator
  assignInvestigator: (invId: string) =>
    `/${API_VERSION}/rides/admin/investigations/${invId}/assign`,

  // Update investigation status
  updateInvestigationStatus: (invId: string) =>
    `/${API_VERSION}/rides/admin/investigations/${invId}/status`,

  // Update investigation progress
  updateInvestigationProgress: (invId: string) =>
    `/${API_VERSION}/rides/admin/investigations/${invId}/progress`,

  // Close investigation
  closeInvestigation: (invId: string) =>
    `/${API_VERSION}/rides/admin/investigations/${invId}/close`,

  // Get investigation notes
  getInvestigationNotes: (invId: string) =>
    `/${API_VERSION}/rides/admin/investigations/${invId}/notes`,

  // Add investigation note
  addInvestigationNote: (invId: string) =>
    `/${API_VERSION}/rides/admin/investigations/${invId}/notes`,

  // Disciplinary KPIs
  getDisciplinaryKpis: `/${API_VERSION}/rides/admin/disciplinary/kpis`,

  // List disciplinary actions
  listDisciplinaryActions: `/${API_VERSION}/rides/admin/disciplinary`,

  // Create disciplinary action
  createDisciplinaryAction: `/${API_VERSION}/rides/admin/disciplinary`,

  // Get disciplinary detail
  getDisciplinaryDetail: (actionId: string) =>
    `/${API_VERSION}/rides/admin/disciplinary/${actionId}`,

  // Get disciplinary reason
  getDisciplinaryReason: (actionId: string) =>
    `/${API_VERSION}/rides/admin/disciplinary/${actionId}/reason`,

  // Reinstate disciplinary action
  reinstateDisciplinaryAction: (actionId: string) =>
    `/${API_VERSION}/rides/admin/disciplinary/${actionId}/reinstate`,

  // Toggle collapse disciplinary
  toggleCollapseDisciplinary: (actionId: string) =>
    `/${API_VERSION}/rides/admin/disciplinary/${actionId}/collapse`,

  // Dispatch Center
  getDispatchDashboard: `/${API_VERSION}/rides/admin/admin/dispatch/dashboard`,
  getUnassignedRides: `/${API_VERSION}/rides/admin/admin/dispatch/unassigned-rides`,
  getAvailableDispatchDrivers: `/${API_VERSION}/rides/admin/admin/dispatch/available-drivers`,
  manuallyAssignDriver: (rideId: string) =>
    `/${API_VERSION}/rides/admin/admin/dispatch/rides/${rideId}/assign`,
  getDispatchSettings: `/${API_VERSION}/rides/admin/admin/dispatch/settings`,
  updateDispatchSettings: `/${API_VERSION}/rides/admin/admin/dispatch/settings`,
  triggerAutoDispatch: `/${API_VERSION}/rides/admin/admin/dispatch/auto-assign`,

  // Fleet Application
  getFleetApplicationsKpi: `/${API_VERSION}/users/admin/fleet/applications/kpis`,
  fleetApplications: `/${API_VERSION}/users/admin/fleet/applications`,
  getFleetApplicationId: (appId: string) =>
    `/${API_VERSION}/users/admin/fleet/applications/${appId}`,
  approveFleetApplication: (appId: string) =>
    `/${API_VERSION}/users/admin/fleet/applications/${appId}/approve`,
  rejectFleetApplication: (appId: string) =>
    `/${API_VERSION}/users/admin/fleet/applications/${appId}/reject`,
  requestInfoFleetApplication: (appId: string) =>
    `/${API_VERSION}/users/admin/fleet/applications/${appId}/request-info`,
  uploadDocumentFleetApplication: (appId: string) =>
    `/${API_VERSION}/users/admin/fleet/applications/${appId}/`,

  // Fleet Companies
  getFleetCompaniesKpi: `/${API_VERSION}/users/admin/fleet/companies/kpis`,
  fleetCompanies: `/${API_VERSION}/users/admin/fleet/companies`,
  getAllFleetCompanies: `/${API_VERSION}/users/admin/fleet/companies/all`,
  fleetCompanyDetail: (businessId: string) =>
    `/${API_VERSION}/users/admin/fleet/companies/${businessId}`,
  fleetCompanyStatus: (businessId: string) =>
    `/${API_VERSION}/users/admin/fleet/companies/${businessId}/status`,
  fleetCompanyDocuments: (businessId: string) =>
    `/${API_VERSION}/users/admin/fleet/companies/${businessId}/documents`,
  fleetCompanyDrivers: (businessId: string) =>
    `/${API_VERSION}/users/admin/fleet/companies/${businessId}/drivers`,

  // Fleet Vehicles
  getFleetVehicleKpi: `/${API_VERSION}/users/admin/fleet/vehicles/kpis`,
  getFleetVehicle: `/${API_VERSION}/users/admin/fleet/vehicles/documents/overview`,
  getFleetCategories: `/${API_VERSION}/users/admin/fleet/vehicles/categories`,
  getFleetCompisition: `/${API_VERSION}/users/admin/fleet/vehicles/categories/composition`,
  getFleetProfiles: `/${API_VERSION}/users/admin/fleet/vehicles/profiles`,
  fleetVehicles: `/${API_VERSION}/users/admin/fleet/vehicles`,
  fleetVehicleByCategory: (categoryId: string) =>
    `/${API_VERSION}/users/admin/fleet/vehicles/categories/${categoryId}`,
  fleetVehiclesId: (vehicleId: string) =>
    `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}`,
  fleetVehicleStatus: (vehicleId: string) =>
    `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/status`,
  fleetVehicleAssignDriver: (vehicleId: string) =>
    `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/assign-driver`,
  fleetVehicleUnAssignDriver: (vehicleId: string) =>
    `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/unassign-driver`,
  getFleetVehicleDocuments: (vehicleId: string) =>
    `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/document`,
  fleetVehicleMaintenance: (vehicleId: string) =>
    `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/maintenance`,
  fleetReplaceVehicleDocuments: (vehicleId: string, docId: string) =>
    `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/document/${docId}/replace`,

  // Fleet Earnings
  getFleetEarningsKpi: `/${API_VERSION}/users/admin/fleet/earnings/kpis`,
  getFleetEarningsTrend: `/${API_VERSION}/users/admin/fleet/earnings/trend`,
  getFleetEarningsBreakdown: `/${API_VERSION}/users/admin/fleet/earnings/breakdown`,

  // Driver Management
  getDriverDocumentOverview: `/${API_VERSION}/users/admin/drivers/documents/overview`,
  getDriverStatusOverview: `/${API_VERSION}/users/admin/drivers/status/overview`,
  searchDrivers: `/${API_VERSION}/users/admin/drivers`,
  driverDetail: (driverId: string) =>
    `/${API_VERSION}/users/admin/drivers/${driverId}`,
  approveDriver: (driverId: string) =>
    `/${API_VERSION}/users/admin/drivers/${driverId}/approve`,
  suspendDriver: (driverId: string) =>
    `/${API_VERSION}/users/admin/drivers/${driverId}/suspend`,
  reactivateDriver: (driverId: string) =>
    `/${API_VERSION}/users/admin/drivers/${driverId}/reactivate`,
  resendDriverInvite: (driverId: string) =>
    `/${API_VERSION}/users/admin/drivers/${driverId}/resend-invite`,
  reAssignDriver: (driverId: string) =>
    `/${API_VERSION}/users/admin/drivers/${driverId}/reassign-fleet`,
  getDriverDocuments: (driverId: string) =>
    `/${API_VERSION}/users/admin/drivers/${driverId}/documents`,
  getDriverTrips: (driverId: string) =>
    `/${API_VERSION}/users/admin/drivers/${driverId}/trips`,
  getDriverRatings: (driverId: string) =>
    `/${API_VERSION}/users/admin/drivers/${driverId}/ratings`,

  // Rider Management
  getRidersProfiles: `/${API_VERSION}/users/admin/riders/profiles`,
  getRidersActivity: `/${API_VERSION}/users/admin/riders/activity`,
  ridersIssues: `/${API_VERSION}/users/admin/riders/issues`,
  ridersIssuesDetail: (issueId: string) =>
    `/${API_VERSION}/users/admin/riders/issues/${issueId}`,
  ridersIssuesStatus: (issueId: string) =>
    `/${API_VERSION}/users/admin/riders/issues/${issueId}/status`,
  ridersIssuesNotes: (issueId: string) =>
    `/${API_VERSION}/users/admin/riders/issues/${issueId}/notes`,
  searchRiders: `/${API_VERSION}/users/admin/riders`,
  riderDetail: (riderId: string) =>
    `/${API_VERSION}/users/admin/riders/${riderId}`,
  suspendRider: (riderId: string) =>
    `/${API_VERSION}/users/admin/riders/${riderId}/suspend`,
  reinstateRider: (riderId: string) =>
    `/${API_VERSION}/users/admin/riders/${riderId}/reinstate`,
  riderRides: (riderId: string) =>
    `/${API_VERSION}/users/admin/riders/${riderId}/rides`,

  // Admin Broadcasts
  getSystemKpis: `/${API_VERSION}/notifications/admin/broadcasts/system/kpis`,
  listSystemBroadcasts: `/${API_VERSION}/notifications/admin/broadcasts/system`,
  sendSystemBroadcast: `/${API_VERSION}/notifications/admin/broadcasts/system/send`,

  getRiderKpis: `/${API_VERSION}/notifications/admin/broadcasts/riders/kpis`,
  listRiderBroadcasts: `/${API_VERSION}/notifications/admin/broadcasts/riders`,
  sendRiderBroadcast: `/${API_VERSION}/notifications/admin/broadcasts/riders/send`,

  getDriverKpis: `/${API_VERSION}/notifications/admin/broadcasts/drivers/kpis`,
  listDriverBroadcasts: `/${API_VERSION}/notifications/admin/broadcasts/drivers`,
  sendDriverBroadcast: `/${API_VERSION}/notifications/admin/broadcasts/drivers/send`,

  getFleetKpis: `/${API_VERSION}/notifications/admin/broadcasts/fleets/kpis`,
  listFleetBroadcasts: `/${API_VERSION}/notifications/admin/broadcasts/fleets`,
  sendFleetBroadcast: `/${API_VERSION}/notifications/admin/broadcasts/fleets/send`,

  // Admin Support Center
  getSupportKpis: `/${API_VERSION}/notifications/admin/support/kpis`,
  listSupportTickets: `/${API_VERSION}/notifications/admin/support/tickets`,
  reopenTicket: (ticketId: string) =>
    `/${API_VERSION}/notifications/admin/support/tickets/${ticketId}/open`,
  resolveTicket: (ticketId: string) =>
    `/${API_VERSION}/notifications/admin/support/tickets/${ticketId}/resolve`,

  // Admin Contact Logs
  getContactKpis: `/${API_VERSION}/notifications/admin/contact-logs/kpis`,
  listContactLogs: `/${API_VERSION}/notifications/admin/contact-logs`,
  createContactLog: `/${API_VERSION}/notifications/admin/contact-logs`,

  // Admin Transactions
  getTransactionKpis: `/${API_VERSION}/payments/admin/transactions/kpis`,
  getPaymentMethodBreakdown: `/${API_VERSION}/payments/admin/transactions/payment-method-breakdown`,
  getAllTransactions: `/${API_VERSION}/payments/admin/transactions`,
  getTransactionDetail: (transactionId: string) =>
    `/${API_VERSION}/payments/admin/transactions/${transactionId}`,

  // Admin Revenue
  getRevenueKpis: `/${API_VERSION}/payments/admin/revenue/kpis`,
  getRevenueTrend: `/${API_VERSION}/payments/admin/revenue/trend`,
  getRevenueByRideType: `/${API_VERSION}/payments/admin/revenue/by-ride-type`,
  getRevenueByCity: `/${API_VERSION}/payments/admin/revenue/by-city`,
  getRevenueDistribution: `/${API_VERSION}/payments/admin/revenue/distribution`,

  // Admin Payouts
  getPayoutKpis: `/${API_VERSION}/payments/admin/payouts/kpis`,
  getPayoutSchedule: `/${API_VERSION}/payments/admin/payouts/schedule`,
  getEarningsBreakdown: `/${API_VERSION}/payments/admin/payouts/earnings-breakdown`,
  getMonthlyDistribution: `/${API_VERSION}/payments/admin/payouts/monthly-distribution`,
  getPayoutsBySpecialty: `/${API_VERSION}/payments/admin/payouts/by-specialty`,
  getDriverEarningsList: `/${API_VERSION}/payments/admin/payouts/drivers`,
  getPayoutDetail: (driverId: string) =>
    `/${API_VERSION}/payments/admin/payouts/drivers/${driverId}`,
  processPayout: (driverId: string) =>
    `/${API_VERSION}/payments/admin/payouts/drivers/${driverId}/pay`,

  // Admin Refunds
  getRefundKpis: `/${API_VERSION}/payments/admin/refunds/kpis`,
  getRefundRequests: `/${API_VERSION}/payments/admin/refunds`,
  createRefundRequest: `/${API_VERSION}/payments/admin/refunds`,
  getRefundDetail: (refundId: string) =>
    `/${API_VERSION}/payments/admin/refunds/${refundId}`,
  approveRefund: (refundId: string) =>
    `/${API_VERSION}/payments/admin/refunds/${refundId}/approve`,
  rejectRefund: (refundId: string) =>
    `/${API_VERSION}/payments/admin/refunds/${refundId}/reject`,

  // Admin Ride Types
  getRideTypeKpis: `/${API_VERSION}/payments/admin/ride-types/kpis`,
  listRideTypes: `/${API_VERSION}/payments/admin/ride-types`,
  createRideType: `/${API_VERSION}/payments/admin/ride-types`,
  getRideType: (rideTypeId: string) =>
    `/${API_VERSION}/payments/admin/ride-types/${rideTypeId}`,
  updateRideType: (rideTypeId: string) =>
    `/${API_VERSION}/payments/admin/ride-types/${rideTypeId}`,
  toggleRideType: (rideTypeId: string) =>
    `/${API_VERSION}/payments/admin/ride-types/${rideTypeId}/toggle`,
  deleteRideType: (rideTypeId: string) =>
    `/${API_VERSION}/payments/admin/ride-types/${rideTypeId}`,

  // ====================== PAYMENTS PRICING ======================

  // Pricing Dashboard
  getPricingDashboardKpis: `/${API_VERSION}/payments/pricing/dashboard/kpis`,
  getRouteComparison: `/${API_VERSION}/payments/pricing/dashboard/route-comparison`,
  getRecentPricingChanges: `/${API_VERSION}/payments/pricing/dashboard/recent-changes`,
  getPricingHealth: `/${API_VERSION}/payments/pricing/dashboard/health`,

  // Fare Configuration
  listServiceTypes: `/${API_VERSION}/payments/pricing/fare-config/service-types`,
  getServiceTypeConfig: (serviceType: string) =>
    `/${API_VERSION}/payments/pricing/fare-config/${serviceType}`,
  updateServiceTypeConfig: (serviceType: string) =>
    `/${API_VERSION}/payments/pricing/fare-config/${serviceType}`,
  getRoutePricing: (serviceType: string) =>
    `/${API_VERSION}/payments/pricing/fare-config/${serviceType}/routes`,
  updateRoutePricing: (serviceType: string) =>
    `/${API_VERSION}/payments/pricing/fare-config/${serviceType}/routes`,
  getCommissionView: (serviceType: string) =>
    `/${API_VERSION}/payments/pricing/fare-config/${serviceType}/commission`,

  // Surcharges
  getSurchargeKpis: `/${API_VERSION}/payments/pricing/surcharges/kpis`,
  listSurchargeRules: `/${API_VERSION}/payments/pricing/surcharges`,
  createSurchargeRule: `/${API_VERSION}/payments/pricing/surcharges`,
  updateSurchargeRule: (ruleId: string) =>
    `/${API_VERSION}/payments/pricing/surcharges/${ruleId}`,
  deleteSurchargeRule: (ruleId: string) =>
    `/${API_VERSION}/payments/pricing/surcharges/${ruleId}`,

  // Ride Packages
  getPackageKpis: `/${API_VERSION}/payments/pricing/packages/kpis`,
  listPackages: `/${API_VERSION}/payments/pricing/packages`,
  createPackage: `/${API_VERSION}/payments/pricing/packages`,
  getPackage: (packageId: string) =>
    `/${API_VERSION}/payments/pricing/packages/${packageId}`,
  updatePackage: (packageId: string) =>
    `/${API_VERSION}/payments/pricing/packages/${packageId}`,
  togglePackage: (packageId: string) =>
    `/${API_VERSION}/payments/pricing/packages/${packageId}/toggle`,

  // Pricing Configuration
  getConfigKpis: `/${API_VERSION}/payments/pricing/configuration/kpis`,
  getCurrentConfig: `/${API_VERSION}/payments/pricing/configuration`,
  saveConfiguration: `/${API_VERSION}/payments/pricing/configuration`,

  // Pricing Logs
  listPricingLogs: `/${API_VERSION}/payments/pricing/logs`,
  exportPricingLogs: `/${API_VERSION}/payments/pricing/logs/export`,

  // Commission Settings
  getCommissionKpis: `/${API_VERSION}/payments/pricing/commission/kpis`,
  getCommissionConfig: `/${API_VERSION}/payments/pricing/commission`,
  updateCommissionConfig: `/${API_VERSION}/payments/pricing/commission`,

  // Cancellation Policy
  getCancellationKpis: `/${API_VERSION}/payments/pricing/cancellation/kpis`,
  getCancellationPolicies: `/${API_VERSION}/payments/pricing/cancellation`,
  updateCancellationPolicies: `/${API_VERSION}/payments/pricing/cancellation`,

  // ====================== LOCATIONS - CITIES & SERVICE AREAS ======================

  // City KPIs
  getCityKpis: `/${API_VERSION}/locations/admin/cities/kpis`,

  // Cities Management
  listCities: `/${API_VERSION}/locations/admin/cities`,
  createCity: `/${API_VERSION}/locations/admin/cities`,
  getCity: (cityId: string) =>
    `/${API_VERSION}/locations/admin/cities/${cityId}`,
  updateCity: (cityId: string) =>
    `/${API_VERSION}/locations/admin/cities/${cityId}`,
  deleteCity: (cityId: string) =>
    `/${API_VERSION}/locations/admin/cities/${cityId}`,
  toggleCity: (cityId: string) =>
    `/${API_VERSION}/locations/admin/cities/${cityId}/toggle`,

  // ====================== ROLES & PERMISSIONS ======================

  // Admin Roles
  listAdminRoles: `/${API_VERSION}/users/admin/roles`,
  createAdminRole: `/${API_VERSION}/users/admin/roles`,
  getAdminRoleDetail: (roleId: string) =>
    `/${API_VERSION}/users/admin/roles/${roleId}`,
  updateAdminRole: (roleId: string) =>
    `/${API_VERSION}/users/admin/roles/${roleId}`,
  deleteAdminRole: (roleId: string) =>
    `/${API_VERSION}/users/admin/roles/${roleId}`,
  assignRole: `/${API_VERSION}/users/admin/roles/assign`,
  removeRole: `/${API_VERSION}/users/admin/roles/remove`,

  // Permissions
  getPermissionMatrix: `/${API_VERSION}/users/admin/permissions/matrix`,
  savePermissions: `/${API_VERSION}/users/admin/permissions/save`,
  getMyPermissions: `/${API_VERSION}/users/admin/me/permissions`,

  // ====================== CAREGIVERS ======================

  // Caregiver KPIs
  getCaregiverKpis: `/${API_VERSION}/users/admin/caregivers/kpis`,

  // Caregiver Profiles
  listCaregiverProfiles: `/${API_VERSION}/users/admin/caregivers/profiles`,

  // Caregivers Management
  listCaregivers: `/${API_VERSION}/users/admin/caregivers`,
  createCaregiver: `/${API_VERSION}/users/admin/caregivers`,
  getCaregiverDetail: (caregiverId: string) =>
    `/${API_VERSION}/users/admin/caregivers/${caregiverId}`,
  updateCaregiver: (caregiverId: string) =>
    `/${API_VERSION}/users/admin/caregivers/${caregiverId}`,

  // ====================== TRACKING ======================

  // Admin Tracking
  getActiveTripKpis: `/${API_VERSION}/tracking/admin/kpis`,
  getActiveTrips: `/${API_VERSION}/tracking/admin/trips`,
  getTripDetail: (rideId: string) =>
    `/${API_VERSION}/tracking/admin/trips/${rideId}`,
  getLiveDrivers: `/${API_VERSION}/tracking/admin/live-drivers`,

  // ============= DISPUTE RESOLUTION =============

  // Dispute KPIs
  getDisputeKpis: `/${API_VERSION}/payments/admin/disputes/kpis`,
  listDisputes: `/${API_VERSION}/payments/admin/disputes`,
  getDisputeDetail: (disputeId: string) =>
    `/${API_VERSION}/payments/admin/disputes/${disputeId}`,
  approveDispute: (disputeId: string) =>
    `/${API_VERSION}/payments/admin/disputes/${disputeId}/approve`,
  rejectDispute: (disputeId: string) =>
    `/${API_VERSION}/payments/admin/disputes/${disputeId}/reject`,
} as const;

export const ROUTES = Object.fromEntries(
  Object.keys(ROUTES_SPEC).map((key) => [key, key])
) as {
  [K in keyof typeof ROUTES_SPEC]: K;
};

type DynamicRoute<T extends any[] = string[]> = (...args: T) => string;
type RouteValueParameters<T> = T extends DynamicRoute<infer P> ? P : [];

/**
 * Resolves a route key to a URL string.
 * If the route is a string, returns it directly.
 * If the route is a function, calls it with the given arguments.
 *
 * @param key - The key of the route to resolve
 * @param args - Parameters required if the route is a function
 * @returns The fully resolved URL string
 *
 * @example
 * // Static route
 * resolveRoute('ping') // Returns: '/v1/ping'
 *
 * @example
 * // Dynamic route
 * resolveRoute('getUserProfileInfo', '123') // Returns: '/v1/user/123/fetch-info'
 */
export function resolveRoute<K extends keyof typeof ROUTES_SPEC>(
  key: K,
  ...args: RouteValueParameters<(typeof ROUTES_SPEC)[K]>
): string {
  const route = ROUTES_SPEC[key];

  if (typeof route === 'string') {
    return route;
  }

  // @ts-ignore
  return route(...args);
}
