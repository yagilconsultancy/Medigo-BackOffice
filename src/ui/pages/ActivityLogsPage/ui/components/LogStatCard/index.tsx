'use client';

import { Box, Stack, Typography } from '@mui/material';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type LogStatCardProps = {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const LogStatCard = ({
  icon,
  iconBg,
  value,
  label,
}: LogStatCardProps) => {
  return (
    <Stack
      spacing={'12px'}
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #F0F4F8',
        borderRadius: '14px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(26),
          lineHeight: '1em',
          color: '#111827',
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13),
          color: '#9CA3AF',
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
};
