'use client';

import { useState, useMemo } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type BillingStatus = 'Settled' | 'Partial' | 'Pending' | 'Failed';
type PayerType = 'Rider' | 'Fleet' | 'Caregiver';
type PaymentMethod =
  | 'Credit Card'
  | 'Bank Transfer'
  | 'Direct Deposit'
  | 'Cheque';

type BillingRow = {
  id: string;
  transactionId: string;
  invoiceRef: string;
  payerName: string;
  type: PayerType;
  method: PaymentMethod;
  amount: string;
  billingPeriod: string;
  datePaid: string;
  status: BillingStatus;
};

// ─── Status Colors ──────────────────────────────────────────────────────────

const statusColors: Record<BillingStatus, string> = {
  Settled: '#059669',
  Partial: '#D97706',
  Pending: '#D97706',
  Failed: '#EF4444',
};

const statusDotColors: Record<BillingStatus, string> = {
  Settled: '#059669',
  Partial: '#D97706',
  Pending: '#D97706',
  Failed: '#EF4444',
};

// ─── Method Icons ───────────────────────────────────────────────────────────

const methodIcons: Record<PaymentMethod, string> = {
  'Credit Card': '💳',
  'Bank Transfer': '🏦',
  'Direct Deposit': '📥',
  Cheque: '📝',
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const billingData: BillingRow[] = [
  {
    id: '1',
    transactionId: 'TXN-4418',
    invoiceRef: 'INV-9021',
    payerName: 'Dorothy MacLeod',
    type: 'Rider',
    method: 'Credit Card',
    amount: '$174.50',
    billingPeriod: 'Mar 2026',
    datePaid: 'Mar 10, 2026',
    status: 'Settled',
  },
  {
    id: '2',
    transactionId: 'TXN-4417',
    invoiceRef: 'INV-9018',
    payerName: 'CareTransit Co.',
    type: 'Fleet',
    method: 'Bank Transfer',
    amount: '$8,280.00',
    billingPeriod: 'Mar 2026',
    datePaid: 'Mar 8, 2026',
    status: 'Settled',
  },
  {
    id: '3',
    transactionId: 'TXN-4416',
    invoiceRef: 'INV-9019',
    payerName: 'Joseph Nguyen',
    type: 'Rider',
    method: 'Credit Card',
    amount: '$240.00',
    billingPeriod: 'Mar 2026',
    datePaid: 'Mar 9, 2026',
    status: 'Settled',
  },
  {
    id: '4',
    transactionId: 'TXN-4415',
    invoiceRef: 'INV-9020',
    payerName: 'MedRide Express',
    type: 'Fleet',
    method: 'Bank Transfer',
    amount: '$4,920.00',
    billingPeriod: 'Mar 2026',
    datePaid: 'Mar 6, 2026',
    status: 'Partial',
  },
  {
    id: '5',
    transactionId: 'TXN-4414',
    invoiceRef: 'INV-9017',
    payerName: 'Claire Beaumont',
    type: 'Rider',
    method: 'Credit Card',
    amount: '$348.00',
    billingPeriod: 'Mar 2026',
    datePaid: 'Mar 7, 2026',
    status: 'Pending',
  },
  {
    id: '6',
    transactionId: 'TXN-4413',
    invoiceRef: 'INV-9015',
    payerName: 'Pierre Tremblay',
    type: 'Rider',
    method: 'Credit Card',
    amount: '$198.75',
    billingPeriod: 'Mar 2026',
    datePaid: 'Mar 6, 2026',
    status: 'Settled',
  },
  {
    id: '7',
    transactionId: 'TXN-4412',
    invoiceRef: 'INV-9016',
    payerName: 'HealthHaul LLC',
    type: 'Fleet',
    method: 'Bank Transfer',
    amount: '$6,390.00',
    billingPeriod: 'Mar 2026',
    datePaid: 'Mar 2, 2026',
    status: 'Failed',
  },
  {
    id: '8',
    transactionId: 'TXN-4411',
    invoiceRef: 'INV-9013',
    payerName: 'Amina Osei',
    type: 'Rider',
    method: 'Credit Card',
    amount: '$112.50',
    billingPeriod: 'Mar 2026',
    datePaid: 'Mar 5, 2026',
    status: 'Settled',
  },
  {
    id: '9',
    transactionId: 'TXN-4410',
    invoiceRef: 'INV-9014',
    payerName: 'SafeRide Medical',
    type: 'Fleet',
    method: 'Bank Transfer',
    amount: '$2,160.00',
    billingPeriod: 'Mar 2026',
    datePaid: '—',
    status: 'Partial',
  },
  {
    id: '10',
    transactionId: 'TXN-4409',
    invoiceRef: 'INV-9012',
    payerName: 'MobiCare Transport',
    type: 'Fleet',
    method: 'Bank Transfer',
    amount: '$4,950.00',
    billingPeriod: 'Feb 2026',
    datePaid: '—',
    status: 'Pending',
  },
  {
    id: '11',
    transactionId: 'TXN-4408',
    invoiceRef: 'INV-9011',
    payerName: 'Fatima Al-Hassan',
    type: 'Caregiver',
    method: 'Direct Deposit',
    amount: '$294.00',
    billingPeriod: 'Mar 2026',
    datePaid: 'Mar 5, 2026',
    status: 'Settled',
  },
  {
    id: '12',
    transactionId: 'TXN-4407',
    invoiceRef: 'INV-9010',
    payerName: 'NorthStar Transit',
    type: 'Fleet',
    method: 'Cheque',
    amount: '$7,335.00',
    billingPeriod: 'Feb 2026',
    datePaid: '—',
    status: 'Failed',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const BillingHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return billingData;

    const query = searchQuery.toLowerCase();
    return billingData.filter(
      (row) =>
        row.transactionId.toLowerCase().includes(query) ||
        row.invoiceRef.toLowerCase().includes(query) ||
        row.payerName.toLowerCase().includes(query) ||
        row.amount.toLowerCase().includes(query) ||
        row.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const statCards = [
    {
      value: '$218,640',
      label: 'Total Collected',
      icon: (
        <AccountBalanceWalletOutlinedIcon
          sx={{ fontSize: 18, color: '#2F6FED' }}
        />
      ),
      iconBg: '#EBF2FF',
    },
    {
      value: '1,094',
      label: 'Settled',
      icon: (
        <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />
      ),
      iconBg: '#ECFDF5',
    },
    {
      value: '74',
      label: 'Partial / Pending',
      icon: (
        <ScheduleOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
    },
    {
      value: '18',
      label: 'Failed',
      icon: (
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
      ),
      iconBg: '#FEF2F2',
    },
  ];

  const columns: GridColSpec<BillingRow>[] = [
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      flex: 0.9,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#2F6FED',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'invoiceRef',
      headerName: 'Invoice Ref',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 10px',
            borderRadius: '6px',
            background: '#EEF2FF',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: '#6366F1',
              lineHeight: '18px',
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'payerName',
      headerName: 'Payer / Account',
      flex: 1.2,
      minWidth: 160,
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
      field: 'type',
      headerName: 'Type',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'method',
      headerName: 'Method',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const method = params.value as PaymentMethod;
        return (
          <RowStack spacing={'6px'}>
            <Typography sx={{ fontSize: pxToRem(13), lineHeight: '18px' }}>
              {methodIcons[method]}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              {method}
            </Typography>
          </RowStack>
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.8,
      minWidth: 110,
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
      field: 'billingPeriod',
      headerName: 'Billing Period',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'datePaid',
      headerName: 'Date Paid',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
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
      renderCell: (params) => {
        const status = params.value as BillingStatus;
        const color = statusColors[status];
        const dotColor = statusDotColors[status];
        return (
          <RowStack spacing={'6px'}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: dotColor,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: color,
              }}
            >
              {status}
            </Typography>
          </RowStack>
        );
      },
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Billing History"
          desc="Payment transactions, settlement records, and account billing activity"
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
              {/* Section Title */}
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(16),
                  color: (theme) => theme.color.deepBlue,
                  lineHeight: '27px',
                }}
              >
                Payment Transactions
              </Typography>
              <AppSearchField
                name="search"
                placeholder="Search by TXN ID, invoice, payer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                boxProps={{
                  sx: { width: '280px' },
                }}
              />
            </RowStack>
          </Stack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
