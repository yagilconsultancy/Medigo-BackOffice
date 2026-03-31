'use client';

import { useState } from 'react';
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { SuspendDriverModal } from './ui/components';
import { pxToRem } from '../../../common';
import { useRouter } from 'next/navigation';

// ─── Types ──────────────────────────────────────────────────────────────────

type DriverStatus = 'On Trip' | 'Available' | 'Off Duty' | 'Suspended';

type DriverProfile = {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  status: DriverStatus;
  fleet: string;
  fleetColor: string;
  fleetBg: string;
  vehicle: string;
  phone: string;
  license: string;
  rating: number;
  trips: number;
  capabilities: string[];
  headerTint: string;
};

// ─── Status Config ──────────────────────────────────────────────────────────

const statusConfig: Record<DriverStatus, { color: string }> = {
  'On Trip': { color: '#6366F1' },
  Available: { color: '#059669' },
  'Off Duty': { color: '#6B7280' },
  Suspended: { color: '#EF4444' },
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const driversData: DriverProfile[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    avatar: '',
    joinedDate: 'Jan 2023',
    status: 'On Trip',
    fleet: 'MediGo Direct',
    fleetColor: '#2F6FED',
    fleetBg: 'rgba(47, 111, 237, 0.09)',
    vehicle: 'Toyota Sienna - 2022',
    phone: '+1 (555) 201-3344',
    license: 'DL-NY-448821',
    rating: 4.9,
    trips: 312,
    capabilities: ['Wheelchair Assistance', 'Senior Assistance'],
    headerTint: 'rgba(47, 111, 237, 0.05)',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    avatar: '',
    joinedDate: 'Feb 2023',
    status: 'Available',
    fleet: 'MedRide Express',
    fleetColor: '#2F6FED',
    fleetBg: 'rgba(47, 111, 237, 0.09)',
    vehicle: 'Honda Odyssey - 2021',
    phone: '+1 (555) 202-4455',
    license: 'DL-NY-559932',
    rating: 4.8,
    trips: 287,
    capabilities: ['Wheelchair Assistance', 'Medical Escort'],
    headerTint: 'rgba(99, 102, 241, 0.05)',
  },
  {
    id: '3',
    name: 'David Chen',
    avatar: '',
    joinedDate: 'Mar 2023',
    status: 'Available',
    fleet: 'MediGo Direct',
    fleetColor: '#2F6FED',
    fleetBg: 'rgba(47, 111, 237, 0.09)',
    vehicle: 'Ford Escape - 2023',
    phone: '+1 (555) 203-5566',
    license: 'DL-NJ-661043',
    rating: 4.8,
    trips: 264,
    capabilities: ['Senior Assistance'],
    headerTint: 'rgba(245, 158, 11, 0.05)',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    avatar: '',
    joinedDate: 'Apr 2023',
    status: 'On Trip',
    fleet: 'CareTransit Co.',
    fleetColor: '#10B981',
    fleetBg: 'rgba(16, 185, 129, 0.09)',
    vehicle: 'Chrysler Pacifica - 2020',
    phone: '+1 (555) 204-6677',
    license: 'DL-CT-772154',
    rating: 4.7,
    trips: 241,
    capabilities: ['Wheelchair Assistance'],
    headerTint: 'rgba(236, 72, 153, 0.05)',
  },
  {
    id: '5',
    name: 'James Thompson',
    avatar: '',
    joinedDate: 'May 2023',
    status: 'On Trip',
    fleet: 'HealthHaul LLC',
    fleetColor: '#6366F1',
    fleetBg: 'rgba(99, 102, 241, 0.09)',
    vehicle: 'Dodge Caravan - 2021',
    phone: '+1 (555) 205-7788',
    license: 'DL-IL-883265',
    rating: 4.7,
    trips: 218,
    capabilities: [
      'Wheelchair Assistance',
      'Medical Escort',
      'Stretcher Transport',
    ],
    headerTint: 'rgba(16, 185, 129, 0.05)',
  },
  {
    id: '6',
    name: 'Anna Kim',
    avatar: '',
    joinedDate: 'Jun 2023',
    status: 'Available',
    fleet: 'MediGo Direct',
    fleetColor: '#2F6FED',
    fleetBg: 'rgba(47, 111, 237, 0.09)',
    vehicle: 'Toyota Camry - 2022',
    phone: '+1 (555) 206-8899',
    license: 'DL-CA-994376',
    rating: 4.6,
    trips: 195,
    capabilities: ['Senior Assistance', 'Medical Escort'],
    headerTint: 'rgba(139, 92, 246, 0.05)',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverProfilesPage = () => {
  const router = useRouter();
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendDriver, setSuspendDriver] = useState<DriverProfile | null>(
    null
  );

  const handleSuspend = (driver: DriverProfile) => {
    setSuspendDriver(driver);
    setSuspendModalOpen(true);
  };

  const handleDocuments = () => {
    router.push('/drivers/documents');
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Driver Profiles"
          desc="Individual driver profiles with personal details, fleet, vehicle, documents, trips and ratings"
        />

        {/* Driver Cards Grid */}
        <Grid container spacing={'20px'}>
          {driversData.map((driver) => (
            <Grid key={driver.id} size={{ xs: 12, md: 6 }}>
              <DriverCard
                driver={driver}
                onSuspend={() => handleSuspend(driver)}
                onDocuments={handleDocuments}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* Suspend Driver Modal */}
      <SuspendDriverModal
        open={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        driver={
          suspendDriver
            ? {
                name: suspendDriver.name,
                avatar: suspendDriver.avatar,
                fleet: suspendDriver.fleet,
                vehicle: suspendDriver.vehicle,
                status: suspendDriver.status,
              }
            : null
        }
      />
    </AppDashboardLayout>
  );
};

// ─── DriverCard Sub-Component ───────────────────────────────────────────────

const DriverCard = ({
  driver,
  onSuspend,
  onDocuments,
}: {
  driver: DriverProfile;
  onSuspend: () => void;
  onDocuments: () => void;
}) => {
  const nameParts = driver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const statusColor = statusConfig[driver.status].color;

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header Band */}
      <RowStack
        justifyContent={'space-between'}
        sx={{
          padding: '16px 20px',
          background: driver.headerTint,
          borderBottom: '0.67px solid #F0F4F8',
        }}
      >
        <RowStack spacing={'12px'}>
          <Avatar
            src={driver.avatar || undefined}
            alt={driver.name}
            sx={{
              width: 46,
              height: 46,
              fontSize: pxToRem(14),
              fontWeight: 600,
              background: '#EBF2FF',
              color: '#2F6FED',
              borderRadius: '23px',
            }}
          >
            {initials}
          </Avatar>
          <Stack spacing={0}>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: '#111827',
                lineHeight: '1.5em',
              }}
            >
              {driver.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#9CA3AF',
                lineHeight: '1.5em',
              }}
            >
              Joined {driver.joinedDate}
            </Typography>
          </Stack>
        </RowStack>

        <Stack spacing={'4px'} alignItems={'flex-end'}>
          {/* Status Chip */}
          <Box
            sx={{
              padding: '2px 10px',
              borderRadius: '100px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                color: statusColor,
              }}
            >
              {driver.status}
            </Typography>
          </Box>

          {/* Fleet Chip */}
          <Box
            sx={{
              padding: '2px 10px',
              borderRadius: '100px',
              background: driver.fleetBg,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                color: driver.fleetColor,
              }}
            >
              {driver.fleet}
            </Typography>
          </Box>
        </Stack>
      </RowStack>

      {/* Details Section */}
      <Stack spacing={'12px'} sx={{ padding: '16px 20px 0' }}>
        {/* Fleet & Vehicle Row */}
        <RowStack
          sx={{
            background: '#F7F9FB',
            border: '0.67px solid #F0F2F5',
            borderRadius: '14px',
            padding: '12px 16px',
            gap: '16px',
          }}
        >
          <ApartmentOutlinedIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
          <Stack spacing={0} sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(10),
                color: '#9CA3AF',
                textTransform: 'uppercase',
                lineHeight: '1.5em',
              }}
            >
              Fleet Company
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(13),
                color: driver.fleetColor,
                lineHeight: '1.5em',
              }}
            >
              {driver.fleet}
            </Typography>
          </Stack>

          <Box
            sx={{
              width: '1px',
              height: 32,
              background: '#E5E7EB',
            }}
          />

          <DirectionsCarOutlinedIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
          <Stack spacing={0} sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(10),
                color: '#9CA3AF',
                textTransform: 'uppercase',
                lineHeight: '1.5em',
              }}
            >
              Vehicle
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#374151',
                lineHeight: '1.5em',
              }}
            >
              {driver.vehicle}
            </Typography>
          </Stack>
        </RowStack>

        {/* Phone & License Row */}
        <RowStack spacing={'12px'}>
          <Box
            sx={{
              flex: 1,
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '10px 14px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(10),
                color: '#9CA3AF',
                textTransform: 'uppercase',
                lineHeight: '1.5em',
              }}
            >
              Phone
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#374151',
                lineHeight: '1.5em',
              }}
            >
              {driver.phone}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              background: '#F7F9FB',
              borderRadius: '14px',
              padding: '10px 14px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: pxToRem(10),
                color: '#9CA3AF',
                textTransform: 'uppercase',
                lineHeight: '1.5em',
              }}
            >
              License
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#374151',
                lineHeight: '1.5em',
              }}
            >
              {driver.license}
            </Typography>
          </Box>
        </RowStack>

        {/* Service Capabilities */}
        {driver.capabilities.length > 0 && (
          <RowStack spacing={'8px'} sx={{ flexWrap: 'wrap', gap: '8px' }}>
            {driver.capabilities.map((cap) => (
              <Box
                key={cap}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: '#EEF3FF',
                  border: '0.67px solid #C7D7F9',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: pxToRem(11),
                    color: '#2F6FED',
                  }}
                >
                  {cap}
                </Typography>
              </Box>
            ))}
          </RowStack>
        )}
      </Stack>

      {/* Footer */}
      <RowStack
        justifyContent={'space-between'}
        sx={{
          padding: '0 20px',
          height: 56,
          borderTop: '0.67px solid #F3F4F6',
          mt: '16px',
        }}
      >
        {/* Rating & Trips */}
        <RowStack spacing={'8px'}>
          <StarIcon sx={{ fontSize: 16, color: '#FCD34D' }} />
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: pxToRem(13),
              color: '#374151',
            }}
          >
            {driver.rating.toFixed(1)}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#9CA3AF',
            }}
          >
            - {driver.trips} trips
          </Typography>
        </RowStack>

        {/* Action Buttons */}
        <RowStack spacing={'8px'}>
          {/* Edit */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '10px',
              background: '#EEF3FF',
              border: '0.67px solid #C7D7F9',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 13, color: '#2F6FED' }} />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#2F6FED',
              }}
            >
              Edit
            </Typography>
          </Box>

          {/* Documents */}
          <Box
            onClick={onDocuments}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '10px',
              background: '#F7F9FB',
              border: '0.67px solid #E5E7EB',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 13, color: '#374151' }} />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#374151',
              }}
            >
              Documents
            </Typography>
          </Box>

          {/* Suspend */}
          <Box
            onClick={onSuspend}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '10px',
              background: '#FEF2F2',
              border: '0.67px solid #FECACA',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            <BlockOutlinedIcon sx={{ fontSize: 13, color: '#EF4444' }} />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#EF4444',
              }}
            >
              Suspend
            </Typography>
          </Box>
        </RowStack>
      </RowStack>
    </Box>
  );
};
