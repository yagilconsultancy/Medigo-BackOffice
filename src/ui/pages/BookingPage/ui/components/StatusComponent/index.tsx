import { alpha, Chip, useTheme } from '@mui/material';
import { pxToRem } from '../../../../../../common';
import { BookingRow } from '../../..';

type StatusComponentProps = {
  status: BookingRow['status'];
};

export const StatusComponent = ({ status }: StatusComponentProps) => {
  const theme = useTheme();

  const statusColorMap: Record<BookingRow['status'], string> = {
    requested: theme.color.warning,
    pending_business_assignment: theme.color.warning,
    confirmed: theme.color.info,
    driver_assigned: theme.color.info,
    driver_en_route: theme.color.purple,
    driver_arrived: theme.color.purple,
    in_progress: theme.color.deepBlue,
    completed: theme.color.success,
    cancelled: theme.color.error,
    no_show: theme.color.error,
  };

  const statusLabelMap: Record<BookingRow['status'], string> = {
    requested: 'Requested',
    pending_business_assignment: 'Pending Assignment',
    confirmed: 'Confirmed',
    driver_assigned: 'Driver Assigned',
    driver_en_route: 'En Route',
    driver_arrived: 'Driver Arrived',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };

  const color = statusColorMap[status];
  const label = statusLabelMap[status];

  return (
    <Chip
      variant="filled"
      label={label}
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
