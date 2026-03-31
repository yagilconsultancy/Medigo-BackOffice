'use client';

import { useState } from 'react';
import { Avatar, Box, Dialog, Grid, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import {
  RowStack,
  AppNotificationSnackbar,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type PendingApplicationDriver = {
  id: string;
  name: string;
  initials: string;
  fleet: string;
  phone: string;
  submittedDate: string;
  license: string;
  vehicle: string;
  experience: string;
  bgCheck: 'Cleared' | 'Pending';
};

type ReviewApplicationsModalProps = {
  open: boolean;
  onClose: () => void;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const pendingApplicationsData: PendingApplicationDriver[] = [
  {
    id: '1',
    name: 'Kevin Walsh',
    initials: 'KW',
    fleet: 'CareTransit Co.',
    phone: '+1 (555) 310-4421',
    submittedDate: 'Submitted Mar 8, 2026',
    license: 'DL-NY-881234',
    vehicle: 'Honda Odyssey 2020',
    experience: '4 years NEMT',
    bgCheck: 'Cleared',
  },
  {
    id: '2',
    name: 'Priya Patel',
    initials: 'PP',
    fleet: 'MediGo',
    phone: '+1 (555) 420-6677',
    submittedDate: 'Submitted Mar 9, 2026',
    license: 'DL-NJ-994421',
    vehicle: 'Toyota Sienna 2022',
    experience: '2 years rideshare',
    bgCheck: 'Pending',
  },
  {
    id: '3',
    name: 'Chris Johnson',
    initials: 'CJ',
    fleet: 'HealthHaul LLC',
    phone: '+1 (555) 530-8833',
    submittedDate: 'Submitted Mar 7, 2026',
    license: 'DL-CT-772344',
    vehicle: 'Chrysler Pacifica 2021',
    experience: '6 years NEMT',
    bgCheck: 'Cleared',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const ReviewApplicationsModal = ({
  open,
  onClose,
}: ReviewApplicationsModalProps) => {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });
  const [requestInfoId, setRequestInfoId] = useState<string | null>(null);
  const [requestInfoText, setRequestInfoText] = useState('');

  const handleApprove = (driver: PendingApplicationDriver) => {
    setSnackbar({
      open: true,
      message: `${driver.name} has been approved`,
    });
  };

  const handleReject = (driver: PendingApplicationDriver) => {
    setSnackbar({
      open: true,
      message: `${driver.name} has been rejected`,
    });
  };

  const handleRequestInfo = (driverId: string) => {
    if (requestInfoId === driverId) {
      setRequestInfoId(null);
      setRequestInfoText('');
    } else {
      setRequestInfoId(driverId);
      setRequestInfoText('');
    }
  };

  const handleSendRequest = (driver: PendingApplicationDriver) => {
    setSnackbar({
      open: true,
      message: `Information request sent to ${driver.name}`,
    });
    setRequestInfoId(null);
    setRequestInfoText('');
  };

  const handleCancelRequest = () => {
    setRequestInfoId(null);
    setRequestInfoText('');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 540,
            maxHeight: '90vh',
            borderRadius: '16px',
            boxShadow: '-4px 0px 48px 0px rgba(0, 0, 0, 0.16)',
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
                background: '#FFFBEB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 18, color: '#D97706' }} />
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
                Review Applications
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
                {pendingApplicationsData.length} applications awaiting decision
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
            padding: '24px 24px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {pendingApplicationsData.length === 0 ? (
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
                All reviewed
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
                No pending applications at the moment.
              </Typography>
            </Stack>
          ) : (
            pendingApplicationsData.map((driver) => (
              <ApplicationCard
                key={driver.id}
                driver={driver}
                isRequestingInfo={requestInfoId === driver.id}
                requestInfoText={requestInfoText}
                onRequestInfoTextChange={setRequestInfoText}
                onApprove={() => handleApprove(driver)}
                onReject={() => handleReject(driver)}
                onRequestInfo={() => handleRequestInfo(driver.id)}
                onSendRequest={() => handleSendRequest(driver)}
                onCancelRequest={handleCancelRequest}
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

// ─── ApplicationCard ────────────────────────────────────────────────────────

const ApplicationCard = ({
  driver,
  isRequestingInfo,
  requestInfoText,
  onRequestInfoTextChange,
  onApprove,
  onReject,
  onRequestInfo,
  onSendRequest,
  onCancelRequest,
}: {
  driver: PendingApplicationDriver;
  isRequestingInfo: boolean;
  requestInfoText: string;
  onRequestInfoTextChange: (text: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestInfo: () => void;
  onSendRequest: () => void;
  onCancelRequest: () => void;
}) => {
  const infoRows = [
    {
      icon: <PhoneOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'PHONE',
      value: driver.phone,
      valueColor: '#374151',
    },
    {
      icon: (
        <CalendarTodayOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
      ),
      label: 'SUBMITTED',
      value: driver.submittedDate,
      valueColor: '#374151',
    },
    {
      icon: <BadgeOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'LICENSE',
      value: driver.license,
      valueColor: '#374151',
    },
    {
      icon: (
        <DirectionsCarOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
      ),
      label: 'VEHICLE',
      value: driver.vehicle,
      valueColor: '#374151',
    },
    {
      icon: <WorkOutlineOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      label: 'EXPERIENCE',
      value: driver.experience,
      valueColor: '#374151',
    },
    {
      icon: (
        <VerifiedUserOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
      ),
      label: 'BG CHECK',
      value: driver.bgCheck,
      valueColor: driver.bgCheck === 'Cleared' ? '#059669' : '#D97706',
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
          background: 'rgba(255, 251, 235, 0.5)',
          borderBottom: '0.67px solid rgba(253, 230, 138, 0.31)',
          borderRadius: '16px 16px 0 0',
          gap: '12px',
        }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            fontSize: pxToRem(14),
            fontWeight: 700,
            background: '#D97706',
            color: '#FFFFFF',
            borderRadius: '22px',
          }}
        >
          {driver.initials}
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
            {driver.fleet}
          </Typography>
        </Stack>
        <Box
          sx={{
            padding: '4px 10px',
            borderRadius: '100px',
            background: '#FFFBEB',
            border: '0.67px solid #FDE68A',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: pxToRem(11.5),
              color: '#D97706',
            }}
          >
            Pending
          </Typography>
        </Box>
      </RowStack>

      {/* Card Details */}
      <Stack spacing={'12px'} sx={{ padding: '20px' }}>
        {/* Info Grid (3x2) */}
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

        {/* BG Check Warning */}
        {driver.bgCheck === 'Pending' && (
          <RowStack
            spacing={'10px'}
            sx={{
              background: '#FFFBEB',
              border: '0.67px solid #FDE68A',
              borderRadius: '14px',
              padding: '12px 16px',
            }}
          >
            <WarningAmberOutlinedIcon
              sx={{ fontSize: 13, color: '#D97706', flexShrink: 0, mt: '2px' }}
            />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#92400E',
                lineHeight: '1.5em',
              }}
            >
              Background check is still in progress. Consider requesting before
              approving.
            </Typography>
          </RowStack>
        )}

        {/* Request Info Form */}
        {isRequestingInfo && (
          <Box
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E5E7EB',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(12),
                color: '#374151',
                lineHeight: '1.5em',
                mb: '8px',
              }}
            >
              Request Additional Info
            </Typography>
            <Box
              component="textarea"
              value={requestInfoText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onRequestInfoTextChange(e.target.value)
              }
              placeholder="Describe what information you need from this applicant..."
              sx={{
                width: '100%',
                minHeight: 75,
                padding: '9px 12px',
                borderRadius: '9px',
                border: '0.67px solid #E8ECF0',
                background: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#374151',
                lineHeight: '1.5em',
                resize: 'vertical',
                outline: 'none',
                '&::placeholder': {
                  color: 'rgba(55, 65, 81, 0.5)',
                },
                '&:focus': {
                  borderColor: '#D1D5DB',
                },
              }}
            />
            <RowStack spacing={'8px'} sx={{ mt: '12px' }}>
              <Box
                onClick={onCancelRequest}
                sx={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  border: '0.67px solid #E5E7EB',
                  cursor: 'pointer',
                  '&:hover': { background: '#F9FAFB' },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: pxToRem(12),
                    color: '#374151',
                    textAlign: 'center',
                  }}
                >
                  Cancel
                </Typography>
              </Box>
              <Box
                onClick={requestInfoText.trim() ? onSendRequest : undefined}
                sx={{
                  flex: 1,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: requestInfoText.trim() ? '#2F6FED' : '#D1D5DB',
                  cursor: requestInfoText.trim() ? 'pointer' : 'default',
                  '&:hover': requestInfoText.trim() ? { opacity: 0.9 } : {},
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: pxToRem(12),
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                >
                  Send Request
                </Typography>
              </Box>
            </RowStack>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: '8px', pt: '4px' }}>
          {/* Approve */}
          <Box
            onClick={onApprove}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: 38,
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
                fontSize: pxToRem(12.5),
                color: '#059669',
              }}
            >
              Approve
            </Typography>
          </Box>

          {/* Request Info */}
          <Box
            onClick={onRequestInfo}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: 38,
              borderRadius: '10px',
              background: isRequestingInfo ? '#EEF3FF' : '#F7F9FB',
              border: isRequestingInfo
                ? '0.67px solid #C7D7F9'
                : '0.67px solid #E5E7EB',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <InfoOutlinedIcon
              sx={{
                fontSize: 13,
                color: isRequestingInfo ? '#2F6FED' : '#374151',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: isRequestingInfo ? '#2F6FED' : '#374151',
              }}
            >
              Request Info
            </Typography>
          </Box>

          {/* Reject */}
          <Box
            onClick={onReject}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: 38,
              borderRadius: '10px',
              background: '#FEF2F2',
              border: '0.67px solid #FECACA',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <CancelOutlinedIcon sx={{ fontSize: 13, color: '#EF4444' }} />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: '#EF4444',
              }}
            >
              Reject
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};
