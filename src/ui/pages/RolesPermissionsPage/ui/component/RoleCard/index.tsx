'use client';

import { Box, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RoleCardProps = {
  icon: React.ReactNode;
  count: number;
  roleName: string;
  adminLabel: string;
  isActive: boolean;
  activeColor: string;
  iconBg: string;
  onClick?: () => void;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const RoleCard = ({
  icon,
  count,
  roleName,
  adminLabel,
  isActive,
  activeColor,
  iconBg,
  onClick,
}: RoleCardProps) => {
  return (
    <Stack
      spacing={'12px'}
      onClick={onClick}
      sx={{
        padding: '20px',
        borderRadius: '16px',
        cursor: 'pointer',
        background: isActive ? activeColor : '#FFFFFF',
        border: isActive
          ? `0.67px solid ${activeColor}`
          : '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Icon + Count */}
      <RowStack justifyContent={'space-between'} alignItems={'center'}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '14px',
            background: isActive ? 'rgba(255, 255, 255, 0.2)' : iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 800,
            fontSize: pxToRem(22),
            lineHeight: '1.5em',
            color: isActive ? '#FFFFFF' : '#111827',
          }}
        >
          {count}
        </Typography>
      </RowStack>

      {/* Role Name + Admin Count */}
      <Stack spacing={'2px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            lineHeight: '1.5em',
            color: isActive ? '#FFFFFF' : '#111827',
          }}
        >
          {roleName}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(11.5),
            lineHeight: '1.5em',
            color: isActive ? 'rgba(255, 255, 255, 0.7)' : '#9CA3AF',
          }}
        >
          {adminLabel}
        </Typography>
      </Stack>
    </Stack>
  );
};
