'use client';

import { Box, Stack, Typography } from '@mui/material';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type LogStatCardProps = {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
  /** When provided the card acts as a severity filter toggle. */
  onClick?: () => void;
  selected?: boolean;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const LogStatCard = ({
  icon,
  iconBg,
  value,
  label,
  onClick,
  selected = false,
}: LogStatCardProps) => {
  const interactive = Boolean(onClick);
  return (
    <Stack
      spacing={'12px'}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? selected : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      sx={{
        background: '#FFFFFF',
        border: selected ? '1px solid #2F6FED' : '0.67px solid #F0F4F8',
        borderRadius: '14px',
        boxShadow: selected
          ? '0px 0px 0px 3px rgba(47, 111, 237, 0.12)'
          : '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        padding: '20px',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
        '&:hover': interactive ? { borderColor: '#2F6FED' } : undefined,
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
