'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Chip,
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';
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

type TransactionStatus = 'Settled' | 'Pending' | 'Failed';
type TabValue = 'All' | TransactionStatus;

type Transaction = {
  id: string;
  txnId: string;
  bookingRef: string;
  rider: string;
  driver: string;
  rideType: string;
  amount: string;
  paymentMethod: string;
  date: string;
  time: string;
  status: TransactionStatus;
  distance: string;
  duration: string;
  pickup: string;
  dropoff: string;
};

// ─── Status Config ──────────────────────────────────────────────────────────

const statusConfig: Record<
  TransactionStatus,
  { dot: string; bg: string; color: string }
> = {
  Settled: { dot: '#10B981', bg: '#ECFDF5', color: '#059669' },
  Pending: { dot: '#F59E0B', bg: '#FFFBEB', color: '#D97706' },
  Failed: { dot: '#EF4444', bg: '#FEF2F2', color: '#EF4444' },
};

// ─── Stat Cards Config ──────────────────────────────────────────────────────

const statCards = [
  {
    icon: <SwapHorizOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
    value: '4,821',
    label: 'Total Transactions',
    subtext: 'This month',
  },
  {
    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />,
    value: '$284,720',
    label: 'Total Collected',
    subtext: '+18.4% vs last month',
  },
  {
    icon: <CheckCircleOutlinedIcon sx={{ fontSize: 20, color: '#059669' }} />,
    value: '4,604',
    label: 'Settled',
    subtext: '95.5% success rate',
  },
  {
    icon: <WarningAmberOutlinedIcon sx={{ fontSize: 20, color: '#D97706' }} />,
    value: '217',
    label: 'Pending',
    subtext: 'Awaiting settlement',
  },
];

// ─── Payment Method Breakdown Config ────────────────────────────────────────

const paymentMethods = [
  {
    label: 'Medicare',
    color: '#2F6FED',
    amount: '$74,892',
    detail: '1284 rides · 26%',
    progress: 26,
  },
  {
    label: 'Medicaid',
    color: '#6366F1',
    amount: '$48,240',
    detail: '968 rides · 17%',
    progress: 17,
  },
  {
    label: 'Private Insurance',
    color: '#10B981',
    amount: '$86,256',
    detail: '1441 rides · 30%',
    progress: 30,
  },
  {
    label: 'Credit / Debit Card',
    color: '#F59E0B',
    amount: '$57,736',
    detail: '820 rides · 20%',
    progress: 20,
  },
  {
    label: 'Direct Pay',
    color: '#EC4899',
    amount: '$17,596',
    detail: '308 rides · 7%',
    progress: 7,
  },
];

// ─── Mock Data ──────────────────────────────────────────────────────────────

