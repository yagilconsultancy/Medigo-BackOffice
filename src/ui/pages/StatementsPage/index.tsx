'use client';

import { useState, useMemo } from 'react';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { ImageAttachment } from '../../modules/components/ImageAttachment';
import { GridColSpec } from '../../modules/components/GridTable';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type StatementRow = {
  id: string;
  period: string;
  riderInvoices: number;
  fleetReports: number;
  caregivers: number;
  totalBilled: string;
  status: 'Available';
  fileUri: string;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const statementsData: StatementRow[] = [
  {
    id: '1',
    period: 'February 2026',
    riderInvoices: 312,
    fleetReports: 4,
    caregivers: 18,
    totalBilled: '$94,320.00',
    status: 'Available',
    fileUri: 'statements/feb-2026.pdf',
  },
  {
    id: '2',
    period: 'January 2026',
    riderInvoices: 288,
    fleetReports: 4,
    caregivers: 15,
    totalBilled: '$88,400.00',
    status: 'Available',
    fileUri: 'statements/jan-2026.pdf',
  },
  {
    id: '3',
    period: 'December 2025',
    riderInvoices: 271,
    fleetReports: 3,
    caregivers: 14,
    totalBilled: '$82,100.00',
    status: 'Available',
    fileUri: 'statements/dec-2025.pdf',
  },
  {
    id: '4',
    period: 'November 2025',
    riderInvoices: 248,
    fleetReports: 3,
    caregivers: 12,
    totalBilled: '$71,800.00',
    status: 'Available',
    fileUri: 'statements/nov-2025.pdf',
  },
  {
    id: '5',
    period: 'October 2025',
    riderInvoices: 235,
    fleetReports: 3,
    caregivers: 11,
    totalBilled: '$74,200.00',
    status: 'Available',
    fileUri: 'statements/oct-2025.pdf',
  },
  {
    id: '6',
    period: 'September 2025',
    riderInvoices: 218,
    fleetReports: 3,
    caregivers: 10,
    totalBilled: '$69,540.00',
    status: 'Available',
    fileUri: 'statements/sep-2025.pdf',
  },
  {
    id: '7',
    period: 'August 2025',
    riderInvoices: 201,
    fleetReports: 2,
    caregivers: 9,
    totalBilled: '$63,180.00',
    status: 'Available',
    fileUri: 'statements/aug-2025.pdf',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const StatementsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return statementsData;

    const query = searchQuery.toLowerCase();
    return statementsData.filter(
      (row) =>
        row.period.toLowerCase().includes(query) ||
        row.totalBilled.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const statCards = [
    {
      value: '18',
      label: 'Statements Available',
      icon: (
        <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
      ),
      iconBg: '#EBF2FF',
    },
    {
      value: '$536,840',
      label: 'Total Billed (YTD)',
      icon: (
        <AttachMoneyOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />
      ),
      iconBg: '#ECFDF5',
    },
    {
      value: '312',
      label: 'Active Accounts',
      icon: <PeopleOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
      iconBg: '#FFFBEB',
    },
    {
      value: '7',
      label: 'Fleet Partners',
      icon: <BusinessOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
      iconBg: '#EEF2FF',
    },
  ];

  const columns: GridColSpec<StatementRow>[] = [
    {
      field: 'period',
      headerName: 'Period',
      flex: 1.4,
      minWidth: 200,
      renderCell: (params) => (
        <RowStack spacing={'10px'}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '8px',
              background: '#EBF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DescriptionOutlinedIcon
              sx={{ fontSize: 16, color: '#2F6FED' }}
            />
          </Box>
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
        </RowStack>
      ),
    },
    {
      field: 'riderInvoices',
      headerName: 'Rider Invoices',
      flex: 0.8,
      minWidth: 120,
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
      field: 'fleetReports',
      headerName: 'Fleet Reports',
      flex: 0.8,
      minWidth: 120,
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
      field: 'caregivers',
      headerName: 'Caregivers',
      flex: 0.8,
      minWidth: 100,
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
      field: 'totalBilled',
      headerName: 'Total Billed',
      flex: 0.9,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            background: '#ECFDF5',
            color: '#059669',
            fontWeight: 600,
            fontSize: pxToRem(12),
            fontFamily: (theme) => theme.typography.fontFamily,
            borderRadius: '16px',
            height: '28px',
          }}
        />
      ),
    },
    {
      field: 'actions' as string,
      headerName: '',
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <ImageAttachment
          text="Download PDF"
          imageUrl={params.row.fileUri}
        >
          <RowStack
            spacing={'6px'}
            sx={{
              padding: '7px 16px',
              borderRadius: '10px',
              background: '#2F6FED',
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <FileDownloadOutlinedIcon
              sx={{ fontSize: 15, color: '#FFFFFF' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#FFFFFF',
                lineHeight: '18px',
                whiteSpace: 'nowrap',
              }}
            >
              Download PDF
            </Typography>
          </RowStack>
        </ImageAttachment>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Statements"
          desc="Download monthly financial statements for riders, fleet, and caregiver accounts"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(24),
                    lineHeight: '1.3em',
                    color: '#111827',
                  }}
                >
                  {card.value}
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
                  {card.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredData}
          initialPageSize={10}
          disableRowClick
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <Stack spacing={'16px'} width={'100%'}>
            <RowStack justifyContent={'space-between'} width={'100%'}>
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(16),
                    color: '#111827',
                    lineHeight: '24px',
                  }}
                >
                  Monthly Financial Statements
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12.5),
                    color: '#6B7280',
                    lineHeight: '18px',
                  }}
                >
                  Download consolidated billing reports by month
                </Typography>
              </Stack>
              <AppSearchField
                name="search"
                placeholder="Search by month..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                boxProps={{
                  sx: { width: '240px' },
                }}
              />
            </RowStack>
          </Stack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
