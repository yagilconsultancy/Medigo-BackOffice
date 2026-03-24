'use client';

import { useState } from 'react';
import { Stack } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc } from '../../modules/components';
import {
  FleetProfileCard,
  FleetProfileData,
  EditFleetProfileModal,
} from './ui/components';

// ─── Sample Data ────────────────────────────────────────────────────────────

const profilesData: FleetProfileData[] = [
  {
    id: '1',
    fleetId: 'FL-001',
    companyName: 'MedRide Express',
    initials: 'MR',
    color: '#2F6FED',
    contactPerson: 'Ryan MacDougall',
    contactEmail: 'ryan@medride.ca',
    contactPhone: '+1 416 555 0101',
    city: 'Toronto, ON',
    vehicles: 48,
    drivers: 42,
    revenue: '$128,400',
    rating: '4.8 / 5.0',
    status: 'Active',
    joinedDate: 'Jan 2024',
    documents: {
      businessLicense: true,
      insuranceCertificate: true,
      vehicleFleetList: true,
      driverCertifications: false,
    },
  },
  {
    id: '2',
    fleetId: 'FL-002',
    companyName: 'CareTransit Co.',
    initials: 'CT',
    color: '#10B981',
    contactPerson: 'Sophie Lacroix',
    contactEmail: 'sophie@caretransit.ca',
    contactPhone: '+1 514 555 0202',
    city: 'Montréal, QC',
    vehicles: 36,
    drivers: 31,
    revenue: '$94,200',
    rating: '4.7 / 5.0',
    status: 'Active',
    joinedDate: 'Feb 2024',
    documents: {
      businessLicense: true,
      insuranceCertificate: true,
      vehicleFleetList: false,
      driverCertifications: false,
    },
  },
  {
    id: '3',
    fleetId: 'FL-003',
    companyName: 'HealthHaul LLC',
    initials: 'HH',
    color: '#6366F1',
    contactPerson: 'David Kim',
    contactEmail: 'david@healthhaul.ca',
    contactPhone: '+1 604 555 0303',
    city: 'Vancouver, BC',
    vehicles: 29,
    drivers: 24,
    revenue: '$71,600',
    rating: '4.6 / 5.0',
    status: 'Active',
    joinedDate: 'Mar 2024',
    documents: {
      businessLicense: true,
      insuranceCertificate: true,
      vehicleFleetList: false,
      driverCertifications: true,
    },
  },
  {
    id: '4',
    fleetId: 'FL-004',
    companyName: 'SafeRide Medical',
    initials: 'SR',
    color: '#F59E0B',
    contactPerson: 'Tina Nguyen',
    contactEmail: 'tina@saferidemd.ca',
    contactPhone: '+1 403 555 0404',
    city: 'Calgary, AB',
    vehicles: 22,
    drivers: 19,
    revenue: '$58,800',
    rating: '4.5 / 5.0',
    status: 'Active',
    joinedDate: 'Apr 2024',
    documents: {
      businessLicense: true,
      insuranceCertificate: false,
      vehicleFleetList: false,
      driverCertifications: false,
    },
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetProfilesPage = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<FleetProfileData | null>(null);

  const handleEdit = (profile: FleetProfileData) => {
    setSelectedProfile(profile);
    setEditModalOpen(true);
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Fleet Profiles"
          desc="Detailed profiles for each approved fleet partner"
        />

        {/* Profile Cards */}
        <Stack spacing={'16px'}>
          {profilesData.map((profile) => (
            <FleetProfileCard
              key={profile.id}
              profile={profile}
              onEdit={() => handleEdit(profile)}
            />
          ))}
        </Stack>
      </Stack>

      {/* Edit Fleet Profile Modal */}
      <EditFleetProfileModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        profile={selectedProfile}
      />
    </AppDashboardLayout>
  );
};
