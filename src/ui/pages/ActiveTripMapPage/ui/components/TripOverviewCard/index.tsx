import { Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { ActiveTripData } from '../../../index';

type TripOverviewCardProps = {
  trip: ActiveTripData;
  isSelected?: boolean;
  onClick?: () => void;
};

export const TripOverviewCard = ({
  trip,
  isSelected,
  onClick,
}: TripOverviewCardProps) => {
  const statusStyles = getStatusStyles(trip.status);

  return (
    <Stack
      onClick={onClick}
      spacing={'8px'}
      sx={{
        width: 212,
        minWidth: 212,
        padding: '17px',
        background: isSelected ? '#EEF3FF' : '#FFFFFF',
        border: `1.33px solid ${isSelected ? '#2F6FED' : '#EAECF0'}`,
        borderRadius: '16px',
        cursor: 'pointer',
        boxShadow: isSelected
          ? '0px 0px 0px 3px rgba(47, 111, 237, 0.08)'
          : '0px 1px 3px 0px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.15s',
        '&:hover': {
          borderColor: isSelected ? '#2F6FED' : '#C7D7F9',
        },
      }}
    >
      {/* Header: Avatar + Trip ID + Status */}
      <RowStack justifyContent="space-between">
        <RowStack spacing={'8px'}>
          {/* Avatar */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '14px',
              background: trip.driverColor,
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
                fontSize: pxToRem(9.5),
                color: '#FFFFFF',
                lineHeight: 1,
              }}
            >
              {trip.driverInitials}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(11.5),
              color: '#6B7280',
            }}
          >
            {trip.tripId}
          </Typography>
        </RowStack>

        {/* Status Badge */}
        <Chip
          icon={
            <FiberManualRecordIcon
              sx={{
                fontSize: 5,
                color: `${statusStyles.color} !important`,
              }}
            />
          }
          label={trip.status}
          size="small"
          sx={{
            background: statusStyles.bg,
            color: statusStyles.color,
            border: `0.67px solid ${statusStyles.border}`,
            fontSize: pxToRem(10),
            fontWeight: 600,
            height: '20px',
            borderRadius: '10px',
            '& .MuiChip-label': { padding: '0 6px 0 2px' },
          }}
        />
      </RowStack>

      {/* Patient Name */}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(12.5),
          color: '#111827',
        }}
      >
        {trip.patientName}
      </Typography>

      {/* Driver Name */}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11.5),
          color: '#9CA3AF',
          marginTop: '-4px !important',
        }}
      >
        {trip.driverName}
      </Typography>

      {/* Speed + ETA */}
      <RowStack justifyContent="space-between">
        <RowStack spacing={'4px'}>
          <SpeedOutlinedIcon sx={{ fontSize: 10, color: '#9CA3AF' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#6B7280',
            }}
          >
            {trip.speed}
          </Typography>
        </RowStack>
        <RowStack spacing={'4px'}>
          <AccessTimeOutlinedIcon sx={{ fontSize: 10, color: '#9CA3AF' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#6B7280',
            }}
          >
            {trip.eta}
          </Typography>
        </RowStack>
      </RowStack>

      {/* Progress Bar */}
      <Stack spacing={'4px'}>
        <LinearProgress
          variant="determinate"
          value={trip.progress}
          sx={{
            height: 4,
            borderRadius: '2px',
            backgroundColor: '#E5E7EB',
            '& .MuiLinearProgress-bar': {
              borderRadius: '2px',
              backgroundColor: trip.driverColor,
            },
          }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(10.5),
            color: '#9CA3AF',
          }}
        >
          {trip.progress}%
        </Typography>
      </Stack>
    </Stack>
  );
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Transit':
      return { bg: '#EEF3FF', color: '#2F6FED', border: '#C7D7F9' };
    case 'Arriving':
      return { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' };
    default:
      return { bg: '#F3F4F6', color: '#9CA3AF', border: '#E5E7EB' };
  }
};
