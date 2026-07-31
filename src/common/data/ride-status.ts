/**
 * Ride status groups, matching `RideStatus` in the backend's shared enums.
 *
 * The admin bookings endpoint takes a comma-separated status list, so these are
 * joined into the `status` query param. Keep them here rather than inline at the
 * call sites — the same group feeds a list query and its count query, and
 * omitting a status silently hides bookings from every tab.
 */
export const RIDE_STATUSES = [
  'requested',
  'pending_business_assignment',
  'confirmed',
  'driver_assigned',
  'driver_en_route',
  'driver_arrived',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
] as const;

export type RideStatusValue = (typeof RIDE_STATUSES)[number];

/** Awaiting an admin decision. */
export const RIDE_STATUS_PENDING: RideStatusValue[] = [
  'requested',
  'pending_business_assignment',
];

/** Approved, but nobody is driving it yet. */
export const RIDE_STATUS_APPROVED: RideStatusValue[] = ['confirmed'];

/** A driver is attached and the trip is underway. */
export const RIDE_STATUS_IN_FLIGHT: RideStatusValue[] = [
  'driver_assigned',
  'driver_en_route',
  'driver_arrived',
  'in_progress',
];

/** Finished successfully. */
export const RIDE_STATUS_COMPLETED: RideStatusValue[] = ['completed'];

/** Closed without completing. */
export const RIDE_STATUS_DECLINED: RideStatusValue[] = ['cancelled', 'no_show'];

/** Every status — "All" must mean all, or assigned trips vanish from the UI. */
export const RIDE_STATUS_ALL: RideStatusValue[] = [...RIDE_STATUSES];

/** Serialise a group for the `status` query param. */
export const toStatusParam = (statuses: RideStatusValue[]): string =>
  statuses.join(',');
