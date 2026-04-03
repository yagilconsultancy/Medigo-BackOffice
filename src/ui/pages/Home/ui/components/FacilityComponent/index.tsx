import { Avatar, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

type FacilityComponentProps = {
  num: string;
  name: string;
  type: string;
  bookings: number;
  acceptanceRate: number;
  iconBg: string;
  icon: React.ReactNode;
};

export const FacilityComponent = ({
  num,
  name,
  type,
  bookings,
  acceptanceRate,
  iconBg,
  icon,
}: FacilityComponentProps) => {
  return (
    <RowStack
      width="100%"
      justifyContent="space-between"
      sx={{
        background: '#F7F9FB',
        padding: '12px 16px',
        borderRadius: '14px',
      }}
    >
      <RowStack spacing={'12px'} flex={1}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#99A1AF',
          }}
        >
          {`#${num}`}
        </Typography>
        <Avatar
          sx={{
            bgcolor: iconBg,
            width: 40,
            height: 40,
          }}
        >
          {icon}
        </Avatar>
        <Stack spacing={0.3}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#101828',
            }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#6A7282',
            }}
          >
            {type} &middot; {bookings} bookings
          </Typography>
        </Stack>
      </RowStack>
      <Stack alignItems="flex-end" spacing={0}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#00A63E',
          }}
        >
          {acceptanceRate}%
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: '#9CA3AF',
          }}
        >
          Accepted
        </Typography>
      </Stack>
    </RowStack>
  );
};
