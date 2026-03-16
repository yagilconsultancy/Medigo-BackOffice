const API_VERSION = 'v1';

// API Routes Specification
export const ROUTES_SPEC = {
  // Base
  ping: `/${API_VERSION}/ping`,

  // User Routes
  fetchUserProfileInfo: (userId: string) =>
    `/${API_VERSION}/user/${userId}/fetch-info`,
  getUserProfile: `/${API_VERSION}/user/profile`,
  updateUserProfile: `/${API_VERSION}/user/profile`,
  changeUserPassword: `/${API_VERSION}/user/profile/password`,
  toggleUserNotification: (type: string) =>
    `/${API_VERSION}/user/profile/notification/${type}`,

  toggleUserAvailability: `/${API_VERSION}/user/toggle-availability`,

  // Driver & Movers Bank Account
  setupUserBankAccount: `/${API_VERSION}/user/bank-account`,
  getUserBankAccounts: `/${API_VERSION}/user/bank-account`,
  updateUserPayoutFrequency: `/${API_VERSION}/user/bank-account/payout-frequency`,
  getStripeAccountLink: `/${API_VERSION}/user/bank-account/link`,
  refreshStripeAccountLink: `/${API_VERSION}/user/bank-account/link/refresh`,

  // Driver Routes
  verifyDriver: `/${API_VERSION}/driver/verification`,
  setupDriverProfile: `/${API_VERSION}/driver/setup-profile`,
  updateDriverHelperStatus: `/${API_VERSION}/driver/update-helper-status`,
  updateDriverLocation: `/${API_VERSION}/driver/location`,

  getAvailableDriverVehicles: `/${API_VERSION}/driver/available-vehicles`,
  getDriverLocation: (driverId: string) =>
    `/${API_VERSION}/driver/${driverId}/location`,

  // Driver Jobs
  searchDriverBookings: `/${API_VERSION}/driver/booking/search`,
  acceptDriverJob: (bookingId: string) =>
    `/${API_VERSION}/driver/booking/${bookingId}/accept`,
  uploadDriverDeliveryProof: (bookingId: string) =>
    `/${API_VERSION}/driver/booking/${bookingId}/delivery/proof`,
  completeDriverJob: (bookingId: string) =>
    `/${API_VERSION}/driver/booking/${bookingId}/complete`,
  getDriverDeliveryStatus: (bookingId: string) =>
    `/${API_VERSION}/driver/booking/${bookingId}/delivery-status`,
  updateDriverDeliveryStatus: (bookingId: string) =>
    `/${API_VERSION}/driver/booking/${bookingId}/delivery-status`,
  signDriverBookingBOL: (bookingId: string) =>
    `/${API_VERSION}/driver/booking/${bookingId}/sign-bol`,

  // Driver Earnings
  getDriverEarningsSummary: `/${API_VERSION}/driver/earnings/summary`,
  getDriverEarningsTransactions: `/${API_VERSION}/driver/earnings/transactions`,
  withdrawDriverEarnings: `/${API_VERSION}/driver/earnings/withdraw`,

  // Mover Routes
  verifyMover: `/${API_VERSION}/mover/verification`,
  setupMoverProfile: `/${API_VERSION}/mover/setup-profile`,

  // Mover Jobs
  searchMoverBookings: `/${API_VERSION}/mover/booking/search`,
  acceptMoverJob: (bookingId: string) =>
    `/${API_VERSION}/mover/booking/${bookingId}/accept`,
  uploadMoverDeliveryProof: (bookingId: string) =>
    `/${API_VERSION}/mover/booking/${bookingId}/delivery/proof`,
  completeMoverJob: (bookingId: string) =>
    `/${API_VERSION}/mover/booking/${bookingId}/complete`,
  getMoverDeliveryStatus: (bookingId: string) =>
    `/${API_VERSION}/mover/booking/${bookingId}/delivery-status`,
  updateMoverDeliveryStatus: (bookingId: string) =>
    `/${API_VERSION}/mover/booking/${bookingId}/delivery-status`,

  // Mover Earnings
  getMoverEarningsSummary: `/${API_VERSION}/mover/earnings/summary`,
  getMoverEarningsTransactions: `/${API_VERSION}/mover/earnings/transactions`,
  withdrawMoverEarnings: `/${API_VERSION}/mover/earnings/withdraw`,

  // Bookings
  calculateRoutes: `/${API_VERSION}/booking/routes/calculate`,
  createBooking: `/${API_VERSION}/booking`,
  getBookingStatus: (bookingId: string) =>
    `/${API_VERSION}/booking/${bookingId}/status`,
  checkoutBooking: `/${API_VERSION}/booking/checkout`,
  calculateBookingHelpers: `/${API_VERSION}/booking/helpers/calculate`,
  refreshCheckoutSession: `/${API_VERSION}/booking/checkout/refresh`,

  // Pricing
  estimateOnDemand: `/${API_VERSION}/pricing/estimate/on-demand`,
  estimatePersonalDelivery: `/${API_VERSION}/pricing/estimate/personal-delivery`,
  estimateCommercialDelivery: `/${API_VERSION}/pricing/estimate/commercial-delivery`,
  estimateMovingAssistance: `/${API_VERSION}/pricing/estimate/moving-assistance`,
  getMoverHourlyRates: `/${API_VERSION}/pricing/rates/mover-hourly`,
  getPricingCatalogItems: `/${API_VERSION}/pricing/catalog/items`,
  addPricingCatalogItem: `/${API_VERSION}/pricing/catalog/items/add`,

  // Notification
  registerNotificationToken: `/${API_VERSION}/notification/token/register`,
  unregisterNotificationToken: `/${API_VERSION}/notification/token/unregister`,
  unregisterAllNotificationTokens: `/${API_VERSION}/notification/token/unregister/all`,

  // Driver Notification
  getDriverNotifications: `/${API_VERSION}/driver/notification`,
  deleteDriverNotifications: `/${API_VERSION}/driver/notification`,
  getDriverUnreadNotificationCount: `/${API_VERSION}/driver/notification/unread-count`,
  markDriverNotificationAsRead: (id: string) =>
    `/${API_VERSION}/driver/notification/${id}/mark-as-read`,

  // Mover Notification
  getMoverNotifications: `/${API_VERSION}/mover/notification`,
  deleteMoverNotifications: `/${API_VERSION}/mover/notification`,
  getMoverUnreadNotificationCount: `/${API_VERSION}/mover/notification/unread-count`,
  markMoverNotificationAsRead: (id: string) =>
    `/${API_VERSION}/mover/notification/${id}/mark-as-read`,

  // Customer Notification
  getCustomerNotifications: `/${API_VERSION}/customer/notification`,
  deleteCustomerNotifications: `/${API_VERSION}/customer/notification`,
  getCustomerUnreadNotificationCount: `/${API_VERSION}/customer/notification/unread-count`,
  markCustomerNotificationAsRead: (id: string) =>
    `/${API_VERSION}/customer/notification/${id}/mark-as-read`,

  // Client Orders
  searchClientOrders: `/${API_VERSION}/client/order/search`,
  getClientOrderDeliveryStatus: (bookingId: string) =>
    `/${API_VERSION}/client/order/${bookingId}/delivery-status`,
  rateClientOrderCrew: (bookingId: string) =>
    `/${API_VERSION}/client/order/${bookingId}/rate`,

  // Bookings Inventory
  getBookingInventory: (bookingId: string) =>
    `/${API_VERSION}/booking/${bookingId}/inventory`,
  createBookingInventory: (bookingId: string) =>
    `/${API_VERSION}/booking/${bookingId}/inventory`,
  confirmBookingInventory: (bookingId: string) =>
    `/${API_VERSION}/booking/${bookingId}/inventory/confirm`,
  signBookingBOL: (bookingId: string) =>
    `/${API_VERSION}/booking/${bookingId}/sign-bol`,
  generateBookingInventoryPDF: (bookingId: string) =>
    `/${API_VERSION}/booking/${bookingId}/inventory/generate-pdf`,

  markInventoryItemsAsDelivered: (bookingId: string) =>
    `/${API_VERSION}/booking/${bookingId}/inventory/mark-as-delivered`,
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
