'use client';

import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { Grid, Stack, Typography } from '@mui/material';
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

  const { data: kpis } = useResolvedApiQuery(useGetFleetApplicationsKpi, null);

  const { data: applicationsList } = useGetFleetApplications({
    search: searchQuery || undefined,
    status: activeTab !== 'All' ? uiStatusToApiStatus[activeTab] : undefined,
  });

  const { approveApplication, rejectApplication, requestInfoApplication } =
    useFleetApplicationsApi();

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
      documents: item.documents.map((doc) =>
        doc.document_type
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
      ),
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

  const handleActionConfirm = useCallback(async () => {
    if (!actionApplication) return;

    if (actionType === 'approve') {
      await approveApplication({ appId: actionApplication.id });
    } else if (actionType === 'reject') {
      await rejectApplication({
        appId: actionApplication.id,
        reason: 'Application rejected by admin',
      });
    } else if (actionType === 'request-docs') {
      await requestInfoApplication({
        appId: actionApplication.id,
        message: 'Please provide additional documentation',
      });
    }
  }, [
    actionApplication,
    actionType,
    approveApplication,
    rejectApplication,
    requestInfoApplication,
  ]);

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
          {statCards.map((card, index) => (
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
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onClick={() => handleCardClick(application)}
              onApprove={() => openActionModal('approve', application)}
              onReject={() => openActionModal('reject', application)}
              onRequestDocs={() => openActionModal('request-docs', application)}
            />
          ))}

          {applications.length === 0 && (
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
