'use client';

import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  LinearProgress,
  MenuItem,
  Rating,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import dayjs from 'dayjs';
import {
  RowStack,
  AppNotificationSnackbar,
  DriverTripSchedule,
  bucketForTrip,
  type TripCardData,
} from '../../../../../modules/components';
import {
  pxToRem,
  useDriversApi,
  useGetDriverDetail,
  useGetDriverRatings,
  useGetDriverTrips,
  useGetFleetCompanies,
  useGetFleetVehicles,
  useResolvedApiQuery,
  type AdminDriverDetailResponse,
  type AdminDriverRatingItem,
  type DriverDocumentSummary,
} from '../../../../../../common';
import { AllDriverRow, DriverStatus } from '../../../index';

// ─── Status Config ──────────────────────────────────────────────────────────

const statusChipConfig: Record<
  DriverStatus,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  Available: {
    color: '#059669',
    bg: '#ECFDF5',
    icon: (
      <CheckCircleOutlineIcon
        sx={{ fontSize: pxToRem(11), color: '#059669 !important' }}
      />
    ),
  },
  'On Trip': {
    color: '#3730A3',
    bg: '#EEF2FF',
    icon: (
      <NearMeOutlinedIcon
        sx={{ fontSize: pxToRem(11), color: '#3730A3 !important' }}
      />
    ),
  },
  'Off Duty': {
    color: '#6B7280',
    bg: '#F3F4F6',
    icon: (
      <AccessTimeIcon
        sx={{ fontSize: pxToRem(11), color: '#6B7280 !important' }}
      />
    ),
  },
  Suspended: {
    color: '#EF4444',
    bg: '#FEF2F2',
    icon: (
      <AccessTimeIcon
        sx={{ fontSize: pxToRem(11), color: '#EF4444 !important' }}
      />
    ),
  },
};

// ─── API Helpers ────────────────────────────────────────────────────────────

const DEFAULT_DRIVER_DETAIL: AdminDriverDetailResponse = {
  user_id: '',
  first_name: '',
  last_name: '',
  email: null,
  phone: null,
  avatar_url: null,
  fleet_id: null,
  fleet_name: null,
  account_status: 'active',
  is_online: false,
  is_approved: false,
  rating: 0,
  total_trips: 0,
  specialty: null,
  service_capabilities: [],
  vehicle_type: null,
  vehicle_make: null,
  vehicle_model: null,
  vehicle_year: null,
  vehicle_plate: null,
  vehicle_color: null,
  vehicle_vin: null,
  vehicle_photo_url: null,
  license_number: null,
  license_expiry: null,
  medical_transport_certification: null,
  date_of_birth: null,
  address: null,
  city: null,
  province: null,
  postal_code: null,
  emergency_contact_name: null,
  emergency_contact_phone: null,
  background_check_status: null,
  suspension_reason: null,
  suspended_at: null,
  deactivated_at: null,
  approved_at: null,
  notes: null,
  invited_via_email: null,
  trip_stats: { total_trips: 0, hours_online: 0, average_earnings: 0 },
  documents: [],
  ratings: [],
  suspension_history: [],
  invite_token: null,
  created_at: null,
  updated_at: null,
};

const formatDate = (value?: string | null, fallback = '—') =>
  value ? dayjs(value).format('MMM D, YYYY') : fallback;

const formatMonthYear = (value?: string | null, fallback = '—') =>
  value ? dayjs(value).format('MMM YYYY') : fallback;

