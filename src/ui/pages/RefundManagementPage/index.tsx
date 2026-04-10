'use client';

import { useState, useMemo } from 'react';
import { Box, Chip, Grid, IconButton, Stack, Typography } from '@mui/material';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  AppSearchField,
  AppFilterPopover,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { FilterSection } from '../../modules/components/AppFilterPopover';
import {
  pxToRem,
  useGetRefundKpis,
  useGetRefundRequests,
  useResolvedApiQuery,
} from '../../../common';
import {
  RefundDetailModal,
  ApproveRefundModal,
  RejectRefundModal,
} from './ui/components';
import { EmptyState } from '../../modules/blocks';

// ─── Types ──────────────────────────────────────────────────────────────────

type RefundStatus = 'Pending' | 'Approved' | 'Rejected';
type TabValue = 'All' | 'Pending' | 'Approved' | 'Rejected';

type RefundRow = {
  id: string;
  refundId: string;
  booking: string;
  riderName: string;
  driverName: string;
  category: string;
  reason: string;
  amount: string;
  amountValue: number;
  requested: string;
  status: RefundStatus;
  paymentMethod: string;
  rideType: string;
  description: string;
};

// ─── Category Colors ────────────────────────────────────────────────────────

const categoryColors: Record<string, { bg: string; color: string }> = {
  'Driver No-Show': { bg: '#FEF2F2', color: '#EF4444' },
  'Service Issue': { bg: '#FFFBEB', color: '#D97706' },
  'Billing Error': { bg: '#EFF5FF', color: '#2F6FED' },
  'Vehicle Mismatch': { bg: '#EEF2FF', color: '#6366F1' },
  'Technical Issue': { bg: '#F0FDF7', color: '#059669' },
  'Driver Behavior': { bg: '#FFF1F2', color: '#BE185D' },
};

// ─── Filter Sections ────────────────────────────────────────────────────────

const filterSections: FilterSection[] = [
  {
    label: 'Category',
    key: 'category',
    options: [
      'All',
      'Driver No-Show',
      'Service Issue',
      'Billing Error',
      'Vehicle Mismatch',
      'Technical Issue',
      'Driver Behavior',
    ],
  },
  {
    label: 'Status',
    key: 'status',
    options: ['All', 'Pending', 'Approved', 'Rejected'],
  },
];

// ─── Tab Config ─────────────────────────────────────────────────────────────

