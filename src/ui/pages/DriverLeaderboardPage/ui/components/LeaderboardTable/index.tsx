'use client';

import {
  Box,
  LinearProgress,
  Typography,
  linearProgressClasses,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { AppGridtable, RowStack } from '../../../../../modules/components';
import { GridColSpec } from '../../../../../modules/components/GridTable';
import { pxToRem } from '../../../../../../common';
import { LeaderboardDriver } from '../../../index';

// ─── Rank Badge Config ──────────────────────────────────────────────────────

const rankConfig: Record<number, { medal: string; bg: string }> = {
  1: { medal: '\uD83E\uDD47', bg: '#FFF9E6' },
  2: { medal: '\uD83E\uDD48', bg: '#F3F4F6' },
  3: { medal: '\uD83E\uDD49', bg: '#FFF7ED' },
};

// ─── Columns ────────────────────────────────────────────────────────────────

const columns: GridColSpec<LeaderboardDriver>[] = [
  {
    field: 'rank',
    headerName: 'Rank',
    minWidth: 80,
    flex: 0.5,
    sortable: false,
    renderCell: (params) => {
      const rank = params.row.rank;
      const config = rankConfig[rank];
      return config ? (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '14px',
            background: config.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: pxToRem(16), lineHeight: 1 }}>
            {config.medal}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '14px',
            background: '#F7F9FB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(13),
              color: '#6B7280',
            }}
          >
            #{rank}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'name',
    headerName: 'Driver',
    minWidth: 200,
    flex: 1.5,
    sortable: false,
    renderCell: (params) => (
      <RowStack spacing={'10px'}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${params.row.avatarColor} 0%, ${params.row.avatarColor}55 100%)`,
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
              fontSize: pxToRem(12),
              color: '#FFFFFF',
            }}
          >
            {params.row.initials}
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
          {params.row.name}
        </Typography>
      </RowStack>
    ),
  },
  {
    field: 'fleet',
    headerName: 'Fleet',
    minWidth: 150,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12.5),
          color: '#6B7280',
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'trips',
    headerName: 'Trips',
    minWidth: 70,
    flex: 0.5,
    sortable: false,
    renderCell: (params) => (
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(13),
          color: '#374151',
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'rating',
    headerName: 'Rating',
    minWidth: 80,
    flex: 0.6,
    sortable: false,
    renderCell: (params) => (
      <RowStack spacing={'4px'}>
        <StarIcon sx={{ fontSize: 12, color: '#F59E0B' }} />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.value}
        </Typography>
      </RowStack>
    ),
  },
  {
    field: 'acceptanceRate',
    headerName: 'Acceptance Rate',
    minWidth: 160,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <RowStack spacing={'8px'}>
        <LinearProgress
          variant="determinate"
          value={params.value as number}
          sx={{
            width: 80,
            height: 6,
            borderRadius: '3px',
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: '#F0F4F8',
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: '3px',
              backgroundColor: '#10B981',
            },
          }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.value}%
        </Typography>
      </RowStack>
    ),
  },
  {
    field: 'completionRate',
    headerName: 'Completion Rate',
    minWidth: 160,
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <RowStack spacing={'8px'}>
        <LinearProgress
          variant="determinate"
          value={params.value as number}
          sx={{
            width: 80,
            height: 6,
            borderRadius: '3px',
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor: '#F0F4F8',
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: '3px',
              backgroundColor: '#6366F1',
            },
          }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.value}%
        </Typography>
      </RowStack>
    ),
  },
  {
    field: 'score',
    headerName: 'Score',
    minWidth: 80,
    flex: 0.6,
    sortable: false,
    renderCell: (params) => (
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 800,
          fontSize: pxToRem(15),
          color: params.row.rank <= 3 ? '#2F6FED' : '#374151',
        }}
      >
        {params.value}
      </Typography>
    ),
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

type LeaderboardTableProps = {
  drivers: LeaderboardDriver[];
};

export const LeaderboardTable = ({ drivers }: LeaderboardTableProps) => {
  return (
    <AppGridtable
      columns={columns}
      data={drivers}
      initialPageSize={10}
      disableRowClick
    >
      <RowStack spacing={'8px'}>
        <EmojiEventsOutlinedIcon sx={{ fontSize: 16, color: '#F59E0B' }} />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(18),
            color: '#111827',
          }}
        >
          Full Rankings
        </Typography>
      </RowStack>
    </AppGridtable>
  );
};
