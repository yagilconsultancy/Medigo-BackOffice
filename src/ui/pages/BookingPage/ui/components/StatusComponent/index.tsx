import { alpha, Chip, useTheme } from '@mui/material';
import { pxToRem } from '../../../../../../common';
import { BookingRow } from '../../..';

type StatusComponentProps = {
  status: BookingRow['status'];
};

export const StatusComponent = ({ status }: StatusComponentProps) => {
  const theme = useTheme();
  const statusColorMap: Record<BookingRow['status'], string> = {
    Pending: theme.color.warning,
    Approved: theme.color.success,
    Declined: theme.color.error,
    None: theme.color.lightGrey,
    Processed: theme.color.success,
    "Full Refund": theme.color.success,
  };

  const color = statusColorMap[status];

  return (
    <Chip
      variant="filled"
      label={status}
      sx={{
        background: alpha(color, 0.1),
        color: color,
        fontSize: pxToRem(12),
        lineHeight: '18px',
        fontWeight: 600,
        fontFamily: theme.typography.fontFamily,
        borderRadius: '16px',
        height: '28px',
      }}
    />
  );
};
