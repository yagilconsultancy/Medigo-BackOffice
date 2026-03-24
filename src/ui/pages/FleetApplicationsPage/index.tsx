'use client';

import { useState, useMemo, useCallback } from 'react';
import { Grid, Pagination, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { DispatchStatCard } from '../DispatchPage/ui/components/DispatchStatCard';
import {
  ApplicationCard,
  FleetApplication,
  ApplicationStatus,
  FleetApproveModal,
  FleetRejectModal,
  FleetRequestDocsModal,
} from './ui/components';
import { pxToRem } from '../../../common';

import totalApplicationsIcon from './ui/assets/icons/total-applications-icon.svg';
import pendingReviewIcon from './ui/assets/icons/pending-review-icon.svg';
import approvedIcon from './ui/assets/icons/approved-icon.svg';
import rejectedIcon from './ui/assets/icons/rejected-icon.svg';

// ─── Filter Types ───────────────────────────────────────────────────────────

type FilterStatus = 'All' | ApplicationStatus;

// ─── Constants ──────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 7;

// ─── Sample Data ────────────────────────────────────────────────────────────

const applicationsData: FleetApplication[] = [
  {
    id: '1',
    appId: 'APP-2401',
    companyName: 'SwiftCare Mobility',
    status: 'Pending',
    contactName: 'Olivier Renaud',
    contactEmail: 'orenaud@swiftcare.ca',
    location: 'Toronto, ON',
    vehicleCount: 12,
    submittedDate: 'Mar 6, 2026',
    description:
      'We operate a fleet of 12 wheelchair-accessible vehicles in Greater Toronto and are looking to partner with Medigo to expand our reach into medical transportation across the GTA.',
    documents: ['Business License', 'Insurance Certificate', 'Vehicle List'],
  },
  {
    id: '2',
    appId: 'APP-2402',
    companyName: 'HealRide Transport',
    status: 'Pending',
    contactName: 'Fatima Al-Rashid',
    contactEmail: 'fatima@healride.ca',
    location: 'Vancouver, BC',
    vehicleCount: 8,
    submittedDate: 'Mar 5, 2026',
    description:
      'HealRide specializes in non-emergency medical transportation for dialysis and oncology patients across Metro Vancouver and the Lower Mainland.',
    documents: ['Business License', 'Vehicle Registration'],
  },
  {
    id: '3',
    appId: 'APP-2403',
    companyName: 'PrimePath Medical',
    status: 'Approved',
    contactName: 'Samuel Grégoire',
    contactEmail: 'samuel@primepath.ca',
    location: 'Montréal, QC',
    vehicleCount: 20,
    submittedDate: 'Mar 3, 2026',
    description:
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
    status: 'More Info Required',
    contactName: 'Diana Chambers',
    contactEmail: 'diana@carepath.ca',
    location: 'Calgary, AB',
    vehicleCount: 6,
    submittedDate: 'Feb 28, 2026',
    description:
      'Small fleet focused on assisted rides for elderly patients across Calgary and the surrounding communities in southern Alberta.',
    documents: ['Business License'],
  },
  {
    id: '5',
    appId: 'APP-2405',
    companyName: 'TrustRide Inc.',
    status: 'Rejected',
    contactName: 'Kevin Cho',
    contactEmail: 'kevin@trustride.ca',
    location: 'Ottawa, ON',
    vehicleCount: 15,
    submittedDate: 'Feb 25, 2026',
    description:
      'We serve the Ottawa-Gatineau region with 15 vehicles including accessible transport for patients attending the Ottawa Hospital and Civic campuses.',
    documents: ['Business License', 'Insurance Certificate'],
  },
  {
    id: '6',
    appId: 'APP-2406',
    companyName: 'MedLink Transport',
    status: 'Pending',
    contactName: 'Camille Dupont',
    contactEmail: 'camille@medlink.ca',
    location: 'Winnipeg, MB',
    vehicleCount: 10,
    submittedDate: 'Mar 7, 2026',
    description:
      'MedLink serves the Winnipeg medical community with reliable transport for hospital appointments at Health Sciences Centre and St. Boniface Hospital.',
    documents: ['Business License', 'Vehicle List', 'Insurance Certificate'],
  },
  {
    id: '7',
    appId: 'APP-2407',
    companyName: 'CareWheels Express',
    status: 'Pending',
    contactName: 'Lisa Chen',
    contactEmail: 'lchen@carewheels.ca',
    location: 'Halifax, NS',
    vehicleCount: 7,
    submittedDate: 'Feb 22, 2026',
    description:
      'CareWheels Express provides accessible and on-demand medical rides in Halifax and surrounding communities, with a focus on rural healthcare access.',
    documents: ['Business License', 'Insurance Certificate'],
  },
  {
    id: '8',
    appId: 'APP-2408',
    companyName: 'NorthStar Medical Transport',
    status: 'Approved',
    contactName: 'Jessica Martinez',
    contactEmail: 'jmartinez@northstar.ca',
    location: 'Regina, SK',
    vehicleCount: 9,
    submittedDate: 'Feb 20, 2026',
    description:
      'NorthStar Medical Transport offers scheduled and on-demand patient transportation across Saskatchewan with a fleet of fully equipped vehicles.',
    documents: ['Business License', 'Vehicle List', 'Insurance Certificate'],
  },
  {
    id: '9',
    appId: 'APP-2409',
    companyName: 'PacificRide Health',
    status: 'Pending',
    contactName: "Ryan O'Brien",
    contactEmail: 'robrien@pacificride.ca',
    location: 'Victoria, BC',
    vehicleCount: 7,
    submittedDate: 'Feb 18, 2026',
    description:
      'PacificRide Health focuses on non-emergency medical transportation for patients on Vancouver Island, connecting rural communities to urban hospitals.',
    documents: ['Business License', 'Insurance Certificate', 'Vehicle List'],
  },
  {
    id: '10',
    appId: 'APP-2410',
    companyName: 'Atlantic Care Express',
    status: 'More Info Required',
    contactName: 'Marie Tremblay',
    contactEmail: 'mtremblay@atlanticcare.ca',
    location: 'Fredericton, NB',
    vehicleCount: 4,
    submittedDate: 'Feb 15, 2026',
    description:
      'Atlantic Care Express is a growing patient transport service in New Brunswick, providing rides to medical appointments across the Fredericton and Moncton areas.',
    documents: ['Business License'],
  },
];

// ─── Filter Config ──────────────────────────────────────────────────────────

const filterOptions: FilterStatus[] = [
  'All',
  'Pending',
  'Approved',
  'More Info Required',
  'Rejected',
];

// ─── Stat Cards Config ──────────────────────────────────────────────────────

const statCards = [
  {
    icon: totalApplicationsIcon,
    value: '24',
    label: 'Total Applications',
    iconBg: '#EBF2FF',
  },
  {
    icon: pendingReviewIcon,
    value: '8',
    label: 'Pending Review',
    iconBg: '#FFFBEB',
  },
  {
    icon: approvedIcon,
    value: '12',
    label: 'Approved',
    iconBg: '#ECFDF5',
  },
  {
    icon: rejectedIcon,
    value: '4',
    label: 'Rejected',
    iconBg: '#FEF2F2',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetApplicationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [requestDocsOpen, setRequestDocsOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<FleetApplication | null>(null);

  const filteredApplications = useMemo(() => {
    if (activeFilter === 'All') return applicationsData;
    return applicationsData.filter((app) => app.status === activeFilter);
  }, [activeFilter]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredApplications, currentPage]);

  const showingStart = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredApplications.length
  );

  const findApp = useCallback(
    (id: string) => applicationsData.find((app) => app.id === id) || null,
    []
  );

  const handleApprove = useCallback(
    (id: string) => {
      setSelectedApp(findApp(id));
      setApproveOpen(true);
    },
    [findApp]
  );

  const handleReject = useCallback(
    (id: string) => {
      setSelectedApp(findApp(id));
      setRejectOpen(true);
    },
    [findApp]
  );

  const handleRequestDocs = useCallback(
    (id: string) => {
      setSelectedApp(findApp(id));
      setRequestDocsOpen(true);
    },
    [findApp]
  );

  const handleFilterChange = useCallback((filter: FilterStatus) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Fleet Applications"
          desc="Review and manage incoming fleet partner applications"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <DispatchStatCard {...card} subtitle="" />
            </Grid>
          ))}
        </Grid>

        {/* Filter Pills */}
        <RowStack spacing={'8px'}>
          {filterOptions.map((filter) => (
            <Typography
              key={filter}
              onClick={() => handleFilterChange(filter)}
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: activeFilter === filter ? '#FFFFFF' : '#6B7280',
                background: activeFilter === filter ? '#2F6FED' : '#FFFFFF',
                border: `0.67px solid ${activeFilter === filter ? '#2F6FED' : '#E8ECF0'}`,
                borderRadius: '20px',
                padding: '7px 16px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.15s ease',
                '&:hover': {
                  background: activeFilter === filter ? '#2F6FED' : '#F7F9FB',
                },
              }}
            >
              {filter}
            </Typography>
          ))}
        </RowStack>

        {/* Application Cards */}
        <Stack spacing={'12px'}>
          {paginatedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestDocs={handleRequestDocs}
            />
          ))}
        </Stack>

        {/* Pagination Footer */}
        <RowStack justifyContent="space-between">
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12.5),
              color: '#6B7280',
            }}
          >
            Showing {showingStart}&ndash;{showingEnd} of{' '}
            {filteredApplications.length} vehicles
          </Typography>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              size="small"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(12),
                  minWidth: 30,
                  height: 30,
                  borderRadius: '8px',
                  color: '#374151',
                  '&.Mui-selected': {
                    background: '#2F6FED',
                    color: '#FFFFFF',
                    '&:hover': {
                      background: '#2563EB',
                    },
                  },
                },
              }}
            />
          )}
        </RowStack>
      </Stack>

      {/* Modals */}
      <FleetApproveModal
        open={approveOpen}
        handleClose={() => setApproveOpen(false)}
        application={selectedApp}
      />
      <FleetRejectModal
        open={rejectOpen}
        handleClose={() => setRejectOpen(false)}
        application={selectedApp}
      />
      <FleetRequestDocsModal
        open={requestDocsOpen}
        handleClose={() => setRequestDocsOpen(false)}
        application={selectedApp}
      />
    </AppDashboardLayout>
  );
};
