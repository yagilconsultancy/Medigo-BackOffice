import { Avatar, Box, Chip, Drawer, IconButton, Rating, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';

export type FleetDriverRow = {
  id: string;
  name: string;
  avatar: string;
  fleetCompany: string;
  vehicle: string;
  plate: string;
  status: DriverStatus;
  rating: number;
  trips: number;
  joinedDate: string;
  phone: string;
  email: string;
  license: string;
};

// ─── Status Config ──────────────────────────────────────────────────────────

const statusConfig: Record<
  DriverStatus,
  { color: string; bg: string; activeBorder: string }
> = {
  Available: { color: '#059669', bg: '#ECFDF5', activeBorder: '#059669' },
  'On Trip': { color: '#D97706', bg: '#FFFBEB', activeBorder: '#D97706' },
  'Off Duty': { color: '#6B7280', bg: '#F3F4F6', activeBorder: '#6B7280' },
  Suspended: { color: '#EF4444', bg: '#FEF2F2', activeBorder: '#EF4444' },
};

const statusOptions: DriverStatus[] = [
  'Available',
  'On Trip',
  'Off Duty',
  'Suspended',
];

// ─── Component ──────────────────────────────────────────────────────────────

type FleetDriverProfileDrawerProps = {
  open: boolean;
  onClose: () => void;
  driver: FleetDriverRow | null;
  onStatusChange?: (driver: FleetDriverRow, newStatus: DriverStatus) => void;
};

export const FleetDriverProfileDrawer = ({
  open,
  onClose,
  driver,
  onStatusChange,
}: FleetDriverProfileDrawerProps) => {
  if (!driver) return null;

  const currentStatus = statusConfig[driver.status];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '405px',
          boxShadow: '-4px 0px 40px 0px rgba(0, 0, 0, 0.12)',
          border: 'none',
        },
      }}
    >
      <Stack sx={{ height: '100%', overflow: 'auto' }}>
        {/* Blue Header Section */}
        <Stack
          sx={{
            background: '#2F6FED',
            padding: '24px',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <CloseIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
          </IconButton>

          {/* Avatar */}
          <Avatar
            src={driver.avatar}
            alt={driver.name}
            sx={{
              width: 60,
              height: 60,
              border: '1px solid rgba(255, 255, 255, 0.8)',
              background: 'rgba(255, 255, 255, 0.2)',
              fontSize: pxToRem(20),
              fontWeight: 700,
            }}
          >
            {driver.name.charAt(0)}
          </Avatar>

          {/* Name */}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(18),
              lineHeight: '1.5em',
              color: '#FFFFFF',
              marginTop: '12px',
            }}
          >
            {driver.name}
          </Typography>

          {/* Fleet + Joined */}
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12.5),
              lineHeight: '1.5em',
              color: 'rgba(255, 255, 255, 0.75)',
            }}
          >
            {driver.fleetCompany} · Joined {driver.joinedDate}
          </Typography>

          {/* Rating + Trips Badges */}
          <RowStack spacing={'8px'} sx={{ marginTop: '12px' }}>
            <Chip
              icon={
                <StarIcon
                  sx={{ fontSize: 11, color: '#FCD34D !important' }}
                />
              }
              label={driver.rating.toFixed(1)}
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                height: '27px',
                borderRadius: '100px',
                '& .MuiChip-icon': { marginLeft: '8px' },
              }}
            />
            <Chip
              label={`${driver.trips} trips`}
              size="small"
              sx={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                height: '27px',
                borderRadius: '100px',
              }}
            />
          </RowStack>
        </Stack>

        {/* Content Sections */}
        <Stack spacing={'20px'} sx={{ padding: '24px', flex: 1 }}>
          {/* Current Status */}
          <Stack spacing={'8px'}>
            <SectionLabel>CURRENT STATUS</SectionLabel>
            <Chip
              icon={
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: 13,
                    color: `${currentStatus.color} !important`,
                  }}
                />
              }
              label={driver.status}
              sx={{
                background: currentStatus.bg,
                color: currentStatus.color,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(13),
                height: '32px',
                borderRadius: '100px',
                width: 'fit-content',
                '& .MuiChip-icon': { marginLeft: '8px' },
              }}
            />

            {/* Change Status */}
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11),
                lineHeight: '1.5em',
                letterSpacing: '0.08em',
                color: '#9CA3AF',
                textTransform: 'uppercase',
                marginTop: '8px !important',
              }}
            >
              CHANGE STATUS
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              {statusOptions.map((status) => {
                const isActive = driver.status === status;
                const config = statusConfig[status];
                return (
                  <Box
                    key={status}
                    onClick={() => onStatusChange?.(driver, status)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '35px',
                      background: isActive ? config.bg : '#FFFFFF',
                      border: `0.67px solid ${isActive ? config.activeBorder : '#E8ECF0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12),
                        lineHeight: '1.5em',
                        color: isActive ? config.color : '#6B7280',
                        textAlign: 'center',
                      }}
                    >
                      {status}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Stack>

          {/* Contact */}
          <Stack spacing={'8px'}>
            <SectionLabel>CONTACT</SectionLabel>
            <InfoPill
              icon={
                <PhoneOutlinedIcon
                  sx={{ fontSize: 14, color: '#9CA3AF' }}
                />
              }
              value={driver.phone}
            />
            <InfoPill
              icon={
                <EmailOutlinedIcon
                  sx={{ fontSize: 14, color: '#9CA3AF' }}
                />
              }
              value={driver.email}
            />
          </Stack>

          {/* Vehicle */}
          <Stack spacing={'8px'}>
            <SectionLabel>VEHICLE</SectionLabel>
            <Stack
              sx={{
                background: '#F7F9FB',
                borderRadius: '14px',
                padding: '12px 16px',
              }}
            >
              <RowStack spacing={'8px'}>
                <DirectionsCarOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    lineHeight: '1.5em',
                    color: '#374151',
                  }}
                >
                  {driver.vehicle}
                </Typography>
              </RowStack>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  lineHeight: '1.5em',
                  color: '#9CA3AF',
                  marginTop: '4px',
                }}
              >
                Plate: {driver.plate}
              </Typography>
            </Stack>
          </Stack>

          {/* License */}
          <Stack spacing={'8px'}>
            <SectionLabel>LICENSE</SectionLabel>
            <Box
              sx={{
                background: '#F7F9FB',
                borderRadius: '14px',
                padding: '14px 16px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#374151',
                }}
              >
                {driver.license}
              </Typography>
            </Box>
          </Stack>

          {/* Fleet Network */}
          <Stack spacing={'8px'}>
            <SectionLabel>FLEET NETWORK</SectionLabel>
            <Box
              sx={{
                background: '#F7F9FB',
                borderRadius: '14px',
                padding: '14px 16px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  lineHeight: '1.5em',
                  color: '#2F6FED',
                }}
              >
                {driver.fleetCompany}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Footer Buttons */}
        <RowStack spacing={'8px'} sx={{ padding: '0 24px 24px' }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '41px',
              background: '#EEF3FF',
              border: '0.67px solid #C7D7F9',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <ChatBubbleOutlineIcon
              sx={{ fontSize: 13, color: '#2F6FED' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                lineHeight: '1.5em',
                color: '#2F6FED',
              }}
            >
              Message
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              height: '41px',
              background: '#FEF2F2',
              border: '0.67px solid #FECACA',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <PersonRemoveOutlinedIcon
              sx={{ fontSize: 13, color: '#DC2626' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                lineHeight: '1.5em',
                color: '#DC2626',
              }}
            >
              Remove
            </Typography>
          </Box>
        </RowStack>
      </Stack>
    </Drawer>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(10),
      lineHeight: '1.5em',
      letterSpacing: '0.08em',
      color: '#9CA3AF',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </Typography>
);

const InfoPill = ({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) => (
  <RowStack
    spacing={'12px'}
    sx={{
      background: '#F7F9FB',
      borderRadius: '14px',
      padding: '12px 16px',
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(13),
        lineHeight: '1.5em',
        color: '#374151',
      }}
    >
      {value}
    </Typography>
  </RowStack>
);
