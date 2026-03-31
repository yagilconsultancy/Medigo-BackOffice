'use client';

import { useState } from 'react';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type LogRow = {
  id: string;
  logId: string;
  adminName: string;
  adminAvatar: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  city: string;
  change: string;
  before: string;
  after: string;
  timestamp: string;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const logsData: LogRow[] = [
  {
    id: '1',
    logId: 'PL-0021',
    adminName: 'Marcus Bell',
    adminAvatar: 'MB',
    category: 'Fare',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    city: 'Milton',
    change: 'Base fare updated',
    before: '$8.00',
    after: '$9.50',
    timestamp: 'Mar 28, 2026 · 2:14 PM',
  },
  {
    id: '2',
    logId: 'PL-0020',
    adminName: 'Angela Brooks',
    adminAvatar: 'AB',
    category: 'Surcharge',
    categoryColor: '#D97706',
    categoryBg: '#FFFBEB',
    city: 'Oakville',
    change: 'Peak multiplier changed',
    before: '1.4×',
    after: '1.5×',
    timestamp: 'Mar 27, 2026 · 4:45 PM',
  },
  {
    id: '3',
    logId: 'PL-0019',
    adminName: 'Kevin Walsh',
    adminAvatar: 'KW',
    category: 'Package',
    categoryColor: '#6366F1',
    categoryBg: '#EEF2FF',
    city: 'Burlington',
    change: 'Dialysis pkg price set',
    before: '$220.00',
    after: '$245.00',
    timestamp: 'Mar 27, 2026 · 11:30 AM',
  },
  {
    id: '4',
    logId: 'PL-0018',
    adminName: 'Marcus Bell',
    adminAvatar: 'MB',
    category: 'Fare',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    city: 'Brampton',
    change: 'Per-km rate adjusted',
    before: '$1.80',
    after: '$2.00',
    timestamp: 'Mar 26, 2026 · 3:20 PM',
  },
  {
    id: '5',
    logId: 'PL-0017',
    adminName: 'Angela Brooks',
    adminAvatar: 'AB',
    category: 'Surcharge',
    categoryColor: '#D97706',
    categoryBg: '#FFFBEB',
    city: 'Milton',
    change: 'Night surcharge enabled',
    before: 'Disabled',
    after: '1.25×',
    timestamp: 'Mar 25, 2026 · 9:15 AM',
  },
  {
    id: '6',
    logId: 'PL-0016',
    adminName: 'Kevin Walsh',
    adminAvatar: 'KW',
    category: 'Fare',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    city: 'Mississauga',
    change: 'Cancellation fee updated',
    before: '$5.00',
    after: '$6.00',
    timestamp: 'Mar 24, 2026 · 1:50 PM',
  },
  {
    id: '7',
    logId: 'PL-0015',
    adminName: 'Marcus Bell',
    adminAvatar: 'MB',
    category: 'Package',
    categoryColor: '#6366F1',
    categoryBg: '#EEF2FF',
    city: 'Georgetown',
    change: 'Hospital discharge pkg added',
    before: '—',
    after: '$185.00',
    timestamp: 'Mar 23, 2026 · 10:00 AM',
  },
  {
    id: '8',
    logId: 'PL-0014',
    adminName: 'Angela Brooks',
    adminAvatar: 'AB',
    category: 'Surcharge',
    categoryColor: '#D97706',
    categoryBg: '#FFFBEB',
    city: 'Oakville',
    change: 'Holiday pricing multiplier',
    before: '1.5×',
    after: '1.6×',
    timestamp: 'Mar 22, 2026 · 5:30 PM',
  },
  {
    id: '9',
    logId: 'PL-0013',
    adminName: 'Kevin Walsh',
    adminAvatar: 'KW',
    category: 'Fare',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    city: 'Milton',
    change: 'Minimum fare increased',
    before: '$10.00',
    after: '$12.00',
    timestamp: 'Mar 21, 2026 · 2:00 PM',
  },
  {
    id: '10',
    logId: 'PL-0012',
    adminName: 'Marcus Bell',
    adminAvatar: 'MB',
    category: 'Fare',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    city: 'Burlington',
    change: 'Time rate per minute',
    before: '$0.15',
    after: '$0.18',
    timestamp: 'Mar 20, 2026 · 11:45 AM',
  },
  {
    id: '11',
    logId: 'PL-0011',
    adminName: 'Angela Brooks',
    adminAvatar: 'AB',
    category: 'Package',
    categoryColor: '#6366F1',
    categoryBg: '#EEF2FF',
    city: 'Brampton',
    change: 'Chemo transport pkg updated',
    before: '$180.00',
    after: '$195.00',
    timestamp: 'Mar 19, 2026 · 4:10 PM',
  },
  {
    id: '12',
    logId: 'PL-0010',
    adminName: 'Kevin Walsh',
    adminAvatar: 'KW',
    category: 'Surcharge',
    categoryColor: '#D97706',
    categoryBg: '#FFFBEB',
    city: 'Mississauga',
    change: 'Weather surcharge toggled',
    before: 'Disabled',
    after: '1.3×',
    timestamp: 'Mar 18, 2026 · 9:00 AM',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const PricingLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logsData.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.logId.toLowerCase().includes(query) ||
      log.adminName.toLowerCase().includes(query) ||
      log.category.toLowerCase().includes(query) ||
      log.city.toLowerCase().includes(query) ||
      log.change.toLowerCase().includes(query)
    );
  });

  const columns: GridColSpec<LogRow>[] = [
    {
      field: 'logId',
      headerName: 'Log ID',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'adminName',
      headerName: 'Admin',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <RowStack spacing={'10px'}>
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: pxToRem(10),
              fontWeight: 600,
              background: '#EBF2FF',
              color: '#2F6FED',
            }}
          >
            {params.row.adminAvatar}
          </Avatar>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(13),
              color: '#111827',
            }}
          >
            {params.value}
          </Typography>
        </RowStack>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            background: params.row.categoryBg,
            color: params.row.categoryColor,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(11.5),
            borderRadius: '100px',
            height: 24,
          }}
        />
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 0.8,
      minWidth: 110,
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
      field: 'change',
      headerName: 'Change',
      flex: 1.2,
      minWidth: 170,
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
      field: 'before',
      headerName: 'Before',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#9CA3AF',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'after',
      headerName: 'After',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#10B981',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12.5),
            color: '#9CA3AF',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Pricing Logs"
            desc="Track and review all pricing changes, updates, and system-generated adjustments for transparency and auditing."
          />
          <AppButton
            variant="contained"
            startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              background: '#FFFFFF',
              border: '0.67px solid #E8ECF0',
              borderRadius: '14px',
              padding: '10px 20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#374151',
              boxShadow: 'none',
              '&:hover': {
                background: '#F7F9FB',
                boxShadow: 'none',
              },
            }}
          >
            Export Logs
          </AppButton>
        </RowStack>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredLogs}
          initialPageSize={12}
          disableRowClick
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent="space-between" width="100%">
            {/* Left: Title + Description */}
            <Stack spacing={'4px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                }}
              >
                Pricing Change History
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                Audit trail of all fare, surcharge, and package edits
              </Typography>
            </Stack>

            {/* Right: Search */}
            <AppSearchField
              name="search"
              placeholder="Search logs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              boxProps={{
                sx: { width: '240px' },
              }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
