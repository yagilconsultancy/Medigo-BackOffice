'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import {
  RowStack,
  AppNotificationSnackbar,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type SuspendDriverModalProps = {
  open: boolean;
  onClose: () => void;
  driver: {
    name: string;
    avatar: string;
    fleet: string;
    vehicle: string;
    status: string;
  } | null;
};

type SuspensionReason =
  | 'Safety Policy Violation'
  | 'Document Non-Compliance'
  | 'Passenger Complaint'
  | 'Background Check Issue'
  | 'Unauthorized Route Deviation'
  | 'Other';

type SuspensionTiming = 'immediately' | 'after_trip';

// ─── Component ──────────────────────────────────────────────────────────────

export const SuspendDriverModal = ({
  open,
  onClose,
  driver,
}: SuspendDriverModalProps) => {
  const [selectedReason, setSelectedReason] =
    useState<SuspensionReason | null>(null);
  const [notes, setNotes] = useState('');
  const [timing, setTiming] = useState<SuspensionTiming>('immediately');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  if (!driver) return null;

  const reasons: SuspensionReason[] = [
    'Safety Policy Violation',
    'Document Non-Compliance',
    'Passenger Complaint',
    'Background Check Issue',
    'Unauthorized Route Deviation',
    'Other',
  ];

  const nameParts = driver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const canConfirm = selectedReason !== null;

  const handleConfirm = () => {
    setSnackbar({
      open: true,
      message: `${driver.name} suspended`,
    });
    setTimeout(() => {
      setSelectedReason(null);
      setNotes('');
      setTiming('immediately');
      onClose();
    }, 300);
  };

  const handleClose = () => {
    setSelectedReason(null);
    setNotes('');
    setTiming('immediately');
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 480,
            borderRadius: '16px',
            boxShadow: '0px 24px 80px 0px rgba(0, 0, 0, 0.22)',
            overflow: 'hidden',
            margin: 0,
          },
        }}
      >
        {/* Header */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack spacing={'12px'}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldOutlinedIcon
                sx={{ fontSize: 20, color: '#EF4444' }}
              />
            </Box>
            <Stack spacing={0}>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: pxToRem(16),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                Suspend Driver
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                  lineHeight: '1.5em',
                }}
              >
                This will immediately restrict access
              </Typography>
            </Stack>
          </RowStack>

          <Box
            onClick={handleClose}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: '#F3F4F6',
              border: '0.67px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </Box>
        </RowStack>

        {/* Content */}
        <Stack spacing={'20px'} sx={{ padding: '20px 24px' }}>
          {/* Driver Info Card */}
          <RowStack
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #EAECF0',
              borderRadius: '14px',
              padding: '14px 16px',
              gap: '12px',
            }}
          >
            <Avatar
              src={driver.avatar || undefined}
              alt={driver.name}
              sx={{
                width: 42,
                height: 42,
                fontSize: pxToRem(13),
                fontWeight: 600,
                background: '#EBF2FF',
                color: '#2F6FED',
              }}
            >
              {initials}
            </Avatar>
            <Stack spacing={0} sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                {driver.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                  lineHeight: '1.5em',
                }}
              >
                {driver.fleet} · {driver.vehicle}
              </Typography>
            </Stack>
            <Chip
              label={driver.status}
              size="small"
              sx={{
                background: '#EEF2FF',
                color: '#6366F1',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(11),
                height: '24px',
                borderRadius: '100px',
              }}
            />
          </RowStack>

          {/* Reason for Suspension */}
          <Stack spacing={'10px'}>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(12),
                color: '#374151',
                lineHeight: '1.5em',
              }}
            >
              Reason for Suspension{' '}
              <Typography
                component="span"
                sx={{ color: '#EF4444', fontSize: pxToRem(12) }}
              >
                *
              </Typography>
            </Typography>
            <Grid container spacing={'8px'}>
              {reasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <Grid key={reason} size={{ xs: 6 }}>
                    <Box
                      onClick={() => setSelectedReason(reason)}
                      sx={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: isSelected ? '#F2F5FE' : '#F7F9FB',
                        border: `1px solid ${isSelected ? '#2F6FED' : '#E5E7EB'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          background: isSelected ? '#F2F5FE' : '#F0F2F5',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: pxToRem(12),
                          color: isSelected ? '#2F6FED' : '#374151',
                          lineHeight: '1.5em',
                        }}
                      >
                        {reason}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>

          {/* Additional Notes */}
          <Stack spacing={'8px'}>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(12),
                color: '#374151',
                lineHeight: '1.5em',
              }}
            >
              Additional Notes{' '}
              <Typography
                component="span"
                sx={{
                  fontWeight: 400,
                  color: '#9CA3AF',
                  fontSize: pxToRem(12),
                }}
              >
                (optional)
              </Typography>
            </Typography>
            <Box
              component="textarea"
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              placeholder="Provide any supporting details for this suspension..."
              sx={{
                width: '100%',
                minHeight: '80px',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                background: '#F7F9FB',
                fontFamily: 'Inter, sans-serif',
                fontSize: pxToRem(12),
                color: '#374151',
                resize: 'vertical',
                outline: 'none',
                '&:focus': {
                  borderColor: '#2F6FED',
                },
                '&::placeholder': {
                  color: '#9CA3AF',
                },
              }}
            />
          </Stack>

          {/* Suspension Timing */}
          <Stack spacing={'10px'}>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(12),
                color: '#374151',
                lineHeight: '1.5em',
              }}
            >
              Suspension Timing
            </Typography>
            <RowStack spacing={'8px'}>
              {/* Immediately */}
              <Box
                onClick={() => setTiming('immediately')}
                sx={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background:
                    timing === 'immediately' ? '#F2F5FE' : '#F7F9FB',
                  border: `1px solid ${timing === 'immediately' ? '#2F6FED' : '#E5E7EB'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: pxToRem(12),
                    color: timing === 'immediately' ? '#2F6FED' : '#374151',
                    lineHeight: '1.5em',
                  }}
                >
                  Immediately
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: timing === 'immediately' ? '#2F6FED' : '#9CA3AF',
                    lineHeight: '1.5em',
                  }}
                >
                  Suspend right now
                </Typography>
              </Box>

              {/* After Current Trip */}
              <Box
                onClick={() => setTiming('after_trip')}
                sx={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background:
                    timing === 'after_trip' ? '#F2F5FE' : '#F7F9FB',
                  border: `1px solid ${timing === 'after_trip' ? '#2F6FED' : '#E5E7EB'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: pxToRem(12),
                    color: timing === 'after_trip' ? '#2F6FED' : '#374151',
                    lineHeight: '1.5em',
                  }}
                >
                  After Current Trip
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: timing === 'after_trip' ? '#2F6FED' : '#9CA3AF',
                    lineHeight: '1.5em',
                  }}
                >
                  Let them finish
                </Typography>
              </Box>
            </RowStack>
          </Stack>
        </Stack>

        {/* Footer */}
        <RowStack
          spacing={'10px'}
          sx={{
            padding: '16px 24px',
            borderTop: '0.67px solid #F0F4F8',
            background: '#FAFBFF',
          }}
        >
          <Box
            onClick={handleClose}
            sx={{
              flex: 1,
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#F3F4F6',
              border: '0.67px solid #E5E7EB',
              cursor: 'pointer',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#374151',
                textAlign: 'center',
              }}
            >
              Cancel
            </Typography>
          </Box>

          <Box
            onClick={canConfirm ? handleConfirm : undefined}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: canConfirm ? '#EF4444' : '#D1D5DB',
              cursor: canConfirm ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              '&:hover': canConfirm
                ? { background: '#DC2626' }
                : undefined,
            }}
          >
            <ShieldOutlinedIcon
              sx={{ fontSize: 14, color: '#FFFFFF' }}
            />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Confirm Suspension
            </Typography>
          </Box>
        </RowStack>
      </Dialog>

      <AppNotificationSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </>
  );
};
