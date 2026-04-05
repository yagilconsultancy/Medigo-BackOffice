const API_VERSION = 'v1';

// API Routes Specification
export const ROUTES_SPEC = {
  // Base
  ping: `/${API_VERSION}/ping`,

  // System logs
  adminLogin: `/${API_VERSION}/auth/admin/login`,
  getActivityKPI: `/${API_VERSION}/auth/admin/activity-logs/kpis`,
  getActivityList: `/${API_VERSION}/auth/admin/activity-logs`,
  getExportActivity: `/${API_VERSION}/auth/admin/activity-logs/export`,
  getLoginHistoryKpi: `/${API_VERSION}/auth/admin/login-history/kpis`,
  getLoginHistory: `/${API_VERSION}/auth/admin/login-history`,
  getExportLoginHistory: `/${API_VERSION}/auth/admin/login-history/export`,
  getSecurityKpi: `/${API_VERSION}/auth/admin/security/kpis`,
  SecurityData: `/${API_VERSION}/auth/admin/security/settings`,
  getSecurityData: `/${API_VERSION}/auth/admin/security/settings`,
  // Admin Sessions
  getActiveSessions: `/${API_VERSION}/users/admin/sessions`,
  revokeSession: (sessionId: string) =>
    `/${API_VERSION}/users/admin/sessions/${sessionId}`,

  // ====================== ADMIN RIDES ======================

  // Get all rides with filters (admin dashboard)
  getAllRides: `/${API_VERSION}/rides/admin/rides`,

  // Get pending rides awaiting assignment
  getPendingRides: `/${API_VERSION}/rides/admin/rides/pending`,

  // Admin directly assign driver to a ride
  adminAssignDriver: (rideId: string) =>
    `/${API_VERSION}/rides/admin/rides/${rideId}/assign-driver`,

  // ====================== ADMIN BOOKING MANAGEMENT ======================

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
    `/${API_VERSION}/users/admin/riders/${riderId}/riders`,
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
