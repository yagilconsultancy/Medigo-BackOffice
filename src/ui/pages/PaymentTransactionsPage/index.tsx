'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Chip,
  Drawer,
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
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  pxToRem,
  useGetTransactionKpis,
  useGetAllTransactions,
  useGetTransactionDetail,
  useResolvedApiQuery,
  type AdminTransactionResponse,
} from '../../../common';
import { EmptyState } from '../../modules/blocks';

// ─── Types ──────────────────────────────────────────────────────────────────

type TransactionStatus = 'completed' | 'pending' | 'failed';
type TabValue = 'All' | TransactionStatus;

type Transaction = {
  id: string;
  txnId: string;
  rideId: string;
  rider: string;
  driver: string;
  rideType: string;
  amount: string;
  paymentMethod: string;
  transactionType: string;
  date: string;
  time: string;
  status: TransactionStatus;
};

type RawTransaction = AdminTransactionResponse;

// ─── Status Config ──────────────────────────────────────────────────────────

const statusConfig: Record<
  TransactionStatus,
  { dot: string; bg: string; color: string }
> = {
  completed: { dot: '#10B981', bg: '#ECFDF5', color: '#059669' },
  pending: { dot: '#F59E0B', bg: '#FFFBEB', color: '#D97706' },
  failed: { dot: '#EF4444', bg: '#FEF2F2', color: '#EF4444' },
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
    return 'completed';
  }

  if (normalized === 'pending' || normalized === 'processing') {
    return 'pending';
  }

  return 'failed';
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