const titleCase = (value?: string | null, fallback = '—') => {
  if (!value) return fallback;
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const deriveDocsStatus = (documents: DriverDocumentSummary[]): string => {
  if (!documents.length) return 'No Documents';
  const statuses = documents.map((d) =>
    (d.verification_status || '').toLowerCase()
  );
  if (statuses.some((s) => s === 'expired')) return 'Expired';
  if (statuses.some((s) => s === 'rejected')) return 'Rejected';
  if (
    statuses.every((s) => s === 'verified' || s === 'valid' || s === 'signed')
  ) {
    return 'Complete';
  }
  return 'Pending';
};

const documentChipStyles = (status: string) => {
  const normalized = (status || '').toLowerCase();
  if (
    normalized.includes('verified') ||
    normalized.includes('valid') ||
    normalized.includes('signed')
  ) {
    return { background: '#ECFDF5', color: '#059669' };
  }
  if (normalized.includes('expired') || normalized.includes('rejected')) {
    return { background: '#FEF2F2', color: '#DC2626' };
  }
  return { background: '#FEF3C7', color: '#B45309' };
};

/** Keeps the per-document-type iconography now that the list comes from the API. */
const documentIconFor = (documentType?: string | null) => {
  const normalized = (documentType || '').toLowerCase();
  const sx = { fontSize: 18, color: '#6B7280' };
  if (normalized.includes('license'))
    return <DescriptionOutlinedIcon sx={sx} />;
  if (normalized.includes('background') || normalized.includes('check')) {
    return <VerifiedOutlinedIcon sx={sx} />;
  }
  if (normalized.includes('insurance')) return <GppGoodOutlinedIcon sx={sx} />;
  if (normalized.includes('medical') || normalized.includes('certif')) {
    return <LocalHospitalOutlinedIcon sx={sx} />;
  }
  if (normalized.includes('agreement'))
    return <HandshakeOutlinedIcon sx={sx} />;
  return <DescriptionOutlinedIcon sx={sx} />;
};

const buildRatingBreakdown = (
  ratings: AdminDriverRatingItem[]
): Array<{ stars: number; percent: number }> => {
  const buckets = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 }));
  ratings.forEach((r) => {
    const bucket = buckets.find((b) => b.stars === Math.round(r.rating));
    if (bucket) bucket.count += 1;
  });
  const total = ratings.length || 1;
  return buckets.map((b) => ({
    stars: b.stars,
    percent: Math.round((b.count / total) * 100),
  }));
};

/** Maps a ride-service ride onto the shared trip-schedule card shape. */
const buildTripCards = (tripsResponse: unknown): TripCardData[] => {
  const raw = tripsResponse as any;
  const items = Array.isArray(raw?.rides)
    ? raw.rides
    : Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw?.trips)
        ? raw.trips
        : Array.isArray(raw)
          ? raw
          : [];

  return items.map((ride: any, idx: number) => {
    const scheduledAt = ride.scheduled_at || ride.pickup_at || ride.created_at;
    const fare = ride.final_fare ?? ride.estimated_fare ?? ride.fare;
    const passenger = [ride.passenger_first_name, ride.passenger_last_name]
      .filter(Boolean)
      .join(' ');

    return {
      key: `${ride.id ?? ride.ride_id ?? 'trip'}-${idx}`,
      id: ride.ride_code || (ride.id ? `#${String(ride.id).slice(0, 8)}` : '—'),
      fare: fare != null ? `$${Number(fare).toFixed(2)}` : '—',
      status: ride.status || 'pending',
      rider: passenger || ride.rider_name || ride.passenger_name || 'Rider',
      pickup: ride.pickup_address || ride.pickup || '—',
      dropoff:
        ride.destination_address || ride.dropoff_address || ride.dropoff || '—',
      date: scheduledAt
        ? dayjs(scheduledAt).format('MMM D, YYYY · h:mm A')
        : '—',
      bucket: bucketForTrip(ride.status, scheduledAt),
      sortValue: scheduledAt ? dayjs(scheduledAt).valueOf() : 0,
    };
  });
};

// ─── Fleet & Vehicle Options ────────────────────────────────────────────────

export type InlineFormOption = { id: string; label: string };

// ─── Component ──────────────────────────────────────────────────────────────

type DriverDetailDrawerProps = {
  open: boolean;
  onClose: () => void;
  driver: AllDriverRow | null;
  /** Fired after a mutation succeeds so the roster can refetch. */
  onDriverChanged?: () => void;
};

