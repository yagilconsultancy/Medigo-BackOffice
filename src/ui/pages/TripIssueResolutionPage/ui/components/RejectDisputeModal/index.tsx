'use client';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RejectDisputeModalProps = {
  open: boolean;
  onClose: () => void;
  data: {
    disputeId: string;
    issueType: string;
    userName: string;
  } | null;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const RejectDisputeModal = ({
  open,
  onClose,
  data,
}: RejectDisputeModalProps) => {
  if (!data) return null;

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="reject-dispute-modal"
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
              'linear-gradient(135deg, rgba(239, 68, 68, 0.09) 0%, rgba(239, 68, 68, 0.02) 100%)',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack spacing={'10px'}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CancelOutlinedIcon
                sx={{ fontSize: 18, color: '#EF4444' }}
              />
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
                Reject Dispute
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
              reject
            </Typography>{' '}
            this dispute submitted by{' '}
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
            ? The rider will be notified of the decision.
          </Typography>

          {/* Warning Alert */}
          <RowStack
            spacing={'10px'}
            alignItems={'flex-start'}
            sx={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: '#FEF2F2',
              border: '0.67px solid #FECACA',
            }}
          >
            <WarningAmberOutlinedIcon
              sx={{ fontSize: 16, color: '#EF4444', flexShrink: 0, mt: '2px' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#991B1B',
                lineHeight: '1.5em',
              }}
            >
              This dispute will be closed. No refund will be issued for this
              request.
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
              Reject
            </Typography>
          </Box>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
