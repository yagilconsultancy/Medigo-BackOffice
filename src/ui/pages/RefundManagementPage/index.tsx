'use client';

import { useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
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
import { pxToRem } from '../../../common';
import {
  RefundDetailModal,
  ApproveRefundModal,
  RejectRefundModal,
} from './ui/components';

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

// ─── Stat Cards ─────────────────────────────────────────────────────────────

const statCards = [
  {
    icon: <LoopOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    value: '84',
    label: 'Total Refund Requests',
    subtext: 'This month',
  },
  {
    icon: <ScheduleOutlinedIcon sx={{ fontSize: 20, color: '#D97706' }} />,
    iconBg: '#FFFBEB',
    value: '22',
    label: 'Pending Review',
    subtext: 'Awaiting decision',
  },
  {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 20, color: '#059669' }} />,
    iconBg: '#ECFDF5',
    value: '56',
    label: 'Approved',
    subtext: '$18,240 issued',
  },
  {
    icon: <CancelOutlinedIcon sx={{ fontSize: 20, color: '#EF4444' }} />,
    iconBg: '#FEF2F2',
    value: '6',
    label: 'Rejected',
    subtext: 'Insufficient reason',
  },
];

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

// ─── Table Data ─────────────────────────────────────────────────────────────

const refundData: RefundRow[] = [
  {
    id: '1',
    refundId: 'REF-1201',
    booking: 'BK-20488',
    riderName: 'George Lewis',
    driverName: 'Anna Kim',
    category: 'Driver No-Show',
    reason: 'Driver no-show',
    amount: '$47.00',
    amountValue: 47,
    requested: 'Mar 8, 2026',
    status: 'Pending',
    paymentMethod: 'Visa ••7744',
    rideType: 'Standard Medical',
    description:
      'Driver accepted the booking but never arrived. I waited 35 minutes before cancelling.',
  },
  {
    id: '2',
    refundId: 'REF-1200',
    booking: 'BK-20481',
    riderName: 'Patricia Clark',
    driverName: 'Tom Roberts',
    category: 'Service Issue',
    reason: 'Wrong destination',
    amount: '$52.00',
    amountValue: 52,
    requested: 'Mar 7, 2026',
    status: 'Pending',
    paymentMethod: 'Mastercard ••3291',
    rideType: 'Standard Medical',
    description:
      'Driver took me to the wrong medical facility. Had to rebook another ride.',
  },
  {
    id: '3',
    refundId: 'REF-1199',
    booking: 'BK-20475',
    riderName: 'Nancy White',
    driverName: 'James Thompson',
    category: 'Billing Error',
    reason: 'Double charge',
    amount: '$29.00',
    amountValue: 29,
    requested: 'Mar 6, 2026',
    status: 'Approved',
    paymentMethod: 'Visa ••8812',
    rideType: 'Wheelchair Accessible',
    description: 'I was charged twice for the same trip on March 5th.',
  },
  {
    id: '4',
    refundId: 'REF-1198',
    booking: 'BK-20469',
    riderName: 'Robert Garcia',
    driverName: 'Kevin Park',
    category: 'Service Issue',
    reason: 'Excessive wait time',
    amount: '$91.25',
    amountValue: 91.25,
    requested: 'Mar 5, 2026',
    status: 'Approved',
    paymentMethod: 'Visa ••5501',
    rideType: 'Standard Medical',
    description:
      'Driver was 45 minutes late to pickup. Almost missed my appointment.',
  },
  {
    id: '5',
    refundId: 'REF-1197',
    booking: 'BK-20461',
    riderName: 'Helen Moore',
    driverName: 'David Chen',
    category: 'Vehicle Mismatch',
    reason: 'Vehicle not equipped',
    amount: '$62.00',
    amountValue: 62,
    requested: 'Mar 4, 2026',
    status: 'Approved',
    paymentMethod: 'Mastercard ••4420',
    rideType: 'Wheelchair Accessible',
    description:
      'Booked a wheelchair accessible vehicle but a standard sedan arrived.',
  },
  {
    id: '6',
    refundId: 'REF-1196',
    booking: 'BK-20453',
    riderName: 'Daniel Martinez',
    driverName: 'Sarah Williams',
    category: 'Technical Issue',
    reason: 'App error',
    amount: '$38.75',
    amountValue: 38.75,
    requested: 'Mar 3, 2026',
    status: 'Rejected',
    paymentMethod: 'Visa ••9913',
    rideType: 'Standard Medical',
    description:
      'App crashed during the ride and I was charged even though the trip was incomplete.',
  },
  {
    id: '7',
    refundId: 'REF-1195',
    booking: 'BK-20446',
    riderName: 'Lisa Anderson',
    driverName: 'Emily Rodriguez',
    category: 'Driver Behavior',
    reason: 'Unsatisfactory service',
    amount: '$78.50',
    amountValue: 78.5,
    requested: 'Mar 2, 2026',
    status: 'Pending',
    paymentMethod: 'Visa ••6677',
    rideType: 'Standard Medical',
    description:
      'Driver was rude and took an unnecessarily long route to increase the fare.',
  },
  {
    id: '8',
    refundId: 'REF-1194',
    booking: 'BK-20438',
    riderName: 'James Wilson',
    driverName: 'Marcus Johnson',
    category: 'Billing Error',
    reason: 'Cancelled trip charge',
    amount: '$43.50',
    amountValue: 43.5,
    requested: 'Mar 1, 2026',
    status: 'Approved',
    paymentMethod: 'Mastercard ••2208',
    rideType: 'Standard Medical',
    description:
      'I cancelled the trip well within the free cancellation window but was still charged.',
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({ category: 'All', status: 'All' });
  };

  // Tab counts
  const tabCounts: Record<TabValue, number> = {
    All: refundData.length,
    Pending: refundData.filter((r) => r.status === 'Pending').length,
    Approved: refundData.filter((r) => r.status === 'Approved').length,
    Rejected: refundData.filter((r) => r.status === 'Rejected').length,
  };

  const filteredRefunds = refundData.filter((r) => {
    // Tab filter
    if (activeTab !== 'All' && r.status !== activeTab) return false;
    // Search
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.refundId.toLowerCase().includes(q) ||
      r.riderName.toLowerCase().includes(q) ||
      r.booking.toLowerCase().includes(q);
    // Filter popover
    const matchesCategory =
      filters.category === 'All' || r.category === filters.category;
    const matchesStatus =
      filters.status === 'All' || r.status === filters.status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
          data={filteredRefunds}
          initialPageSize={8}
          disableRowClick
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
                      onClick={() => setActiveTab(tab.value)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        background: isActive ? '#2F6FED' : 'transparent',
                        border: isActive
                          ? 'none'
                          : '0.67px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': { opacity: 0.85 },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) =>
                            theme.typography.fontFamily,
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
                            fontFamily: (theme) =>
                              theme.typography.fontFamily,
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
