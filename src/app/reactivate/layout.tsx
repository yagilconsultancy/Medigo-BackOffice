// The reactivation page acts on a one-time token from an emailed link. It must
// never be statically prerendered/cached (Next.js otherwise serves it with
// Cache-Control: s-maxage=31536000, so browsers keep stale HTML that references
// old JS chunks). force-dynamic keeps the HTML fresh and non-cacheable.
export const dynamic = 'force-dynamic';

export default function ReactivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
