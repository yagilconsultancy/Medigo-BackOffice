'use client';

import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  MenuItem,
  Rating,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ForwardToInboxOutlinedIcon from '@mui/icons-material/ForwardToInboxOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import dayjs from 'dayjs';
import {
  pxToRem,
  useDriversApi,
  useGetDriverDetail,
  useGetDriverRatings,
  useGetDriverTrips,
  useGetAllFleetCompanies,
  useGetFleetVehicles,
  useResolvedApiQuery,
  type AdminDriverDetailResponse,
  type AdminDriverRatingItem,
  type DriverDocumentSummary,
  type FleetCompanyDetailResponse,
  type VehicleResponse,
} from '../../../../../../common';
import {
  RowStack,
  DriverTripSchedule,
  bucketForTrip,
  type TripCardData,
} from '../../../../../modules/components';
import { TripDetailModal } from '../TripDetailModal';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DriverSeed = {
  driverId: string;
  name: string;
  avatar?: string;
  fleet?: string;
  vehicle?: string;
  status?: string;
  joinedDate?: string;
};

export type DriverViewDrawerProps = {
  open: boolean;
  onClose: () => void;
  driverId: string | null;
  seed?: DriverSeed | null;
};

// ─── Default Detail ─────────────────────────────────────────────────────────

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

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const normalizeStatus = (status?: string | null): string => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'suspended') return 'Suspended';
  if (normalized === 'on_trip' || normalized === 'on trip') return 'On Trip';
  return 'Available';
};

const buildVehicleLabel = (detail: AdminDriverDetailResponse): string => {
  const parts = [
    detail.vehicle_make,
    detail.vehicle_model,
    detail.vehicle_year ? String(detail.vehicle_year) : null,
  ].filter(Boolean);
  const label = parts.join(' ').trim();
  return label || detail.vehicle_type || '—';
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

const buildRatingBreakdown = (
  ratings: AdminDriverRatingItem[]
): Array<{ stars: number; percent: number }> => {
  const buckets = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 }));
  ratings.forEach((r) => {
    const rounded = Math.round(r.rating);
    const bucket = buckets.find((b) => b.stars === rounded);
    if (bucket) bucket.count += 1;
  });
  const total = ratings.length || 1;
  return buckets.map((b) => ({
    stars: b.stars,
    percent: Math.round((b.count / total) * 100),
  }));
};

// ─── Status Badge Config ────────────────────────────────────────────────────

const statusBadgeConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Available: { color: '#166534', bg: '#EDFAF4', border: '#BBF7D0' },
  'On Trip': { color: '#3730A3', bg: '#EEF2FF', border: '#C7D2FE' },
  Suspended: { color: '#991B1B', bg: '#FEF2F2', border: '#FECACA' },
};

// ─── Document Status Chip ───────────────────────────────────────────────────