const transactionsData: Transaction[] = [
  {
    id: '1',
    txnId: 'TXN-88401',
    bookingRef: 'BK-20501',
    rider: 'Patricia Clark',
    driver: 'Marcus Johnson',
    rideType: 'Standard Medical',
    amount: '$43.50',
    paymentMethod: 'Visa ••4521',
    date: 'Mar 9, 2026',
    time: '09:14 AM',
    status: 'Settled',
    distance: '3.2 mi',
    duration: '14 min',
    pickup: '145 W 53rd St, NYC',
    dropoff: 'NewYork-Presbyterian Hospital',
  },
  {
    id: '2',
    txnId: 'TXN-88400',
    bookingRef: 'BK-20500',
    rider: 'Helen Moore',
    driver: 'Sarah Williams',
    rideType: 'Wheelchair Accessible',
    amount: '$62.00',
    paymentMethod: 'Mastercard ••8832',
    date: 'Mar 9, 2026',
    time: '08:47 AM',
    status: 'Settled',
    distance: '5.1 mi',
    duration: '22 min',
    pickup: '820 Park Ave, NYC',
    dropoff: 'Mount Sinai Hospital',
  },
  {
    id: '3',
    txnId: 'TXN-88399',
    bookingRef: 'BK-20499',
    rider: 'Daniel Martinez',
    driver: 'David Chen',
    rideType: 'Assisted Ride',
    amount: '$38.75',
    paymentMethod: 'Medicaid',
    date: 'Mar 9, 2026',
    time: '08:22 AM',
    status: 'Pending',
    distance: '2.8 mi',
    duration: '19 min',
    pickup: '402 E 10th St, NYC',
    dropoff: 'Bellevue Hospital Center',
  },
  {
    id: '4',
    txnId: 'TXN-88398',
    bookingRef: 'BK-20498',
    rider: 'Nancy White',
    driver: 'Emily Rodriguez',
    rideType: 'Standard Medical',
    amount: '$29.00',
    paymentMethod: 'Medicare',
    date: 'Mar 8, 2026',
    time: '05:58 PM',
    status: 'Settled',
    distance: '1.9 mi',
    duration: '11 min',
    pickup: '301 E 17th St, NYC',
    dropoff: 'Beth Israel Medical Center',
  },
  {
    id: '5',
    txnId: 'TXN-88397',
    bookingRef: 'BK-20497',
    rider: 'Robert Garcia',
    driver: 'James Thompson',
    rideType: 'Stretcher Transport',
    amount: '$91.25',
    paymentMethod: 'Aetna Direct',
    date: 'Mar 8, 2026',
    time: '04:30 PM',
    status: 'Settled',
    distance: '7.4 mi',
    duration: '35 min',
    pickup: '525 E 68th St, NYC',
    dropoff: 'Weill Cornell Medical Center',
  },
  {
    id: '6',
    txnId: 'TXN-88396',
    bookingRef: 'BK-20496',
    rider: 'George Lewis',
    driver: 'Anna Kim',
    rideType: 'Standard Medical',
    amount: '$47.00',
    paymentMethod: 'Visa ••7744',
    date: 'Mar 8, 2026',
    time: '02:12 PM',
    status: 'Settled',
    distance: '4.2 mi',
    duration: '18 min',
    pickup: '1275 York Ave, NYC',
    dropoff: 'Memorial Sloan Kettering',
  },
  {
    id: '7',
    txnId: 'TXN-88395',
    bookingRef: 'BK-20495',
    rider: 'Lisa Anderson',
    driver: 'Tom Roberts',
    rideType: 'Wheelchair Accessible',
    amount: '$78.50',
    paymentMethod: 'BlueCare',
    date: 'Mar 8, 2026',
    time: '11:05 AM',
    status: 'Settled',
    distance: '6.1 mi',
    duration: '28 min',
    pickup: '462 1st Ave, NYC',
    dropoff: 'NYU Langone Health',
  },
  {
    id: '8',
    txnId: 'TXN-88394',
    bookingRef: 'BK-20494',
    rider: 'Dorothy Harris',
    driver: 'Kevin Park',
    rideType: 'Assisted Ride',
    amount: '$32.00',
    paymentMethod: 'Medicaid',
    date: 'Mar 8, 2026',
    time: '09:30 AM',
    status: 'Pending',
    distance: '2.3 mi',
    duration: '15 min',
    pickup: '177 Fort Washington Ave, NYC',
    dropoff: 'Columbia Presbyterian',
  },
  {
    id: '9',
    txnId: 'TXN-88393',
    bookingRef: 'BK-20493',
    rider: 'James Wilson',
    driver: 'Sofia Reyes',
    rideType: 'Standard Medical',
    amount: '$52.75',
    paymentMethod: 'Cigna Direct',
    date: 'Mar 7, 2026',
    time: '03:45 PM',
    status: 'Settled',
    distance: '4.8 mi',
    duration: '20 min',
    pickup: '560 1st Ave, NYC',
    dropoff: 'VA Medical Center',
  },
  {
    id: '10',
    txnId: 'TXN-88392',
    bookingRef: 'BK-20492',
    rider: 'Barbara Martin',
    driver: 'Marcus Johnson',
    rideType: 'Standard Medical',
    amount: '$26.50',
    paymentMethod: 'UnitedHealth',
    date: 'Mar 7, 2026',
    time: '01:20 PM',
    status: 'Settled',
    distance: '1.5 mi',
    duration: '9 min',
    pickup: '550 1st Ave, NYC',
    dropoff: 'Bellevue Hospital Center',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const PaymentTransactionsPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const tabCounts = useMemo(() => {
    const settled = transactionsData.filter(
      (t) => t.status === 'Settled'
    ).length;
    const pending = transactionsData.filter(
      (t) => t.status === 'Pending'
    ).length;
    const failed = transactionsData.filter((t) => t.status === 'Failed').length;
    return {
      All: transactionsData.length,
      Settled: settled,
      Pending: pending,
      Failed: failed,
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    let data = transactionsData;

    if (activeTab !== 'All') {
      data = data.filter((t) => t.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (t) =>
          t.txnId.toLowerCase().includes(q) ||
          t.rider.toLowerCase().includes(q) ||
          t.driver.toLowerCase().includes(q) ||
          t.paymentMethod.toLowerCase().includes(q) ||
          t.amount.toLowerCase().includes(q)
      );
    }

    return data;
  }, [activeTab, searchQuery]);

  const handleViewTransaction = (txn: Transaction) => {
    setSelectedTxn(txn);
    setModalOpen(true);
  };

  const tabs: { label: string; value: TabValue }[] = [
    { label: 'All', value: 'All' },
    { label: 'Settled', value: 'Settled' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Failed', value: 'Failed' },
  ];

  const columns: GridColSpec<Transaction>[] = [
    {
      field: 'txnId',
      headerName: 'Transaction ID',
      flex: 1.2,
      minWidth: 140,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#2F6FED',
          }}
        >
          {params.row.txnId}
        </Typography>
      ),
    },
    {
      field: 'rider',
      headerName: 'Rider',
      flex: 1.1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13.5),
            color: '#111827',
          }}
        >
          {params.row.rider}
        </Typography>
      ),
    },
    {
      field: 'driver',
      headerName: 'Driver',
      flex: 1.15,
      minWidth: 140,
    },
    {
      field: 'rideType',
      headerName: 'Ride Type',
      flex: 1.25,
      minWidth: 150,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.85,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.amount}
        </Typography>
      ),
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      flex: 1.4,
      minWidth: 150,
    },
    {
      field: 'date',
      headerName: 'Date & Time',
      flex: 1.8,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.row.date} · {params.row.time}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const config = statusConfig[params.row.status];
        return (
          <Chip
            label={params.row.status}
            size="small"
            sx={{
              background: config.bg,
              color: config.color,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(11.5),
              height: '26px',
              borderRadius: '100px',
              '& .MuiChip-label': { px: '10px' },
            }}
          />
        );
      },
    },
    {
      field: 'actions' as string,
      headerName: '',
      flex: 0.5,
      minWidth: 50,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleViewTransaction(params.row);
          }}
          sx={{
            width: 30,
            height: 30,
            color: '#9CA3AF',
            '&:hover': { color: '#2F6FED', background: '#EBF2FF' },
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header: Title + Export Button */}
        <RowStack justifyContent={'space-between'} alignItems={'flex-start'}>
          <DashboardTitleAndDesc
            title="Payment History & Ride Transactions"
            desc="All ride payments, method breakdowns, and transaction records"
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              background: '#2F6FED',
              borderRadius: '14px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.9 },
              flexShrink: 0,
            }}
          >
            <DownloadOutlinedIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              Export CSV
            </Typography>
          </Box>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'20px'}>
          {statCards.map((card) => (
            <Grid key={card.label} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                  padding: '20px',
                  gap: '16px',
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: '#EBF2FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
                <Stack spacing={'4px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(26),
                      lineHeight: '1em',
                      color: '#111827',
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(13),
                      color: '#374151',
                    }}
                  >
                    {card.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11.5),
                      color: '#9CA3AF',
                    }}
                  >
                    {card.subtext}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Payment Method Breakdown */}
        <Stack
          spacing={'16px'}
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            padding: '24px',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(18),
              color: '#111827',
            }}
          >
            Payment Method Breakdown
          </Typography>

          <Grid container spacing={'12px'}>
            {paymentMethods.map((pm) => (
              <Grid key={pm.label} size={{ xs: 6, md: 4, lg: 2.4 }}>
                <Stack
                  sx={{
                    background: '#F7F9FB',
                    border: '0.67px solid #F0F4F8',
                    borderRadius: '14px',
                    padding: '16px',
                    gap: '12px',
                  }}
                >
                  <RowStack spacing={'8px'}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: pm.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12.5),
                        color: '#374151',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pm.label}
                    </Typography>
                  </RowStack>

                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(20),
                      color: '#111827',
                    }}
                  >
                    {pm.amount}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12),
                      color: '#9CA3AF',
                    }}
                  >
                    {pm.detail}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={pm.progress}
                    sx={{
                      height: 4,
                      borderRadius: '100px',
                      backgroundColor: '#E8ECF0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: '100px',
                        backgroundColor: pm.color,
                      },
                    }}
                  />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* All Transactions Table */}
        <AppGridtable
          columns={columns}
          data={filteredTransactions}
          initialPageSize={8}
          onRowClick={(row) => handleViewTransaction(row)}
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <Stack spacing={'16px'} width={'100%'}>
            {/* Table Title */}
            <RowStack spacing={'8px'}>
              <SwapVertOutlinedIcon
                sx={{
                  fontSize: 20,
                  color: (theme) => theme.palette.primary.main,
                }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(16),
                  color: '#111827',
                }}
              >
                All Transactions
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#9CA3AF',
                }}
              >
                {filteredTransactions.length} transactions
              </Typography>
            </RowStack>

            {/* Tabs + Search */}
            <RowStack justifyContent={'space-between'}>
              <RowStack spacing={'4px'}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.value;
                  return (
                    <Box
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        background: isActive ? '#2F6FED' : 'transparent',
                        border: isActive ? 'none' : '0.67px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': { opacity: 0.85 },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: isActive ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        {tab.label}
                      </Typography>
                      <Box
                        sx={{
                          padding: '2px 6px',
                          borderRadius: '100px',
                          background: isActive
                            ? 'rgba(255,255,255,0.25)'
                            : '#F0F4F8',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(11),
                            color: isActive ? '#FFFFFF' : '#6B7280',
                          }}
                        >
                          {tabCounts[tab.value]}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </RowStack>

              <AppSearchField
                name="search"
                placeholder="Search transactions..."
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

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={selectedTxn}
      />
    </AppDashboardLayout>
  );
};

