'use client';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type ApproveDisputeModalProps = {
  open: boolean;
  onClose: () => void;
  data: {
    disputeId: string;
    issueType: string;
    userName: string;
    claimed: string;
  } | null;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const ApproveDisputeModal = ({
  open,
  onClose,
  data,
}: ApproveDisputeModalProps) => {
  if (!data) return null;

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="approve-dispute-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 400,
          maxWidth: 400,
          borderRadius: '20px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
        },
      }}
    >
      <Stack>
        {/* ── Header ───────────────────────────────────────────────────── */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '16px 20px',
            background:
              'linear-gradient(135deg, rgba(5, 150, 105, 0.09) 0%, rgba(5, 150, 105, 0.02) 100%)',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack spacing={'10px'}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#059669' }} />
            </Box>
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  color: '#111827',
                }}
              >
                Approve Dispute
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                }}
              >
                {data.disputeId} · {data.issueType}
              </Typography>
            </Stack>
          </RowStack>

          <IconButton
            onClick={onClose}
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              flexShrink: 0,
              alignSelf: 'flex-start',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <Stack spacing={'16px'} sx={{ padding: '20px' }}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              color: '#374151',
              lineHeight: '1.6em',
            }}
          >
            Are you sure you want to{' '}
            <Typography
              component="span"
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              approve
            </Typography>{' '}
            this dispute and process a refund of{' '}
            <Typography
              component="span"
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              {data.claimed}
            </Typography>{' '}
            to{' '}
            <Typography
              component="span"
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              {data.userName}
            </Typography>
            ? This action cannot be undone.
          </Typography>

          {/* Info Alert */}
          <RowStack
            spacing={'10px'}
            alignItems={'flex-start'}
            sx={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: '#ECFDF5',
              border: '0.67px solid #A7F3D0',
            }}
          >
            <WarningAmberOutlinedIcon
              sx={{ fontSize: 16, color: '#059669', flexShrink: 0, mt: '2px' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#065F46',
                lineHeight: '1.5em',
              }}
            >
              A refund of {data.claimed} will be issued to the rider&apos;s
              original payment method within 3–5 business days.
            </Typography>
          </RowStack>
        </Stack>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '12px 20px',
            borderTop: '0.67px solid #F0F4F8',
          }}
        >
          <Box
            onClick={onClose}
            sx={{
              height: 36,
              padding: '0 20px',
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
            onClick={onClose}
            sx={{
              height: 36,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              background: '#059669',
              boxShadow: '0px 2px 8px 0px rgba(5, 150, 105, 0.25)',
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
              Approve
            </Typography>
          </Box>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