const tabs: { label: string; value: TabValue }[] = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const RefundManagementPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    category: 'All',
    status: 'All',
  });
  const [selectedRefund, setSelectedRefund] = useState<RefundRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 8,
  });

  // API Integration
  const { data: kpisData } = useResolvedApiQuery(useGetRefundKpis, null);
  const { data: refundsData } = useResolvedApiQuery(
    useGetRefundRequests,
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
        icon: <LoopOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
        iconBg: '#EBF2FF',
        value: kpis.total_refunds?.toLocaleString() || '0',
        label: 'Total Refund Requests',
        subtext: 'This month',
      },
      {
        icon: <ScheduleOutlinedIcon sx={{ fontSize: 20, color: '#D97706' }} />,
        iconBg: '#FFFBEB',
        value: kpis.pending_refunds?.toLocaleString() || '0',
        label: 'Pending Review',
        subtext: 'Awaiting decision',
      },
      {
        icon: (
          <CheckCircleOutlineIcon sx={{ fontSize: 20, color: '#059669' }} />
        ),
        iconBg: '#ECFDF5',
        value: kpis.approved_refunds?.toLocaleString() || '0',
        label: 'Approved',
        subtext: `$${kpis.total_refund_amount?.toLocaleString() || '0'} issued`,
      },
      {
        icon: <CancelOutlinedIcon sx={{ fontSize: 20, color: '#EF4444' }} />,
        iconBg: '#FEF2F2',
        value: kpis.rejected_refunds?.toLocaleString() || '0',
        label: 'Rejected',
        subtext: 'Insufficient reason',
      },
    ];
  }, [kpisData]);

  const refundRows = useMemo(() => {
    const items = refundsData?.items || [];
    return items.map((item: any) => ({
      id: item.id,
      refundId: item.refund_id || '',
      booking: item.booking_id || '',
      riderName: item.user_name || '',
      driverName: '',
      category: item.category || 'Other',
      reason: item.reason || '',
      amount: `$${item.amount?.toFixed(2) || '0.00'}`,
      amountValue: item.amount || 0,
      requested: new Date(item.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: item.status || 'Pending',
      paymentMethod: '',
      rideType: '',
      description: item.reason || '',
    }));
  }, [refundsData]);

  const tabCounts: Record<TabValue, number> = useMemo(() => {
    const kpis = kpisData || {};
    return {
      All: kpis.total_refunds || 0,
      Pending: kpis.pending_refunds || 0,
      Approved: kpis.approved_refunds || 0,
      Rejected: kpis.rejected_refunds || 0,
    };
  }, [kpisData]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({ category: 'All', status: 'All' });
  };

  const openApprove = (row: RefundRow) => {
    setSelectedRefund(row);
    setDetailOpen(false);
    setApproveOpen(true);
  };

  const openReject = (row: RefundRow) => {
    setSelectedRefund(row);
    setDetailOpen(false);
    setRejectOpen(true);
  };

  const columns: GridColSpec<RefundRow>[] = [
    {
      field: 'refundId',
      headerName: 'Refund ID',
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#2F6FED',
          }}
        >
          {params.row.refundId}
        </Typography>
      ),
    },
    {
      field: 'booking',
      headerName: 'Booking',
      flex: 0.7,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.row.booking}
        </Typography>
      ),
    },
    {
      field: 'riderName',
      headerName: 'Rider',
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.riderName}
        </Typography>
      ),
    },
    {
      field: 'driverName',
      headerName: 'Driver',
      flex: 0.9,
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
          {params.row.driverName}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const cat = categoryColors[params.row.category] || {
          bg: '#F3F4F6',
          color: '#6B7280',
        };
        return (
          <Chip
            label={params.row.category}
            size="small"
            sx={{
              background: cat.bg,
              color: cat.color,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(11),
              height: '24px',
              borderRadius: '100px',
            }}
          />
        );
      },
    },
    {
      field: 'reason',
      headerName: 'Reason',
      flex: 1.1,
      minWidth: 130,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.reason}
        </Typography>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.7,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#059669',
          }}
        >
          {params.row.amount}
        </Typography>
      ),
    },
    {
      field: 'requested',
      headerName: 'Requested',
      flex: 0.9,
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
          {params.row.requested}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => {
        const statusMap: Record<
          RefundStatus,
          { dotColor: string; textColor: string }
        > = {
          Pending: { dotColor: '#D97706', textColor: '#D97706' },
          Approved: { dotColor: '#059669', textColor: '#059669' },
          Rejected: { dotColor: '#EF4444', textColor: '#EF4444' },
        };
        const s = statusMap[params.row.status];
        return (
          <RowStack spacing={'5px'}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '3px',
                background: s.dotColor,
              }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: s.textColor,
              }}
            >
              {params.row.status}
            </Typography>
          </RowStack>
        );
      },
    },
    {
      field: 'actions' as string,
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 90,
      sortable: false,
      renderCell: (params) => (
        <RowStack spacing={'2px'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRefund(params.row);
              setDetailOpen(true);
            }}
            sx={{
              width: 28,
              height: 28,
              color: '#9CA3AF',
              '&:hover': { color: '#2F6FED', background: '#EBF2FF' },
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          {params.row.status === 'Pending' && (
            <>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  openApprove(params.row);
                }}
                sx={{
                  width: 28,
                  height: 28,
                  color: '#9CA3AF',
                  '&:hover': { color: '#059669', background: '#ECFDF5' },
                }}
              >
                <CheckOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  openReject(params.row);
                }}
                sx={{
                  width: 28,
                  height: 28,
                  color: '#9CA3AF',
                  '&:hover': { color: '#EF4444', background: '#FEF2F2' },
                }}
              >
                <CloseOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </>
          )}
        </RowStack>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <DashboardTitleAndDesc
          title="Refund Management"
          desc="Review refund requests, approve or reject claims, and track issued refunds"
        />

        {/* ── Stat Cards ─────────────────────────────────────────────── */}
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
                    background: card.iconBg,
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

        {/* ── Table ──────────────────────────────────────────────────── */}
        <AppGridtable
          columns={columns}
          data={refundRows}
          initialPageSize={8}
          disableRowClick
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={refundsData?.total || 0}
          paginationMode="server"
          emptyState={
            <EmptyState
              title="No refund requests found"
              description="There are no refund requests matching your current filters"
              height={400}
            />
          }
          sx={{ height: 'auto', width: '100%' }}
        >
          <Stack spacing={'16px'} width={'100%'}>
            <RowStack justifyContent={'space-between'}>
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(16),
                    color: '#111827',
                  }}
                >
                  Refund Requests
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11.5),
                    color: '#9CA3AF',
                  }}
                >
                  All refund submissions for March 2026
                </Typography>
              </Stack>
            </RowStack>

            {/* Tabs + Search + Filter */}
            <RowStack justifyContent={'space-between'}>
              <RowStack spacing={'8px'}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.value;
                  return (
                    <Box
                      key={tab.value}
                      onClick={() => {
                        setActiveTab(tab.value);
                        setPaginationModel({ page: 0, pageSize: 8 });
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
                          fontSize: pxToRem(13),
                          color: isActive ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        {tab.label}
                      </Typography>
                      <Box
                        sx={{
                          padding: '1px 7px',
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

              <RowStack spacing={'8px'}>
                <AppSearchField
                  name="search"
                  placeholder="Search by ID, rider, or booking..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  boxProps={{ sx: { width: '280px' } }}
                />
                <AppFilterPopover
                  sections={filterSections}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleFilterReset}
                />
              </RowStack>
            </RowStack>
          </Stack>
        </AppGridtable>
      </Stack>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <RefundDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedRefund(null);
        }}
        onApprove={() => {
          if (selectedRefund) openApprove(selectedRefund);
        }}
        onReject={() => {
          if (selectedRefund) openReject(selectedRefund);
        }}
        data={selectedRefund}
      />

      <ApproveRefundModal
        open={approveOpen}
        onClose={() => {
          setApproveOpen(false);
          setSelectedRefund(null);
        }}
        onConfirm={() => {
          setApproveOpen(false);
          setSelectedRefund(null);
        }}
        data={selectedRefund}
      />

      <RejectRefundModal
        open={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
          setSelectedRefund(null);
        }}
        onConfirm={() => {
          setRejectOpen(false);
          setSelectedRefund(null);
        }}
        data={selectedRefund}
      />
    </AppDashboardLayout>
  );
};
