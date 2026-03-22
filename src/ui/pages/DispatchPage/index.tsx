'use client';

import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGoogleMap,
  AppGoogleMapsProvider,
  DashboardTitleAndDesc,
  RowStack,
  StyledImage,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import { useState } from 'react';
import {
  DispatchStatCard,
  DispatchBookingCard,
  DispatchBooking,
  AvailableDriverCard,
  AvailableDriver,
  ActiveTripCard,
  ActiveTrip,
  TripTelemetryPanel,
  DispatchAssignModal,
} from './ui/components';

import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import pendingIcon from "./ui/assets/icons/dispatch-pending-Icon.svg"
import driverIcon from "./ui/assets/icons/driverinfo-icon.svg"
import userGroupIcon from "./ui/assets/icons/drivermanagement-Icon.svg"
import tripIcon from "./ui/assets/icons/tripstatus-icon.svg"
import assignIcon from "./ui/assets/icons/assign-icon.svg"

// ─── Sample Data ────────────────────────────────────────────────────────────

const pendingBookings: DispatchBooking[] = [
  {
    id: '1',
    bookingId: 'BK-20491',
    patientName: 'Claire Beaumont',
    time: '09:00 AM',
    pickup: '120 King St W, Toronto, ON',
    destination: 'Toronto General Hospital',
    specialNote: 'Wheelchair accessible',
    specialNoteType: 'wheelchair',
    status: 'urgent',
  },
  {
    id: '2',
    bookingId: 'BK-20487',
    patientName: 'Dorothy MacLeod',
    time: '01:30 PM',
    pickup: '1225 Gladstone Ave, Ottawa, ON',
    destination: 'Ottawa Kidney Care Centre',
    specialNote: 'Care Assistant required',
    specialNoteType: 'careAssistant',
  },
  {
    id: '3',
    bookingId: 'BK-20485',
    patientName: 'Isabelle Côté',
    time: '03:00 PM',
    pickup: '800 René-Lévesque Blvd W, Montréal, QC',
    destination: 'Montreal Heart Institute',
  },
  {
    id: '4',
    bookingId: 'BK-20483',
    patientName: 'Gordon MacPherson',
    time: '04:30 PM',
    pickup: '321 Elgin St, Ottawa, ON',
    destination: 'Civic Hospital Ottawa',
    specialNote: 'Oxygen needed',
    specialNoteType: 'oxygen',
  },
  {
    id: '5',
    bookingId: 'BK-20480',
    patientName: "Margaret O'Brien",
    time: '05:00 PM',
    pickup: '1150 12 Ave SW, Calgary, AB',
    destination: 'Foothills Medical Centre',
  },
];

const availableDrivers: AvailableDriver[] = [
  {
    id: '1',
    initials: 'MJ',
    initialsColor: '#2F6FED',
    name: 'Marcus Johnson',
    vehicle: 'Toyota Sienna WAV',
    rating: 4.9,
    trips: 312,
    distance: '0.4 mi',
    eta: '3 min',
    status: 'Available',
  },
  {
    id: '2',
    initials: 'SW',
    initialsColor: '#8B5CF6',
    name: 'Sarah Williams',
    vehicle: 'Honda Odyssey',
    rating: 4.8,
    trips: 287,
    distance: '0.8 mi',
    eta: '5 min',
    status: 'Available',
  },
  {
    id: '3',
    initials: 'DC',
    initialsColor: '#F59E0B',
    name: 'David Chen',
    vehicle: 'Ford Escape',
    rating: 4.8,
    trips: 264,
    distance: '1.1 mi',
    eta: '7 min',
    status: 'Available',
  },
  {
    id: '4',
    initials: 'ER',
    initialsColor: '#EF4444',
    name: 'Emily Rodriguez',
    vehicle: 'Chrysler Pacifica',
    rating: 4.7,
    trips: 241,
    distance: '1.4 mi',
    eta: '9 min',
    status: 'Available',
  },
  {
    id: '5',
    initials: 'JT',
    initialsColor: '#059669',
    name: 'James Thompson',
    vehicle: 'Dodge Grand Caravan',
    rating: 4.7,
    trips: 218,
    distance: '1.8 mi',
    eta: '11 min',
    status: 'Available',
  },
  {
    id: '6',
    initials: 'AK',
    initialsColor: '#0EA5E9',
    name: 'Anna Kim',
    vehicle: 'Toyota Camry',
    rating: 4.6,
    trips: 195,
    distance: '2.2 mi',
    eta: '13 min',
    status: 'Available',
  },
];

