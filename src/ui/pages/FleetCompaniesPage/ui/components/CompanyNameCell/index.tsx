import { Box, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

type CompanyNameCellProps = {
  name: string;
  fleetId: string;
  initials: string;
  color: string;
};

export const CompanyNameCell = ({
  name,
  fleetId,
  initials,
  color,
}: CompanyNameCellProps) => (
  <RowStack spacing={'12px'}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '14px',
        background: `${color}16`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: pxToRem(12),
          color,
          letterSpacing: '-0.03em',
        }}
      >
        {initials}
      </Typography>
    </Box>
    <Stack spacing={'2px'}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(13),
          lineHeight: '1.3em',
          color: '#111827',
        }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11.5),
          color: '#9CA3AF',
        }}
      >
        {fleetId}
      </Typography>
    </Stack>
  </RowStack>
);
