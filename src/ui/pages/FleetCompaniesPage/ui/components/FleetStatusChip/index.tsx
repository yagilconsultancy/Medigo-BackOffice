import { Box, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

export type FleetCompanyStatus = 'Active' | 'Suspended' | 'Pending';

const statusConfig: Record<
  FleetCompanyStatus,
  { color: string; bg: string }
> = {
  Active: { color: '#059669', bg: '#ECFDF5' },
  Suspended: { color: '#EF4444', bg: '#FEF2F2' },
  Pending: { color: '#D97706', bg: '#FFFBEB' },
};

type FleetStatusChipProps = {
  status: FleetCompanyStatus;
};

export const FleetStatusChip = ({ status }: FleetStatusChipProps) => {
  const config = statusConfig[status];
  return (
    <RowStack
      spacing={'5px'}
      sx={{
        display: 'inline-flex',
        background: config.bg,
        borderRadius: '100px',
        padding: '3px 10px',
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: config.color,
        }}
      />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(11.5),
          lineHeight: '1.5em',
          color: config.color,
        }}
      >
        {status}
      </Typography>
    </RowStack>
  );
};