export const DriverDetailDrawer = ({
  open,
  onClose,
  driver,
  onDriverChanged,
}: DriverDetailDrawerProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showFleetForm, setShowFleetForm] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  // Hooks must run on every render, so the queries sit above the null guard and
  // stay disabled (empty id) until a driver is selected.
  const driverId = driver?.driverId ?? '';

  const { data: detail, isLoading: isLoadingDetail } = useResolvedApiQuery(
    useGetDriverDetail,
    DEFAULT_DRIVER_DETAIL,
    driverId
  );

  const { data: tripsResponse, isFetching: isFetchingTrips } =
    useResolvedApiQuery(
      useGetDriverTrips,
      { rides: [], total: 0, page: 1, limit: 10 } as any,
      {
        driverId: activeTab === 2 ? driverId : '',
        page: 1,
        limit: 50,
        status: 'all',
      }
    );

  const { data: ratingsResponse, isFetching: isFetchingRatings } =
    useResolvedApiQuery(useGetDriverRatings, { items: [] } as any, {
      driverId: activeTab === 3 ? driverId : '',
      limit: 50,
    });

  const { suspendDriver, reassignDriver, updateDriver } = useDriversApi();

  // Fleet/vehicle pickers are only needed once an admin opens the inline form,
  // and the mutations key off ids, so both lists carry the real record id.
  const fleetsQuery = useGetFleetCompanies({ limit: 50, page: 1 });
  const vehiclesQuery = useGetFleetVehicles({ limit: 50, page: 1 });

  const fleetOptions = useMemo<InlineFormOption[]>(
    () =>
      (fleetsQuery.data?.data ?? []).map((fleet: any) => ({
        id: fleet.id,
        label: fleet.name,
      })),
    [fleetsQuery.data]
  );

  const vehicleOptions = useMemo<InlineFormOption[]>(
    () =>
      (vehiclesQuery.data?.data ?? []).map((vehicle: any) => ({
        id: vehicle.id,
        label:
          [vehicle.make, vehicle.model, vehicle.year]
            .filter(Boolean)
            .join(' · ') ||
          vehicle.plate_number ||
          vehicle.id,
      })),
    [vehiclesQuery.data]
  );

  const hasDetail = Boolean(detail && detail.user_id);
  // Memoized so the empty-case literal doesn't re-trigger dependent memos.
  const documents = useMemo<DriverDocumentSummary[]>(
    () => (hasDetail ? (detail.documents ?? []) : []),
    [hasDetail, detail]
  );

  const tripCards = useMemo(
    () => buildTripCards(tripsResponse),
    [tripsResponse]
  );

  const ratingsList = useMemo<AdminDriverRatingItem[]>(() => {
    const raw = ratingsResponse as any;
    const fromEndpoint = Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw?.ratings)
        ? raw.ratings
        : Array.isArray(raw)
          ? raw
          : [];
    if (fromEndpoint.length) return fromEndpoint;
    return hasDetail ? (detail.ratings ?? []) : [];
  }, [ratingsResponse, hasDetail, detail]);

  /**
   * The roster row seeds the drawer so it paints instantly; the detail response
   * fills in the fields the list endpoint doesn't carry.
   */
  const resolvedDriver = useMemo<AllDriverRow | null>(() => {
    if (!driver) return null;
    if (!hasDetail) return driver;
    return {
      ...driver,
      name:
        `${detail.first_name ?? ''} ${detail.last_name ?? ''}`.trim() ||
        driver.name,
      avatar: detail.avatar_url || driver.avatar,
      fleet: detail.fleet_name || driver.fleet,
      phone: detail.phone || '—',
      email: detail.email || '—',
      dateOfBirth: formatDate(detail.date_of_birth),
      memberSince: formatMonthYear(detail.created_at, driver.memberSince),
      license: detail.license_number || '—',
      bgCheck: titleCase(detail.background_check_status),
      licenseExpiry: formatDate(detail.license_expiry),
      docsStatus: deriveDocsStatus(documents),
      capabilities: (detail.service_capabilities ?? []).map((cap) =>
        titleCase(cap)
      ),
      rating: detail.rating ?? driver.rating,
      // trip_stats is counted live off the rides table, so prefer it over the
      // denormalized profile counter, which can drift.
      trips: detail.trip_stats?.total_trips ?? detail.total_trips ?? driver.trips,
    };
  }, [driver, hasDetail, detail, documents]);

  const handleSuspend = async () => {
    if (!driverId || !resolvedDriver) return;
    setIsSubmitting(true);
    const ok = await suspendDriver({
      driverId,
      reason: 'Suspended by admin from driver roster',
    });
    setIsSubmitting(false);
    if (ok) {
      setSnackbar({ open: true, message: `${resolvedDriver.name} suspended` });
      onDriverChanged?.();
    }
  };

  const handleSaveFleet = async () => {
    if (!driverId || !selectedFleet.trim() || !resolvedDriver) return;
    setIsSubmitting(true);
    const ok = await reassignDriver({
      driverId,
      fleet_id: selectedFleet.trim(),
    });
    setIsSubmitting(false);
    if (ok) {
      setSnackbar({
        open: true,
        message: `Fleet assignment updated for ${resolvedDriver.name}`,
      });
      setShowFleetForm(false);
      setSelectedFleet('');
      onDriverChanged?.();
    }
  };

  const handleReassignVehicle = async () => {
    if (!driverId || !selectedVehicle.trim() || !resolvedDriver) return;
    setIsSubmitting(true);
    const ok = await updateDriver({
      driverId,
      vehicle_id: selectedVehicle.trim(),
    });
    setIsSubmitting(false);
    if (ok) {
      setSnackbar({
        open: true,
        message: `Vehicle reassigned for ${resolvedDriver.name}`,
      });
      setShowVehicleForm(false);
      setSelectedVehicle('');
      onDriverChanged?.();
    }
  };

  if (!driver || !resolvedDriver) return null;

  const nameParts = resolvedDriver.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : (nameParts[0]?.charAt(0) ?? '?');

  const statusConfig = statusChipConfig[resolvedDriver.status];

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: '500px',
            boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
            border: 'none',
          },
        }}
      >
        <Stack sx={{ height: '100%', overflow: 'auto' }}>
          {/* ─── Header Section ──────────────────────────────────────── */}
          <Stack
            sx={{
              padding: '24px',
              borderBottom: '1px solid #E8ECF0',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: '#F3F4F6',
                '&:hover': { background: '#E5E7EB' },
              }}
            >
              <CloseIcon sx={{ fontSize: 16, color: '#6B7280' }} />
            </IconButton>

            {/* Avatar + Name + ID */}
            <RowStack spacing={'16px'}>
              <Avatar
                src={resolvedDriver.avatar || undefined}
                alt={resolvedDriver.name}
                sx={{
                  width: 56,
                  height: 56,
                  fontSize: pxToRem(18),
                  fontWeight: 700,
                  background: '#EBF2FF',
                  color: '#2F6FED',
                }}
              >
                {initials}
              </Avatar>
              <Stack spacing={0}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(17),
                    lineHeight: '1.4em',
                    color: '#111827',
                  }}
                >
                  {resolvedDriver.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    lineHeight: '1.5em',
                    color: '#9CA3AF',
                  }}
                >
                  {resolvedDriver.driverId} · Joined {resolvedDriver.joinedDate}
                </Typography>
              </Stack>
            </RowStack>

            {/* Summary Bar */}
            <RowStack
              sx={{
                marginTop: '16px',
                background: '#F7F9FB',
                borderRadius: '14px',
                padding: '12px 16px',
                justifyContent: 'space-between',
              }}
            >
              {/* minWidth: 0 lets long fleet names ellipsize instead of
                  squeezing the status chip out of the bar. */}
              <Stack
                spacing={0}
                alignItems={'center'}
                sx={{ minWidth: 0, maxWidth: '45%' }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(9),
                    letterSpacing: '0.08em',
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                  }}
                >
                  FLEET
                </Typography>
                <Typography
                  noWrap
                  title={resolvedDriver.fleet}
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(12.5),
                    color: '#374151',
                    maxWidth: '100%',
                  }}
                >
                  {resolvedDriver.fleet}
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: '1px',
                  height: '28px',
                  background: '#E8ECF0',
                }}
              />
              <Stack
                spacing={0}
                alignItems={'center'}
                sx={{ minWidth: 0, maxWidth: '35%' }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(9),
                    letterSpacing: '0.08em',
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                  }}
                >
                  VEHICLE
                </Typography>
                <Typography
                  noWrap
                  title={resolvedDriver.vehicle}
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(12.5),
                    color: '#374151',
                    maxWidth: '100%',
                  }}
                >
                  {resolvedDriver.vehicle}
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: '1px',
                  height: '28px',
                  background: '#E8ECF0',
                }}
              />
              <Chip
                icon={statusConfig.icon as React.ReactElement}
                label={resolvedDriver.status}
                size="small"
                sx={{
                  flexShrink: 0,
                  background: statusConfig.bg,
                  color: statusConfig.color,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(11.5),
                  height: '26px',
                  borderRadius: '100px',
                  '& .MuiChip-icon': { marginLeft: '6px' },
                }}
              />
            </RowStack>

            {/* Trip Schedule shortcut — jumps straight to the grouped
                previous / current / upcoming assignment view. */}
            <RowStack
              justifyContent={'center'}
              spacing={'8px'}
              onClick={() => setActiveTab(2)}
              sx={{
                marginTop: '12px',
                height: '40px',
                borderRadius: '10px',
                background: '#EEF3FF',
                border: '0.67px solid #C7D7F9',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                '&:hover': { background: '#E3ECFF' },
              }}
            >
              <CalendarMonthOutlinedIcon
                sx={{ fontSize: 15, color: '#2F6FED' }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#2F6FED',
                }}
              >
                View Trip Schedule
              </Typography>
            </RowStack>
          </Stack>

          {/* ─── Tab Bar ─────────────────────────────────────────────── */}
          <Box sx={{ borderBottom: '1px solid #E8ECF0' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                minHeight: '44px',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#2F6FED',
                  height: '2px',
                },
                '& .MuiTab-root': {
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  textTransform: 'none',
                  color: '#9CA3AF',
                  minHeight: '44px',
                  padding: '12px 16px',
                  '&.Mui-selected': {
                    color: '#2F6FED',
                  },
                },
              }}
            >
              <Tab label="Driver Info" />
              <Tab label="Documents" />
              <Tab label="Trips" />
              <Tab label="Ratings" />
            </Tabs>
          </Box>

          {/* ─── Tab Panels ──────────────────────────────────────────── */}
          <Box sx={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            {/* Tab 0: Driver Info */}
            {activeTab === 0 && (
              <DriverInfoTab
                driver={resolvedDriver}
                isLoading={isLoadingDetail && !hasDetail}
                isSubmitting={isSubmitting}
                fleetOptions={fleetOptions}
                vehicleOptions={vehicleOptions}
                showFleetForm={showFleetForm}
                showVehicleForm={showVehicleForm}
                selectedFleet={selectedFleet}
                selectedVehicle={selectedVehicle}
                onToggleFleetForm={() => {
                  setShowFleetForm(!showFleetForm);
                  setShowVehicleForm(false);
                }}
                onToggleVehicleForm={() => {
                  setShowVehicleForm(!showVehicleForm);
                  setShowFleetForm(false);
                }}
                onFleetChange={setSelectedFleet}
                onVehicleChange={setSelectedVehicle}
                onSaveFleet={handleSaveFleet}
                onReassignVehicle={handleReassignVehicle}
                onSuspend={handleSuspend}
              />
            )}

            {/* Tab 1: Documents */}
            {activeTab === 1 && <DocumentsTab documents={documents} />}

            {/* Tab 2: Trips */}
            {activeTab === 2 && (
              <TripsTab
                driver={resolvedDriver}
                trips={tripCards}
                isLoading={isFetchingTrips}
              />
            )}

            {/* Tab 3: Ratings */}
            {activeTab === 3 && (
              <RatingsTab
                driver={resolvedDriver}
                ratings={ratingsList}
                isLoading={isFetchingRatings}
              />
            )}
          </Box>
        </Stack>
      </Drawer>

      <AppNotificationSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </>
  );
};

