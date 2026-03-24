'use client';

import { alpha, Chip, useTheme } from '@mui/material';
import { pxToRem } from '../../../../../../common';

export type VehicleStatus = 'Active' | 'Maintenance' | 'Inactive';

const statusColors: Record<VehicleStatus, string> = {
  Active: '#059669',
  Maintenance: '#D97706',
  Inactive: '#EF4444',
};

type VehicleStatusChipProps = {
  status: VehicleStatus;
};

export const VehicleStatusChip = ({ status }: VehicleStatusChipProps) => {
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
