'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Chip,
  Dialog,
  Grid,
  IconButton,
  LinearProgress,
  Skeleton,
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
  AppModal,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  pxToRem,
  useGetTransactionKpis,
  useGetPaymentMethodBreakdown,
  useGetAllTransactions,
  useResolvedApiQuery,
} from '../../../common';
import { EmptyState } from '../../modules/blocks';

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

type RawTransaction = {
  id?: string;
  transaction_id?: string | null;
  booking_id?: string | null;
  ride_id?: string | null;
  rider_name?: string | null;
  driver_name?: string | null;
  ride_type?: string | null;
  user_name?: string | null;
  user_type?: string | null;
  amount?: number | string | null;
  payment_method?: string | null;
  status?: string | null;
  created_at?: string | null;
  metadata?: {
    rider_name?: string | null;
    driver_name?: string | null;
    ride_type?: string | null;
    distance?: string | null;
    duration?: string | null;
    pickup_address?: string | null;
    dropoff_address?: string | null;
  } | null;
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

const normalizeTransactionStatus = (
  status?: string | null
): TransactionStatus => {
  const normalized = (status || '').toLowerCase();

  if (
    normalized === 'completed' ||
    normalized === 'settled' ||
    normalized === 'successful' ||
    normalized === 'success'
  ) {
    return 'Settled';
  }

  if (normalized === 'pending' || normalized === 'processing') {
    return 'Pending';
  }

  return 'Failed';
};

const getTransactionItems = (data: unknown): RawTransaction[] => {
  if (Array.isArray(data)) return data as RawTransaction[];

  if (data && typeof data === 'object') {
    const maybeData = data as {
      items?: RawTransaction[];
      data?: RawTransaction[];
    };

    if (Array.isArray(maybeData.items)) return maybeData.items;
    if (Array.isArray(maybeData.data)) return maybeData.data;
  }

  return [];
};

const formatCadFromCents = (value?: number | string | null) => {
  const cad = Number(value || 0);

  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'code',
  }).format(cad);
};

const shortenId = (value?: string | null) => {
  if (!value) return 'N/A';
  return value.slice(0, 8);
};

// ─── Component ──────────────────────────────────────────────────────────────