/** The API reports amounts in dollars, not cents. */
const formatCad = (value?: number | string | null) => {
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

/** "wheelchair_accessible" → "Wheelchair Accessible" */
const titleCase = (value?: string | null, fallback = 'N/A') => {
  if (!value) return fallback;
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
  const transactionsQuery = useGetAllTransactions({
    status: activeTab === 'All' ? null : activeTab,
    search: searchQuery || null,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });
  const transactionsData = transactionsQuery.data as
    | (typeof transactionsQuery.data & { total?: number })
    | undefined;

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

  // const paymentMethods = useMemo(() => {
  //   const methods = paymentMethodData || [];
  //   const methodColors: Record<string, { color: string; label?: string }> = {
  //     medicare: { color: '#2F6FED', label: 'Medicare' },
  //     medicaid: { color: '#6366F1', label: 'Medicaid' },
  //     private_insurance: { color: '#10B981', label: 'Private Insurance' },
  //     credit_debit: { color: '#F59E0B', label: 'Credit / Debit Card' },
  //     direct_pay: { color: '#EC4899', label: 'Direct Pay' },
  //   };

  //   return methods.map((pm: any) => {
  //     const colorConfig = methodColors[
  //       pm.method?.toLowerCase().replace(/\s+/g, '_')
  //     ] || {
  //       color: '#6B7280',
  //       label: pm.method,
  //     };
  //     return {
  //       label: colorConfig.label || pm.method || 'Unknown',
  //       color: colorConfig.color,
  //       amount: `$${pm.total_amount?.toLocaleString() || '0'}`,
  //       detail: `${pm.count || 0} rides · ${pm.percentage || 0}%`,
  //       progress: pm.percentage || 0,
  //     };
  //   });
  // }, [paymentMethodData]);

  const transactionRows = useMemo<Transaction[]>(() => {
    const items = getTransactionItems(transactionsData);
    return items.map((txn) => ({
      id: txn.id || '',
      txnId: shortenId(txn.id),
      rideId: txn.ride_id || '',
      rider: txn.rider_name || 'Unknown',
      driver: txn.driver_name || 'Unassigned',
      rideType: titleCase(txn.ride_type),
      amount: formatCad(txn.amount),
      paymentMethod: titleCase(txn.payment_method),
      transactionType: titleCase(txn.transaction_type),
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
    { label: 'Settled', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Failed', value: 'failed' },
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
        {/* <Stack
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
        </Stack> */}

        {/* All Transactions Table */}
        <AppGridtable
          columns={columns}
          data={transactionRows}
          disableAutoPagination
          totalRows={transactionsData?.total ?? 0}
          initialPageSize={paginationModel.pageSize}
          isFetchingData={transactionsQuery.isFetching}
          onPaginationModelChange={(model) => {
            setPaginationModel(model);
          }}
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
                {transactionsData?.total ?? 0} transactions
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
                      onClick={() => {
                        setActiveTab(tab.value);
                        setPaginationModel((prev) => ({ ...prev, page: 0 }));
                      }}
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                boxProps={{
                  sx: { width: '240px' },
                }}
              />
            </RowStack>
          </Stack>
        </AppGridtable>
      </Stack>

      {/* Transaction Detail Sheet */}
      <TransactionDetailSheet
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={selectedTxn}
      />
    </AppDashboardLayout>
  );
};
// ─── Transaction Detail Sheet ───────────────────────────────────────────────

const TransactionDetailSheet = ({
  open,
  onClose,
  transaction: txn,
}: {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}) => {
  // The roster row seeds the sheet so it paints instantly; the per-transaction
  // call then fills in what the list endpoint doesn't carry (route addresses,
  // booking ref, ride description). Fetch only while the sheet is open.
  const { data: detail, isFetching } = useResolvedApiQuery(
    useGetTransactionDetail,
    null,
    open && txn ? txn.id : ''
  );

  if (!txn) return null;

  const isLoading = isFetching && !detail;

  const status = detail ? normalizeTransactionStatus(detail.status) : txn.status;
  const config = statusConfig[status];

  const created = detail?.created_at ? new Date(detail.created_at) : null;
  const date = created
    ? created.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : txn.date;
  const time = created
    ? created.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : txn.time;

  const amount = detail ? formatCad(detail.amount) : txn.amount;
  const rider = detail?.rider_name || txn.rider;
  const driver = detail?.driver_name || txn.driver;
  const rideType = detail ? titleCase(detail.ride_type) : txn.rideType;
  const paymentMethod = detail
    ? titleCase(detail.payment_method)
    : txn.paymentMethod;
  const transactionType = detail
    ? titleCase(detail.transaction_type)
    : txn.transactionType;
  const bookingRef = detail?.booking_ref || '—';
  const rideId = detail?.ride_id || txn.rideId || '';
  const pickup = detail?.pickup_address || '—';
  const dropoff = detail?.destination_address || '—';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 520,
          maxWidth: '100vw',
          boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
          border: 'none',
        },
      }}
    >
      <Stack sx={{ height: '100%' }}>
        {/* ─── Header ──────────────────────────────────────────────── */}
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
                {txn.txnId}
                {bookingRef !== '—' ? ` · Booking ${bookingRef}` : ''}
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

        {/* ─── Scrollable Body ─────────────────────────────────────── */}
        <Stack sx={{ flex: 1, overflowY: 'auto' }}>
          {/* Amount */}
          <RowStack
            justifyContent={'space-between'}
            alignItems={'flex-start'}
            sx={{
              padding: '20px 24px',
              background: '#FAFBFC',
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            <Stack spacing={'6px'}>
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
                  lineHeight: '1.2em',
                  letterSpacing: '-0.028em',
                  color: '#111827',
                }}
              >
                {amount}
              </Typography>
              {isLoading ? (
                <Skeleton variant="text" width={180} height={18} />
              ) : (
                (detail?.ride_description || rideType !== 'N/A') && (
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#6B7280',
                    }}
                  >
                    {detail?.ride_description || rideType}
                  </Typography>
                )
              )}
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
                  {status}
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
                {paymentMethod}
              </Typography>
            </Stack>
          </RowStack>

          {/* Details */}
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
                value={rider}
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
                value={driver}
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
                <SwapVertOutlinedIcon
                  sx={{ fontSize: 13, color: '#9CA3AF' }}
                />
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

              <RowStack spacing={'12px'} alignItems={'stretch'}>
                <Stack alignItems={'center'} spacing={'4px'} sx={{ pt: '5px' }}>
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
                  <Box sx={{ width: 1.5, flex: 1, background: '#E0E7FF' }} />
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
                    {isLoading ? (
                      <Skeleton variant="text" width={240} height={20} />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 500,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        {pickup}
                      </Typography>
                    )}
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
                    {isLoading ? (
                      <Skeleton variant="text" width={240} height={20} />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 500,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        {dropoff}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </RowStack>
            </Stack>

            {/* Date & Time / Payment / Booking Ref */}
            <RowStack spacing={0} sx={{ gap: 0 }}>
              <InfoTile
                icon={
                  <AccessTimeOutlinedIcon
                    sx={{ fontSize: 11, color: '#6B7280' }}
                  />
                }
                iconBg="#F3F4F6"
                label="DATE & TIME"
                value={date}
                caption={time}
                sx={{ borderRadius: '14px 0 0 14px' }}
              />
              <InfoTile
                icon={
                  <CreditCardOutlinedIcon
                    sx={{ fontSize: 11, color: '#6366F1' }}
                  />
                }
                iconBg="#EEF2FF"
                label="PAYMENT"
                value={paymentMethod}
                sx={{ borderRadius: 0, borderLeft: 'none' }}
              />
              <InfoTile
                icon={
                  <BookmarkBorderOutlinedIcon
                    sx={{ fontSize: 11, color: '#D97706' }}
                  />
                }
                iconBg="#FFFBEB"
                label="BOOKING REF"
                value={bookingRef}
                loading={isLoading}
                sx={{ borderRadius: '0 14px 14px 0', borderLeft: 'none' }}
              />
            </RowStack>

            {/* Ride Type / Transaction Type */}
            <RowStack spacing={0} sx={{ gap: 0 }}>
              <InfoTile
                icon={
                  <DirectionsCarOutlinedIcon
                    sx={{ fontSize: 11, color: '#0EA5E9' }}
                  />
                }
                iconBg="#EFF6FF"
                label="RIDE TYPE"
                value={rideType}
                sx={{ borderRadius: '14px 0 0 14px' }}
              />
              <InfoTile
                icon={
                  <SwapHorizOutlinedIcon
                    sx={{ fontSize: 11, color: '#7C3AED' }}
                  />
                }
                iconBg="#F5F3FF"
                label="TRANSACTION TYPE"
                value={transactionType}
                sx={{ borderRadius: '0 14px 14px 0', borderLeft: 'none' }}
              />
            </RowStack>

            {/* Identifiers */}
            <Stack
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #F0F4F8',
                borderRadius: '14px',
                padding: '16px',
                gap: '12px',
              }}
            >
              <IdentifierRow label="TRANSACTION ID" value={txn.id} />
              <IdentifierRow label="RIDE ID" value={rideId || '—'} />
            </Stack>
          </Stack>
        </Stack>

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <Box sx={{ padding: '16px 24px', borderTop: '0.67px solid #F0F4F8' }}>
          <Box
            onClick={onClose}
            sx={{
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
      </Stack>
    </Drawer>
  );
};

const InfoTile = ({
  icon,
  iconBg,
  label,
  value,
  caption,
  loading,
  sx: sxProp,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  caption?: string;
  loading?: boolean;
  sx?: Record<string, unknown>;
}) => (
  <Stack
    sx={{
      flex: 1,
      minWidth: 0,
      background: '#F7F9FB',
      border: '0.67px solid #F0F4F8',
      padding: '14px',
      gap: '8px',
      ...sxProp,
    }}
  >
    <RowStack spacing={'6px'}>
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: '8px',
          background: iconBg,
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
          fontWeight: 700,
          fontSize: pxToRem(10.5),
          letterSpacing: '0.038em',
          color: '#9CA3AF',
        }}
      >
        {label}
      </Typography>
    </RowStack>
    {loading ? (
      <Skeleton variant="text" width={80} height={20} />
    ) : (
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(13),
          color: '#111827',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </Typography>
    )}
    {caption && (
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11.5),
          color: '#9CA3AF',
        }}
      >
        {caption}
      </Typography>
    )}
  </Stack>
);

const IdentifierRow = ({ label, value }: { label: string; value: string }) => (
  <RowStack justifyContent={'space-between'} spacing={'12px'}>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(10.5),
        letterSpacing: '0.038em',
        color: '#9CA3AF',
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: 'monospace',
        fontWeight: 500,
        fontSize: pxToRem(12),
        color: '#374151',
        wordBreak: 'break-all',
        textAlign: 'right',
      }}
    >
      {value}
    </Typography>
  </RowStack>
);
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
