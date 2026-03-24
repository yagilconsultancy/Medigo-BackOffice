'use client';

import { Box, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { LeaderboardDriver } from '../../../index';

// ─── Podium Config ──────────────────────────────────────────────────────────

const podiumConfig: Record<number, { medal: string; borderColor: string }> = {
  1: { medal: '\uD83E\uDD47', borderColor: 'rgba(217, 119, 6, 0.27)' },
  2: { medal: '\uD83E\uDD48', borderColor: 'rgba(107, 114, 128, 0.27)' },
  3: { medal: '\uD83E\uDD49', borderColor: 'rgba(234, 88, 12, 0.27)' },
};

// ─── Stat Item ──────────────────────────────────────────────────────────────

const StatItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => (
  <Stack alignItems="center" spacing={'4px'} sx={{ flex: 1 }}>
    <RowStack spacing={'4px'}>
      {icon}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(12),
          color: '#374151',
        }}
      >
        {value}
      </Typography>
    </RowStack>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(10),
        color: '#9CA3AF',
      }}
    >
      {label}
    </Typography>
  </Stack>
);

// ─── Component ──────────────────────────────────────────────────────────────

type PodiumCardProps = {
  driver: LeaderboardDriver;
};

export const PodiumCard = ({ driver }: PodiumCardProps) => {
  const config = podiumConfig[driver.rank];
  if (!config) return null;

  return (
    <Stack
      alignItems="center"
      spacing={'12px'}
      sx={{
        flex: 1,
        background: '#FFFFFF',
        borderRadius: '16px',
        border: `2px solid ${config.borderColor}`,
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        padding: '24px 20px',
      }}
    >
      {/* Medal */}
      <Typography sx={{ fontSize: pxToRem(28), lineHeight: 1 }}>
        {config.medal}
      </Typography>

      {/* Avatar */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${driver.avatarColor} 0%, ${driver.avatarColor}55 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(18),
            color: '#FFFFFF',
          }}
        >
          {driver.initials}
        </Typography>
      </Box>

      {/* Name & Fleet */}
      <Stack alignItems="center" spacing={'2px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(15),
            color: '#111827',
          }}
        >
          {driver.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12),
            color: '#9CA3AF',
          }}
        >
          {driver.fleet}
        </Typography>
      </Stack>

      {/* Performance Score */}
      <Stack
        alignItems="center"
        spacing={'4px'}
        sx={{
          background: '#EBF2FF',
          borderRadius: '14px',
          padding: '10px 24px',
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 800,
            fontSize: pxToRem(22),
            color: '#2F6FED',
          }}
        >
          {driver.score}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: '#6B7280',
          }}
        >
          Performance Score
        </Typography>
      </Stack>

      {/* Stats Row */}
      <RowStack
        sx={{
          width: '100%',
          borderTop: '0.67px solid #F0F4F8',
          paddingTop: '12px',
        }}
      >
        <StatItem
          label="Rating"
          value={String(driver.rating)}
          icon={<StarIcon sx={{ fontSize: 12, color: '#F59E0B' }} />}
        />
        <Box
          sx={{
            width: '0.67px',
            height: '28px',
            background: '#F0F4F8',
          }}
        />
        <StatItem label="Trips" value={String(driver.trips)} />
        <Box
          sx={{
            width: '0.67px',
            height: '28px',
            background: '#F0F4F8',
          }}
        />
        <StatItem label="Accept" value={`${driver.acceptanceRate}%`} />
      </RowStack>
    </Stack>
  );
};
