// Turns the technical text the server stores for an admin action
// (for example "PUT /rides/admin/bookings/48273947-.../approve") into a short
// line staff can read ("Booking #48273947"). The technical text stays stored
// on the server for investigations; it is only hidden here.

const REQUEST = /^(GET|POST|PUT|PATCH|DELETE)\s+(\/\S*)/i;
const ID_LIKE = /^([0-9a-f]{8}-[0-9a-f-]{20,}|[0-9a-f]{16,}|\d+)$/i;

// First match wins. `name` is what the record is; the id (if any) is added.
const TARGETS: Array<[RegExp, string]> = [
  [/^\/auth\/(admin\/)?(logout|login)/, 'Back office account'],
  [/^\/auth\/admin\/security/, 'Security settings'],
  [/^\/auth\/admin\/register/, 'Admin account'],
  [/^\/auth\//, 'Back office account'],
  [/^\/rides\/admin\/bookings/, 'Booking'],
  [/^\/rides\/admin\/incidents/, 'Incident'],
  [/^\/rides\/admin\/investigations/, 'Investigation'],
  [/^\/rides\/admin\/disciplinary/, 'Disciplinary action'],
  [/^\/rides\/admin\/dispatch/, 'Dispatch'],
  [/^\/rides/, 'Ride'],
  [/^\/users\/admin\/fleet\/applications/, 'Fleet application'],
  [/^\/users\/admin\/fleet/, 'Fleet company'],
  [/^\/users\/admin\/drivers/, 'Driver'],
  [/^\/users\/admin\/caregivers/, 'Caregiver'],
  [/^\/users\/admin\/riders/, 'Rider'],
  [/^\/users\/admin\/vehicle-categories/, 'Vehicle category'],
  [/^\/users\/admin\/vehicles/, 'Vehicle'],
  [/^\/users\/admin\/roles/, 'Roles and permissions'],
  [/^\/users\/admin\/admins/, 'Admin team'],
  [/^\/users\/admin\/account-deletion/, 'Account deletion request'],
  [/^\/users/, 'User account'],
  [/^\/payments\/admin\/refunds/, 'Refund'],
  [/^\/payments\/admin\/payouts/, 'Payout'],
  [/^\/payments\/(admin\/)?(pricing|commission|fare|surcharge)/, 'Pricing'],
  [/^\/payments/, 'Payment'],
  [/^\/notifications\/admin\/support/, 'Support ticket'],
  [/^\/notifications\/admin\/broadcasts/, 'Notification'],
  [/^\/notifications/, 'Notification'],
  [/^\/locations/, 'Service area'],
];

function humanise(segment: string): string {
  const words = segment.replace(/[-_]+/g, ' ').trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function describeActivity(
  description: string | null | undefined
): string {
  const text = (description ?? '').trim();
  const match = REQUEST.exec(text);
  if (!match) return text; // already readable

  const path = match[2].split('?')[0];
  const segments = path.split('/').filter(Boolean);
  const id = [...segments].reverse().find((s) => ID_LIKE.test(s));

  let name = TARGETS.find(([pattern]) => pattern.test(path))?.[1];
  if (!name) {
    const last = [...segments].reverse().find((s) => !ID_LIKE.test(s));
    name = last ? humanise(last) : 'Back office';
  }

  return id ? `${name} #${id.slice(0, 8)}` : name;
}

// Older entries were saved before the server learned clearer titles
// ("Logout created", "Booking updated" on an approval, "Drivers deleted").
// Show them with the same wording new entries get.
const TITLE_RULES: Array<[RegExp, string | null, string]> = [
  [/^\/auth\/(admin\/)?logout\/?$/, null, 'Signed out'],
  [/^\/rides\/admin\/bookings\/[^/]+\/approve\/?$/, null, 'Booking approved'],
  [
    /^\/rides\/admin\/bookings\/[^/]+\/(decline|reject)\/?$/,
    null,
    'Booking declined',
  ],
  [/^\/rides\/admin\/bookings\/[^/]+\/?$/, 'DELETE', 'Booking deleted'],
  [
    /^\/users\/admin\/fleet\/applications\/[^/]+\/approve\/?$/,
    null,
    'Fleet application approved',
  ],
  [
    /^\/users\/admin\/fleet\/applications\/[^/]+\/reject\/?$/,
    null,
    'Fleet application rejected',
  ],
  [
    /^\/users\/admin\/fleet\/applications\/[^/]+\/request-info\/?$/,
    null,
    'More information requested',
  ],
];

function singularFirstWord(title: string): string {
  const m = /^(\S+)( (?:created|updated|deleted))$/.exec(title);
  if (!m) return title;
  let word = m[1];
  if (/ies$/i.test(word) && word.length > 4) word = word.slice(0, -3) + 'y';
  else if (/s$/i.test(word) && !/(ss|us|is)$/i.test(word) && word.length > 3)
    word = word.slice(0, -1);
  return word + m[2];
}

export function describeTitle(
  title: string | null | undefined,
  description: string | null | undefined
): string {
  const text = (title ?? '').trim();
  const match = REQUEST.exec((description ?? '').trim());
  if (match) {
    const method = match[1].toUpperCase();
    const path = match[2].split('?')[0];
    const rule = TITLE_RULES.find(
      ([pattern, onlyMethod]) =>
        pattern.test(path) && (!onlyMethod || onlyMethod === method)
    );
    if (rule) return rule[2];
  }
  return singularFirstWord(text);
}

// Older sign-out entries were tagged "Settings"; new ones are tagged "Admin".
// Fleet application actions on older entries were tagged "Admin"; they are Fleet.
export function describeCategory(
  category: string | null | undefined,
  description: string | null | undefined
): string {
  const match = REQUEST.exec((description ?? '').trim());
  const path = match ? match[2].split('?')[0] : '';
  if (/^\/auth\/(admin\/)?(logout|login)/.test(path)) return 'Admin';
  if (/^\/users\/admin\/fleet\//.test(path)) return 'Fleet';
  return category ?? '';
}