// ─── Tab 0: Driver Info ─────────────────────────────────────────────────────

type DriverInfoTabProps = {
  driver: AllDriverRow;
  isLoading: boolean;
  isSubmitting: boolean;
  fleetOptions: InlineFormOption[];
  vehicleOptions: InlineFormOption[];
  showFleetForm: boolean;
  showVehicleForm: boolean;
  selectedFleet: string;
  selectedVehicle: string;
  onToggleFleetForm: () => void;
  onToggleVehicleForm: () => void;
  onFleetChange: (value: string) => void;
  onVehicleChange: (value: string) => void;
  onSaveFleet: () => void;
  onReassignVehicle: () => void;
  onSuspend: () => void;
};

const DriverInfoTab = ({
  driver,
  isLoading,
  isSubmitting,
  fleetOptions,
  vehicleOptions,
  showFleetForm,
  showVehicleForm,
  selectedFleet,
  selectedVehicle,
  onToggleFleetForm,
  onToggleVehicleForm,
  onFleetChange,
  onVehicleChange,
  onSaveFleet,
  onReassignVehicle,
  onSuspend,
}: DriverInfoTabProps) =>
  isLoading ? (
    <Stack alignItems="center" justifyContent="center" sx={{ py: '48px' }}>
      <CircularProgress size={24} sx={{ color: '#2F6FED' }} />
    </Stack>
  ) : (
    <Stack spacing={'24px'}>
      {/* Personal Information */}
      <Stack spacing={'12px'}>
        <SectionLabel>PERSONAL INFORMATION</SectionLabel>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          <InfoCard label="PHONE" value={driver.phone} />
          <InfoCard label="EMAIL" value={driver.email} />
          <InfoCard label="DATE OF BIRTH" value={driver.dateOfBirth} />
          <InfoCard label="MEMBER SINCE" value={driver.memberSince} />
        </Box>
      </Stack>

      {/* Driver Credentials */}
      <Stack spacing={'12px'}>
        <SectionLabel>DRIVER CREDENTIALS</SectionLabel>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          <InfoCard label="LICENSE" value={driver.license} />
          <InfoCard
            label="BG CHECK"
            value={driver.bgCheck}
            valueColor={driver.bgCheck === 'Verified' ? '#059669' : '#D97706'}
          />
          <InfoCard label="LICENSE EXPIRY" value={driver.licenseExpiry} />
          <InfoCard
            label="DOCS STATUS"
            value={driver.docsStatus}
            valueColor={
              driver.docsStatus === 'Complete' ? '#059669' : '#D97706'
            }
          />
        </Box>
      </Stack>

      {/* Service Capabilities */}
      {driver.capabilities.length > 0 && (
        <Stack spacing={'12px'}>
          <SectionLabel>SERVICE CAPABILITIES</SectionLabel>
          <RowStack spacing={'8px'} sx={{ flexWrap: 'wrap' }}>
            {driver.capabilities.map((cap) => (
              <Chip
                key={cap}
                label={cap}
                size="small"
                sx={{
                  background: '#EEF3FF',
                  border: '1px solid #C7D7F9',
                  color: '#2F6FED',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(12),
                  height: '30px',
                  borderRadius: '100px',
                }}
              />
            ))}
          </RowStack>
        </Stack>
      )}

      {/* Admin Actions */}
      <Stack spacing={'10px'}>
        <SectionLabel>ADMIN ACTIONS</SectionLabel>

        {/* Change Fleet Assignment */}
        <ActionButton
          icon={<SwapHorizIcon sx={{ fontSize: 16, color: '#6B7280' }} />}
          label="Change Fleet Assignment"
          onClick={onToggleFleetForm}
          variant="default"
        />
        {showFleetForm && (
          <InlineForm
            title="Change Fleet Assignment"
            value={selectedFleet}
            onChange={onFleetChange}
            options={fleetOptions}
            onCancel={onToggleFleetForm}
            onSave={onSaveFleet}
            saveLabel="Save Fleet"
            placeholder="Select fleet..."
          />
        )}

        {/* Reassign Vehicle */}
        <ActionButton
          icon={
            <DirectionsCarOutlinedIcon
              sx={{ fontSize: 16, color: '#6B7280' }}
            />
          }
          label="Reassign Vehicle"
          onClick={onToggleVehicleForm}
          variant="default"
        />
        {showVehicleForm && (
          <InlineForm
            title="Reassign Vehicle"
            value={selectedVehicle}
            onChange={onVehicleChange}
            options={vehicleOptions}
            onCancel={onToggleVehicleForm}
            onSave={onReassignVehicle}
            saveLabel="Reassign"
            placeholder="Select vehicle..."
          />
        )}

        {/* Suspend Driver */}
        <ActionButton
          icon={<BlockOutlinedIcon sx={{ fontSize: 16, color: '#EF4444' }} />}
          label={isSubmitting ? 'Working...' : 'Suspend Driver'}
          onClick={isSubmitting ? undefined : onSuspend}
          variant="danger"
        />
      </Stack>
    </Stack>
  );

