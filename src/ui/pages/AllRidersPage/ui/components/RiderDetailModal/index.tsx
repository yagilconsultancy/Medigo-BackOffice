'use client';

import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AvgPaceOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import type { RiderRow } from '../../..';

// ─── Types ──────────────────────────────────────────────────────────────────

type RiderDetailModalProps = {
  open: boolean;
  onClose: () => void;
  rider: RiderRow | null;
  onSuspend?: (rider: RiderRow) => void;
  onReinstate?: (rider: RiderRow) => void;
  onViewHistory?: (rider: RiderRow) => void;
};

// ─── Detail data per rider (extends table data) ─────────────────────────────

const riderDetails: Record<
  string,
  { dob: string; insurance: string; emergencyContact: string; avgCost: string }
> = {
  'R-001': {
    dob: 'Mar 14, 1954',
    insurance: 'Blue Cross Canada #BC-881234',
    emergencyContact: 'Frank Moore · Husband · +1 514 555 0278',
    avgCost: '$45',
  },
  'R-002': {
    dob: 'Jul 22, 1968',
    insurance: 'Sun Life #SL-334521',
    emergencyContact: 'Maria Garcia · Wife · +1 416 555 0189',
    avgCost: '$40',
  },
  'R-003': {
    dob: 'Nov 5, 1960',
    insurance: 'Manulife #ML-667890',
    emergencyContact: 'Tom White · Son · +1 416 555 0234',
    avgCost: '$38',
  },
  'R-004': {
    dob: 'N/A',
    insurance: 'Manulife #ML-998765',
    emergencyContact: 'Susan Lewis · Wife · +1 613 555 0313',
    avgCost: '$40',
  },
  'R-005': {
    dob: 'Sep 12, 1971',
    insurance: 'Great-West Life #GW-112233',
    emergencyContact: 'James Clark · Husband · +1 416 555 0345',
    avgCost: '$44',
  },
  'R-006': {
    dob: 'Jan 30, 1985',
    insurance: 'Desjardins #DJ-445566',
    emergencyContact: 'Ana Martinez · Sister · +1 416 555 0456',
    avgCost: '$40',
  },
  'R-007': {
    dob: 'Apr 18, 1978',
    insurance: 'Blue Cross Canada #BC-778899',
    emergencyContact: 'Mark Anderson · Husband · +1 416 555 0567',
    avgCost: '$40',
  },
  'R-008': {
    dob: 'N/A',
    insurance: 'Ontario Health #OH-556677',
    emergencyContact: 'Admin Office · +1 408 555 0100',
    avgCost: '$40',
  },
};

const statusConfig: Record<
  string,
  { color: string; bg: string; gradient: string }
> = {
  Active: {
    color: '#059669',
    bg: '#ECFDF5',
    gradient:
      'linear-gradient(135deg, rgba(47, 111, 237, 1) 0%, rgba(47, 111, 237, 0.33) 100%)',
  },
  Inactive: {
    color: '#6B7280',
    bg: '#F3F4F6',
    gradient:
      'linear-gradient(135deg, rgba(107, 114, 128, 1) 0%, rgba(107, 114, 128, 0.33) 100%)',
  },
  Suspended: {
    color: '#EF4444',
    bg: '#FEF2F2',
    gradient:
      'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(239, 68, 68, 0.33) 100%)',
  },
};

// ─── Reusable info field ────────────────────────────────────────────────────

const InfoField = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Stack
    spacing={'4px'}
    sx={{
      background: '#F7F9FB',
      borderRadius: '14px',
      padding: '10px 12px',
    }}
  >
    <RowStack spacing={'6px'}>
      {icon}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(10.5),
          color: '#9CA3AF',
        }}
      >
        {label}
      </Typography>
    </RowStack>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12.5),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

// ─── Stat Card ──────────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <Stack
    sx={{
      flex: 1,
      background: '#F7F9FB',
      border: '0.67px solid #F0F4F8',
      borderRadius: '14px',
      padding: '12px',
      alignItems: 'center',
      position: 'relative',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(18),
        color: '#111827',
        mt: '16px',
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(11),
        color: '#9CA3AF',
      }}
    >
      {label}
    </Typography>
  </Stack>
);

