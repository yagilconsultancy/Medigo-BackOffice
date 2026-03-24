'use client';

import { useState, useMemo, useCallback } from 'react';
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
import { pxToRem } from '../../../common';

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

// ─── Sample Data ────────────────────────────────────────────────────────────

const applicationsData: FleetApplicationRow[] = [
  {
    id: '1',
    appId: 'APP-2401',
    companyName: 'SwiftCare Mobility',
    fleetSize: 12,
    contactPerson: 'Olivier Renaud',
    contactEmail: 'orenaud@swiftcare.ca',
    contactPhone: '+1 (416) 555-1223',
    city: 'Toronto, ON',
    submittedDate: 'Mar 6, 2026',
    status: 'Pending',
    message:
      'We operate a fleet of 12 wheelchair-accessible vehicles in Greater Toronto and are looking to partner with Medigo to expand our reach into medical transportation across the GTA.',
    documents: ['Business License', 'Insurance Certificate', 'Vehicle List'],
  },
  {
    id: '2',
    appId: 'APP-2402',
    companyName: 'HealRide Transport',
    fleetSize: 8,
    contactPerson: 'Fatima Al-Rashid',
    contactEmail: 'fatima@healride.ca',
    contactPhone: '+1 (604) 555-7712',
    city: 'Vancouver, BC',
    submittedDate: 'Mar 5, 2026',
    status: 'Pending',
    message:
      'HealRide specializes in non-emergency medical transportation for dialysis and oncology patients across Metro Vancouver and the Lower Mainland.',
    documents: ['Business License', 'Vehicle Registration'],
  },
  {
    id: '3',
    appId: 'APP-2403',
    companyName: 'PrimePath Medical',
    fleetSize: 20,
    contactPerson: 'Samuel Grégoire',
    contactEmail: 'samuel@primepath.ca',
    contactPhone: '+1 (514) 555-4890',
    city: 'Montréal, QC',
    submittedDate: 'Mar 3, 2026',
    status: 'Approved',
    message:
      'We are an established NEMT provider with 20 vehicles including stretcher transport units, serving hospitals across the Island of Montréal.',
    documents: [
      'Business License',
      'Insurance Certificate',
      'Vehicle List',
      'Driver Certifications',
    ],
  },
  {
    id: '4',
    appId: 'APP-2404',
    companyName: 'CarePath Logistics',
    fleetSize: 6,
    contactPerson: 'Diana Chambers',
    contactEmail: 'diana@carepath.ca',
    contactPhone: '+1 (403) 555-9981',
    city: 'Calgary, AB',
    submittedDate: 'Feb 28, 2026',
    status: 'More Info Required',
    message:
      'Small fleet focused on assisted rides for elderly patients across Calgary and the surrounding communities in southern Alberta.',
    documents: ['Business License'],
  },
  {
    id: '5',
    appId: 'APP-2405',
    companyName: 'TrustRide Inc.',
    fleetSize: 15,
    contactPerson: 'Kevin Cho',
    contactEmail: 'kevin@trustride.ca',
    contactPhone: '+1 (613) 555-3345',
    city: 'Ottawa, ON',
    submittedDate: 'Feb 25, 2026',
    status: 'Rejected',
    message:
      'We serve the Ottawa-Gatineau region with 15 vehicles including accessible transport for patients attending the Ottawa Hospital and Civic campuses.',
    documents: ['Business License', 'Insurance Certificate'],
  },
  {
    id: '6',
    appId: 'APP-2406',
    companyName: 'MedLink Transport',
    fleetSize: 10,
    contactPerson: 'Camille Dupont',
    contactEmail: 'camille@medlink.ca',
    contactPhone: '+1 (204) 555-2241',
    city: 'Winnipeg, MB',
    submittedDate: 'Mar 7, 2026',
    status: 'Pending',
    message:
      'MedLink serves the Winnipeg medical community with reliable transport for hospital appointments at Health Sciences Centre and St. Boniface Hospital.',
    documents: ['Business License', 'Vehicle List', 'Insurance Certificate'],
  },
];

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

  const filteredApplications = useMemo(() => {
    let filtered = applicationsData;

    if (activeTab !== 'All') {
      filtered = filtered.filter((a) => a.status === activeTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.companyName.toLowerCase().includes(query) ||
          a.appId.toLowerCase().includes(query) ||
          a.contactPerson.toLowerCase().includes(query) ||
          a.city.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeTab]);

  const statusCounts = useMemo(() => {
    return {
      total: applicationsData.length,
      pending: applicationsData.filter((a) => a.status === 'Pending').length,
      approved: applicationsData.filter((a) => a.status === 'Approved').length,
      rejected: applicationsData.filter((a) => a.status === 'Rejected').length,
    };
  }, []);

  const statCards = [
    {
      icon: totalApplicationsIcon,
      value: String(statusCounts.total),
      label: 'Total Applications',
      subtitle: 'All fleet applications',
      iconBg: '#EBF2FF',
    },
    {
      icon: pendingReviewIcon,
      value: String(statusCounts.pending),
      label: 'Pending Review',
      subtitle: 'Awaiting decision',
      iconBg: '#FFFBEB',
    },
    {
      icon: approvedIcon,
      value: String(statusCounts.approved),
      label: 'Approved',
      subtitle: 'Accepted partners',
      iconBg: '#ECFDF5',
    },
    {
      icon: rejectedIcon,
      value: String(statusCounts.rejected),
      label: 'Rejected',
      subtitle: 'Declined applications',
      iconBg: '#FEF2F2',
    },
  ];

  const handleCardClick = (application: FleetApplicationRow) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  const openActionModal = useCallback(
    (type: FleetActionType, application: FleetApplicationRow) => {
      setActionType(type);
      setActionApplication(application);
      setActionModalOpen(true);
    },
    []
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
                  color:
                    activeTab === tab.status ? '#FFFFFF' : '#6B7280',
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
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onClick={() => handleCardClick(application)}
              onApprove={() => openActionModal('approve', application)}
              onReject={() => openActionModal('reject', application)}
              onRequestDocs={() =>
                openActionModal('request-docs', application)
              }
            />
          ))}

          {filteredApplications.length === 0 && (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ padding: '60px 0' }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(14),
                  color: '#9CA3AF',
                }}
              >
                No applications found
              </Typography>
            </Stack>
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
      />
    </AppDashboardLayout>
  );
};
