'use client';

import { alpha, Chip, useTheme } from '@mui/material';
import { pxToRem } from '../../../../../../common';

export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty';

const statusColors: Record<DriverStatus, string> = {
  Available: '#059669',
  'On Trip': '#2F6FED',
  'Off Duty': '#6B7280',
};

type DriverStatusChipProps = {
  status: DriverStatus;
};

export const DriverStatusChip = ({ status }: DriverStatusChipProps) => {
  const theme = useTheme();
  const color = statusColors[status];

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
