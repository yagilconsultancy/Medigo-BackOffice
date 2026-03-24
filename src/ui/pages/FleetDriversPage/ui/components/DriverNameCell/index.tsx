'use client';

import { Box, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

type DriverNameCellProps = {
  name: string;
  initials: string;
  color: string;
};

export const DriverNameCell = ({
  name,
  initials,
  color,
}: DriverNameCellProps) => {
  return (
    <RowStack spacing={'10px'}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(11),
            color: color,
          }}
        >
          {initials}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(13),
          color: '#111827',
        }}
      >
        {name}
      </Typography>
    </RowStack>
  );
};
