import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import {
  AppButton,
  RowStack,
  StyledImage,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import callIcon from '../../assets/icons/call-icon.svg';
import alertIcon from '../../assets/icons/alert-icon.svg';

type TripTelemetryPanelProps = {
  tripId: string;
  patientName: string;
  driverName: string;
  speed: string;
  eta: string;
  progress: number;
  status: string;
  pickup: string;
  destination: string;
};

export const TripTelemetryPanel = ({
  tripId,
  patientName,
  driverName,
  speed,
  eta,
  progress,
  status,
  pickup,
  destination,
}: TripTelemetryPanelProps) => {
  const telemetryStats = [
    { label: 'Speed', value: speed },
    { label: 'ETA', value: eta },
    { label: 'Progress', value: `${progress}%` },
    { label: 'Status', value: status },
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
            Trip Telemetry — {tripId}
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
          </Typography>
        </Stack>
        <RowStack spacing={'8px'}>
          <AppButton
            sx={{
              background: '#EBF2FF',
              color: '#2F6FED',
              fontWeight: 600,
              fontSize: pxToRem(11.5),
              borderRadius: '8px',
              padding: '6px 14px',
              minWidth: 'auto',
              '&:hover': { background: '#DBEAFE' },
            }}
          >
            <RowStack spacing={'4px'}>
              <StyledImage src={callIcon} alt="call" width={12} height={12} />
              <span>Call</span>
            </RowStack>
          </AppButton>
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
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(14),
                color: (theme) => theme.color.deepBlue,
              }}
            >
              {stat.value}
            </Typography>
          </Stack>
        ))}
      </RowStack>

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
            {pickup}
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
