'use client';

import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  DeletionActionModal,
  DeletionActionType,
  DeletionRequestCard,
  DeletionRequestRow,
  DeletionStatCard,
} from './ui/components';
import {
  pxToRem,
  useAccountDeletionRequestsApi,
  useGetAccountDeletionKpis,
  useGetAccountDeletionRequests,
  useResolvedApiQuery,
} from '../../../common';
import { AccountDeletionStatus } from '../../../common/types';
import { EmptyState } from '../../modules/blocks';

// ─── Filter Tabs ────────────────────────────────────────────────────────────

const filterTabs: { label: string; status: AccountDeletionStatus | 'All' }[] = [
  { label: 'Pending Review', status: 'pending_review' },
  { label: 'All', status: 'All' },
  { label: 'Unverified', status: 'pending_verification' },
  { label: 'Approved', status: 'approved' },
  { label: 'Rejected', status: 'rejected' },
];

const formatDate = (value: string | null) =>
  value ? dayjs(value).format('MMM D, YYYY') : '';

const formatRole = (value: string | null) =>
  value ? value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';

// ─── Component ──────────────────────────────────────────────────────────────

export const AccountDeletionRequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // Pending review is the queue that actually needs an admin, so it opens there.
  const [activeTab, setActiveTab] = useState<AccountDeletionStatus | 'All'>(
    'pending_review'
  );

  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<DeletionActionType>('approve');
  const [actionRequest, setActionRequest] = useState<DeletionRequestRow | null>(
    null
  );

  const kpisQuery = useGetAccountDeletionKpis();
  const { data: kpis } = useResolvedApiQuery(useGetAccountDeletionKpis, null);
  const isFetchingKpis = kpisQuery.isFetching;

  const requestsQuery = useGetAccountDeletionRequests({
    search: searchQuery || undefined,
    status: activeTab !== 'All' ? activeTab : undefined,
  });
  const { data: requestsList } = requestsQuery;
  const isFetchingRequests = requestsQuery.isFetching;

  const { approveRequest, rejectRequest, isApproving, isRejecting } =
    useAccountDeletionRequestsApi();

  const requests = useMemo<DeletionRequestRow[]>(() => {
    if (!requestsList?.success || !requestsList?.data?.length) return [];

    return requestsList.data.map((item) => ({
      id: item.id,
      reference: `DEL-${item.id.slice(-6).toUpperCase()}`,
      status: item.status,
      submittedName: item.full_name,
      submittedEmail: item.email,
      submittedPhone: item.phone ?? '',
      reason: item.reason ?? '',
      submittedDate: formatDate(item.created_at),
      verifiedDate: formatDate(item.email_verified_at),
      accountName: item.account_name ?? '',
      accountEmail: item.account_email ?? '',
      accountPhone: item.account_phone ?? '',
      accountRole: formatRole(item.account_role),
      accountCreated: formatDate(item.account_created_at),
      accountDeleted: formatDate(item.account_deleted_at),
      reviewerName: item.reviewer_name ?? '',
      reviewedDate: formatDate(item.reviewed_at),
      rejectionReason: item.rejection_reason ?? '',
    }));
  }, [requestsList]);

  const statCards = [
    {
      icon: <DeleteForeverOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      value: String(kpis?.total_requests ?? '--'),
      label: 'Total Requests',
      subtitle: 'All deletion requests',
      iconBg: '#EBF2FF',
    },
    {
      icon: (
        <MarkEmailReadOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
      ),
      value: String(kpis?.pending_review ?? '--'),
      label: 'Pending Review',
      subtitle: 'Verified, awaiting decision',
      iconBg: '#FFFBEB',
    },
    {
      icon: <TaskAltOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
      value: String(kpis?.approved ?? '--'),
      label: 'Approved',
      subtitle: 'Accounts deleted',
      iconBg: '#ECFDF5',
    },
    {
      icon: (
        <HourglassEmptyOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
      ),
      value: String(kpis?.awaiting_verification ?? '--'),
      label: 'Unverified',
      subtitle: 'Code not yet confirmed',
      iconBg: '#F7F9FB',
    },
  ];

  const openActionModal = useCallback(
    (type: DeletionActionType, request: DeletionRequestRow) => {
      setActionType(type);
      setActionRequest(request);
      setActionModalOpen(true);
    },
    []
  );

  const handleActionConfirm = useCallback(
    async (message?: string) => {
      if (!actionRequest) return;

      if (actionType === 'approve') {
        await approveRequest({
          requestId: actionRequest.id,
          notes: message?.trim() || null,
        });
        return;
      }

      const reason = message?.trim();
      if (!reason) return;

      await rejectRequest({ requestId: actionRequest.id, reason });
    },
    [actionRequest, actionType, approveRequest, rejectRequest]
  );

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        <DashboardTitleAndDesc
          title="Account Deletion Requests"
          desc="Review deletion requests submitted from getmedigo.com/medigo-delete-account. Every request here has confirmed an emailed code; approving one permanently deletes the account."
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {isFetchingKpis
            ? Array.from({ length: 4 }).map((_, index) => (
                <Grid key={index} size={{ xs: 6, lg: 3 }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={100}
                    sx={{ borderRadius: '14px' }}
                  />
                </Grid>
              ))
            : statCards.map((card, index) => (
                <Grid key={index} size={{ xs: 6, lg: 3 }}>
                  <DeletionStatCard {...card} />
                </Grid>
              ))}
        </Grid>

        {/* Tab Filters + Search */}
        <RowStack justifyContent="space-between">
          <RowStack spacing={'0px'}>
            {filterTabs.map((tab) => (
              <Typography
                key={tab.label}
                onClick={() => setActiveTab(tab.status)}
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(12.5),
                  color: activeTab === tab.status ? '#FFFFFF' : '#6B7280',
                  background:
                    activeTab === tab.status ? '#2F6FED' : 'transparent',
                  border: `0.67px solid ${activeTab === tab.status ? '#2F6FED' : '#E8ECF0'}`,
                  borderRadius: '20px',
                  padding: '7px 16px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    background:
                      activeTab === tab.status ? '#2F6FED' : '#F7F9FB',
                  },
                }}
              >
                {tab.label}
              </Typography>
            ))}
          </RowStack>
          <AppSearchField
            name="search"
            placeholder="Search name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            boxProps={{
              sx: { width: '280px' },
            }}
          />
        </RowStack>

        {/* Request Cards */}
        <Stack spacing={'12px'}>
          {isFetchingRequests ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={180}
                sx={{ borderRadius: '12px' }}
              />
            ))
          ) : requests.length > 0 ? (
            requests.map((request) => (
              <DeletionRequestCard
                key={request.id}
                request={request}
                onApprove={() => openActionModal('approve', request)}
                onReject={() => openActionModal('reject', request)}
              />
            ))
          ) : (
            <EmptyState animationSrc="/empty.json" />
          )}
        </Stack>
      </Stack>

      <DeletionActionModal
        open={actionModalOpen}
        setOpen={setActionModalOpen}
        actionType={actionType}
        request={actionRequest}
        isSubmitting={isApproving || isRejecting}
        onConfirm={handleActionConfirm}
      />
    </AppDashboardLayout>
  );
};
