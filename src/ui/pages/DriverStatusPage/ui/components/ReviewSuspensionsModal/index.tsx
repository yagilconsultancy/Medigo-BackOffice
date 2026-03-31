'use client';

import { useState } from 'react';
import { Avatar, Box, Dialog, Grid, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import {
  RowStack,
  AppNotificationSnackbar,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type SuspendedDriverInfo = {
  id: string;
  name: string;
  avatar: string;
  initials?: string;
  fleet: string;
  trips: number;
  reason: string;
  since: string;
  suspendedBy: string;
  notes: string;
};

type ReviewSuspensionsModalProps = {
  open: boolean;
  onClose: () => void;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const suspendedDriversData: SuspendedDriverInfo[] = [
  {
    id: '1',
    name: 'Tom Roberts',
    avatar: '',
    fleet: 'SafeRide Medical',
    trips: 178,
    reason: 'Safety Policy Violation',
    since: 'Mar 5, 2026',
    suspendedBy: 'Admin · Sarah O.',
    notes: 'Reported for aggressive driving by two passengers on Mar 4.',
  },
  {
    id: '2',
    name: 'Leon Torres',
    avatar: '',
    initials: 'LT',
    fleet: 'MediGo',
    trips: 94,
    reason: 'Document Non-Compliance',
    since: 'Feb 28, 2026',
    suspendedBy: 'System · Auto-flag',
    notes: 'Vehicle insurance expired Feb 20 and was not renewed in time.',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const ReviewSuspensionsModal = ({
  open,
  onClose,
}: ReviewSuspensionsModalProps) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  const handleLift = (driver: SuspendedDriverInfo) => {
    setSnackbar({
      open: true,
      message: `Suspension lifted for ${driver.name}`,
    });
  };

  const handleKeep = (driver: SuspendedDriverInfo) => {
    setSnackbar({
      open: true,
      message: `${driver.name} remains suspended`,
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 520,
            maxHeight: '90vh',
            borderRadius: '16px',
            boxShadow: '0px 24px 80px 0px rgba(0, 0, 0, 0.22)',
            overflow: 'hidden',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Header */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
            flexShrink: 0,
          }}
        >
          <RowStack spacing={'12px'}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
            </Box>
            <Stack spacing={'1px'}>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                Review Suspensions
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
                {suspendedDriversData.length} drivers currently suspended
              </Typography>
            </Stack>
          </RowStack>

          <Box
            onClick={onClose}
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

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {suspendedDriversData.length === 0 ? (
            <Stack
              alignItems={'center'}
              justifyContent={'center'}
              spacing={'16px'}
              sx={{ py: '80px' }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: '#ECFDF5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TaskAltOutlinedIcon sx={{ fontSize: 26, color: '#059669' }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  color: '#374151',
                  lineHeight: '1.5em',
                }}
              >
                All clear
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#9CA3AF',
                  lineHeight: '1.5em',
                }}
              >
                No drivers are currently suspended.
              </Typography>
            </Stack>
          ) : (
            suspendedDriversData.map((driver) => (
              <SuspendedDriverCard
                key={driver.id}
                driver={driver}
                onLift={() => handleLift(driver)}
                onKeep={() => handleKeep(driver)}
              />
            ))
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            padding: '16px 24px',
            borderTop: '0.67px solid #F0F4F8',
            background: '#FAFBFF',
            flexShrink: 0,
          }}
        >
          <Box
            onClick={onClose}
            sx={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
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
              Close
            </Typography>
          </Box>
        </Box>
      </Dialog>

      <AppNotificationSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </>
  );
};

// ─── SuspendedDriverCard ────────────────────────────────────────────────────

const SuspendedDriverCard = ({
  driver,
  onLift,
  onKeep,
}: {
  driver: SuspendedDriverInfo;
  onLift: () => void;
  onKeep: () => void;
}) => {
  const nameParts = driver.name.split(' ');
  const initials =
    driver.initials ||
    (nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0));
  const hasAvatar = !!driver.avatar;

  const infoRows = [
    {
      icon: (
        <ReportProblemOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
      ),
      label: 'REASON',
      value: driver.reason,
      valueColor: '#DC2626',
    },
    {
      icon: (
        <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
      ),
      label: 'SINCE',
      value: driver.since,
      valueColor: '#374151',
    },
    {
      icon: <PersonOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'SUSPENDED BY',
      value: driver.suspendedBy,
      valueColor: '#374151',
    },
    {
      icon: <ApartmentOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'FLEET',
      value: driver.fleet,
      valueColor: '#374151',
    },
  ];

  return (
    <Box
      sx={{
        border: '0.67px solid #F0F4F8',
        borderRadius: '16px',
      }}
    >
      {/* Card Header */}
      <RowStack
        sx={{
          padding: '16px 20px',
          background: 'rgba(254, 242, 242, 0.5)',
          borderBottom: '0.67px solid #FEE2E2',
          borderRadius: '16px 16px 0 0',
          gap: '12px',
        }}
      >
        <Avatar
          src={hasAvatar ? driver.avatar : undefined}
          alt={driver.name}
          sx={{
            width: 44,
            height: 44,
            fontSize: pxToRem(14),
            fontWeight: 700,
            background: hasAvatar ? undefined : '#EF4444',
            color: '#FFFFFF',
            borderRadius: '22px',
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
            {driver.fleet} · {driver.trips} trips
          </Typography>
        </Stack>
        <Box
          sx={{
            padding: '4px 10px',
            borderRadius: '100px',
            background: '#FEF2F2',
            border: '0.67px solid #FECACA',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: pxToRem(11.5),
              color: '#EF4444',
            }}
          >
            Suspended
          </Typography>
        </Box>
      </RowStack>

      {/* Card Details */}
      <Stack spacing={'12px'} sx={{ padding: '20px' }}>
        {/* Info Grid (2x2) */}
        <Grid container spacing={'8px'}>
          {infoRows.map((row) => (
            <Grid key={row.label} size={{ xs: 6 }}>
              <RowStack
                spacing={'12px'}
                sx={{
                  background: '#F7F9FB',
                  border: '0.67px solid #F0F2F5',
                  borderRadius: '14px',
                  padding: '10px 12px',
                }}
              >
                {row.icon}
                <Stack spacing={0}>
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 700,
                      fontSize: pxToRem(10),
                      color: '#9CA3AF',
                      lineHeight: '1.5em',
                    }}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: pxToRem(12.5),
                      color: row.valueColor,
                      lineHeight: '1.5em',
                    }}
                  >
                    {row.value}
                  </Typography>
                </Stack>
              </RowStack>
            </Grid>
          ))}
        </Grid>

        {/* Suspension Notes */}
        <Box
          sx={{
            background: '#FFF7F7',
            border: '0.67px solid #FEE2E2',
            borderRadius: '14px',
            padding: '12px 16px',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: pxToRem(10),
              color: '#9CA3AF',
              lineHeight: '1.5em',
            }}
          >
            SUSPENSION NOTES
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: pxToRem(12.5),
              color: '#7F1D1D',
              lineHeight: '1.5em',
            }}
          >
            {driver.notes}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Box
            onClick={onLift}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: 39,
              padding: '0 16px',
              borderRadius: '10px',
              background: '#ECFDF5',
              border: '0.67px solid #BBF7D0',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 13, color: '#059669' }} />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#059669',
              }}
            >
              Lift Suspension
            </Typography>
          </Box>

          <Box
            onClick={onKeep}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: 39,
              padding: '0 16px',
              borderRadius: '10px',
              background: '#F7F9FB',
              border: '0.67px solid #E5E7EB',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <BlockOutlinedIcon sx={{ fontSize: 13, color: '#374151' }} />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              Keep Suspended
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
