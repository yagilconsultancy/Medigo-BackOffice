'use client';

import { alpha, Chip, useTheme } from '@mui/material';
import { pxToRem } from '../../../../../../common';

export type FleetCompanyStatus = 'Active' | 'Inactive' | 'Suspended';

const statusColors: Record<FleetCompanyStatus, string> = {
  Active: '#059669',
  Inactive: '#6B7280',
  Suspended: '#EF4444',
};

type FleetStatusChipProps = {
  status: FleetCompanyStatus;
};

export const FleetStatusChip = ({ status }: FleetStatusChipProps) => {
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