// ─── Tab 1: Documents ───────────────────────────────────────────────────────

const DocumentsTab = ({
  documents,
}: {
  documents: DriverDocumentSummary[];
}) => (
  <Stack spacing={'12px'}>
    <SectionLabel>DOCUMENT STATUS</SectionLabel>
    {documents.length ? (
      documents.map((doc) => {
        const chip = documentChipStyles(doc.verification_status);
        return (
          <RowStack
            key={doc.id}
            sx={{
              background: '#F7F9FB',
              border: '1px solid #E8ECF0',
              borderRadius: '14px',
              padding: '14px 16px',
              justifyContent: 'space-between',
            }}
          >
            <RowStack spacing={'12px'} sx={{ minWidth: 0 }}>
              {documentIconFor(doc.document_type)}
              <Stack spacing={0} sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(13),
                    color: '#374151',
                  }}
                >
                  {titleCase(doc.document_type)}
                </Typography>
                {doc.expires_at && (
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11),
                      color: '#9CA3AF',
                    }}
                  >
                    Expires {formatDate(doc.expires_at)}
                  </Typography>
                )}
              </Stack>
            </RowStack>
            <Chip
              label={titleCase(doc.verification_status)}
              size="small"
              sx={{
                flexShrink: 0,
                background: chip.background,
                color: chip.color,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(11),
                height: '24px',
                borderRadius: '100px',
              }}
            />
          </RowStack>
        );
      })
    ) : (
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12),
          color: '#9CA3AF',
          textAlign: 'center',
          py: '24px',
        }}
      >
        No documents uploaded yet.
      </Typography>
    )}
  </Stack>
);

