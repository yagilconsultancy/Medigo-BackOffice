import { Avatar, Box, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import StarIcon from '@mui/icons-material/Star';

type FleetPartnerComponentProps = {
  num: string;
  name: string;
  initials: string;
  vehicles: number;
  trips: number;
  rating: number;
  avatarBg: string;
};

export const FleetPartnerComponent = ({
  num,
  name,
  initials,
  vehicles,
  trips,
  rating,
  avatarBg,
}: FleetPartnerComponentProps) => {
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
            bgcolor: avatarBg,
            width: 40,
            height: 40,
            fontSize: pxToRem(14),
            fontWeight: 600,
            borderRadius: '12px',
          }}
          variant="rounded"
        >
          {initials}
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
            {vehicles} vehicles &middot; {trips.toLocaleString()} trips
          </Typography>
        </Stack>
      </RowStack>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: '100px',
          backgroundColor: '#FFFBEB',
        }}
      >
        <StarIcon sx={{ fontSize: 16, color: '#FE9A00' }} />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#BB4D00',
          }}
        >
          {rating.toFixed(1)}
        </Typography>
      </Box>
    </RowStack>
  );
};
