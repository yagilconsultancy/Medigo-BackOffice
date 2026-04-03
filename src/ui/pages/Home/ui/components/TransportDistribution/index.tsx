import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

type TransportType = {
  label: string;
  trips: number;
  percent: number;
  color: string;
};

type TransportDistributionProps = {
  data: TransportType[];
  clientPercent: number;
  facilityPercent: number;
};

export const TransportDistribution = ({
  data,
  clientPercent,
  facilityPercent,
}: TransportDistributionProps) => {
  return (
    <Stack spacing={'20px'}>
      {data.map((item) => (
        <Stack key={item.label} spacing={'10px'}>
          <RowStack justifyContent="space-between" width="100%">
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(13),
                color: '#364153',
              }}
            >
              {item.label}
            </Typography>
            <RowStack spacing={'6px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#6A7282',
                }}
              >
                {item.trips.toLocaleString()} trips
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#101828',
                }}
              >
                {item.percent}%
              </Typography>
            </RowStack>
          </RowStack>
          <LinearProgress
            variant="determinate"
            value={item.percent}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#F0F4F8',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: item.color,
              },
            }}
          />
        </Stack>
      ))}

      {/* Client vs Facility split */}
      <RowStack justifyContent="space-between" sx={{ paddingTop: '8px' }}>
        <Stack spacing={'2px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#9CA3AF',
            }}
          >
            Client Bookings
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(20),
              color: '#155DFC',
            }}
          >
            {clientPercent}%
          </Typography>
        </Stack>
        <Box
          sx={{
            width: '1px',
            height: '40px',
            backgroundColor: '#F0F4F8',
          }}
        />
        <Stack spacing={'2px'} alignItems="flex-end">
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#9CA3AF',
            }}
          >
            Facility Bookings
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(20),
              color: '#9810FA',
            }}
          >
            {facilityPercent}%
          </Typography>
        </Stack>
      </RowStack>
    </Stack>
  );
};
