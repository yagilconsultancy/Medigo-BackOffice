import { Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

type BreadcrumbProps = {
  bookingId: string;
};

export const Breadcrumb = ({ bookingId }: BreadcrumbProps) => {
  return (
    <RowStack spacing={'5px'}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13.5),
          color: (theme) => theme.color.lightGrey,
        }}
      >
        Booking Management
      </Typography>
      <NavigateNextIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13.5),
          color: (theme) => theme.color.lightGrey,
        }}
      >
        All Bookings
      </Typography>
      <NavigateNextIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(13.5),
          color: 'primary.main',
        }}
      >
        {bookingId}
      </Typography>
    </RowStack>
  );
};
