'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc } from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import {
  FleetProfileCard,
  FleetProfileData,
  EditFleetProfileModal,
} from './ui/components';
import { pxToRem, useGetAllFleetCompanies } from '../../../common';
import type { FleetCompanyDetailResponse } from '../../../common';

// ─── Helpers ────────────────────────────────────────────────────────────────

const COLORS = [
  '#2F6FED',
  '#10B981',
  '#6366F1',
  '#F59E0B',
  '#EC4899',
  '#0EA5E9',
  '#8B5CF6',
  '#D97706',
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const formatCurrency = (amount?: number | null) =>
  amount != null
    ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
    : '—';

const formatRating = (rating?: number | null) =>
  rating != null ? `${rating.toFixed(1)} / 5.0` : '—';

const hasDocument = (
  documents: FleetCompanyDetailResponse['documents'],
  keyword: string
) =>
  documents.some((doc) =>
    doc.document_type?.toLowerCase().includes(keyword.toLowerCase())
  );

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetProfilesPage = () => {
  const { data: companiesResponse, isLoading } = useGetAllFleetCompanies();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<FleetProfileData | null>(null);

  const profiles = useMemo<FleetProfileData[]>(() => {
    if (!companiesResponse?.success || !companiesResponse?.data?.length)
      return [];

    return companiesResponse.data.map((item, index) => ({
      id: item.id,
      fleetId: `FL-${item.id.slice(-3).toUpperCase()}`,
      companyName: item.name,
      initials: getInitials(item.name),
      color: COLORS[index % COLORS.length],
      contactPerson: item.contact_person ?? '—',
      contactEmail: item.email ?? '—',
      contactPhone: item.phone ?? '—',
      city: [item.city, item.state].filter(Boolean).join(', ') || '—',
      vehicles: item.vehicle_count ?? 0,
      drivers: item.driver_count ?? 0,
      revenue: formatCurrency(item.total_revenue),
      rating: formatRating(item.avg_rating),
      status: item.is_active ? 'Active' : 'Suspended',
      joinedDate: dayjs(item.created_at).format('MMM YYYY'),
      documents: {
        businessLicense: hasDocument(item.documents ?? [], 'business_license'),
        insuranceCertificate: hasDocument(item.documents ?? [], 'insurance'),
        vehicleFleetList: hasDocument(item.documents ?? [], 'vehicle_fleet'),
        driverCertifications: hasDocument(item.documents ?? [], 'driver_cert'),
      },
    }));
  }, [companiesResponse]);

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
        {!isLoading && profiles.length === 0 ? (
          <EmptyState
            emptyState={
              <Stack spacing={'4px'} sx={{ alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontSize: pxToRem(14),
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  No fleet profiles found
                </Typography>
                <Typography sx={{ fontSize: pxToRem(12), color: '#6B7280' }}>
                  Approved fleet partners will appear here.
                </Typography>
              </Stack>
            }
          />
        ) : (
          <Stack spacing={'16px'}>
            {profiles.map((profile) => (
              <FleetProfileCard
                key={profile.id}
                profile={profile}
                onEdit={() => handleEdit(profile)}
              />
            ))}
          </Stack>
        )}
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