// ─── Tab 2: Trips ───────────────────────────────────────────────────────────

const TripsTab = ({
  driver,
  trips,
  isLoading,
}: {
  driver: AllDriverRow;
  trips: TripCardData[];
  isLoading: boolean;
}) => {
  return (
    <Stack spacing={'16px'}>
      <RowStack spacing={'10px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(10),
            letterSpacing: '0.08em',
            color: '#9CA3AF',
            textTransform: 'uppercase',
          }}
        >
          TRIP SCHEDULE
        </Typography>
        <Chip
          label={`${driver.trips} total`}
          size="small"
          sx={{
            background: '#EEF3FF',
            color: '#2F6FED',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(11),
            height: '22px',
            borderRadius: '100px',
          }}
        />
      </RowStack>

      <DriverTripSchedule trips={trips} isLoading={isLoading} />
    </Stack>
  );
};

// ─── Tab 3: Ratings ─────────────────────────────────────────────────────────

const RatingsTab = ({
  driver,
  ratings,
  isLoading,
}: {
  driver: AllDriverRow;
  ratings: AdminDriverRatingItem[];
  isLoading: boolean;
}) => {
  const breakdown = buildRatingBreakdown(ratings);

  return (
    <Stack spacing={'24px'}>
      {/* Rating Breakdown */}
      <Stack spacing={'12px'}>
        <RowStack justifyContent={'space-between'}>
          <SectionLabel>RATING BREAKDOWN</SectionLabel>
          {isLoading && (
            <CircularProgress size={14} sx={{ color: '#9CA3AF' }} />
          )}
        </RowStack>

        {/* Overall Rating Card */}
        <Stack
          sx={{
            background: '#F7F9FB',
            border: '1px solid #EAECF0',
            borderRadius: '16px',
            padding: '20px',
            alignItems: 'center',
          }}
          spacing={'8px'}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 800,
              fontSize: pxToRem(44),
              lineHeight: '1em',
              color: '#111827',
            }}
          >
            {(driver.rating || 0).toFixed(1)}
          </Typography>
          <Rating
            value={driver.rating || 0}
            readOnly
            precision={0.1}
            icon={<StarIcon sx={{ fontSize: 22, color: '#F59E0B' }} />}
            emptyIcon={<StarIcon sx={{ fontSize: 22, color: '#E5E7EB' }} />}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#9CA3AF',
            }}
          >
            {ratings.length} ratings
          </Typography>
        </Stack>

        {/* Star Distribution */}
        <Stack spacing={'6px'} sx={{ marginTop: '4px' }}>
          {breakdown.map((row) => (
            <RowStack key={row.stars} spacing={'10px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                  width: '12px',
                  textAlign: 'right',
                }}
              >
                {row.stars}
              </Typography>
              <StarIcon sx={{ fontSize: 13, color: '#F59E0B' }} />
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={row.percent}
                  sx={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: '#F0F2F5',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#F59E0B',
                      borderRadius: '4px',
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                  width: '32px',
                  textAlign: 'right',
                }}
              >
                {row.percent}%
              </Typography>
            </RowStack>
          ))}
        </Stack>
      </Stack>

      {/* Recent Comments — the API exposes per-ride ratings, not per-category
          scores, so this replaces the old category breakdown. */}
      {ratings.length ? (
        <Stack spacing={'12px'}>
          <SectionLabel>RECENT COMMENTS</SectionLabel>
          {ratings.slice(0, 5).map((rating, idx) => (
            <Stack
              key={`${rating.ride_id}-${idx}`}
              spacing={'6px'}
              sx={{
                background: '#F7F9FB',
                border: '1px solid #F0F2F5',
                borderRadius: '14px',
                padding: '12px 16px',
              }}
            >
              <RowStack justifyContent={'space-between'}>
                <Rating
                  value={rating.rating}
                  readOnly
                  precision={0.5}
                  size="small"
                  icon={<StarIcon sx={{ fontSize: 12, color: '#F59E0B' }} />}
                  emptyIcon={
                    <StarIcon sx={{ fontSize: 12, color: '#E5E7EB' }} />
                  }
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(10.5),
                    color: '#9CA3AF',
                  }}
                >
                  {formatDate(rating.created_at)}
                </Typography>
              </RowStack>
              {rating.comment && (
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#374151',
                  }}
                >
                  {rating.comment}
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
      ) : (
        !isLoading && (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#9CA3AF',
              textAlign: 'center',
              py: '8px',
            }}
          >
            No ratings yet.
          </Typography>
        )
      )}
    </Stack>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(10),
      lineHeight: '1.5em',
      letterSpacing: '0.08em',
      color: '#9CA3AF',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </Typography>
);

