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
  DisputeViewModalProps,
} from './ui/components';
import { CustomPagination } from '@/ui/modules/components/GridTable/ui/components/DataGridPagination/ui/components';
import { EmptyState } from '@/ui/modules/blocks';

type DisputeStatus = 'Under Review' | 'Approved' | 'Rejected';
type IssueType = 'Fare Dispute' | 'Refund Request' | 'Trip Fraud';

type DisputeRow = {
  id: string;
  disputeId: string;
  issueType: IssueType;
  status: DisputeStatus;
  userName: string;
  tripId: string;
  billed: string;
  claimed: string;
  date: string;
};

// ─────────────────────────────────────────────────────────────
// Mappers
// ─────────────────────────────────────────────────────────────

const mapTicketToDisputeRow = (ticket: any): DisputeRow => {
  const statusMap: Record<string, DisputeStatus> = {
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  const typeMap: Record<string, IssueType> = {
    fare_dispute: 'Fare Dispute',
    refund_request: 'Refund Request',
    trip_fraud: 'Trip Fraud',
  };

  return {
    id: ticket.id,
    disputeId: `${ticket.dispute_number}`,
    issueType: typeMap[ticket.dispute_type] || 'Fare Dispute',
    status: statusMap[ticket.status] || 'Under Review',
    userName: ticket.rider_name,
    tripId: ticket.trip_code,
    billed: `$${ticket.billed_amount}`,
    claimed: `$${ticket.claimed_amount}`,
    date: new Date(ticket.created_at).toLocaleDateString(),
  };
};
const mapDetailToViewData = (detail: any): DisputeViewModalProps['data'] => {
  if (!detail) return null;

  const statusMap: Record<string, DisputeStatus> = {
    under_review: 'Under Review',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  const typeMap: Record<string, IssueType> = {
    fare_dispute: 'Fare Dispute',
    refund_request: 'Refund Request',
    trip_fraud: 'Trip Fraud',
  };

  return {
    disputeId: `${detail.dispute_number}`,
    issueType: typeMap[detail.dispute_type] || 'Fare Dispute',
    status: statusMap[detail.status] || 'Under Review',
    userName: detail.rider_name,
    driver: detail.driver_name || '—', // fallback if missing
    tripId: detail.trip_code,
    billed: `$${detail.billed_amount}`,
    claimed: `$${detail.claimed_amount}`,
    date: new Date(detail.created_at).toLocaleDateString(),
    description: detail.description || 'No description provided',
  };
};

// ─────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export const TripIssueResolutionPage = () => {
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'under_review' | 'approved' | 'rejected'
  >('all');

  const [typeFilter, setTypeFilter] = useState<
    'all' | 'fare_dispute' | 'refund_request' | 'trip_fraud'
  >('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [viewOpen, setViewOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  // ─── Payloads

  const listPayload = useMemo(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      dispute_type: typeFilter === 'all' ? undefined : typeFilter,
      search: searchTerm || undefined,
      page: page + 1,
      page_size: pageSize,
    }),
    [statusFilter, typeFilter, searchTerm, page, pageSize]
  );

  const detailPayload = useMemo(
    () => ({
      dispute_id: selectedDispute?.id || '',
    }),
    [selectedDispute]
  );

  // ─── API Calls

  const { data: kpis, isLoading: kpiLoading } = useResolvedApiQuery(
    useGetTripResolutionKpis,
    null
  );

  const { data: listData, isLoading: listLoading } = useResolvedApiQuery(
    useGetTripResolutionTickets,
    null,
    listPayload
  );

  const { data: detailData } = useResolvedApiQuery(
    useGetTripResolutionDetail,
    null,
    detailPayload
  );

  // ─── Derived

  const disputes = useMemo(() => {
    return listData?.items?.map(mapTicketToDisputeRow) || [];
  }, [listData]);

  const kpiData: TripResolutionKpis = useMemo(() => {
    return (
      kpis || {
        open_disputes: 0,
        refunds_approved: 0,
        rejected: 0,
      }
    );
  }, [kpis]);

  const statCards = [
    {
      value: kpiData.open_disputes.toString(),
      label: 'Open Disputes',
      valueColor: '#2F6FED',
    },
    {
      value: kpiData.refunds_approved.toString(),
      label: 'Refunds Approved',
      valueColor: '#059669',
    },
    {
      value: kpiData.rejected.toString(),
      label: 'Rejected',
      valueColor: '#EF4444',
    },
  ];

  const viewData = useMemo(() => {
    return mapDetailToViewData(detailData);
  }, [detailData]);

  return (
    <AppDashboardLayout>
      <Stack spacing="24px">
        <DashboardTitleAndDesc
          title="Trip Issue Resolution"
          desc="Fare disputes, refund requests, and ride conflicts"
        />

        {/* KPI */}
        <Grid container spacing="12px">
          {kpiLoading
            ? [1, 2, 3].map((i) => (
                <Grid key={i} size={{ xs: 6, lg: 4 }}>
                  <Skeleton sx={{ height: 50 }} />
                </Grid>
              ))
            : statCards.map((card, i) => (
                <Grid key={i} size={{ xs: 6, lg: 4 }}>
                  <IssueStatCard {...card} />
                </Grid>
              ))}
        </Grid>

        {/* LIST */}
        <Stack spacing="10px">
          {listLoading ? (
            <Typography>Loading...</Typography>
          ) : !disputes.length ? (
            <EmptyState
              animationSrc="/empty.json"
              emptyState={
                <Typography color="#9CA3AF">No disputes found</Typography>
              }
            />
          ) : (
            // <Box textAlign="center" py={5}>
            //   <Typography color="#9CA3AF">No disputes found</Typography>
            // </Box>
            disputes.map((dispute) => {
              const sColor = statusColors[dispute.status];
              const tColor = issueTypeColors[dispute.issueType];

              return (
                <RowStack
                  key={dispute.id}
                  justifyContent="space-between"
                  sx={{
                    padding: '12px',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    border: '0.67px solid #F0F4F8',
                  }}
                >
                  {/* LEFT */}
                  <RowStack spacing="12px">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#ECFDF5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AttachMoneyOutlinedIcon
                        sx={{ fontSize: 20, color: '#059669' }}
                      />
                    </Box>

                    <Stack spacing="4px">
                      <RowStack spacing="8px">
                        <Typography fontWeight={700} fontSize={pxToRem(13.5)}>
                          {dispute.disputeId}
                        </Typography>

                        <Chip
                          label={dispute.issueType}
                          size="small"
                          sx={{
                            background: tColor.bg,
                            color: tColor.color,
                          }}
                        />

                        <Chip
                          icon={statusIcons[dispute.status] as any}
                          label={dispute.status}
                          size="small"
                          sx={{
                            background: alpha(sColor, 0.1),
                            color: sColor,
                          }}
                        />
                      </RowStack>

                      <Typography fontSize={pxToRem(13)} color="#6B7280">
                        <b>{dispute.userName}</b> · Trip: {dispute.tripId} ·
                        Billed: <b>{dispute.billed}</b> · Claimed:{' '}
                        <b>{dispute.claimed}</b>
                      </Typography>

                      <Typography fontSize={pxToRem(12)} color="#9CA3AF">
                        {dispute.date}
                      </Typography>
                    </Stack>
                  </RowStack>

                  {/* ACTIONS */}
                  <RowStack spacing="4px">
                    <IconButton
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setViewOpen(true);
                      }}
                    >
                      <VisibilityOutlinedIcon />
                    </IconButton>

                    {dispute.status === 'Under Review' && (
                      <>
                        <IconButton
                          onClick={() => {
                            setSelectedDispute(dispute);
                            setApproveOpen(true);
                          }}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>

                        <IconButton
                          onClick={() => {
                            setSelectedDispute(dispute);
                            setRejectOpen(true);
                          }}
                        >
                          <CancelOutlinedIcon />
                        </IconButton>
                      </>
                    )}
                  </RowStack>
                </RowStack>
              );
            })
          )}
        </Stack>

        {/* PAGINATION */}
        <CustomPagination
          count={listData?.total || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(0);
          }}
        />
      </Stack>

      {/* MODALS */}
      <DisputeViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={viewData}
      />

      <ApproveDisputeModal
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        data={selectedDispute}
      />

      <RejectDisputeModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        data={selectedDispute}
      />
    </AppDashboardLayout>
  );
};
