import { AxiosError } from 'axios';

/**
 * Why a query has no usable data.
 *
 * `useResolvedApiQuery` collapses any unsuccessful response to its
 * `defaultValue`, which makes a 403, a 500, a dropped connection and a
 * genuinely empty result indistinguishable at the call site. Classifying the
 * failure lets pages tell the user what actually happened instead of
 * rendering a friendly "no data yet" empty state over a hard error.
 */
export type QueryErrorKind =
  | 'none'
  | 'unauthorized'
  | 'forbidden'
  | 'network'
  | 'server'
  | 'unknown';

const isAxiosLikeError = (
  error: unknown
): error is { response?: { status?: number } } =>
  typeof error === 'object' && error !== null && 'response' in error;

export const getQueryErrorKind = (
  error: unknown,
  apiResponse?: { success?: boolean }
): QueryErrorKind => {
  if (!error) {
    // The API can answer HTTP 200 with `success: false`. React Query treats
    // that as a win, so it has to be caught here or it reads as "no data".
    return apiResponse && apiResponse.success === false ? 'server' : 'none';
  }

  if (error instanceof AxiosError || isAxiosLikeError(error)) {
    const status = error.response?.status;
    // No response at all means the request never completed (offline, DNS,
    // CORS, timeout) rather than the server rejecting it.
    if (status === undefined) return 'network';
    if (status === 401) return 'unauthorized';
    if (status === 403) return 'forbidden';
    if (status >= 500) return 'server';
  }

  return 'unknown';
};

/** Retrying only helps when the failure might be transient. */
export const isRetryableErrorKind = (kind: QueryErrorKind): boolean =>
  kind === 'network' || kind === 'server' || kind === 'unknown';
