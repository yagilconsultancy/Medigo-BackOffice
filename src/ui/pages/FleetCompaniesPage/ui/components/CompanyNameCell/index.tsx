'use client';

import { Box, Typography } from '@mui/material';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

type CompanyNameCellProps = {
  name: string;
  fleetId: string;
};

export const CompanyNameCell = ({ name, fleetId }: CompanyNameCellProps) => {
  return (
    <RowStack spacing={'10px'}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '10px',
          background: '#EBF2FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <BusinessOutlinedIcon sx={{ fontSize: 14, color: '#2F6FED' }} />
      </Box>
      <Box>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#111827',
            lineHeight: '18px',
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: '#9CA3AF',
            lineHeight: '16px',
          }}
        >
          {fleetId}
        </Typography>
      </Box>
    </RowStack>
  );
};
