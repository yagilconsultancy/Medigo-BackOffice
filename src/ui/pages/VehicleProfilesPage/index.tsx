'use client';

import { useState, useMemo } from 'react';
import { Stack } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  DashboardTitleAndDesc,
  AppSearchField,
} from '../../modules/components';
import {
  VehicleProfileCard,
  VehicleDocumentsModal,
} from './ui/components';
import type { VehicleProfileCardData } from './ui/components/VehicleProfileCard';

// ─── Mock Data ──────────────────────────────────────────────────────────────

const vehicleProfilesData: VehicleProfileCardData[] = [
  {
    id: '1',
    vehicleId: 'VH-001',
    vehicle: '2022 Toyota Sienna',
    plate: 'ABC-1234',
    category: 'Wheelchair Accessible',
    status: 'Active',
    driver: 'Marcus Johnson',
    fleet: 'MediGo',
    mileage: '48,200 mi',
    capacity: 6,
    insurance: 'State Farm · Exp Dec 2026',
    registration: 'NY · Exp Nov 2026',
    lastService: 'Jan 15, 2026',
    vin: '5TDYZ3DC4NS138401',
  },
  {
    id: '2',
    vehicleId: 'VH-002',
    vehicle: '2021 Honda Odyssey',
    plate: 'DEF-5678',
    category: 'Standard Ride',
    status: 'Active',
    driver: 'Sarah Williams',
    fleet: 'MedRide Express',
    mileage: '62,400 mi',
    capacity: 7,
    insurance: 'Allstate · Exp Mar 2027',
    registration: 'NY · Exp Jun 2026',
    lastService: 'Feb 8, 2026',
    vin: '5FNRL6H74MB049221',
  },
  {
    id: '3',
    vehicleId: 'VH-003',
    vehicle: '2023 Ford Escape',
    plate: 'GHI-9012',
    category: 'Assisted Ride',
    status: 'Active',
    driver: 'David Chen',
    fleet: 'MediGo',
    mileage: '21,800 mi',
    capacity: 4,
    insurance: 'GEICO · Exp Jan 2027',
    registration: 'NY · Exp Sep 2026',
    lastService: 'Mar 1, 2026',
    vin: '1FMCU9J94NUA03003',
  },
  {
    id: '4',
    vehicleId: 'VH-004',
    vehicle: '2020 Chrysler Pacifica',
    plate: 'JKL-3456',
    category: 'Wheelchair Accessible',
    status: 'Maintenance',
    driver: 'Emily Rodriguez',
    fleet: 'CareTransit Co.',
    mileage: '89,100 mi',
    capacity: 5,
    insurance: 'Progressive · Exp Oct 2026',
    registration: 'NJ · Exp Apr 2026',
    lastService: 'Feb 28, 2026',
    vin: '2C4RC1BG5LR104004',
  },
  {
    id: '5',
    vehicleId: 'VH-005',
    vehicle: '2021 Dodge Grand Caravan',
    plate: 'MNO-7890',
    category: 'Standard Ride',
    status: 'Active',
    driver: 'James Thompson',
    fleet: 'HealthHaul LLC',
    mileage: '54,600 mi',
    capacity: 6,
    insurance: 'Liberty Mutual · Exp Dec 2026',
    registration: 'NY · Exp Aug 2026',
    lastService: 'Jan 15, 2026',
    vin: '2C4RDGCG1LR105005',
  },
  {
    id: '6',
    vehicleId: 'VH-006',
    vehicle: '2022 Ram ProMaster',
    plate: 'PQR-1234',
    category: 'Stretcher Transport',
    status: 'Active',
    driver: 'Anna Kim',
    fleet: 'MediGo',
    mileage: '31,900 mi',
    capacity: 2,
    insurance: 'State Farm · Exp Nov 2026',
    registration: 'NY · Exp Jul 2026',
    lastService: 'Feb 20, 2026',
    vin: '3C6TRVDG5NE106006',
  },
  {
    id: '7',
    vehicleId: 'VH-007',
    vehicle: '2020 Kia Sedona',
    plate: 'STU-5678',
    category: 'Standard Ride',
    status: 'Inactive',
    driver: 'Tom Roberts',
    fleet: 'SafeRide Medical',
    mileage: '74,200 mi',
    capacity: 6,
    insurance: 'Expired',
    registration: 'NY · Exp Jun 2026',
    lastService: 'Dec 5, 2025',
    vin: 'KNDMC5C16L6107007',
  },
  {
    id: '8',
    vehicleId: 'VH-008',
    vehicle: '2021 Buick Enclave',
    plate: 'VWX-9012',
    category: 'Assisted Ride',
    status: 'Active',
    driver: 'Grace Miller',
    fleet: 'MobCare Transport',
    mileage: '42,700 mi',
    capacity: 4,
    insurance: 'Travelers · Exp Jan 2027',
    registration: 'CT · Exp Sep 2026',
    lastService: 'Feb 15, 2026',
    vin: '5GAEVCKW1MJ108008',
  },
  {
    id: '9',
    vehicleId: 'VH-009',
    vehicle: '2023 Ford Transit',
    plate: 'YZA-3456',
    category: 'Stretcher Transport',
    status: 'Active',
    driver: 'Unassigned',
    fleet: 'MediGo',
    mileage: '12,400 mi',
    capacity: 2,
    insurance: 'GEICO · Exp Feb 2027',
    registration: 'NY · Exp Oct 2026',
    lastService: 'Mar 5, 2026',
    vin: '1FTBW2CM3NKA09009',
  },
  {
    id: '10',
    vehicleId: 'VH-010',
    vehicle: '2022 Toyota Camry',
    plate: 'BCD-7890',
    category: 'Standard Ride',
    status: 'Maintenance',
    driver: 'Leon Price',
    fleet: 'Apex Medical Rides',
    mileage: '58,300 mi',
    capacity: 4,
    insurance: 'Allstate · Exp Nov 2026',
    registration: 'NY · Exp Aug 2026',
    lastService: 'Mar 10, 2026',
    vin: '4T1BF1FK5CU510010',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const VehicleProfilesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleProfileCardData | null>(null);

  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return vehicleProfilesData;

    const query = searchQuery.toLowerCase();
    return vehicleProfilesData.filter(
      (v) =>
        v.vehicle.toLowerCase().includes(query) ||
        v.vehicleId.toLowerCase().includes(query) ||
        v.plate.toLowerCase().includes(query) ||
        v.driver.toLowerCase().includes(query) ||
        v.fleet.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
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
        <Stack spacing={'20px'}>
          {filteredVehicles.map((vehicle) => (
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
