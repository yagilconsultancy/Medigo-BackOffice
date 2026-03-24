'use client';

import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGoogleMap,
  AppGoogleMapsProvider,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import { useState } from 'react';
import { DispatchStatCard } from '../DispatchPage/ui/components';
import { TripDetailPanel, TripOverviewCard } from './ui/components';

import activeIcon from './ui/assets/active-icon.svg';
import arriveIcon from './ui/assets/arrive-icon.svg';
import velocityIcon from './ui/assets/velocity-icon.svg';
import completedIcon from './ui/assets/Icon-7.svg';

// ─── Types ──────────────────────────────────────────────────────────────────

export type ActiveTripData = {
  id: string;
  tripId: string;
  driverName: string;
  driverInitials: string;
  driverColor: string;
  vehicle: string;
  patientName: string;
  pickup: string;
  destination: string;
  speed: string;
  eta: string;
  elapsed: string;
  progress: number;
  status: 'Completed' | 'Transit' | 'Arriving';
  tag?: 'Wheelchair' | 'Escort';
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const activeTrips: ActiveTripData[] = [
  {
    id: '1',
    tripId: 'TR-8801',
    driverName: 'Marcus Johnson',
    driverInitials: 'MJ',
    driverColor: '#2F6FED',
    vehicle: 'Toyota Sienna WAV',
    patientName: 'Helen Moore',
    pickup: '120 King St W, Toronto',
    destination: 'Toronto General Hospital',
    speed: '37 mph',
    eta: 'Arrived',
    elapsed: '13 min',
    progress: 100,
    status: 'Completed',
    tag: 'Wheelchair',
  },
  {
    id: '2',
    tripId: 'TR-8800',
    driverName: 'Sarah Williams',
    driverInitials: 'SW',
    driverColor: '#7C3AED',
    vehicle: 'Honda Odyssey',
    patientName: 'Robert Garcia',
    pickup: '1428 Elm Street',
    destination: 'Memorial Medical Center',
    speed: '28 mph',
    eta: 'Arrived',
    elapsed: '13 min',
    progress: 100,
    status: 'Completed',
  },
  {
    id: '3',
    tripId: 'TR-8799',
    driverName: 'David Chen',
    driverInitials: 'DC',
    driverColor: '#059669',
    vehicle: 'Ford Escape',
    patientName: 'Daniel Martinez',
    pickup: '888 Burrard St, Vancouver',
    destination: 'BC Cancer — Vancouver Centre',
    speed: '13 mph',
    eta: 'Arrived',
    elapsed: '19 min',
    progress: 100,
    status: 'Completed',
    tag: 'Escort',
  },
  {
    id: '4',
    tripId: 'TR-8798',
    driverName: 'Emily Rodriguez',
    driverInitials: 'ER',
    driverColor: '#D97706',
    vehicle: 'Chrysler Pacifica',
    patientName: 'Nancy White',
    pickup: '200 University Ave',
    destination: 'Sunnybrook Health Centre',
    speed: '42 mph',
    eta: '4 min',
    elapsed: '8 min',
    progress: 87,
    status: 'Arriving',
  },
  {
    id: '5',
    tripId: 'TR-8797',
    driverName: 'James Thompson',
    driverInitials: 'JT',
    driverColor: '#DC2626',
    vehicle: 'Dodge Grand Caravan',
    patientName: 'Patricia Clark',
    pickup: '321 Elgin St',
    destination: 'Civic Hospital Ottawa',
    speed: '40 mph',
    eta: '9 min',
    elapsed: '5 min',
    progress: 75,
    status: 'Transit',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const ActiveTripMapPage = () => {
  const [selectedTripId, setSelectedTripId] = useState<string>('1');

  const selectedTrip =
    activeTrips.find((t) => t.id === selectedTripId) || activeTrips[0];

  const inProgressCount = activeTrips.filter(
    (t) => t.status !== 'Completed'
  ).length;

  const arrivingCount = activeTrips.filter(
    (t) => t.status === 'Arriving'
  ).length;

  const completedCount = activeTrips.filter(
    (t) => t.status === 'Completed'
  ).length;

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Active Trip Monitor"
            desc="Real-time monitoring of all trips currently in progress"
          />
          <Chip
            icon={
              <FiberManualRecordIcon
                sx={{ fontSize: 7, color: '#2F6FED !important' }}
              />
            }
            label={`Live · ${inProgressCount} Active`}
            sx={{
              background: '#EEF3FF',
              border: '1px solid #C7D7F9',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: '#2F6FED',
              borderRadius: '20px',
              height: '32px',
            }}
          />
        </RowStack>

        {/* Stat Cards */}
        <RowStack spacing={'16px'}>
          <DispatchStatCard
            icon={activeIcon}
            value={String(inProgressCount)}
            label="Active Trips"
            subtitle="Currently in progress"
          />
          <DispatchStatCard
            icon={arriveIcon}
            value={String(arrivingCount)}
            label="Arriving (< 5 min)"
            subtitle="Approaching destination"
          />
          <DispatchStatCard
            icon={velocityIcon}
            value="31 mph"
            label="Avg Speed"
            subtitle="Fleet average"
          />
          <DispatchStatCard
            icon={completedIcon}
            value={String(completedCount)}
            label="Completed Today"
            subtitle="Successful drop-offs"
          />
        </RowStack>

        {/* Map + Trip Detail Panel */}
        <Grid container spacing={'16px'}>
          {/* Map */}
          <Grid size={{ xs: 12, lg: 7.5 }}>
            <Box
              sx={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '0.67px solid #EAECF0',
                overflow: 'hidden',
                height: '574px',
                position: 'relative',
                boxShadow:
                  '0px 8px 24px rgba(0,0,0,0.06), 0px 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <AppGoogleMapsProvider
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
              >
                <AppGoogleMap
                  markerPositions={[
                    { lat: 43.6532, lng: -79.3832 },
                    { lat: 43.6615, lng: -79.3956 },
                    { lat: 43.6448, lng: -79.3735 },
                  ]}
                  mapContainerStyle={{ width: '100%', height: '574px' }}
                  showDirections={false}
                />
              </AppGoogleMapsProvider>

              {/* "All Trips Live" Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  background: 'rgba(15, 23, 42, 0.88)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  zIndex: 1,
                }}
              >
                <RowStack spacing={'6px'}>
                  <FiberManualRecordIcon
                    sx={{ fontSize: 9, color: '#22C55E', opacity: 0.65 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(10.3),
                      color: '#FFFFFF',
                    }}
                  >
                    All Trips Live
                  </Typography>
                </RowStack>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(9.4),
                    color: '#94A3B8',
                  }}
                >
                  {inProgressCount} active · click to focus
                </Typography>
              </Box>

              {/* ETA Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'rgba(15, 23, 42, 0.88)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  zIndex: 1,
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(8.4),
                    color: '#FFFFFFAA',
                    textTransform: 'uppercase',
                  }}
                >
                  ETA
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(14),
                    color: '#FFFFFF',
                  }}
                >
                  {selectedTrip.eta}
                </Typography>
              </Box>

              {/* Speed Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  background: 'rgba(15, 23, 42, 0.82)',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  zIndex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(10.3),
                    color: '#FFFFFF',
                  }}
                >
                  {selectedTrip.speed}
                </Typography>
              </Box>

              {/* Driver Name Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: '#2F6FED',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  zIndex: 1,
                }}
              >
                <RowStack spacing={'6px'}>
                  <FiberManualRecordIcon
                    sx={{ fontSize: 8, color: '#4ADE80' }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(11),
                      color: '#FFFFFF',
                    }}
                  >
                    Live Dispatch Map
                  </Typography>
                </RowStack>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(10),
                    color: '#FFFFFFCC',
                  }}
                >
                  {selectedTrip.tripId} · {selectedTrip.progress}% complete
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Trip Detail Panel */}
          <Grid size={{ xs: 12, lg: 4.5 }}>
            <TripDetailPanel trip={selectedTrip} />
          </Grid>
        </Grid>

        {/* All Trips Overview */}
        <Stack spacing={'12px'}>
          <RowStack justifyContent="space-between" alignItems="center">
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: '#111827',
                }}
              >
                All Trips Overview
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: '#9CA3AF',
                }}
              >
                {activeTrips.length} trips monitored
              </Typography>
            </Stack>
          </RowStack>

          {/* Horizontal Trip Cards */}
          <RowStack
            spacing={'12px'}
            sx={{
              overflowX: 'auto',
              paddingBottom: '4px',
              '::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {activeTrips.map((trip) => (
              <TripOverviewCard
                key={trip.id}
                trip={trip}
                isSelected={selectedTripId === trip.id}
                onClick={() => setSelectedTripId(trip.id)}
              />
            ))}
          </RowStack>
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
