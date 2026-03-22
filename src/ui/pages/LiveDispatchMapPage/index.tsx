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
import {
  ActiveTripCard,
  ActiveTrip,
  TripTelemetryPanel,
} from '../DispatchPage/ui/components';

// ─── Sample Data ────────────────────────────────────────────────────────────

const activeTrips: (ActiveTrip & {
  vehicle: string;
  pickup: string;
  destination: string;
})[] = [
  {
    id: '1',
    tripId: 'TR-8801',
    status: 'Completed',
    statusColor: '#6B7280',
    statusBg: '#F3F4F6',
    eta: 'Arrived',
    patientName: 'Marie Tremblay',
    driverName: 'Jean-Luc Dubois',
    driverInitials: 'JL',
    driverInitialsColor: '#2F6FED',
    speed: '31 mph',
    progress: 100,
    vehicle: 'Toyota Sienna WAV',
    pickup: '742 Evergreen Terrace',
    destination: "St. Mary's Hospital",
  },
  {
    id: '2',
    tripId: 'TR-8800',
    status: 'In Transit',
    statusColor: '#2F6FED',
    statusBg: '#EBF2FF',
    eta: '5 min',
    patientName: 'David Chen',
    driverName: 'Priya Sharma',
    driverInitials: 'PS',
    driverInitialsColor: '#8B5CF6',
    speed: '25 mph',
    progress: 83,
    vehicle: 'Honda Odyssey',
    pickup: '1428 Elm Street',
    destination: 'Memorial Medical Center',
  },
  {
    id: '3',
    tripId: 'TR-8799',
    status: 'Completed',
    statusColor: '#6B7280',
    statusBg: '#F3F4F6',
    eta: 'Arrived',
    patientName: 'Sophie Gagnon',
    driverName: 'Ben Williams',
    driverInitials: 'BW',
    driverInitialsColor: '#F59E0B',
    speed: '9 mph',
    progress: 100,
    vehicle: 'Ford Escape',
    pickup: '55 Wellington St W',
    destination: 'Toronto Western Hospital',
  },
  {
    id: '4',
    tripId: 'TR-8798',
    status: 'Completed',
    statusColor: '#6B7280',
    statusBg: '#F3F4F6',
    eta: 'Arrived',
    patientName: 'Olivier Martin',
    driverName: 'Meera Patel',
    driverInitials: 'MP',
    driverInitialsColor: '#EF4444',
    speed: '42 mph',
    progress: 100,
    vehicle: 'Chrysler Pacifica',
    pickup: '200 University Ave',
    destination: 'Sunnybrook Health Centre',
  },
  {
    id: '5',
    tripId: 'TR-8797',
    status: 'Arriving',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    eta: '2 min',
    patientName: 'Isabelle Roy',
    driverName: 'Ethan Brown',
    driverInitials: 'EB',
    driverInitialsColor: '#059669',
    speed: '34 mph',
    progress: 95,
    vehicle: 'Dodge Grand Caravan',
    pickup: '321 Elgin St',
    destination: 'Civic Hospital Ottawa',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const LiveDispatchMapPage = () => {
  const [selectedTripId, setSelectedTripId] = useState<string>('1');

  const selectedTrip =
    activeTrips.find((t) => t.id === selectedTripId) || activeTrips[0];

  const inProgressCount = activeTrips.filter(
    (t) => t.status !== 'Completed'
  ).length;

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Live Dispatch Map"
            desc="Real-time GPS tracking for all active vehicles"
          />
          <Chip
            icon={
              <FiberManualRecordIcon
                sx={{ fontSize: 10, color: '#059669 !important' }}
              />
            }
            label={`Live · ${inProgressCount} Active`}
            sx={{
              background: '#FFFFFF',
              border: '1px solid #EAECF0',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: '#059669',
              borderRadius: '20px',
              height: '32px',
            }}
          />
        </RowStack>

        {/* Main Content */}
        <Grid container spacing={'20px'}>
          {/* Left: Active Trips */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack
              sx={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '0.67px solid #EAECF0',
                overflow: 'hidden',
              }}
            >
              <Stack spacing={'2px'} sx={{ padding: '20px 20px 12px' }}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(15),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  Active Trips
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  {inProgressCount} trips in progress
                </Typography>
              </Stack>

              <Stack
                sx={{
                  maxHeight: '650px',
                  overflowY: 'auto',
                  '::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                }}
              >
                {activeTrips.map((trip) => (
                  <ActiveTripCard
                    key={trip.id}
                    trip={trip}
                    isSelected={selectedTripId === trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                  />
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Right: Map + Telemetry */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={'16px'}>
              {/* Map */}
              <Box
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '0.67px solid #EAECF0',
                  overflow: 'hidden',
                  height: '400px',
                  position: 'relative',
                }}
              >
                <AppGoogleMapsProvider
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                >
                  <AppGoogleMap
                    markerPositions={[
                      { lat: 43.6532, lng: -79.3832 },
                      { lat: 43.6615, lng: -79.3956 },
                    ]}
                    mapContainerStyle={{ width: '100%', height: '400px' }}
                    showDirections={false}
                  />
                </AppGoogleMapsProvider>
                {/* Map Overlay Badge */}
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
                {/* ETA Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: '#1E293B',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    zIndex: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(9),
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
              </Box>

              {/* Trip Telemetry */}
              <TripTelemetryPanel
                tripId={selectedTrip.tripId}
                patientName={selectedTrip.patientName}
                driverName={selectedTrip.driverName}
                speed={selectedTrip.speed}
                eta={selectedTrip.eta}
                progress={selectedTrip.progress}
                status={selectedTrip.status}
                pickup={selectedTrip.pickup}
                destination={selectedTrip.destination}
                vehicle={selectedTrip.vehicle}
                statusColor={selectedTrip.statusColor}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </AppDashboardLayout>
  );
};
