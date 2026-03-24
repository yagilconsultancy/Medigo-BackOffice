'use client';

import { Typography } from '@mui/material';
import { pxToRem } from '../../../../../../common';

export type DocValidity = 'Valid' | 'Expiring' | 'Expired';

const validityColors: Record<DocValidity, string> = {
  Valid: '#059669',
  Expiring: '#D97706',
  Expired: '#EF4444',
};

type DocValidityChipProps = {
  validity: DocValidity;
};

export const DocValidityChip = ({ validity }: DocValidityChipProps) => {
  const color = validityColors[validity];

  return (
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12),
        color: color,
      }}
    >
      {validity}
    </Typography>
  );
};
