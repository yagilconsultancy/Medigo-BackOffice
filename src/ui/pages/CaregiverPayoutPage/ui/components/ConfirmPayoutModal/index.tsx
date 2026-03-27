'use client';

import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type ConfirmPayoutModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    name: string;
    id: string;
    fleet: string;
    payoutAmount: string;
    method: string;
    schedule: string;
  } | null;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const ConfirmPayoutModal = ({
  open,
  onClose,
  onConfirm,
  data,
}: ConfirmPayoutModalProps) => {
  if (!data) return null;

  const detailRows = [
    { label: 'Driver', value: data.name, color: '#374151' },
    { label: 'Fleet', value: data.fleet, color: '#374151' },
    { label: 'Payout Amount', value: data.payoutAmount, color: '#059669' },
    { label: 'Method', value: data.method, color: '#374151' },
    { label: 'Schedule', value: data.schedule, color: '#374151' },
  ];

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="confirm-payout-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 420,
          maxWidth: 420,
          borderRadius: '16px',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        },
      }}
    >
      <Stack>
        {/* ── Header ───────────────────────────────────────────────────── */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <Stack spacing={'2px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: '#111827',
                lineHeight: '1.5em',
              }}
            >
              Confirm Payout
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#9CA3AF',
                lineHeight: '1.5em',
              }}
            >
              {data.name} · {data.id}
            </Typography>
          </Stack>

          <Box
            onClick={onClose}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </Box>
        </RowStack>

        {/* ── Detail Rows ──────────────────────────────────────────────── */}
        <Stack spacing={'10px'} sx={{ padding: '24px 24px 0' }}>
          {detailRows.map((row) => (
            <RowStack
              key={row.label}
              justifyContent={'space-between'}
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #F0F4F8',
                borderRadius: '14px',
                padding: '12px 16px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                  lineHeight: '1.5em',
                }}
              >
                {row.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: row.color,
                  lineHeight: '1.5em',
                }}
              >
                {row.value}
              </Typography>
            </RowStack>
          ))}

          {/* ── Footer Buttons ────────────────────────────────────────── */}
          <RowStack spacing={'12px'} sx={{ pt: '8px', pb: '24px' }}>
            <Box
              onClick={onClose}
              sx={{
                flex: 1,
                height: 43,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                cursor: 'pointer',
                '&:hover': { background: '#E5E7EB' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#374151',
                }}
              >
                Cancel
              </Typography>
            </Box>

            <Box
              onClick={onConfirm}
              sx={{
                flex: 1,
                height: 43,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: '#2F6FED',
                boxShadow: '0px 2px 8px 0px rgba(47, 111, 237, 0.25)',
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#FFFFFF',
                }}
              >
                Confirm Payout
              </Typography>
            </Box>
          </RowStack>
        </Stack>
      </Stack>
    </AppModal>
  );
};
