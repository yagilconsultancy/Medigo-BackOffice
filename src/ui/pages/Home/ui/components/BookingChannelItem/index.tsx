import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

type BookingChannelItemProps = {
  icon: React.ReactNode;
  label: string;
  count: number;
  percent: number;
  color: string;
  iconBg?: string;
  trendValue: string;
  trendPositive: boolean;
};

export const BookingChannelItem = ({
  icon,
  label,
  count,
  percent,
  color,
  iconBg,
  trendValue,
  trendPositive,
}: BookingChannelItemProps) => {
  return (
    <Stack spacing={'10px'}>
      <RowStack justifyContent="space-between" width="100%">
        <RowStack spacing={'10px'}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              backgroundColor: iconBg || `${color}14`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(13),
              color: '#101828',
            }}
          >
            {label}
          </Typography>
        </RowStack>
        <RowStack spacing={'10px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(15),
              color: '#101828',
            }}
          >
            {count.toLocaleString()}
          </Typography>
          <Box
            sx={{
              padding: '2px 8px',
              borderRadius: '100px',
              backgroundColor: trendPositive ? '#F0FDF4' : '#FEF2F2',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11),
                color: trendPositive ? '#00A63E' : '#EF4444',
              }}
            >
              {trendValue}
            </Typography>
          </Box>
        </RowStack>
      </RowStack>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#F3F4F6',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: color,
          },
        }}
      />
    </Stack>
  );
};
