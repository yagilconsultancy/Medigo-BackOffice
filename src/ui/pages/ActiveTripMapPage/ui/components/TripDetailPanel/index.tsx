import { Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { ActiveTripData } from '../../../index';

type TripDetailPanelProps = {
  trip: ActiveTripData;
};

export const TripDetailPanel = ({ trip }: TripDetailPanelProps) => {
  const isArrived = trip.eta === 'Arrived';

  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '0.67px solid #EAECF0',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Driver Header */}
      <Stack
        spacing={'8px'}
        sx={{
          padding: '16px 20px',
          background: '#FAFBFC',
          borderBottom: '0.67px solid #F0F2F5',
        }}
      >
        <RowStack spacing={'12px'}>
          {/* Driver Avatar */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${trip.driverColor} 0%, ${trip.driverColor}BA 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 800,
                fontSize: pxToRem(12),
                color: '#FFFFFF',
                lineHeight: 1,
              }}
            >
              {trip.driverInitials}
            </Typography>
          </Box>

          {/* Driver Info */}
          <Stack spacing={'1px'} sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(13.5),
                color: '#111827',
              }}
            >
              {trip.driverName}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11.5),
                color: '#9CA3AF',
              }}
            >
              {trip.vehicle}
            </Typography>
          </Stack>

          {/* Status Badge */}
          <Chip
            icon={
              <FiberManualRecordIcon
                sx={{
                  fontSize: 5,
                  color:
                    trip.status === 'Completed'
                      ? '#9CA3AF !important'
                      : '#2F6FED !important',
                }}
              />
            }
            label={trip.status}
            size="small"
            sx={{
              background: trip.status === 'Completed' ? '#F3F4F6' : '#EEF3FF',
              color: trip.status === 'Completed' ? '#9CA3AF' : '#2F6FED',
              border: `0.67px solid ${trip.status === 'Completed' ? '#E5E7EB' : '#C7D7F9'}`,
              fontSize: pxToRem(11),
              fontWeight: 600,
              height: '26px',
              borderRadius: '13px',
            }}
          />
        </RowStack>

        {/* Trip ID + Patient */}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(11),
            color: '#2F6FED',
          }}
        >
          {trip.tripId} · Patient: {trip.patientName}
        </Typography>
      </Stack>

      {/* Content */}
      <Stack spacing={'16px'} sx={{ padding: '16px 20px 0' }}>
        {/* 2x2 Metric Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          <MetricBox
            icon={<SpeedOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />}
            label="CURRENT SPEED"
            value={trip.speed}
          />
          <MetricBox
            icon={
              <AccessTimeOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />
            }
            label="ETA"
            value={isArrived ? 'Arrived' : trip.eta}
            valueColor={isArrived ? '#059669' : undefined}
            valueIcon={
              isArrived ? (
                <CheckCircleOutlinedIcon
                  sx={{ fontSize: 14, color: '#059669' }}
                />
              ) : undefined
            }
          />
          <MetricBox
            icon={
              <AccessTimeOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />
            }
            label="ELAPSED"
            value={trip.elapsed}
          />
          <MetricBox
            icon={
              <TrendingUpOutlinedIcon sx={{ fontSize: 11, color: '#9CA3AF' }} />
            }
            label="PROGRESS"
            value={`${trip.progress}%`}
          />
        </Box>

        {/* Trip Progress */}
        <Stack spacing={'6px'}>
          <RowStack justifyContent="space-between">
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#374151',
              }}
            >
              Trip Progress
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(12),
                color: trip.driverColor,
              }}
            >
              {trip.progress.toFixed(1)}%
            </Typography>
          </RowStack>
          <LinearProgress
            variant="determinate"
            value={trip.progress}
            sx={{
              height: 8,
              borderRadius: '4px',
              backgroundColor: '#EEF3FF',
              '& .MuiLinearProgress-bar': {
                borderRadius: '4px',
                background: `linear-gradient(90deg, ${trip.driverColor} 0%, ${trip.driverColor}99 100%)`,
              },
            }}
          />
        </Stack>

        {/* Route Section */}
        <Stack
          sx={{
            border: '0.67px solid #F0F2F5',
            borderRadius: '14px',
            padding: '12px',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(10),
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: '5%',
              marginBottom: '10px',
            }}
          >
            Route
          </Typography>

          {/* Pickup */}
          <RowStack spacing={'8px'}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                border: '1.33px solid #22C55E',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#374151',
              }}
            >
              {trip.pickup}
            </Typography>
          </RowStack>

          {/* Connector */}
          <Box
            sx={{
              width: 0,
              height: 12,
              borderLeft: '1.33px dashed #D1D5DB',
              marginLeft: '3px',
            }}
          />

          {/* Destination */}
          <RowStack spacing={'8px'}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#7C3AED',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#374151',
              }}
            >
              {trip.destination}
            </Typography>
          </RowStack>
        </Stack>

        {/* Special Tag */}
        {trip.tag && (
          <RowStack
            spacing={'6px'}
            sx={{
              background: '#FFFBEB',
              border: '0.67px solid #FDE68A',
              borderRadius: '14px',
              padding: '6px 12px',
              alignSelf: 'flex-start',
            }}
          >
            {trip.tag === 'Wheelchair' ? (
              <AccessibleOutlinedIcon sx={{ fontSize: 14, color: '#92400E' }} />
            ) : (
              <SecurityOutlinedIcon sx={{ fontSize: 14, color: '#92400E' }} />
            )}
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(12),
                color: '#92400E',
              }}
            >
              {trip.tag}
            </Typography>
          </RowStack>
        )}
      </Stack>

      {/* Action Buttons */}
      <RowStack
        spacing={'8px'}
        sx={{
          padding: '16px 20px',
          borderTop: '0.67px solid #F0F2F5',
          marginTop: 'auto',
        }}
      >
        <ActionButton
          icon={<PhoneOutlinedIcon sx={{ fontSize: 13, color: '#2F6FED' }} />}
          label="Call"
          bg="#EEF3FF"
          borderColor="#C7D7F9"
          textColor="#2F6FED"
        />
        <ActionButton
          icon={
            <ChatBubbleOutlineOutlinedIcon
              sx={{ fontSize: 13, color: '#374151' }}
            />
          }
          label="Message"
          bg="#F7F9FB"
          borderColor="#E5E7EB"
          textColor="#374151"
        />
        <ActionButton
          icon={
            <WarningAmberOutlinedIcon sx={{ fontSize: 13, color: '#DC2626' }} />
          }
          label="Alert"
          bg="#FEF2F2"
          borderColor="#FECACA"
          textColor="#DC2626"
        />
      </RowStack>
    </Stack>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const MetricBox = ({
  icon,
  label,
  value,
  valueColor,
  valueIcon,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  valueIcon?: React.ReactNode;
}) => (
  <Stack
    spacing={'6px'}
    sx={{
      padding: '12px',
      border: '0.67px solid #F0F2F5',
      borderRadius: '14px',
      background: '#F7F9FB',
    }}
  >
    <RowStack spacing={'4px'}>
      {icon}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(10),
          color: '#9CA3AF',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </Typography>
    </RowStack>
    <RowStack spacing={'4px'}>
      {valueIcon}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(14),
          color: valueColor || '#111827',
        }}
      >
        {value}
      </Typography>
    </RowStack>
  </Stack>
);

const ActionButton = ({
  icon,
  label,
  bg,
  borderColor,
  textColor,
}: {
  icon: React.ReactNode;
  label: string;
  bg: string;
  borderColor: string;
  textColor: string;
}) => (
  <RowStack
    spacing={'6px'}
    sx={{
      flex: 1,
      justifyContent: 'center',
      padding: '10px 0',
      background: bg,
      border: `0.67px solid ${borderColor}`,
      borderRadius: '14px',
      cursor: 'pointer',
      transition: 'opacity 0.15s',
      '&:hover': { opacity: 0.85 },
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12.5),
        color: textColor,
      }}
    >
      {label}
    </Typography>
  </RowStack>
);
