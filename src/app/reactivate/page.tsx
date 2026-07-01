'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { getApiClient } from '../../common/lib';
import { ROUTES } from '../../common/constants';

type Status = 'loading' | 'success' | 'error';

function ReactivateInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('This reactivation link is missing its token.');
      return;
    }
    let active = true;
    getApiClient()
      .post(ROUTES.reactivateAccount, { token })
      .then(() => {
        if (!active) return;
        setStatus('success');
        setMessage(
          'Your account has been reactivated. You can now sign in with your new email.'
        );
      })
      .catch((err: unknown) => {
        if (!active) return;
        const resp = (err as { response?: { data?: Record<string, string> } })
          ?.response?.data;
        setStatus('error');
        setMessage(
          resp?.detail ||
            resp?.message ||
            'This reactivation link is invalid or has expired.'
        );
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F5F7FA',
        px: 2,
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: '#fff',
          border: '1px solid #E8ECF0',
          borderRadius: '14px',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#2F6FED' }}>
          MediGo
        </Typography>

        {status === 'loading' && (
          <>
            <CircularProgress size={28} />
            <Typography sx={{ color: '#374151', fontSize: 14 }}>
              Reactivating your account…
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: '#111827' }}>
              Account reactivated
            </Typography>
            <Typography sx={{ color: '#374151', fontSize: 14 }}>
              {message}
            </Typography>
            <Button
              variant="contained"
              href="/login"
              sx={{ textTransform: 'none', mt: 1 }}
            >
              Go to sign in
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: '#B91C1C' }}>
              Reactivation failed
            </Typography>
            <Typography sx={{ color: '#374151', fontSize: 14 }}>
              {message}
            </Typography>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default function ReactivatePage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={28} />
        </Box>
      }
    >
      <ReactivateInner />
    </Suspense>
  );
}
