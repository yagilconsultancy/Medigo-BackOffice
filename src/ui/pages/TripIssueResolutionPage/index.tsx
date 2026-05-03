'use client';

import { useMemo, useState } from 'react';
import {
  alpha,
  Box,
  Chip,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import {
  pxToRem,
  TripResolutionKpis,
  useGetTripResolutionDetail,
  useGetTripResolutionKpis,
  useGetTripResolutionTickets,
  useResolvedApiQuery,
} from '../../../common';
import {
  IssueStatCard,
  DisputeViewModal,
  ApproveDisputeModal,
  RejectDisputeModal,
} from './ui/components';

// ─── Types ──────────────────────────────────────────────────────────────────

type DisputeStatus = 'Under Review' | 'Approved' | 'Rejected';
type IssueType = 'Fare Dispute' | 'Refund Request' | 'Trip Fraud';

type DisputeRow = {
  id: string;
  disputeId: string;
  issueType: IssueType;
  status: DisputeStatus;
  userName: string;
  driver: string;
  tripId: string;
  billed: string;
  claimed: string;
  date: string;
  description: string;
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const statusColors: Record<DisputeStatus, string> = {
  'Under Review': '#D97706',
  Approved: '#059669',
  Rejected: '#EF4444',
};

const statusIcons: Record<DisputeStatus, React.ReactNode> = {
  'Under Review': (
    <ErrorOutlineOutlinedIcon sx={{ fontSize: 13, color: '#D97706' }} />
  ),
  Approved: <CheckCircleOutlineIcon sx={{ fontSize: 13, color: '#059669' }} />,
  Rejected: <CancelOutlinedIcon sx={{ fontSize: 13, color: '#EF4444' }} />,
};

const issueTypeColors: Record<IssueType, { bg: string; color: string }> = {
  'Fare Dispute': { bg: '#FFFBEB', color: '#D97706' },
  'Refund Request': { bg: '#EBF2FF', color: '#2F6FED' },
  'Trip Fraud': { bg: '#FEF2F2', color: '#EF4444' },
};

// ─── Stat Cards ─────────────────────────────────────────────────────────────

const statCards = [
  { value: '2', label: 'Open Disputes', valueColor: '#2F6FED' },
  { value: '1', label: 'Refunds Approved', valueColor: '#059669' },
  { value: '1', label: 'Rejected', valueColor: '#EF4444' },
];

// ─── Data ───────────────────────────────────────────────────────────────────

const disputeData: DisputeRow[] = [
  {
    id: '1',
    disputeId: 'DIS-3301',
    issueType: 'Fare Dispute',
    status: 'Under Review',
    userName: 'Joseph Nguyen',
    driver: 'David Chen',
    tripId: 'BK-20480',
    billed: '$38.75',
    claimed: '$30.00',
    date: 'Mar 8, 2026',
    description:
      'Rider claims the base fare was higher than quoted. GPS confirms correct route was taken, but rider disputes the surge pricing applied during peak hours.',
  },
  {
    id: '2',
    disputeId: 'DIS-3300',
    issueType: 'Refund Request',
    status: 'Approved',
    userName: "Margaret O'Brien",
    driver: 'Sophie Tremblay',
    tripId: 'BK-20478',
    billed: '$29.00',
    claimed: '$29.00',
    date: 'Mar 7, 2026',
    description:
      'Rider was charged for a trip that was cancelled by the driver. Requesting full refund of the billed amount.',
  },
  {
    id: '3',
    disputeId: 'DIS-3299',
    issueType: 'Trip Fraud',
    status: 'Under Review',
    userName: 'Isabelle Côté',
    driver: 'Marc Lefebvre',
    tripId: 'BK-20476',
    billed: '$47.50',
    claimed: '$47.50',
    date: 'Mar 6, 2026',
    description:
      'Rider reports trip was marked complete without being picked up. Driver may have completed a phantom ride.',
  },
  {
    id: '4',
    disputeId: 'DIS-3298',
    issueType: 'Refund Request',
    status: 'Rejected',
    userName: 'Pierre Tremblay',
    driver: 'Anna Kim',
    tripId: 'BK-20474',
    billed: '$61.25',
    claimed: '$20.00',
    date: 'Mar 5, 2026',
    description:
      'Rider claims detour added extra cost. GPS data shows driver followed optimal route. No refund warranted.',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const TripIssueResolutionPage = () => {
  const [selectedDispute, setSelectedDispute] = useState<DisputeRow | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'all' | 'under_review' | 'approved' | 'rejected'
  >('all');
  const [typeFilter, setTypeFilter] = useState<
    'all' | 'all' | 'fare_dispute' | 'refund_request' | 'trip_fraud'
  >('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [viewOpen, setViewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const listTripResolutionTicketsPayload = useMemo(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      dispute_type: typeFilter === 'all' ? undefined : typeFilter,
      search: searchTerm || undefined,
      page: page,
      page_size: 10,
    }),
    [statusFilter, typeFilter, searchTerm, page]
  );
  const detailpayload = useMemo(
    () => ({
      dispute_id: !!selectedDispute?.id ? selectedDispute.id : '',
    }),
    [selectedDispute]
  );

  const { data: dashboardTripKPIs, isLoading: kpiDataLoading } =
    useResolvedApiQuery(useGetTripResolutionKpis, null);

  const { data: tripResolutionList } = useResolvedApiQuery(
    useGetTripResolutionTickets,
    null,
    listTripResolutionTicketsPayload
  );
  const { data: tripResolutionDetail } = useResolvedApiQuery(
    useGetTripResolutionDetail,
    null,
    detailpayload
  );
  const kpiDashboardData = useMemo<TripResolutionKpis>(() => {
    if (!dashboardTripKPIs)
      return {
        open_disputes: 0,
        refunds_approved: 0,
        rejected: 0,
      };

    return (
      dashboardTripKPIs || {
        open_disputes: 0,
        refunds_approved: 0,
        rejected: 0,
      }
    );
  }, [dashboardTripKPIs]);

  console.log('Dashboard KPIs:', dashboardTripKPIs);
  console.log('Trip Resolution List:', tripResolutionList);

  const statCards = [
    {
      value: kpiDashboardData.open_disputes.toString(),
      label: 'Open Disputes',
      valueColor: '#2F6FED',
    },
    {
      value: kpiDashboardData.refunds_approved.toString(),
      label: 'Refunds Approved',
      valueColor: '#059669',
    },
    {
      value: kpiDashboardData.rejected.toString(),
      label: 'Rejected',
      valueColor: '#EF4444',
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Trip Issue Resolution"
          desc="Fare disputes, refund requests, and ride conflicts"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {kpiDataLoading ? (
            <Grid container size={{ xs: 6, lg: 4 }}>
              <Grid>
                <Skeleton sx={{ width: '100%', height: '50px' }} />
              </Grid>
            </Grid>
          ) : (
            statCards.map((card, index) => (
              <Grid key={index} size={{ xs: 6, lg: 4 }}>
                <IssueStatCard
                  value={card.value}
                  label={card.label}
                  valueColor={card.valueColor}
                />
              </Grid>
            ))
          )}
        </Grid>

        {/* Dispute List */}
        <Stack spacing={'10px'}>
          {disputeData.map((dispute) => {
            const sColor = statusColors[dispute.status];
            const tColor = issueTypeColors[dispute.issueType];

            return (
              <RowStack
                key={dispute.id}
                justifyContent={'space-between'}
                sx={{
                  padding: '12px',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                }}
              >
                {/* Left: Icon + Info */}
                <RowStack spacing={'12px'}>
                  {/* Dollar Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#ECFDF5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <AttachMoneyOutlinedIcon
                      sx={{ fontSize: 20, color: '#059669' }}
                    />
                  </Box>

                  {/* Info */}
                  <Stack spacing={'4px'}>
                    {/* Row 1: Dispute ID + Issue Type Chip + Status Chip */}
                    <RowStack spacing={'8px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        {dispute.disputeId}
                      </Typography>

                      {/* Issue Type Chip */}
                      <Chip
                        label={dispute.issueType}
                        size="small"
                        sx={{
                          background: tColor.bg,
                          color: tColor.color,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          height: '22px',
                          borderRadius: '100px',
                        }}
                      />

                      {/* Status Chip */}
                      <Chip
                        icon={statusIcons[dispute.status] as React.ReactElement}
                        label={dispute.status}
                        size="small"
                        sx={{
                          background: alpha(sColor, 0.1),
                          color: sColor,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          height: '22px',
                          borderRadius: '100px',
                          '& .MuiChip-icon': {
                            color: sColor,
                            marginLeft: '6px',
                            marginRight: '-2px',
                          },
                        }}
                      />
                    </RowStack>

                    {/* Row 2: User details */}
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(13),
                        color: '#6B7280',
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(13),
                          color: '#374151',
                        }}
                      >
                        {dispute.userName}
                      </Typography>
                      {` · Trip: ${dispute.tripId} · Billed: `}
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(13),
                          color: '#374151',
                        }}
                      >
                        {dispute.billed}
                      </Typography>
                      {' · Claimed: '}
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(13),
                          color: '#374151',
                        }}
                      >
                        {dispute.claimed}
                      </Typography>
                    </Typography>

                    {/* Row 3: Date */}
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12),
                        color: '#9CA3AF',
                      }}
                    >
                      {dispute.date}
                    </Typography>
                  </Stack>
                </RowStack>

                {/* Right: Action Buttons */}
                <RowStack spacing={'4px'}>
                  {/* View */}
                  <IconButton
                    onClick={() => {
                      setSelectedDispute(dispute);
                      setViewOpen(true);
                    }}
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '8px',
                      background: '#F2F6FF',
                      '&:hover': { background: '#DCE8FD' },
                    }}
                  >
                    <VisibilityOutlinedIcon
                      sx={{ fontSize: 16, color: '#2F6FED' }}
                    />
                  </IconButton>

                  {/* Approve - only for Under Review */}
                  {dispute.status === 'Under Review' && (
                    <IconButton
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setApproveOpen(true);
                      }}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '8px',
                        background: '#ECFDF5',
                        '&:hover': { background: '#D1FAE5' },
                      }}
                    >
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: 16, color: '#059669' }}
                      />
                    </IconButton>
                  )}

                  {/* Reject - only for Under Review */}
                  {dispute.status === 'Under Review' && (
                    <IconButton
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setRejectOpen(true);
                      }}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '8px',
                        background: '#FEF2F2',
                        '&:hover': { background: '#FEE2E2' },
                      }}
                    >
                      <CancelOutlinedIcon
                        sx={{ fontSize: 16, color: '#EF4444' }}
                      />
                    </IconButton>
                  )}
                </RowStack>
              </RowStack>
            );
          })}
        </Stack>
      </Stack>

      {/* View Modal */}
      <DisputeViewModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedDispute(null);
        }}
        data={selectedDispute}
      />

      {/* Approve Modal */}
      <ApproveDisputeModal
        open={approveOpen}
        onClose={() => {
          setApproveOpen(false);
          setSelectedDispute(null);
        }}
        data={selectedDispute}
      />

      {/* Reject Modal */}
      <RejectDisputeModal
        open={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
          setSelectedDispute(null);
        }}
        data={selectedDispute}
      />
    </AppDashboardLayout>
  );
};