export const PaymentTransactionsPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // API Integration
  const { data: kpisData } = useResolvedApiQuery(useGetTransactionKpis, null);
  const { data: paymentMethodData } = useResolvedApiQuery(
    useGetPaymentMethodBreakdown,
    null
  );
  const { data: transactionsData } = useResolvedApiQuery(
    useGetAllTransactions,
    null,
    {
      status: activeTab === 'All' ? null : activeTab,
      search: searchQuery || null,
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    }
  );

  // Transform API data
  const statCards = useMemo(() => {
    const kpis = kpisData || {};
    return [
      {
        icon: <SwapHorizOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
        value: kpis.total_transactions?.toLocaleString() || '0',
        label: 'Total Transactions',
        subtext: 'This month',
      },
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />
        ),
        value: `$${kpis.total_collected?.toLocaleString() || '0'}`,
        label: 'Total Collected',
        subtext: '+18.4% vs last month',
      },
      {
        icon: (
          <CheckCircleOutlinedIcon sx={{ fontSize: 20, color: '#059669' }} />
        ),
        value: kpis.settled_count?.toLocaleString() || '0',
        label: 'Settled',
        subtext: '95.5% success rate',
      },
      {
        icon: (
          <WarningAmberOutlinedIcon sx={{ fontSize: 20, color: '#D97706' }} />
        ),
        value: kpis.pending_count?.toLocaleString() || '0',
        label: 'Pending',
        subtext: 'Awaiting settlement',
      },
    ];
  }, [kpisData]);

  const paymentMethods = useMemo(() => {
    const methods = paymentMethodData || [];
    const methodColors: Record<string, { color: string; label?: string }> = {
      medicare: { color: '#2F6FED', label: 'Medicare' },
      medicaid: { color: '#6366F1', label: 'Medicaid' },
      private_insurance: { color: '#10B981', label: 'Private Insurance' },
      credit_debit: { color: '#F59E0B', label: 'Credit / Debit Card' },
      direct_pay: { color: '#EC4899', label: 'Direct Pay' },
    };

    return methods.map((pm: any) => {
      const colorConfig = methodColors[
        pm.method?.toLowerCase().replace(/\s+/g, '_')
      ] || {
        color: '#6B7280',
        label: pm.method,
      };
      return {
        label: colorConfig.label || pm.method || 'Unknown',
        color: colorConfig.color,
        amount: `$${pm.total_amount?.toLocaleString() || '0'}`,
        detail: `${pm.count || 0} rides · ${pm.percentage || 0}%`,
        progress: pm.percentage || 0,
      };
    });
  }, [paymentMethodData]);

  const transactionRows = useMemo<Transaction[]>(() => {
    const items = getTransactionItems(transactionsData);
    return items.map((txn: any) => ({
      id: txn.id || txn.transaction_id || txn.ride_id || '',
      txnId: shortenId(txn.transaction_id || txn.id),
      bookingRef: txn.booking_id || txn.ride_id || 'N/A',
      rider:
        txn.metadata?.rider_name ||
        txn.rider_name ||
        txn.user_name ||
        'Unknown',
      driver: txn.metadata?.driver_name || txn.driver_name || 'Unknown',
      rideType:
        txn.metadata?.ride_type || txn.ride_type || txn.user_type || 'N/A',
      amount: formatCadFromCents(txn.amount),
      paymentMethod: txn.payment_method || 'N/A',
      date: new Date(txn.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      time: new Date(txn.created_at || Date.now()).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: normalizeTransactionStatus(txn.status),
      distance: txn.metadata?.distance || 'N/A',
      duration: txn.metadata?.duration || 'N/A',
      pickup: txn.metadata?.pickup_address || 'N/A',
      dropoff: txn.metadata?.dropoff_address || 'N/A',
    }));
  }, [transactionsData]);

  const tabCounts = useMemo(() => {
    const kpis = kpisData || {};
    return {
      All: kpis.total_transactions || 0,
      Settled: kpis.settled_count || 0,
      Pending: kpis.pending_count || 0,
      // Failed: kpis.failed_count || 0,
    };
  }, [kpisData]);

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

          {paymentMethods.length === 0 ? (
            <Stack
              sx={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EmptyState emptyState="No Payment Methods" />
            </Stack>
          ) : (
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
          )}
        </Stack>

        {/* All Transactions Table */}
        <AppGridtable
          columns={columns}
          data={transactionRows}
          initialPageSize={paginationModel.pageSize}
          onRowClick={(row) => handleViewTransaction(row)}
          emptyState={
            <Stack
              sx={{
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EmptyState emptyState="No Transactions" />
            </Stack>
          }
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
                {transactionRows.length} transactions
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
    <AppModal
      open={open}
      setOpen={onClose}
      label="Transaction Detail"
      padding="16px"
      sx={{
        sx: {
          width: 540,
          borderRadius: '16px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
          margin: 0,
        },
      }}
    >
      <Box>
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
              <ReceiptLongOutlinedIcon
                sx={{ fontSize: 18, color: '#2F6FED' }}
              />
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
                {txn.txnId} · Booking {txn.bookingRef.slice(0, 10)}...
                {txn.bookingRef.slice(-6)}
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
                fontSize: pxToRem(28),
                lineHeight: '1rem',
                letterSpacing: '-0.028em',
                color: '#111827',
              }}
            >
              {txn.amount}
            </Typography>
            {/* <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#6B7280',
              }}
            >
              {txn.rideType} · {txn.distance} · {txn.duration}
            </Typography> */}
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
          {/* <Stack
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
          </Stack> */}

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
                {txn.bookingRef.slice(0, 10)}...{txn.bookingRef.slice(-6)}
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
      </Box>
    </AppModal>
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