const InfoCard = ({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) => (
  <Stack
    sx={{
      background: '#F7F9FB',
      borderRadius: '14px',
      padding: '12px 14px',
    }}
    spacing={'2px'}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(9),
        letterSpacing: '0.08em',
        color: '#9CA3AF',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13),
        color: valueColor || '#374151',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

const ActionButton = ({
  icon,
  label,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: 'default' | 'danger';
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      background: variant === 'danger' ? '#FEF2F2' : '#FFFFFF',
      border: `1px solid ${variant === 'danger' ? '#FECACA' : '#E8ECF0'}`,
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      '&:hover': {
        background: variant === 'danger' ? '#FEE2E2' : '#F9FAFB',
      },
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13),
        color: variant === 'danger' ? '#EF4444' : '#374151',
      }}
    >
      {label}
    </Typography>
  </Box>
);

const InlineForm = ({
  title,
  value,
  onChange,
  options,
  onCancel,
  onSave,
  saveLabel,
  placeholder,
}: {
  title: string;
  value: string;
  onChange: (val: string) => void;
  /** Value carries the record id — the mutations need UUIDs, not names. */
  options: InlineFormOption[];
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
  placeholder: string;
}) => (
  <Stack
    sx={{
      background: '#F7F9FB',
      border: '1px solid #E8ECF0',
      borderRadius: '14px',
      padding: '16px',
    }}
    spacing={'12px'}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13),
        color: '#374151',
      }}
    >
      {title}
    </Typography>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      displayEmpty
      size="small"
      sx={{
        background: '#FFFFFF',
        borderRadius: '10px',
        fontFamily: 'Inter, sans-serif',
        fontSize: pxToRem(13),
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E8ECF0',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#C7D7F9',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#2F6FED',
        },
      }}
    >
      <MenuItem value="" disabled>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: pxToRem(13),
            color: '#9CA3AF',
          }}
        >
          {placeholder}
        </Typography>
      </MenuItem>
      {options.map((opt) => (
        <MenuItem
          key={opt.id}
          value={opt.id}
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: pxToRem(13),
          }}
        >
          {opt.label}
        </MenuItem>
      ))}
    </Select>
    <RowStack spacing={'8px'} justifyContent={'flex-end'}>
      <Box
        onClick={onCancel}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '36px',
          padding: '0 16px',
          background: '#FFFFFF',
          border: '1px solid #E8ECF0',
          borderRadius: '8px',
          cursor: 'pointer',
          '&:hover': { background: '#F9FAFB' },
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: '#6B7280',
          }}
        >
          Cancel
        </Typography>
      </Box>
      <Box
        onClick={onSave}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '36px',
          padding: '0 16px',
          background: '#2F6FED',
          borderRadius: '8px',
          cursor: 'pointer',
          '&:hover': { opacity: 0.9 },
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: '#FFFFFF',
          }}
        >
          {saveLabel}
        </Typography>
      </Box>
    </RowStack>
  </Stack>
);
