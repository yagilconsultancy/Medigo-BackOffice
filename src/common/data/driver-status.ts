/**
 * Driver enums, mirroring the backend's shared enums.
 *
 * The UI previously offered 'Verified' / 'Not Verified' for background checks,
 * which match no member of BackgroundCheckStatus — so the value was written
 * straight through to the DB and a driver whose status was 'approved' rendered
 * blank. Keep the label/value mapping here so the add and edit forms cannot
 * drift apart again.
 */

/** Mirrors BackgroundCheckStatus: pending | in_progress | approved | rejected. */
export const BG_CHECK_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const bgCheckOptions = Object.values(BG_CHECK_LABELS);

/** Display label -> wire value. Returns null for anything unrecognised. */
export const bgCheckLabelToValue = (label: string): string | null =>
  Object.keys(BG_CHECK_LABELS).find((key) => BG_CHECK_LABELS[key] === label) ??
  null;

/** Wire value -> display label. Empty string when the value isn't a member. */
export const bgCheckValueToLabel = (value?: string | null): string =>
  value ? (BG_CHECK_LABELS[value.toLowerCase()] ?? '') : '';

/** Mirrors DriverAccountStatus. */
export const DRIVER_ACCOUNT_STATUSES = [
  'pending',
  'active',
  'suspended',
  'deactivated',
] as const;
