import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import SignalCellularAltOutlinedIcon from '@mui/icons-material/SignalCellularAltOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import {
  AppButton,
  RowStack,
  StyledImage,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import callIcon from '../../assets/icons/call-icon.svg';
import alertIcon from '../../assets/icons/alert-icon.svg';
import { ReactNode } from 'react';

type TripTelemetryPanelProps = {
  tripId: string;
  patientName: string;
  driverName: string;
  driverPhone?: string;
  speed: string;
  eta: string;
  progress: number;
  status: string;
  pickup: string;
  destination: string;
  vehicle?: string;
  statusColor?: string;
};

export const TripTelemetryPanel = ({
  tripId,
  patientName,
  driverName,
  driverPhone,
  speed,
  eta,
  progress,
  status,
  pickup,
  destination,
  vehicle,
  statusColor,
}: TripTelemetryPanelProps) => {
  const iconSx = { fontSize: 14, color: '#9CA3AF' };

  const telemetryStats: {
    label: string;
    value: string;
    icon: ReactNode;
    valueColor?: string;
  }[] = [
    {
      label: 'SPEED',
      value: speed,
      icon: <SpeedOutlinedIcon sx={iconSx} />,
      valueColor: '#2F6FED',
    },
    {
      label: 'ETA',
      value: eta,
      icon: <AccessTimeOutlinedIcon sx={iconSx} />,
    },
    {
      label: 'PROGRESS',
      value: `${progress}%`,
      icon: <TrendingUpOutlinedIcon sx={iconSx} />,
    },
    {
      label: 'STATUS',
      value: status,
      icon: <SignalCellularAltOutlinedIcon sx={iconSx} />,
      valueColor: statusColor,
    },
    ...(vehicle
      ? [
          {
            label: 'VEHICLE',
            value: vehicle,
            icon: <DirectionsCarOutlinedIcon sx={iconSx} />,
          },
        ]
      : []),
  ];

  return (
    <Stack
      spacing={'16px'}
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        border: '0.67px solid #EAECF0',
      }}
    >
      {/* Header */}
      <RowStack justifyContent="space-between">
        <Stack spacing={'2px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(14),
              color: (theme) => theme.color.deepBlue,
            }}
          >
            Trip Telemetry —{' '}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: pxToRem(14),
                color: '#2F6FED',
              }}
            >
              {tripId}
            </Typography>
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {patientName} · {driverName}
            {vehicle ? ` · ${vehicle}` : ''}
          </Typography>
        </Stack>
        <RowStack spacing={'8px'}>
          {driverPhone && (
            // <AppButton
            //   component="a"
            //   href={`tel:${driverPhone}`}
            //   sx={{
            //     background: '#EBF2FF',
            //     color: '#2F6FED',
            //     fontWeight: 600,
            //     fontSize: pxToRem(11.5),
            //     borderRadius: '8px',
            //     padding: '6px 14px',
            //     minWidth: 'auto',
            //     textDecoration: 'none',
            //     '&:hover': { background: '#DBEAFE' },
            //   }}
            // >
              <RowStack spacing={'4px'}
                sx={{
                  // background: '#EBF2FF',
                  color: '#2F6FED',
                  fontWeight: 600,
                  fontSize: pxToRem(11.5),
                  borderRadius: '8px',
                  padding: '6px 14px',
                  minWidth: 'auto',
                  textDecoration: 'none',
                }}
              >
                {/* <Typography></Typography> */}
                <StyledImage
                  src={callIcon}
                  alt="call"
                  width={12}
                  height={12}
                />
                <span>{`Driver: ${driverPhone}`}</span>
              </RowStack>
            // </AppButton>
          )}
          <AppButton
            sx={{
              background: '#FEF2F2',
              color: '#EF4444',
              fontWeight: 600,
              fontSize: pxToRem(11.5),
              borderRadius: '8px',
              padding: '6px 14px',
              minWidth: 'auto',
              '&:hover': { background: '#FEE2E2' },
            }}
          >
            <RowStack spacing={'4px'}>
              <StyledImage src={alertIcon} alt="alert" width={12} height={12} />
              <span>Alert</span>
            </RowStack>
          </AppButton>
        </RowStack>
      </RowStack>

      {/* Stats Grid */}
      <RowStack spacing={'0px'}>
        {telemetryStats.map((stat, index) => (
          <Stack
            key={index}
            spacing={'2px'}
            sx={{
              flex: 1,
              borderRight:
                index < telemetryStats.length - 1
                  ? '0.67px solid #F3F4F6'
                  : 'none',
              padding: '0 12px',
            }}
          >
            <RowStack spacing={'4px'}>
              {stat.icon}
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(10.5),
                  color: (theme) => theme.color.lightGrey,
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </Typography>
            </RowStack>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(14),
                color: stat.valueColor || ((theme) => theme.color.deepBlue),
              }}
            >
              {stat.value}
            </Typography>
          </Stack>
        ))}
      </RowStack>

      {/* Route */}
      <Stack spacing={'0px'}>
        <RowStack spacing={'8px'}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              border: '2px solid #059669',
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.deepBlue,
            }}
          >
            {pickup}
          </Typography>
        </RowStack>
        <Box
          sx={{
            width: 0,
            height: 16,
            borderLeft: '2px dashed #E5E7EB',
            marginLeft: '3px',
          }}
        />
        <RowStack spacing={'8px'}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#6366F1',
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.deepBlue,
            }}
          >
            {destination}
          </Typography>
        </RowStack>
      </Stack>

      {/* Trip Progress */}
      <Stack spacing={'8px'}>
        <RowStack justifyContent="space-between">
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.deepBlue,
            }}
          >
            Trip Progress
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: '#2F6FED',
            }}
          >
            {progress}%
          </Typography>
        </RowStack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: '#E5E7EB',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              backgroundColor: '#2F6FED',
            },
          }}
        />
        <RowStack justifyContent="space-between">
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(10.5),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            Departed
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(10.5),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {destination}
          </Typography>
        </RowStack>
      </Stack>
    </Stack>
  );
};