const activeTrips: ActiveTrip[] = [
  {
    id: '1',
    tripId: 'TR-8801',
    status: 'In Transit',
    statusColor: '#2F6FED',
    statusBg: '#EBF2FF',
    eta: '7 min',
    patientName: 'Helen Moore',
    driverName: 'Marcus Johnson',
    driverInitials: 'MJ',
    driverInitialsColor: '#2F6FED',
    speed: '33 mph',
    progress: 75,
  },
  {
    id: '2',
    tripId: 'TR-8800',
    status: 'In Transit',
    statusColor: '#2F6FED',
    statusBg: '#EBF2FF',
    eta: '14 min',
    patientName: 'Robert Garcia',
    driverName: 'Sarah Williams',
    driverInitials: 'SW',
    driverInitialsColor: '#8B5CF6',
    speed: '26 mph',
    progress: 48,
  },
  {
    id: '3',
    tripId: 'TR-8799',
    status: 'Arriving',
    statusColor: '#059669',
    statusBg: '#ECFDF5',
    eta: '2 min',
    patientName: 'Daniel Martinez',
    driverName: 'David Chen',
    driverInitials: 'DC',
    driverInitialsColor: '#F59E0B',
    speed: '16 mph',
    progress: 94,
  },
  {
    id: '4',
    tripId: 'TR-8798',
    status: 'In Transit',
    statusColor: '#2F6FED',
    statusBg: '#EBF2FF',
    eta: '21 min',
    patientName: 'Nancy White',
    driverName: 'Emily Rodriguez',
    driverInitials: 'ER',
    driverInitialsColor: '#EF4444',
    speed: '43 mph',
    progress: 31,
  },
  {
    id: '5',
    tripId: 'TR-8797',
    status: 'In Transit',
    statusColor: '#2F6FED',
    statusBg: '#EBF2FF',
    eta: '30 min',
    patientName: 'Patricia Clark',
    driverName: 'James Thompson',
    driverInitials: 'JT',
    driverInitialsColor: '#059669',
    speed: '38 mph',
    progress: 18,
  },
];

const dispatchDrivers = availableDrivers.map((d, i) => ({
  ...d,
  isBestMatch: i === 0,
}));

// ─── Component ──────────────────────────────────────────────────────────────

type ViewTab = 'assignments' | 'liveMap';

