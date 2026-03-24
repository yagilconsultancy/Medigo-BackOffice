'use client';

import { alpha, Chip, useTheme } from '@mui/material';
import { pxToRem } from '../../../../../../common';

export type PayoutStatus = 'Paid' | 'Pending' | 'Processing';

const statusColors: Record<PayoutStatus, string> = {
  Paid: '#059669',
  Pending: '#D97706',
  Processing: '#2F6FED',
};

type PayoutStatusChipProps = {
  status: PayoutStatus;
};

export const PayoutStatusChip = ({ status }: PayoutStatusChipProps) => {
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
