'use client';

import { useState } from 'react';
import { Box, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RejectRefundModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    refundId: string;
    riderName: string;
    amount: string;
    reason: string;
  } | null;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const RejectRefundModal = ({
  open,
  onClose,
  onConfirm,
  data,
}: RejectRefundModalProps) => {
  const [decisionNote, setDecisionNote] = useState('');

  if (!data) return null;

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="reject-refund-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 480,
          maxWidth: 480,
          borderRadius: '20px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
        },
      }}
    >
      <Stack>
        {/* ── Red Gradient Header ──────────────────────────────────────── */}
        <Box
          sx={{
            background:
              'linear-gradient(135deg, rgba(239, 68, 68, 0.09) 0%, rgba(239, 68, 68, 0.02) 100%)',
            padding: '20px 24px',
            borderBottom: '0.67px solid #FECACA',
          }}
        >
          <RowStack
            justifyContent={'space-between'}
            alignItems={'flex-start'}
          >
            <RowStack spacing={'12px'}>
              <CancelOutlinedIcon sx={{ fontSize: 24, color: '#EF4444' }} />
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(16),
                    color: '#EF4444',
                  }}
                >
                  Reject Refund
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12.5),
                    color: '#6B7280',
                  }}
                >
                  {data.refundId} · {data.riderName} · {data.amount}
                </Typography>
              </Stack>
            </RowStack>

            <Box
              onClick={onClose}
              sx={{
                width: 30,
                height: 30,
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.08)',
                border: '0.67px solid #FECACA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                '&:hover': { background: '#FECACA' },
              }}
            >
              <CloseIcon sx={{ fontSize: 14, color: '#EF4444' }} />
            </Box>
          </RowStack>
        </Box>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <Stack spacing={'20px'} sx={{ padding: '24px' }}>
          {/* Rider's Reason */}
          <Stack spacing={'8px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              Rider&apos;s Reason
            </Typography>
            <Box
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #F0F4F8',
                borderRadius: '12px',
                padding: '12px 14px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                {data.reason}
              </Typography>
            </Box>
          </Stack>

          {/* Decision Note */}
          <Stack spacing={'8px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              Decision Note
              <Typography
                component="span"
                sx={{ color: '#EF4444', ml: '2px' }}
              >
                *
              </Typography>
            </Typography>
            <TextField
              multiline
              rows={3}
              placeholder="e.g. GPS confirms driver arrived on time..."
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: pxToRem(13),
                  '& fieldset': {
                    borderColor: '#E8ECF0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#EF4444',
                    borderWidth: '1px',
                  },
                },
              }}
            />
          </Stack>

          {/* Footer Buttons */}
          <RowStack spacing={'12px'} sx={{ pt: '4px' }}>
            <Box
              onClick={onClose}
              sx={{
                flex: 1,
                height: 44,
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
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: '#EF4444',
                boxShadow: '0px 2px 8px 0px rgba(239, 68, 68, 0.25)',
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
                Confirm Rejection
              </Typography>
            </Box>
          </RowStack>
        </Stack>
      </Stack>
    </AppModal>
  );
};