export const DispatchPage = () => {
  const [activeView, setActiveView] = useState<ViewTab>('assignments');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<DispatchBooking | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string>('1');

  const selectedTrip =
    activeTrips.find((t) => t.id === selectedTripId) || activeTrips[0];

  const handleAssignDriver = (booking: DispatchBooking) => {
    setSelectedBooking(booking);
    setAssignModalOpen(true);
  };

  const statCards = [
    {
      icon: pendingIcon,
      value: '5',
      label: 'Pending Assignments',
      subtitle: 'Awaiting driver',
      badge: { text: '5 need action', color: '#EF4444', bg: '#FEF2F2' },
      progress: '0/5 assigned',
    },
    {
      icon: driverIcon,
      value: '89',
      label: 'Assigned Today',
      subtitle: 'Dispatched trips',
      badge: { text: '+0 this session', color: '#059669', bg: '#ECFDF5' },
    },
    {
      icon: userGroupIcon,
      value: '32',
      label: 'Available Drivers',
      subtitle: 'Ready to dispatch',
      badge: { text: 'Online now', color: '#2F6FED', bg: '#EEF3FF' },
    },
    {
      icon: tripIcon,
      value: '62',
      label: 'Drivers On Trip',
      subtitle: 'Active rides',
      badge: { text: 'Live tracking', color: '#9CA3AF', bg: '#F3F4F6' },
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Dispatch Center"
            desc="Assign drivers to pending bookings and monitor active dispatches"
          />

          {/* View Toggle */}
          <Tabs
            value={activeView === 'assignments' ? 0 : 1}
            onChange={(_, newValue) =>
              setActiveView(newValue === 0 ? 'assignments' : 'liveMap')
            }
            sx={{
              minHeight: 'auto',
              background: '#F3F4F6',
              borderRadius: '10px',
              padding: '3px',
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTabs-flexContainer': {
                gap: 0,
              },
            }}
          >
            <Tab
              icon={<GridViewOutlinedIcon sx={{ fontSize: pxToRem(16), color: (theme) => theme.color.deepBlue }} />}
              iconPosition="start"
              label="Assignments"
              disableRipple
              sx={{
                minHeight: 'auto',
                minWidth: 'auto',
                padding: '8px 20px',
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: '#6B7280',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: (theme) => theme.color.deepBlue,
                  background: '#ffffff',
                },
              }}
            />
            <Tab
              icon={<MapOutlinedIcon sx={{ fontSize: 16 }} />}
              iconPosition="start"
              label="Live Map"
              disableRipple
              sx={{
                minHeight: 'auto',
                minWidth: 'auto',
                padding: '8px 20px',
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: '#6B7280',
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  color: '#2F6FED',
                  background: '#FFFFFF',
                },
              }}
            />
          </Tabs>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <DispatchStatCard {...card} />
            </Grid>
          ))}
        </Grid>

        {/* ═══════════ ASSIGNMENTS VIEW ═══════════ */}
        {activeView === 'assignments' && (
          <Grid container spacing={'20px'}>
            {/* Left: Pending Bookings */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack
                spacing={'12px'}
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '0.67px solid #EAECF0',
                }}
              >
                <Stack spacing={'2px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(15),
                      color: (theme) => theme.color.deepBlue,
                    }}
                  >
                    Pending Bookings
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12),
                      color: (theme) => theme.color.lightGrey,
                    }}
                  >
                    {pendingBookings.length} awaiting assignment
                  </Typography>
                </Stack>

                <Stack
                 sx={{
                  height: '600px',
                  overflowY: 'auto',
                  '::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                 }}
                 spacing={.4}
                >
                  {pendingBookings.map((booking) => (
                    <DispatchBookingCard
                      key={booking.id}
                      booking={booking}
                      onAssignDriver={() => handleAssignDriver(booking)}
                    />
                  ))}
                </Stack>
              </Stack>
            </Grid>

            {/* Right: Available Drivers */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack
                spacing={'0px'}
                sx={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '0.67px solid #EAECF0',
                }}
              >
                <RowStack
                  justifyContent="space-between"
                  sx={{ marginBottom: '8px' }}
                >
                  <Stack spacing={'2px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(15),
                        color: (theme) => theme.color.deepBlue,
                      }}
                    >
                      Available Drivers
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12),
                        color: (theme) => theme.color.lightGrey,
                      }}
                    >
                      {availableDrivers.length} ready to dispatch
                    </Typography>
                  </Stack>
                  <AppButton
                    sx={{
                      background: '#F7F9FB',
                      color: (theme) => theme.color.deepBlue,
                      fontWeight: 600,
                      fontSize: pxToRem(12),
                      borderRadius: '8px',
                      padding: '6px 14px',
                      minWidth: 'auto',
                      '&:hover': { background: '#EBF2FF' },
                    }}
                    startIcon={<StyledImage 
                       src={assignIcon}
                       alt="assign-driver"
                       sx={{
                        width: '13px',
                        height: '13px'
                       }}
                    />}
                  >
                    Auto Assign All
                  </AppButton>
                </RowStack>

                {availableDrivers.map((driver) => (
                  <AvailableDriverCard key={driver.id} driver={driver} />
                ))}
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* ═══════════ LIVE MAP VIEW ═══════════ */}
        {activeView === 'liveMap' && (
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
                    {activeTrips.length} trips in progress
                  </Typography>
                </Stack>

                {activeTrips.map((trip) => (
                  <ActiveTripCard
                    key={trip.id}
                    trip={trip}
                    isSelected={selectedTripId === trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                  />
                ))}
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
                  pickup="742 Evergreen Terrace"
                  destination="St. Mary's Hospital"
                />
              </Stack>
            </Grid>
          </Grid>
        )}
      </Stack>

      {/* Dispatch Assign Driver Modal */}
      {selectedBooking && (
        <DispatchAssignModal
          open={assignModalOpen}
          handleClose={() => setAssignModalOpen(false)}
          bookingId={selectedBooking.bookingId}
          patientName={selectedBooking.patientName}
          time={selectedBooking.time}
          pickup={selectedBooking.pickup}
          destination={selectedBooking.destination}
          specialNote={selectedBooking.specialNote}
          drivers={dispatchDrivers}
        />
      )}
    </AppDashboardLayout>
  );
};
