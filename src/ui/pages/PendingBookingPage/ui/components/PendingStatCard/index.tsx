import { Stack, Typography } from '@mui/material';
import { pxToRem } from '../../../../../../common';

type PendingStatCardProps = {
  value: string;
  label: string;
};

export const PendingStatCard = ({ value, label }: PendingStatCardProps) => {
  return (
    <Stack
      spacing={'4px'}
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '21px',
        flex: 1,
        border: '0.67px solid #EAECF0',
      }}
    >
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 800,
          fontSize: pxToRem(32),
          lineHeight: '48px',
          color: (theme) => theme.color.deepBlue,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13),
          lineHeight: '19.5px',
          color: (theme) => theme.color.lightGrey,
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
};
