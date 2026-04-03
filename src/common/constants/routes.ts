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
  getExportLoginHistory: `/${API_VERSION}/auth/admin/login-history/export`,
  getSecurityKpi: `/${API_VERSION}/auth/admin/security/kpis`,
  SecurityData: `/${API_VERSION}/auth/admin/security/settings`,
  getSecurityData: `/${API_VERSION}/auth/admin/security/settings`,

  // Fleet Application
  getFleetApplicationsKpi: `/${API_VERSION}/users/admin/fleet/applications/kpis`,
  fleetApplications: `/${API_VERSION}/users/admin/fleet/applications`,
  getFleetApplicationId: (fleetId: string) => `/${API_VERSION}/users/admin/fleet/applications/${fleetId}`,
  approveFleetApplication: (fleetId: string) => `/${API_VERSION}/users/admin/fleet/applications/${fleetId}/approve`,
  rejectFleetApplication: (fleetId: string) => `/${API_VERSION}/users/admin/fleet/applications/${fleetId}/reject`,
  requestInfoFleetApplication: (fleetId: string) => `/${API_VERSION}/users/admin/fleet/applications/${fleetId}/request-info`,
  uploadDocumentFleetApplication: (fleetId: string) => `/${API_VERSION}/users/admin/fleet/applications/${fleetId}/`,

  // Fleet Companies
  getFleetCompaniesKpi: `/${API_VERSION}/users/admin/fleet/companies/kpis`,
  fleetCompanies: `/${API_VERSION}/users/admin/fleet/companies`,
  fleetCompanyDetail: (businessId: string) => `/${API_VERSION}/users/admin/fleet/companies/${businessId}`,
  fleetCompanyStatus: (businessId: string) => `/${API_VERSION}/users/admin/fleet/companies/${businessId}/status`,
  fleetCompanyDocuments: (businessId: string) => `/${API_VERSION}/users/admin/fleet/companies/${businessId}/documents`,
  fleetCompanyDrivers: (businessId: string) => `/${API_VERSION}/users/admin/fleet/companies/${businessId}/drivers`,

  // Fleet companies
  getFleetVehicleKpi: `/${API_VERSION}/users/admin/fleet/vehicles/kpis`,
  getFleetVehicle: `/${API_VERSION}/users/admin/fleet/vehicles/documents/overview`,
  getFleetCategories: `/${API_VERSION}/users/admin/fleet/vehicles/categories`,
  getFleetCompisition: `/${API_VERSION}/users/admin/fleet/vehicles/categories/composition`,
  getFleetProfiles: `/${API_VERSION}/users/admin/fleet/vehicles/profiles`,
  fleetVehicles: `/${API_VERSION}/users/admin/fleet/vehicles`,
  fleetVehicleByCategory: (categoryId: string) => `/${API_VERSION}/users/admin/fleet/vehicles/categories/${categoryId}`,
  fleetVehiclesId: (vehicleId: string) => `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}`,
  fleetVehicleStatus: (vehicleId: string) => `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/status`,
  fleetVehicleAssignDriver: (vehicleId: string) => `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/assign-driver`,
  fleetVehicleUnAssignDriver: (vehicleId: string) => `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/unassign-driver`,
  getFleetVehicleDocuments: (vehicleId: string) => `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/document`,
  fleetVehicleMaintenance: (vehicleId: string) => `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/maintenance`,
  fleetReplaceVehicleDocuments: (vehicleId: string, docId: string) => `/${API_VERSION}/users/admin/fleet/vehicles/${vehicleId}/document/${docId}/replace`,

  // Fleet Earnings
  getFleetEarningsKpi: `/${API_VERSION}/users/admin/fleet/earnings/kpis`,
  getFleetEarningsTrend: `/${API_VERSION}/users/admin/fleet/earnings/trend`,
  getFleetEarningsBreakdown: `/${API_VERSION}/users/admin/fleet/earnings/breakdown`,

  // Driver Management
  getDriverDocumentOverview: `/${API_VERSION}/users/admin/drivers/documents/overview`,
  getDriverStatusOverview: `/${API_VERSION}/users/admin/drivers/status/overview`,
  searchDrivers: `/${API_VERSION}/users/admin/drivers`,
  driverDetail: (driverId: string) => `/${API_VERSION}/users/admin/drivers/${driverId}`,
  approveDriver: (driverId: string) => `/${API_VERSION}/users/admin/drivers/${driverId}/approve`,
  suspendDriver: (driverId: string) => `/${API_VERSION}/users/admin/drivers/${driverId}/suspend`,
  reactivateDriver: (driverId: string) => `/${API_VERSION}/users/admin/drivers/${driverId}/reactivate`,
  resendDriverInvite: (driverId: string) => `/${API_VERSION}/users/admin/drivers/${driverId}/resend-invite`,
  reAssignDriver: (driverId: string) => `/${API_VERSION}/users/admin/drivers/${driverId}/reassign-fleet`,
  getDriverDocuments: (driverId: string) => `/${API_VERSION}/users/admin/drivers/${driverId}/documents`,
  getDriverTrips: (driverId: string) => `/${API_VERSION}/users/admin/drivers/${driverId}/trips`,
  getDriverRatings: (driverId: string) => `/${API_VERSION}/users/admin/drivers/${driverId}/ratings`,

  // Rider Management
  getRidersProfiles: `/${API_VERSION}/users/admin/riders/profiles`,
  getRidersActivity: `/${API_VERSION}/users/admin/riders/activity`,
  ridersIssues: `/${API_VERSION}/users/admin/riders/issues`,
  ridersIssuesDetail: (issueId: string) => `/${API_VERSION}/users/admin/riders/issues/${issueId}`,
  ridersIssuesStatus: (issueId: string) => `/${API_VERSION}/users/admin/riders/issues/${issueId}/status`,
  ridersIssuesNotes: (issueId: string) => `/${API_VERSION}/users/admin/riders/issues/${issueId}/notes`,
  searchRiders: `/${API_VERSION}/users/admin/riders`,
  riderDetail: (riderId: string) => `/${API_VERSION}/users/admin/riders/${riderId}`,
  suspendRider: (riderId: string) => `/${API_VERSION}/users/admin/riders/${riderId}/suspend`,
  reinstateRider: (riderId: string) => `/${API_VERSION}/users/admin/riders/${riderId}/riders`,
  riderRides: (riderId: string) => `/${API_VERSION}/users/admin/riders/${riderId}/rides`,

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
  reopenTicket: (ticketId: string) => `/${API_VERSION}/notifications/admin/support/tickets/${ticketId}/open`,
  resolveTicket: (ticketId: string) => `/${API_VERSION}/notifications/admin/support/tickets/${ticketId}/resolve`,

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