// ─── Transaction Detail Modal ───────────────────────────────────────────────

const TransactionDetailModal = ({
  open,
  onClose,
  transaction: txn,
}: {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}) => {
  if (!txn) return null;

  const config = statusConfig[txn.status];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 540,
          borderRadius: '16px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
          margin: 0,
        },
      }}
    >
      {/* Header */}
      <RowStack
        justifyContent={'space-between'}
        sx={{ padding: '20px 24px', borderBottom: '0.67px solid #F0F4F8' }}
      >
        <RowStack spacing={'12px'}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '14px',
              background: '#EFF5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ReceiptLongOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
          </Box>
          <Stack spacing={'1px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: '#111827',
                lineHeight: '1.5em',
              }}
            >
              Transaction Detail
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#9CA3AF',
                lineHeight: '1.5em',
              }}
            >
              {txn.txnId} · Booking {txn.bookingRef}
            </Typography>
          </Stack>
        </RowStack>

        <Box
          onClick={onClose}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '10px',
            background: '#F7F9FB',
            border: '0.67px solid #E8ECF0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': { background: '#E5E7EB' },
          }}
        >
          <CloseIcon sx={{ fontSize: 15, color: '#6B7280' }} />
        </Box>
      </RowStack>

      {/* Amount Section */}
      <RowStack
        justifyContent={'space-between'}
        sx={{
          padding: '20px 24px',
          background: '#FAFBFC',
          borderBottom: '0.67px solid #F0F4F8',
        }}
      >
        <Stack spacing={'4px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(11),
              letterSpacing: '0.055em',
              color: '#9CA3AF',
            }}
          >
            AMOUNT CHARGED
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 800,
              fontSize: pxToRem(36),
              lineHeight: '1em',
              letterSpacing: '-0.028em',
              color: '#111827',
            }}
          >
            {txn.amount}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12.5),
              color: '#6B7280',
            }}
          >
            {txn.rideType} · {txn.distance} · {txn.duration}
          </Typography>
        </Stack>

        <Stack spacing={'8px'} alignItems={'flex-end'}>
          <RowStack
            spacing={'6px'}
            sx={{
              padding: '5px 12px',
              borderRadius: '100px',
              background: config.bg,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '3px',
                background: config.dot,
              }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(12.5),
                color: config.color,
              }}
            >
              {txn.status}
            </Typography>
          </RowStack>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#9CA3AF',
            }}
          >
            {txn.paymentMethod}
          </Typography>
        </Stack>
      </RowStack>

      {/* Details Section */}
      <Stack spacing={'16px'} sx={{ padding: '24px' }}>
        {/* Rider & Driver */}
        <RowStack spacing={0} sx={{ gap: 0 }}>
          <DetailCard
            icon={
              <PersonOutlineOutlinedIcon
                sx={{ fontSize: 13, color: '#2F6FED' }}
              />
            }
            iconBg="#EFF5FF"
            label="RIDER"
            value={txn.rider}
            sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
          <DetailCard
            icon={
              <PersonOutlineOutlinedIcon
                sx={{ fontSize: 13, color: '#059669' }}
              />
            }
            iconBg="#F0FDF7"
            label="DRIVER"
            value={txn.driver}
            sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          />
        </RowStack>

        {/* Route */}
        <Stack
          sx={{
            background: '#F7F9FB',
            border: '0.67px solid #F0F4F8',
            borderRadius: '14px',
            padding: '16px',
            gap: '12px',
          }}
        >
          <RowStack spacing={'8px'}>
            <Box
              sx={{
                width: 13,
                height: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  border: '2px solid #2F6FED',
                }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(11),
                letterSpacing: '0.045em',
                color: '#9CA3AF',
              }}
            >
              ROUTE
            </Typography>
          </RowStack>

          <RowStack spacing={'12px'}>
            <Stack alignItems={'center'} spacing={'4px'} sx={{ pt: '3px' }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '5px',
                  background: '#2F6FED',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0px 0px 0px 2px #2F6FED',
                }}
              />
              <Box
                sx={{
                  width: 1.5,
                  height: 28,
                  background: '#E0E7FF',
                }}
              />
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '5px',
                  background: '#10B981',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0px 0px 0px 2px #10B981',
                }}
              />
            </Stack>

            <Stack justifyContent={'space-between'} sx={{ gap: '18px' }}>
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(10.5),
                    letterSpacing: '0.038em',
                    color: '#9CA3AF',
                  }}
                >
                  PICKUP
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(13.5),
                    color: '#111827',
                  }}
                >
                  {txn.pickup}
                </Typography>
              </Stack>
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(10.5),
                    letterSpacing: '0.038em',
                    color: '#9CA3AF',
                  }}
                >
                  DROPOFF
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(13.5),
                    color: '#111827',
                  }}
                >
                  {txn.dropoff}
                </Typography>
              </Stack>
            </Stack>
          </RowStack>
        </Stack>

        {/* Date & Time / Payment / Booking Ref */}
        <RowStack spacing={0} sx={{ gap: 0 }}>
          <Stack
            sx={{
              flex: 1,
              background: '#F7F9FB',
              border: '0.67px solid #F0F4F8',
              borderRadius: '14px 0 0 14px',
              padding: '14px',
              gap: '8px',
            }}
          >
            <RowStack spacing={'6px'}>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '8px',
                  background: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccessTimeOutlinedIcon
                  sx={{ fontSize: 11, color: '#6B7280' }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10.5),
                  letterSpacing: '0.038em',
                  color: '#9CA3AF',
                }}
              >
                DATE & TIME
              </Typography>
            </RowStack>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
              }}
            >
              {txn.date}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11.5),
                color: '#9CA3AF',
              }}
            >
              {txn.time}
            </Typography>
          </Stack>

          <Stack
            sx={{
              flex: 1,
              background: '#F7F9FB',
              border: '0.67px solid #F0F4F8',
              borderLeft: 'none',
              padding: '14px',
              gap: '8px',
            }}
          >
            <RowStack spacing={'6px'}>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '8px',
                  background: '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CreditCardOutlinedIcon
                  sx={{ fontSize: 11, color: '#6366F1' }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10.5),
                  letterSpacing: '0.038em',
                  color: '#9CA3AF',
                }}
              >
                PAYMENT
              </Typography>
            </RowStack>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
              }}
            >
              {txn.paymentMethod}
            </Typography>
          </Stack>

          <Stack
            sx={{
              flex: 1,
              background: '#F7F9FB',
              border: '0.67px solid #F0F4F8',
              borderLeft: 'none',
              borderRadius: '0 14px 14px 0',
              padding: '14px',
              gap: '8px',
            }}
          >
            <RowStack spacing={'6px'}>
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '8px',
                  background: '#FFFBEB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookmarkBorderOutlinedIcon
                  sx={{ fontSize: 11, color: '#D97706' }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10.5),
                  letterSpacing: '0.038em',
                  color: '#9CA3AF',
                }}
              >
                BOOKING REF
              </Typography>
            </RowStack>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
              }}
            >
              {txn.bookingRef}
            </Typography>
          </Stack>
        </RowStack>
      </Stack>

      {/* Close Button */}
      <Box
        onClick={onClose}
        sx={{
          margin: '0 24px 24px',
          padding: '12px',
          borderRadius: '10px',
          background: '#F7F9FB',
          border: '0.67px solid #E8ECF0',
          cursor: 'pointer',
          textAlign: 'center',
          '&:hover': { background: '#EFF2F5' },
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          Close
        </Typography>
      </Box>
    </Dialog>
  );
};

const DetailCard = ({
  icon,
  iconBg,
  label,
  value,
  sx: sxProp,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  sx?: Record<string, unknown>;
}) => (
  <Stack
    sx={{
      flex: 1,
      background: '#F7F9FB',
      border: '0.67px solid #F0F4F8',
      borderRadius: '14px',
      padding: '16px',
      gap: '8px',
      ...sxProp,
    }}
  >
    <RowStack spacing={'8px'}>
      <Box
        sx={{
          width: 26,
          height: 26,
          borderRadius: '10px',
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
          fontSize: pxToRem(11),
          letterSpacing: '0.045em',
          color: '#9CA3AF',
        }}
      >
        {label}
      </Typography>
    </RowStack>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(14),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </Stack>
);
