'use client';

import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { DispatchStatCard } from '../DispatchPage/ui/components/DispatchStatCard';
import {
  ApplicationCard,
  FleetApplicationRow,
  ApplicationStatus,
  FleetApplicationDetailModal,
  FleetActionModal,
  FleetActionType,
} from './ui/components';
import {
  pxToRem,
  useGetFleetApplicationsKpi,
  useGetFleetApplications,
  useFleetApplicationsApi,
  useResolvedApiQuery,
} from '../../../common';
import { EmptyState } from '../../modules/blocks';
import totalApplicationsIcon from './ui/assets/icons/total-applications-icon.svg';
import pendingReviewIcon from './ui/assets/icons/pending-review-icon.svg';
import approvedIcon from './ui/assets/icons/approved-icon.svg';
import rejectedIcon from './ui/assets/icons/rejected-icon.svg';

// ─── Filter Tabs ────────────────────────────────────────────────────────────

const filterTabs: { label: string; status: ApplicationStatus | 'All' }[] = [
  { label: 'All', status: 'All' },
  { label: 'Pending', status: 'Pending' },
  { label: 'Approved', status: 'Approved' },
  { label: 'More Info Required', status: 'More Info Required' },
  { label: 'Rejected', status: 'Rejected' },
];

// ─── Status Mapping ─────────────────────────────────────────────────────────

const apiStatusToUiStatus: Record<string, ApplicationStatus> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  info_requested: 'More Info Required',
};

const uiStatusToApiStatus: Record<string, string> = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
  'More Info Required': 'info_requested',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetApplicationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'All'>('All');
  const [selectedApplication, setSelectedApplication] =
    useState<FleetApplicationRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Action modal state
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<FleetActionType>('approve');
  const [actionApplication, setActionApplication] =
    useState<FleetApplicationRow | null>(null);

  const kpisQuery = useGetFleetApplicationsKpi();
  const { data: kpis } = useResolvedApiQuery(useGetFleetApplicationsKpi, null);
  const isFetchingKpis = kpisQuery.isFetching;

  const applicationsQuery = useGetFleetApplications({
    search: searchQuery || undefined,
    status: activeTab !== 'All' ? uiStatusToApiStatus[activeTab] : undefined,
  });
  const { data: applicationsList } = applicationsQuery;
  const isFetchingApplications = applicationsQuery.isFetching;

  const {
    approveApplication,
    rejectApplication,
    requestInfoApplication,
    deleteApplication,
  } = useFleetApplicationsApi();

  const applications = useMemo<FleetApplicationRow[]>(() => {
    if (!applicationsList?.success || !applicationsList?.data?.length)
      return [];
    return applicationsList.data.map((item) => ({
      id: item.id,
      appId: `APP-${item.id.slice(-4).toUpperCase()}`,
      companyName: item.company_name,
      fleetSize: item.fleet_size,
      contactPerson: item.contact_person,
      contactEmail: item.email,
      contactPhone: item.phone ?? '',
      city: [item.city, item.province].filter(Boolean).join(', '),
      submittedDate: dayjs(item.created_at).format('MMM D, YYYY'),
      status: apiStatusToUiStatus[item.status] ?? 'Pending',
      message: item.description ?? '',
      documents: item.documents,
    }));
  }, [applicationsList]);

  const statCards = [
    {
      icon: totalApplicationsIcon,
      value: String(kpis?.total_applications ?? '--'),
      label: 'Total Applications',
      subtitle: 'All fleet applications',
      iconBg: '#EBF2FF',
    },
    {
      icon: pendingReviewIcon,
      value: String(kpis?.pending_review ?? '--'),
      label: 'Pending Review',
      subtitle: 'Awaiting decision',
      iconBg: '#FFFBEB',
    },
    {
      icon: approvedIcon,
      value: String(kpis?.approved ?? '--'),
      label: 'Approved',
      subtitle: 'Accepted partners',
      iconBg: '#ECFDF5',
    },
    {
      icon: rejectedIcon,
      value: String(kpis?.rejected ?? '--'),
      label: 'Rejected',
      subtitle: 'Declined applications',
      iconBg: '#FEF2F2',
    },
  ];

  const handleCardClick = useCallback((application: FleetApplicationRow) => {
    setSelectedApplication(application);
    setModalOpen(true);
  }, []);

  const openActionModal = useCallback(
    (type: FleetActionType, application: FleetApplicationRow) => {
      setActionType(type);
      setActionApplication(application);
      setActionModalOpen(true);
    },
    []
  );

  const handleActionConfirm = useCallback(
    async (message?: string) => {
      if (!actionApplication) return;

      if (actionType === 'approve') {
        await approveApplication({ appId: actionApplication.id });
      } else if (actionType === 'reject') {
        await rejectApplication({
          appId: actionApplication.id,
          reason: 'Application rejected by admin',
        });
      } else if (actionType === 'request-docs') {
        const trimmedMessage = message?.trim();
        if (!trimmedMessage) return;

        await requestInfoApplication({
          appId: actionApplication.id,
          message: trimmedMessage,
        });
      } else if (actionType === 'delete') {
        await deleteApplication({ appId: actionApplication.id });
      }
    },
    [
      actionApplication,
      actionType,
      approveApplication,
      rejectApplication,
      requestInfoApplication,
      deleteApplication,
    ]
  );

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Fleet Applications"
          desc="Review and manage fleet partner applications"
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
                  <DispatchStatCard {...card} />
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
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            boxProps={{
              sx: { width: '280px' },
            }}
          />
        </RowStack>

        {/* Application Cards */}
        <Stack spacing={'12px'}>
          {isFetchingApplications ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={120}
                sx={{ borderRadius: '12px' }}
              />
            ))
          ) : applications.length > 0 ? (
            applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onClick={() => handleCardClick(application)}
                onApprove={() => openActionModal('approve', application)}
                onReject={() => openActionModal('reject', application)}
                onRequestDocs={() =>
                  openActionModal('request-docs', application)
                }
                onDelete={() => openActionModal('delete', application)}
              />
            ))
          ) : (
            <EmptyState animationSrc="/empty.json" />
          )}
        </Stack>
      </Stack>

      {/* Detail Modal */}
      <FleetApplicationDetailModal
        open={modalOpen}
        setOpen={setModalOpen}
        application={selectedApplication}
        onApprove={() => {
          if (selectedApplication) {
            setModalOpen(false);
            openActionModal('approve', selectedApplication);
          }
        }}
        onReject={() => {
          if (selectedApplication) {
            setModalOpen(false);
            openActionModal('reject', selectedApplication);
          }
        }}
        onRequestDocs={() => {
          if (selectedApplication) {
            setModalOpen(false);
            openActionModal('request-docs', selectedApplication);
          }
        }}
        onDelete={() => {
          if (selectedApplication) {
            setModalOpen(false);
            openActionModal('delete', selectedApplication);
          }
        }}
      />

      {/* Action Confirmation Modal */}
      <FleetActionModal
        open={actionModalOpen}
        setOpen={setActionModalOpen}
        actionType={actionType}
        application={actionApplication}
        onConfirm={handleActionConfirm}
      />
    </AppDashboardLayout>
  );
};
