'use client';

import { useState, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  DashboardTitleAndDesc,
  AppSearchField,
  CustomBreadCrumbs,
} from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import { VehicleProfileCard, VehicleDocumentsModal } from './ui/components';
import type { VehicleProfileCardData } from './ui/components/VehicleProfileCard';
import {
  pxToRem,
  useGetFleetProfiles,
  useResolvedApiQuery,
} from '../../../common';

// ─── Component ──────────────────────────────────────────────────────────────

export const VehicleProfilesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleProfileCardData | null>(null);

  // Fetch vehicle profiles from API
  const { data: profilesData } = useResolvedApiQuery(
    useGetFleetProfiles,
    null,
    {
      page,
      limit: pageSize,
      search: searchQuery.trim() || '',
    }
  );

  // Map API response to UI format
  const vehicleProfiles = useMemo<VehicleProfileCardData[]>(() => {
    if (!profilesData) return [];

    return profilesData.map((vehicle) => {
      type VehicleCategory =
        | 'Standard Ride'
        | 'Wheelchair Accessible'
        | 'Assisted Ride'
        | 'Stretcher Transport';
      type VehicleStatus = 'Active' | 'Maintenance' | 'Inactive';

      return {
        id: vehicle.id,
        vehicleId: vehicle.id.substring(0, 8).toUpperCase(),
        vehicle:
          vehicle.vehicle_name ||
          `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        plate: vehicle.plate_number,
        category: vehicle.category as VehicleCategory,
        status: vehicle.status as VehicleStatus,
        driver: vehicle.driver_name || 'Unassigned',
        fleet: vehicle.fleet_name || 'Unknown Fleet',
        mileage: vehicle.mileage
          ? `${vehicle.mileage.toLocaleString()} mi`
          : 'N/A',
        capacity: vehicle.passenger_capacity || 0,
        insurance: vehicle.insurance_provider
          ? `${vehicle.insurance_provider} · Exp ${vehicle.insurance_expiry ? new Date(vehicle.insurance_expiry).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}`
          : 'N/A',
        registration: vehicle.registration_authority
          ? `${vehicle.registration_authority} · Exp ${vehicle.registration_expiry ? new Date(vehicle.registration_expiry).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}`
          : 'N/A',
        lastService: vehicle.last_inspection_date
          ? new Date(vehicle.last_inspection_date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'N/A',
        vin: vehicle.vin || 'N/A',
      };
    });
  }, [profilesData]);

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        <CustomBreadCrumbs
          breadcrumbsData={[
            { text: 'All Vehicles', href: '/vehicles' },
            { text: 'Vehicle Profiles', href: '#' },
          ]}
        />
        {/* Header */}
        <DashboardTitleAndDesc
          title="Vehicle Profiles"
          desc="Detailed vehicle profiles including assigned driver, fleet, and documents"
        />

        {/* Search */}
        <AppSearchField
          name="search"
          placeholder="Search vehicle profiles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          boxProps={{
            sx: { width: '380px' },
          }}
        />

        {/* Vehicle Cards — full-width rows */}
        {vehicleProfiles.length > 0 ? (
          <Stack spacing={'20px'}>
            {vehicleProfiles.map((vehicle) => (
              <VehicleProfileCard
                key={vehicle.id}
                vehicle={vehicle}
                onEditProfile={() => {}}
                onDocuments={() => {
                  setSelectedVehicle(vehicle);
                  setDocumentsModalOpen(true);
                }}
                onScheduleService={() => {}}
              />
            ))}
          </Stack>
        ) : (
          <EmptyState
            emptyState={
              <Typography
                sx={{
                  fontSize: pxToRem(16),
                  fontWeight: 400,
                  textAlign: 'center',
                }}
              >
                No vehicle profiles found
              </Typography>
            }
          />
        )}
      </Stack>

      {/* Vehicle Documents Modal */}
      <VehicleDocumentsModal
        open={documentsModalOpen}
        onClose={() => setDocumentsModalOpen(false)}
        vehicle={selectedVehicle}
      />
    </AppDashboardLayout>
  );
};
