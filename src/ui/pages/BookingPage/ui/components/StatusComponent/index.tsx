import { alpha, Chip, useTheme } from '@mui/material';
import { pxToRem } from '../../../../../../common';
import { BookingRow } from '../../..';

type StatusComponentProps = {
  status: BookingRow['status'] | string | null;
};

export const StatusComponent = ({ status }: StatusComponentProps) => {
  const theme = useTheme();

  // Combined status color map for booking and refund statuses
  const statusColorMap: Record<string, string> = {
    // Booking statuses
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
    // Refund/Payment statuses
    pending: theme.color.warning,
    approved: theme.color.success,
    declined: theme.color.error,
    processed: theme.color.success,
    'full refund': theme.color.success,
    none: theme.color.lightGrey,
  };

  const statusLabelMap: Record<string, string> = {
    // Booking statuses
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
    // Refund/Payment statuses
    pending: 'Pending',
    approved: 'Approved',
    declined: 'Declined',
    processed: 'Processed',
    'full refund': 'Full Refund',
    none: 'None',
  };

  // Handle null or undefined status
  if (!status) {
    return (
      <Chip
        variant="filled"
        label="None"
        sx={{
          background: alpha(theme.color.lightGrey, 0.1),
          color: theme.color.lightGrey,
          fontSize: pxToRem(12),
          lineHeight: '18px',
          fontWeight: 600,
          fontFamily: theme.typography.fontFamily,
          borderRadius: '16px',
          height: '28px',
        }}
      />
    );
  }

  const normalizedStatus = status.toLowerCase();
  const color = statusColorMap[normalizedStatus] || theme.color.lightGrey;
  const label = statusLabelMap[normalizedStatus] || status;

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