// ─── Section Header ─────────────────────────────────────────────────────────

const SectionHeader = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <RowStack spacing={'8px'}>
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(11),
        letterSpacing: '0.6px',
        textTransform: 'uppercase',
        color: '#374151',
      }}
    >
      {label}
    </Typography>
  </RowStack>
);

// ─── Component ──────────────────────────────────────────────────────────────

export const RiderDetailModal = ({
  open,
  onClose,
  rider,
  onSuspend,
  onReinstate,
  onViewHistory,
}: RiderDetailModalProps) => {
  if (!rider) return null;

  const detail = riderDetails[rider.id] || {
    dob: '—',
    insurance: '—',
    emergencyContact: '—',
    avgCost: '—',
  };

  const config = statusConfig[rider.status] || statusConfig.Active;
  const isSuspended = rider.status === 'Suspended';

  const iconSx = { fontSize: 11, color: '#9CA3AF' };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="rider-detail-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: '580px',
          maxHeight: '90vh',
          borderRadius: '16px',
          boxShadow: '0px 24px 64px 0px rgba(0, 0, 0, 0.14)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Scrollable content */}
        <Stack
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          {/* Close Button */}
          <RowStack
            justifyContent={'flex-end'}
            sx={{ padding: '20px 24px 0px 0px' }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                width: 30,
                height: 30,
                borderRadius: '8px',
                background: '#F3F4F6',
                border: '0.67px solid #E5E7EB',
              }}
            >
              <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
            </IconButton>
          </RowStack>

          {/* Suspended Banner */}
          {isSuspended && (
            <Box sx={{ px: '24px', pt: '12px' }}>
              <RowStack
                spacing={'12px'}
                sx={{
                  background: '#FEF2F2',
                  border: '0.67px solid #FECACA',
                  borderRadius: '14px',
                  padding: '12px 16px',
                }}
              >
                <WarningAmberOutlinedIcon
                  sx={{ fontSize: 14, color: '#EF4444' }}
                />
                <Stack>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12.5),
                      color: '#EF4444',
                    }}
                  >
                    Account Suspended
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11.5),
                      color: '#F87171',
                    }}
                  >
                    This rider cannot book trips until reinstated.
                  </Typography>
                </Stack>
              </RowStack>
            </Box>
          )}

          {/* Avatar + Name + Status */}
          <Stack
            alignItems={'center'}
            spacing={'8px'}
            sx={{
              pt: '20px',
              pb: '20px',
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            {/* Avatar with gradient border */}
            <Box
              sx={{
                width: 84,
                height: 84,
                borderRadius: '50%',
                background: config.gradient,
                padding: '3px',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  padding: '3px',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonOutlinedIcon sx={{ fontSize: 32, color: '#9CA3AF' }} />
                </Box>
              </Box>
            </Box>

            {/* Name */}
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(20),
                color: '#111827',
              }}
            >
              {rider.client}
            </Typography>

            {/* Status + Member Since */}
            <RowStack spacing={'8px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(11.5),
                  color: config.color,
                }}
              >
                {rider.status}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                }}
              >
                ·
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                }}
              >
                Member since {rider.joined}
              </Typography>
            </RowStack>

            {/* Stat Cards Row */}
            <RowStack
              spacing={'12px'}
              sx={{ px: '32px', pt: '8px', width: '100%' }}
            >
              <StatCard
                icon={
                  <DirectionsCarOutlinedIcon
                    sx={{ fontSize: 14, color: '#9CA3AF' }}
                  />
                }
                value={String(rider.trips)}
                label="Total Rides"
              />
              <StatCard
                icon={
                  <AttachMoneyOutlinedIcon
                    sx={{ fontSize: 14, color: '#9CA3AF' }}
                  />
                }
                value={rider.spent}
                label="Total Spent"
              />
              <StatCard
                icon={
                  <AvgPaceOutlinedIcon
                    sx={{ fontSize: 14, color: '#9CA3AF' }}
                  />
                }
                value={detail.avgCost}
                label="Avg Cost"
              />
            </RowStack>
          </Stack>

          {/* Body — Personal Info, Insurance, Emergency Contact */}
          <Stack spacing={'20px'} sx={{ padding: '24px 32px' }}>
            {/* Personal Information */}
            <Stack spacing={'12px'}>
              <SectionHeader
                icon={
                  <PersonOutlinedIcon sx={{ fontSize: 13, color: '#2F6FED' }} />
                }
                label="Personal Information"
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                <InfoField
                  icon={<EmailOutlinedIcon sx={iconSx} />}
                  label="Email"
                  value={rider.email}
                />
                <InfoField
                  icon={<PhoneOutlinedIcon sx={iconSx} />}
                  label="Phone"
                  value={rider.phone}
                />
                <InfoField
                  icon={<CakeOutlinedIcon sx={iconSx} />}
                  label="Date of Birth"
                  value={detail.dob}
                />
                <InfoField
                  icon={<CalendarTodayOutlinedIcon sx={iconSx} />}
                  label="Member Since"
                  value={rider.joined}
                />
                <InfoField
                  icon={<RepeatOutlinedIcon sx={iconSx} />}
                  label="Ride Frequency"
                  value={rider.frequency}
                />
                <InfoField
                  icon={<ConfirmationNumberOutlinedIcon sx={iconSx} />}
                  label="Support Tickets"
                  value={
                    rider.tickets === '—' ? '0 open' : `${rider.tickets} open`
                  }
                />
              </Box>
            </Stack>

            {/* Insurance */}
            <Stack spacing={'12px'}>
              <SectionHeader
                icon={
                  <LocalHospitalOutlinedIcon
                    sx={{ fontSize: 13, color: '#2F6FED' }}
                  />
                }
                label="Insurance"
              />
              <RowStack
                spacing={'12px'}
                sx={{
                  background: '#F7F9FB',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '14px',
                  padding: '12px 16px',
                }}
              >
                <VerifiedOutlinedIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(13),
                    color: '#111827',
                  }}
                >
                  {detail.insurance}
                </Typography>
              </RowStack>
            </Stack>

            {/* Emergency Contact */}
            <Stack spacing={'12px'}>
              <SectionHeader
                icon={
                  <ContactPhoneOutlinedIcon
                    sx={{ fontSize: 13, color: '#2F6FED' }}
                  />
                }
                label="Emergency Contact"
              />
              <RowStack
                spacing={'12px'}
                sx={{
                  background: '#F7F9FB',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '14px',
                  padding: '12px 16px',
                }}
              >
                <PersonOutlinedIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(13),
                    color: '#111827',
                  }}
                >
                  {detail.emergencyContact}
                </Typography>
              </RowStack>
            </Stack>

            {/* Footer Buttons */}
            <RowStack spacing={'12px'} sx={{ pt: '4px', pb: '24px' }}>
              {isSuspended ? (
                <Box
                  onClick={() => onReinstate?.(rider)}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '41px',
                    background: '#ECFDF5',
                    border: '0.67px solid #BBF7D0',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                    '&:hover': { opacity: 0.85 },
                  }}
                >
                  <CheckCircleOutlinedIcon
                    sx={{ fontSize: 14, color: '#059669' }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#059669',
                    }}
                  >
                    Reinstate Rider
                  </Typography>
                </Box>
              ) : (
                <Box
                  onClick={() => onSuspend?.(rider)}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '41px',
                    background: '#FEF2F2',
                    border: '0.67px solid #FECACA',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'opacity 0.15s ease',
                    '&:hover': { opacity: 0.85 },
                  }}
                >
                  <BlockOutlinedIcon sx={{ fontSize: 14, color: '#EF4444' }} />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#EF4444',
                    }}
                  >
                    Suspend Rider
                  </Typography>
                </Box>
              )}

              <Box
                onClick={() => onViewHistory?.(rider)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  height: '41px',
                  background: '#2F6FED',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                <HistoryOutlinedIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#FFFFFF',
                  }}
                >
                  View Ride History
                </Typography>
              </Box>
            </RowStack>
          </Stack>
        </Stack>
      </Stack>
    </AppModal>
  );
};
