'use client';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WifiOffOutlinedIcon from '@mui/icons-material/WifiOffOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import {
  isRetryableErrorKind,
  QueryErrorKind,
} from '../../../../common/hooks/common/useResolvedApiQuery/errors';
import { pxToRem } from '../../../../common/utils/helpers';

type QueryErrorStateProps = {
  kind: QueryErrorKind;
  onRetry?: () => void;
};

const COPY: Record<
  Exclude<QueryErrorKind, 'none'>,
  { icon: typeof ErrorOutlineOutlinedIcon; title: string; body: string }
> = {
  unauthorized: {
    icon: LockOutlinedIcon,
    title: 'Your session has expired',
    body: 'Sign in again to view this page.',
  },
  forbidden: {
    icon: LockOutlinedIcon,
    title: "You don't have access to this",
    body: 'Ask an administrator to grant you the "System Logs & Security" module.',
  },
  network: {
    icon: WifiOffOutlinedIcon,
    title: "Can't reach the server",
    body: 'Check your connection and try again.',
  },
  server: {
    icon: ErrorOutlineOutlinedIcon,
    title: 'Something went wrong on our end',
    body: "We couldn't load this data. Try again in a moment.",
  },
  unknown: {
    icon: ErrorOutlineOutlinedIcon,
    title: 'Unexpected error',
    body: "We couldn't load this data.",
  },
};

/**
 * Shown when a query failed, in place of the "no data yet" empty state.
 *
 * These pages used to render the friendly empty state for every failure, so a
 * permission problem or a dead backend looked identical to "there is nothing
 * here yet" -- which is why the System Logs section read as silently broken.
 */
export const QueryErrorState = ({ kind, onRetry }: QueryErrorStateProps) => {
  if (kind === 'none') return null;

  const { icon: Icon, title, body } = COPY[kind];

  return (
    <Stack alignItems="center" spacing="8px" sx={{ py: 4 }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '14px',
          background: '#FEF2F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: '4px',
        }}
      >
        <Icon sx={{ fontSize: 24, color: '#F87171' }} />
      </Box>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(14),
          color: '#6B7280',
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13),
          color: '#9CA3AF',
          textAlign: 'center',
        }}
      >
        {body}
      </Typography>
      {isRetryableErrorKind(kind) && onRetry && (
        <Button
          onClick={onRetry}
          size="small"
          variant="outlined"
          sx={{
            mt: '8px',
            textTransform: 'none',
            fontSize: pxToRem(13),
          }}
        >
          Try again
        </Button>
      )}
    </Stack>
  );
};