const documentChipStyles = (status: string) => {
  const normalized = status.toLowerCase();
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

// ─── Reusable Section Label ─────────────────────────────────────────────────

const SectionLabel = ({ text }: { text: string }) => (
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
    {text}
  </Typography>
);

// ─── Reusable Read-Only Field ───────────────────────────────────────────────

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <Stack
    spacing={'6px'}
    sx={{
      background: '#F7F9FB',
      border: '0.67px solid #F0F2F5',
      borderRadius: '14px',
      padding: '12px 16px',
    }}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(10.5),
        letterSpacing: '0.04em',
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
        fontSize: pxToRem(13.5),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

// ─── Reusable Document Row ──────────────────────────────────────────────────

const DocumentRow = ({ name, status }: { name: string; status: string }) => {
  const chip = documentChipStyles(status);
  return (
    <RowStack
      justifyContent={'space-between'}
      sx={{
        background: '#F7F9FB',
        border: '0.67px solid #F0F2F5',
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <RowStack spacing={'12px'}>
        <DescriptionOutlinedIcon sx={{ fontSize: 15, color: '#9CA3AF' }} />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {name}
        </Typography>
      </RowStack>
      <Chip
        label={titleCase(status)}
        size="small"
        sx={{
          background: chip.background,
          color: chip.color,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: pxToRem(11.5),
          height: '22px',
          borderRadius: '100px',
        }}
      />
    </RowStack>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

export const DriverViewDrawer = ({
  open,
  onClose,
  driverId,
  seed,
}: DriverViewDrawerProps) => {
  // ─── Hooks (all at top) ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(0);
  // Ride whose detail modal is stacked over this drawer, so the admin keeps
  // their place in the driver record while reviewing trips.
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [expandedAction, setExpandedAction] = useState<
    'fleet' | 'vehicle' | 'suspend' | null
  >(null);
  const [selectedFleetId, setSelectedFleetId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const resolvedDriverId = driverId ?? '';

  const {
    data: detail,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useResolvedApiQuery(
    useGetDriverDetail,
    DEFAULT_DRIVER_DETAIL,
    resolvedDriverId
  );

  const { data: tripsResponse, isFetching: isFetchingTrips } =
    useResolvedApiQuery(
      useGetDriverTrips,
      { rides: [], total: 0, page: 1, limit: 10 } as any,
      {
        driverId: activeTab === 2 ? resolvedDriverId : '',
        page: 1,
        limit: 50,
        // Past, current and upcoming assignments in one call so the schedule
        // view can group them without three round-trips.
        status: 'all',
      }
    );

  const { data: ratingsResponse, isFetching: isFetchingRatings } =
    useResolvedApiQuery(useGetDriverRatings, { items: [] } as any, {
      driverId: activeTab === 3 ? resolvedDriverId : '',
      limit: 50,
    });

  const {
    suspendDriver,
    reactivateDriver,
    reassignDriver,
    updateDriver,
    resendDriverInvite,
  } = useDriversApi();

  // ─── Derived values ──────────────────────────────────────────────────────
  const hasDetail = Boolean(detail && detail.user_id);

  const fullName = useMemo(() => {
    if (hasDetail) {
      return `${detail.first_name ?? ''} ${detail.last_name ?? ''}`.trim();
    }
    return seed?.name ?? '';
  }, [hasDetail, detail, seed]);

  const avatar = hasDetail ? detail.avatar_url || '' : seed?.avatar || '';
  const joinedLabel = hasDetail
    ? formatMonthYear(detail.created_at)
    : (seed?.joinedDate ?? '—');
  const fleetLabel = hasDetail
    ? detail.fleet_name || '—'
    : (seed?.fleet ?? '—');
  const vehicleLabel = hasDetail
    ? buildVehicleLabel(detail)
    : (seed?.vehicle ?? '—');
  const statusLabel = normalizeStatus(
    hasDetail ? detail.account_status : seed?.status
  );
  const isCurrentlySuspended = statusLabel === 'Suspended';

  const nameParts = fullName ? fullName.split(' ') : [];
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : (nameParts[0]?.charAt(0) ?? '?');

  const badge = statusBadgeConfig[statusLabel] || statusBadgeConfig.Available;

  const capabilities = hasDetail ? (detail.service_capabilities ?? []) : [];
  const documents = hasDetail ? (detail.documents ?? []) : [];
  const tripStats = hasDetail
    ? detail.trip_stats
    : { total_trips: 0, hours_online: 0, average_earnings: 0 };
  const overallRating = hasDetail ? (detail.rating ?? 0) : 0;

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

  const ratingBreakdown = useMemo(
    () => buildRatingBreakdown(ratingsList),
    [ratingsList]
  );

  const tripCards = useMemo<TripCardData[]>(() => {
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
      const scheduledAt =
        ride.scheduled_at || ride.pickup_at || ride.created_at;
      const fare = ride.final_fare ?? ride.estimated_fare ?? ride.fare;
      const passenger = [ride.passenger_first_name, ride.passenger_last_name]
        .filter(Boolean)
        .join(' ');

      return {
        key: `${ride.id ?? ride.ride_id ?? 'trip'}-${idx}`,
        // Keep the raw uuid — `id` below is display-only and can't be looked up.
        rideId: ride.id ?? ride.ride_id ?? undefined,
        id:
          ride.ride_code || (ride.id ? `#${String(ride.id).slice(0, 8)}` : '—'),
        fare: fare != null ? `$${Number(fare).toFixed(2)}` : '—',
        status: ride.status || 'pending',
        rider: passenger || ride.rider_name || ride.passenger_name || 'Rider',
        pickup: ride.pickup_address || ride.pickup || '—',
        dropoff:
          ride.destination_address ||
          ride.dropoff_address ||
          ride.dropoff ||
          '—',
        date: scheduledAt
          ? dayjs(scheduledAt).format('MMM D, YYYY · h:mm A')
          : '—',
        bucket: bucketForTrip(ride.status, scheduledAt),
        sortValue: scheduledAt ? dayjs(scheduledAt).valueOf() : 0,
      };
    });
  }, [tripsResponse]);

  // Fleets and vehicles for the admin-action pickers. Typing a raw UUID was
  // the only way to reassign either of these before.
  const { data: fleetCompanies } = useResolvedApiQuery(
    useGetAllFleetCompanies,
    [] as FleetCompanyDetailResponse[]
  );
  const vehiclesQuery = useGetFleetVehicles({ page: 1, limit: 100 });
  const assignableVehicles: VehicleResponse[] = useMemo(() => {
    const all = vehiclesQuery.data?.data ?? [];
    // Only vehicles belonging to this driver's fleet can be assigned.
    return detail.fleet_id
      ? all.filter((v) => v.business_id === detail.fleet_id)
      : all;
  }, [vehiclesQuery.data, detail.fleet_id]);

  // ─── Mutation handlers ───────────────────────────────────────────────────
  const handleChangeFleet = async () => {
    if (!resolvedDriverId || !selectedFleetId.trim()) return;
    setIsSubmittingAction(true);
    const ok = await reassignDriver({
      driverId: resolvedDriverId,
      fleet_id: selectedFleetId.trim(),
    });
    setIsSubmittingAction(false);
    if (ok) {
      setExpandedAction(null);
      setSelectedFleetId('');
    }
  };

  const handleReassignVehicle = async () => {
    if (!resolvedDriverId || !selectedVehicleId.trim()) return;
    setIsSubmittingAction(true);
    const ok = await updateDriver({
      driverId: resolvedDriverId,
      vehicle_id: selectedVehicleId.trim(),
    });
    setIsSubmittingAction(false);
    if (ok) {
      setExpandedAction(null);
      setSelectedVehicleId('');
    }
  };

  const handleSuspend = async () => {
    if (!resolvedDriverId || !suspendReason.trim()) return;
    setIsSubmittingAction(true);
    const ok = await suspendDriver({
      driverId: resolvedDriverId,
      reason: suspendReason.trim(),
    });
    setIsSubmittingAction(false);
    if (ok) {
      setExpandedAction(null);
      setSuspendReason('');
    }
  };

  const handleReactivate = async () => {
    if (!resolvedDriverId) return;
    setIsSubmittingAction(true);
    await reactivateDriver({ driverId: resolvedDriverId });
    setIsSubmittingAction(false);
  };

  const handleResendInvite = async () => {
    if (!resolvedDriverId) return;
    setIsSubmittingAction(true);
    await resendDriverInvite({ driverId: resolvedDriverId });
    setIsSubmittingAction(false);
  };

  if (!driverId) return null;

  const isInitialLoading = isLoadingDetail && !hasDetail;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 500,
            boxShadow: '-4px 0px 48px rgba(0, 0, 0, 0.14)',
          },
        }}
      >
        {/* ─── Sticky Header ──────────────────────────────────────────── */}
        <Stack
          sx={{
            padding: '20px 24px 0',
            borderBottom: '0.67px solid #F0F4F8',
          }}
          spacing={'16px'}
        >
          <RowStack justifyContent={'space-between'}>
            <RowStack spacing={'12px'}>
              <Avatar
                src={avatar || undefined}
                alt={fullName}
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
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(17),
                    color: '#111827',
                    lineHeight: '1.5em',
                  }}
                >
                  {fullName || '—'}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#9CA3AF',
                    lineHeight: '1.5em',
                  }}
                >
                  {resolvedDriverId.slice(0, 8)} · Joined {joinedLabel}
                </Typography>
              </Stack>
            </RowStack>
            <IconButton
              onClick={onClose}
              sx={{
                width: 30,
                height: 30,
                background: '#F3F4F6',
                border: '0.67px solid #E5E7EB',
                borderRadius: '8px',
                '&:hover': { background: '#E5E7EB' },
              }}
            >
              <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
            </IconButton>
          </RowStack>

          {/* Fleet / Vehicle Card */}
          <Box
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #F0F2F5',
              borderRadius: '14px',
              padding: '12px 16px',
            }}
          >
            <RowStack spacing={'16px'}>
              {/* minWidth: 0 lets long fleet names ellipsize instead of pushing
                the status chip off the card. */}
              <Stack spacing={'2px'} sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(10),
                    letterSpacing: '0.04em',
                    color: '#9CA3AF',
                  }}
                >
                  FLEET
                </Typography>
                <Typography
                  noWrap
                  title={fleetLabel}
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(12.5),
                    color: '#374151',
                  }}
                >
                  {fleetLabel}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: '#E5E7EB' }}
              />
              <Stack spacing={'2px'} sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(10),
                    letterSpacing: '0.04em',
                    color: '#9CA3AF',
                  }}
                >
                  VEHICLE
                </Typography>
                <Typography
                  noWrap
                  title={vehicleLabel}
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(12.5),
                    color: '#374151',
                  }}
                >
                  {vehicleLabel}
                </Typography>
              </Stack>
              <Chip
                label={statusLabel}
                size="small"
                sx={{
                  flexShrink: 0,
                  background: badge.bg,
                  color: badge.color,
                  border: `0.67px solid ${badge.border}`,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: pxToRem(11.5),
                  height: '24px',
                  borderRadius: '100px',
                }}
              />
            </RowStack>
          </Box>

          {/* Trip Schedule shortcut — jumps straight to the grouped
            previous / current / upcoming assignment view. */}
          <RowStack
            justifyContent={'center'}
            spacing={'8px'}
            onClick={() => setActiveTab(2)}
            sx={{
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

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="fullWidth"
            sx={{
              minHeight: 'unset',
              '& .MuiTabs-indicator': {
                height: 2,
                backgroundColor: '#2F6FED',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: pxToRem(12.5),
                fontWeight: 600,
                color: '#9CA3AF',
                minHeight: '41px',
                padding: '10px 0',
                '&.Mui-selected': { color: '#2F6FED' },
              },
            }}
          >
            <Tab label="Driver Info" />
            <Tab label="Documents" />
            <Tab label="Trips" />
            <Tab label="Ratings" />
          </Tabs>
        </Stack>

        {/* ─── Scrollable Content ─────────────────────────────────────── */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            '::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}
        >
          {isInitialLoading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ py: '48px' }}
            >
              <CircularProgress size={24} sx={{ color: '#2F6FED' }} />
            </Stack>
          ) : (
            <>
              {/* ═══ Tab 0: Driver Info ════════════════════════════════════ */}
              {activeTab === 0 && (
                <Stack spacing={'20px'}>
                  {/* Personal Information */}
                  <Stack spacing={'10px'}>
                    <SectionLabel text="Personal Information" />
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                      }}
                    >
                      <ReadOnlyField
                        label="Phone"
                        value={detail.phone || '—'}
                      />
                      <ReadOnlyField
                        label="Email"
                        value={detail.email || '—'}
                      />
                      <ReadOnlyField
                        label="Date of Birth"
                        value={formatDate(detail.date_of_birth)}
                      />
                      <ReadOnlyField
                        label="Member Since"
                        value={formatMonthYear(detail.created_at)}
                      />
                      <ReadOnlyField
                        label="Gender"
                        value={titleCase(detail.gender)}
                      />
                      <ReadOnlyField
                        label="Account Status"
                        value={titleCase(detail.account_status)}
                      />
                    </Box>
                  </Stack>

                  {/* Contact & Address — returned by the API all along but
                      never shown, so an admin had no way to check them. */}
                  <Stack spacing={'10px'}>
                    <SectionLabel text="Contact & Address" />
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                      }}
                    >
                      <ReadOnlyField
                        label="Emergency Contact"
                        value={detail.emergency_contact_name || '—'}
                      />
                      <ReadOnlyField
                        label="Emergency Phone"
                        value={detail.emergency_contact_phone || '—'}
                      />
                      <ReadOnlyField
                        label="Address"
                        value={detail.address || '—'}
                      />
                      <ReadOnlyField label="City" value={detail.city || '—'} />
                      <ReadOnlyField
                        label="Province"
                        value={detail.province || '—'}
                      />
                      <ReadOnlyField
                        label="Postal Code"
                        value={detail.postal_code || '—'}
                      />
                    </Box>
                    {detail.notes ? (
                      <ReadOnlyField
                        label="Internal Notes"
                        value={detail.notes}
                      />
                    ) : null}
                  </Stack>

                  {/* Driver Credentials */}
                  <Stack spacing={'10px'}>
                    <SectionLabel text="Driver Credentials" />
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                      }}
                    >
                      <ReadOnlyField
                        label="License"
                        value={detail.license_number || '—'}
                      />
                      <ReadOnlyField
                        label="BG Check"
                        value={titleCase(detail.background_check_status)}
                      />
                      <ReadOnlyField
                        label="License Expiry"
                        value={formatDate(detail.license_expiry)}
                      />
                      <ReadOnlyField
                        label="Docs Status"
                        value={deriveDocsStatus(documents)}
                      />
                    </Box>
                  </Stack>

                  {/* Service Capabilities */}
                  <Stack spacing={'10px'}>
                    <SectionLabel text="Service Capabilities" />
                    {capabilities.length ? (
                      <RowStack spacing={'8px'} flexWrap="wrap">
                        {capabilities.map((cap) => (
                          <Chip
                            key={cap}
                            icon={
                              <CheckCircleOutlinedIcon
                                sx={{
                                  fontSize: 11,
                                  color: '#2F6FED !important',
                                }}
                              />
                            }
                            label={titleCase(cap)}
                            size="small"
                            sx={{
                              background: '#EEF3FF',
                              color: '#2F6FED',
                              border: '0.67px solid #C7D7F9',
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 600,
                              fontSize: pxToRem(12),
                              height: '28px',
                              borderRadius: '100px',
                              '& .MuiChip-icon': { marginLeft: '8px' },
                            }}
                          />
                        ))}
                      </RowStack>
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          color: '#9CA3AF',
                        }}
                      >
                        No capabilities recorded
                      </Typography>
                    )}
                  </Stack>

                  {/* Admin Actions */}
                  <Stack spacing={'10px'}>
                    <SectionLabel text="Admin Actions" />
                    <Stack spacing={'8px'}>
                      {/* Change Fleet Assignment */}
                      {expandedAction === 'fleet' ? (
                        <Stack
                          spacing={'16px'}
                          sx={{
                            background: '#F7F9FB',
                            border: '0.67px solid #E8ECF0',
                            borderRadius: '14px',
                            padding: '16px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(12),
                              color: '#374151',
                            }}
                          >
                            Change Fleet Assignment
                          </Typography>
                          <Select
                            value={selectedFleetId}
                            onChange={(e) => setSelectedFleetId(e.target.value)}
                            displayEmpty
                            size="small"
                            sx={{
                              background: '#F9FAFB',
                              borderRadius: '10px',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: pxToRem(13),
                            }}
                          >
                            <MenuItem value="" disabled>
                              Select a fleet
                            </MenuItem>
                            {fleetCompanies.map((company) => (
                              <MenuItem
                                key={company.id}
                                value={company.id}
                                sx={{ fontSize: pxToRem(13) }}
                              >
                                {company.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <RowStack spacing={'8px'}>
                            <Box
                              onClick={() => {
                                setExpandedAction(null);
                                setSelectedFleetId('');
                              }}
                              sx={{
                                flex: 1,
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                background: '#FFFFFF',
                                border: '0.67px solid #E5E7EB',
                                cursor: 'pointer',
                                '&:hover': { background: '#F9FAFB' },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 600,
                                  fontSize: pxToRem(12),
                                  color: '#374151',
                                }}
                              >
                                Cancel
                              </Typography>
                            </Box>
                            <Box
                              onClick={
                                isSubmittingAction
                                  ? undefined
                                  : handleChangeFleet
                              }
                              sx={{
                                flex: 1,
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                background: '#2F6FED',
                                cursor: isSubmittingAction ? 'wait' : 'pointer',
                                opacity: isSubmittingAction ? 0.7 : 1,
                                '&:hover': { background: '#2760D4' },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 600,
                                  fontSize: pxToRem(12),
                                  color: '#FFFFFF',
                                }}
                              >
                                {isSubmittingAction
                                  ? 'Saving...'
                                  : 'Save Fleet'}
                              </Typography>
                            </Box>
                          </RowStack>
                        </Stack>
                      ) : (
                        <ActionButton
                          icon={
                            <SwapHorizOutlinedIcon
                              sx={{ fontSize: 13, color: '#374151' }}
                            />
                          }
                          label="Change Fleet Assignment"
                          variant="default"
                          onClick={() => {
                            setExpandedAction('fleet');
                            setSelectedFleetId('');
                          }}
                        />
                      )}

                      {/* Reassign Vehicle */}
                      {expandedAction === 'vehicle' ? (
                        <Stack
                          spacing={'16px'}
                          sx={{
                            background: '#F7F9FB',
                            border: '0.67px solid #E8ECF0',
                            borderRadius: '14px',
                            padding: '16px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(12),
                              color: '#374151',
                            }}
                          >
                            Reassign Vehicle
                          </Typography>
                          <Select
                            value={selectedVehicleId}
                            onChange={(e) =>
                              setSelectedVehicleId(e.target.value)
                            }
                            displayEmpty
                            size="small"
                            sx={{
                              background: '#F9FAFB',
                              borderRadius: '10px',
                              fontFamily: 'Inter, sans-serif',
                              fontSize: pxToRem(13),
                            }}
                          >
                            <MenuItem value="" disabled>
                              {assignableVehicles.length
                                ? 'Select a vehicle'
                                : 'No vehicles in this fleet'}
                            </MenuItem>
                            {assignableVehicles.map((vehicle) => (
                              <MenuItem
                                key={vehicle.id}
                                value={vehicle.id}
                                sx={{ fontSize: pxToRem(13) }}
                              >
                                {[vehicle.make, vehicle.model]
                                  .filter(Boolean)
                                  .join(' ')}
                                {vehicle.plate_number
                                  ? ` (${vehicle.plate_number})`
                                  : ''}
                              </MenuItem>
                            ))}
                          </Select>
                          <RowStack spacing={'8px'}>
                            <Box
                              onClick={() => {
                                setExpandedAction(null);
                                setSelectedVehicleId('');
                              }}
                              sx={{
                                flex: 1,
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                background: '#FFFFFF',
                                border: '0.67px solid #E5E7EB',
                                cursor: 'pointer',
                                '&:hover': { background: '#F9FAFB' },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 600,
                                  fontSize: pxToRem(12),
                                  color: '#374151',
                                }}
                              >
                                Cancel
                              </Typography>
                            </Box>
                            <Box
                              onClick={
                                isSubmittingAction
                                  ? undefined
                                  : handleReassignVehicle
                              }
                              sx={{
                                flex: 1,
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                background: '#2F6FED',
                                cursor: isSubmittingAction ? 'wait' : 'pointer',
                                opacity: isSubmittingAction ? 0.7 : 1,
                                '&:hover': { background: '#2760D4' },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 600,
                                  fontSize: pxToRem(12),
                                  color: '#FFFFFF',
                                }}
                              >
                                {isSubmittingAction ? 'Saving...' : 'Reassign'}
                              </Typography>
                            </Box>
                          </RowStack>
                        </Stack>
                      ) : (
                        <ActionButton
                          icon={
                            <DirectionsCarOutlinedIcon
                              sx={{ fontSize: 13, color: '#374151' }}
                            />
                          }
                          label="Reassign Vehicle"
                          variant="default"
                          onClick={() => {
                            setExpandedAction('vehicle');
                            setSelectedVehicleId('');
                          }}
                        />
                      )}

                      {/* Suspend / Reactivate */}
                      {isCurrentlySuspended ? (
                        <ActionButton
                          icon={
                            <CheckCircleOutlineIcon
                              sx={{ fontSize: 13, color: '#059669' }}
                            />
                          }
                          label={
                            isSubmittingAction
                              ? 'Reactivating...'
                              : 'Reactivate Driver'
                          }
                          variant="success"
                          onClick={
                            isSubmittingAction ? undefined : handleReactivate
                          }
                        />
                      ) : expandedAction === 'suspend' ? (
                        <Stack
                          spacing={'16px'}
                          sx={{
                            background: '#FEF2F2',
                            border: '0.67px solid #FECACA',
                            borderRadius: '14px',
                            padding: '16px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(12),
                              color: '#991B1B',
                            }}
                          >
                            Suspend Driver
                          </Typography>
                          <TextField
                            value={suspendReason}
                            onChange={(e) => setSuspendReason(e.target.value)}
                            placeholder="Reason for suspension"
                            size="small"
                            multiline
                            minRows={2}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                background: '#FFFFFF',
                                borderRadius: '10px',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: pxToRem(13),
                              },
                            }}
                          />
                          <RowStack spacing={'8px'}>
                            <Box
                              onClick={() => {
                                setExpandedAction(null);
                                setSuspendReason('');
                              }}
                              sx={{
                                flex: 1,
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                background: '#FFFFFF',
                                border: '0.67px solid #E5E7EB',
                                cursor: 'pointer',
                                '&:hover': { background: '#F9FAFB' },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 600,
                                  fontSize: pxToRem(12),
                                  color: '#374151',
                                }}
                              >
                                Cancel
                              </Typography>
                            </Box>
                            <Box
                              onClick={
                                isSubmittingAction ? undefined : handleSuspend
                              }
                              sx={{
                                flex: 1,
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                background: '#DC2626',
                                cursor: isSubmittingAction ? 'wait' : 'pointer',
                                opacity: isSubmittingAction ? 0.7 : 1,
                                '&:hover': { background: '#B91C1C' },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 600,
                                  fontSize: pxToRem(12),
                                  color: '#FFFFFF',
                                }}
                              >
                                {isSubmittingAction
                                  ? 'Suspending...'
                                  : 'Confirm'}
                              </Typography>
                            </Box>
                          </RowStack>
                        </Stack>
                      ) : (
                        <ActionButton
                          icon={
                            <BlockOutlinedIcon
                              sx={{ fontSize: 13, color: '#DC2626' }}
                            />
                          }
                          label="Suspend Driver"
                          variant="danger"
                          onClick={() => {
                            setExpandedAction('suspend');
                            setSuspendReason('');
                          }}
                        />
                      )}

                      {/* Resend Activation Code — emails a fresh code to an
                        approved driver who hasn't set a password yet. */}
                      <ActionButton
                        icon={
                          <ForwardToInboxOutlinedIcon
                            sx={{ fontSize: 13, color: '#2F6FED' }}
                          />
                        }
                        label={
                          isSubmittingAction
                            ? 'Resending...'
                            : 'Resend Activation Code'
                        }
                        variant="default"
                        onClick={
                          isSubmittingAction ? undefined : handleResendInvite
                        }
                      />
                    </Stack>
                  </Stack>
                </Stack>
              )}

              {/* ═══ Tab 1: Documents ══════════════════════════════════════ */}
              {activeTab === 1 && (
                <Stack spacing={'10px'}>
                  <SectionLabel text="Document Status" />
                  {documents.length ? (
                    <Stack spacing={'10px'}>
                      {documents.map((doc) => (
                        <DocumentRow
                          key={doc.id}
                          name={titleCase(doc.document_type)}
                          status={doc.verification_status}
                        />
                      ))}
                    </Stack>
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
              )}

              {/* ═══ Tab 2: Trips ══════════════════════════════════════════ */}
              {activeTab === 2 && (
                <Stack spacing={'16px'}>
                  <RowStack justifyContent={'space-between'}>
                    <SectionLabel text="Trip Schedule" />
                    <Chip
                      label={`${tripStats.total_trips ?? 0} total`}
                      size="small"
                      sx={{
                        background: '#EEF3FF',
                        color: '#2F6FED',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: pxToRem(11.5),
                        height: '22px',
                        borderRadius: '100px',
                      }}
                    />
                  </RowStack>

                  <DriverTripSchedule
                    trips={tripCards}
                    isLoading={isFetchingTrips}
                    onTripClick={(trip) =>
                      setSelectedTripId(trip.rideId ?? null)
                    }
                  />
                </Stack>
              )}

              {/* ═══ Tab 3: Ratings ════════════════════════════════════════ */}
              {activeTab === 3 && (
                <Stack spacing={'16px'}>
                  <RowStack justifyContent="space-between">
                    <SectionLabel text="Rating Breakdown" />
                    {isFetchingRatings && (
                      <CircularProgress size={14} sx={{ color: '#9CA3AF' }} />
                    )}
                  </RowStack>

                  <Stack
                    sx={{
                      background: '#F7F9FB',
                      border: '0.67px solid #EAECF0',
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                    spacing={'20px'}
                  >
                    <RowStack spacing={'20px'} alignItems="flex-start">
                      <Stack spacing={'4px'} alignItems={'center'}>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 800,
                            fontSize: pxToRem(44),
                            lineHeight: '1em',
                            color: '#111827',
                          }}
                        >
                          {(overallRating || 0).toFixed(1)}
                        </Typography>
                        <Rating
                          value={overallRating || 0}
                          readOnly
                          precision={0.1}
                          size="small"
                          icon={
                            <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                          }
                          emptyIcon={
                            <StarIcon sx={{ fontSize: 14, color: '#E5E7EB' }} />
                          }
                        />
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(12),
                            color: '#9CA3AF',
                          }}
                        >
                          {ratingsList.length} ratings
                        </Typography>
                      </Stack>

                      <Stack spacing={'6px'} sx={{ flex: 1 }}>
                        {ratingBreakdown.map((item) => (
                          <RowStack
                            key={item.stars}
                            spacing={'8px'}
                            sx={{ width: '100%' }}
                          >
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 400,
                                fontSize: pxToRem(11.5),
                                color: '#6B7280',
                                width: '8px',
                                flexShrink: 0,
                              }}
                            >
                              {item.stars}
                            </Typography>
                            <StarIcon sx={{ fontSize: 10, color: '#F59E0B' }} />
                            <LinearProgress
                              variant="determinate"
                              value={item.percent}
                              sx={{
                                flex: 1,
                                height: 6,
                                borderRadius: '3px',
                                [`& .${linearProgressClasses.bar}`]: {
                                  borderRadius: '3px',
                                  backgroundColor: '#F59E0B',
                                },
                                [`&.${linearProgressClasses.root}`]: {
                                  backgroundColor: '#E5E7EB',
                                },
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 400,
                                fontSize: pxToRem(11),
                                color: '#9CA3AF',
                                width: '28px',
                                textAlign: 'right',
                                flexShrink: 0,
                              }}
                            >
                              {item.percent}%
                            </Typography>
                          </RowStack>
                        ))}
                      </Stack>
                    </RowStack>
                  </Stack>

                  {/* Recent Rating Comments */}
                  {ratingsList.length ? (
                    <Stack spacing={'10px'}>
                      <SectionLabel text="Recent Comments" />
                      {ratingsList.slice(0, 5).map((rating) => (
                        <Stack
                          key={rating.ride_id}
                          spacing={'6px'}
                          sx={{
                            background: '#F7F9FB',
                            border: '0.67px solid #F0F2F5',
                            borderRadius: '14px',
                            padding: '12px 16px',
                          }}
                        >
                          <RowStack justifyContent="space-between">
                            <Rating
                              value={rating.rating}
                              readOnly
                              precision={0.5}
                              size="small"
                              icon={
                                <StarIcon
                                  sx={{ fontSize: 12, color: '#F59E0B' }}
                                />
                              }
                              emptyIcon={
                                <StarIcon
                                  sx={{ fontSize: 12, color: '#E5E7EB' }}
                                />
                              }
                            />
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
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
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
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
                  ) : null}
                </Stack>
              )}
            </>
          )}
          {isFetchingDetail && hasDetail && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CircularProgress size={14} sx={{ color: '#9CA3AF' }} />
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Stacked over the drawer so the admin keeps their place in the
        driver record while reviewing individual trips. */}
      <TripDetailModal
        open={Boolean(selectedTripId)}
        onClose={() => setSelectedTripId(null)}
        rideId={selectedTripId ?? ''}
      />
    </>
  );
};

// ─── Action Button ──────────────────────────────────────────────────────────

const ActionButton = ({
  icon,
  label,
  variant,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  variant: 'default' | 'danger' | 'success';
  onClick?: () => void;
}) => (
  <RowStack
    justifyContent={'center'}
    spacing={'8px'}
    onClick={onClick}
    sx={{
      height: '41px',
      borderRadius: '10px',
      cursor: onClick ? 'pointer' : 'not-allowed',
      transition: 'opacity 0.15s ease',
      '&:hover': { opacity: onClick ? 0.8 : 1 },
      ...(variant === 'default' && {
        background: '#F7F9FB',
        border: '0.67px solid #E5E7EB',
      }),
      ...(variant === 'danger' && {
        background: '#FEF2F2',
        border: '0.67px solid #FECACA',
      }),
      ...(variant === 'success' && {
        background: '#ECFDF5',
        border: '0.67px solid #BBF7D0',
      }),
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(13),
        color:
          variant === 'danger'
            ? '#DC2626'
            : variant === 'success'
              ? '#059669'
              : '#374151',
      }}
    >
      {label}
    </Typography>
  </RowStack>
);
