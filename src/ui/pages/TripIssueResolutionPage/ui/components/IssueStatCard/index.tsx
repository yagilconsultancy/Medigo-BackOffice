'use client';

import { Stack, Typography } from '@mui/material';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type IssueStatCardProps = {
  value: string;
  label: string;
  valueColor?: string;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const IssueStatCard = ({
  value,
  label,
  valueColor,
}: IssueStatCardProps) => {
  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #F0F4F8',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
      }}
    >
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(24),
          lineHeight: '1.3em',
          color: valueColor || '#111827',
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(12.5),
          lineHeight: '1.5em',
          color: '#6B7280',
          marginTop: '2px',
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
};
