import { Typography } from '@mui/material';
import { pxToRem } from '../../../../../../common';

type BookingIdComponentProps = {
  bookingId: string;
};

export const BookingIdComponent = ({ bookingId }: BookingIdComponentProps) => {
  return (
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        color: 'primary.main',
        fontWeight: 600,
        fontSize: pxToRem(13),
        lineHeight: '19.5px',
      }}
    >
      {bookingId}
    </Typography>
  );
};
