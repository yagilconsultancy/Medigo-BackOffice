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
import dayjs from 'dayjs';
import {
  pxToRem,
  useDriversApi,
  useGetDriverDetail,
  useGetDriverRatings,
  useGetDriverTrips,
  useResolvedApiQuery,
  type AdminDriverDetailResponse,
  type AdminDriverRatingItem,
  type DriverDocumentSummary,
} from '../../../../../../common';
import { RowStack } from '../../../../../modules/components';

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
  const statuses = documents.map((d) => (d.verification_status || '').toLowerCase());
  if (statuses.some((s) => s === 'expired')) return 'Expired';
  if (statuses.some((s) => s === 'rejected')) return 'Rejected';
  if (statuses.every((s) => s === 'verified' || s === 'valid' || s === 'signed')) {
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
  if (normalized.includes('verified') || normalized.includes('valid') || normalized.includes('signed')) {
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

// ─── Reusable Trip Card ─────────────────────────────────────────────────────

type TripCardData = {
  id: string;
  fare: string;
  status: string;
  rider: string;
  pickup: string;
  dropoff: string;
  date: string;
};

const TripCard = ({ trip }: { trip: TripCardData }) => (
  <Stack
    spacing={'8px'}
    sx={{
      background: '#F7F9FB',
      border: '0.67px solid #F0F2F5',
      borderRadius: '14px',
      padding: '16px',
    }}
  >
    <RowStack justifyContent={'space-between'}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(11.5),
          color: '#2F6FED',
        }}
      >
        {trip.id}
      </Typography>
      <RowStack spacing={'8px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(12.5),
            color: '#059669',
          }}
        >
          {trip.fare}
        </Typography>
        <Chip
          label={titleCase(trip.status)}
          size="small"
          sx={{
            background: '#ECFDF5',
            color: '#059669',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(10.5),
            height: '20px',
            borderRadius: '100px',
          }}
        />
      </RowStack>
    </RowStack>

    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12.5),
        color: '#111827',
      }}
    >
      {trip.rider}
    </Typography>

    <RowStack spacing={'8px'}>
      <Box
        sx={{
          width: 5,
          height: 5,
          borderRadius: '2.5px',
          border: '1.33px solid #6B7280',
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11.5),
          color: '#6B7280',
        }}
      >
        {trip.pickup}
      </Typography>
    </RowStack>

    <RowStack spacing={'8px'}>
      <Box
        sx={{
          width: 5,
          height: 5,
          borderRadius: '2.5px',
          background: '#2F6FED',
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11.5),
          color: '#6B7280',
        }}
      >
        {trip.dropoff}
      </Typography>
    </RowStack>

    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(11),
        color: '#9CA3AF',
      }}
    >
      {trip.date}
    </Typography>
  </Stack>
);

// ─── Main Component ─────────────────────────────────────────────────────────

export const DriverViewDrawer = ({
  open,
  onClose,
  driverId,
  seed,
}: DriverViewDrawerProps) => {
  // ─── Hooks (all at top) ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(0);
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

  const {
    data: tripsResponse,
    isFetching: isFetchingTrips,
  } = useResolvedApiQuery(
    useGetDriverTrips,
    { items: [], total: 0, page: 1, limit: 10 } as any,
    { driverId: activeTab === 2 ? resolvedDriverId : '', page: 1, limit: 20 }
  );

  const {
    data: ratingsResponse,
    isFetching: isFetchingRatings,
  } = useResolvedApiQuery(
    useGetDriverRatings,
    { items: [] } as any,
    { driverId: activeTab === 3 ? resolvedDriverId : '', limit: 50 }
  );

  const {
    suspendDriver,
    reactivateDriver,
    reassignDriver,
    updateDriver,
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
    : seed?.joinedDate ?? '—';
  const fleetLabel = hasDetail
    ? detail.fleet_name || '—'
    : seed?.fleet ?? '—';
  const vehicleLabel = hasDetail ? buildVehicleLabel(detail) : seed?.vehicle ?? '—';
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

  const capabilities = hasDetail ? detail.service_capabilities ?? [] : [];
  const documents = hasDetail ? detail.documents ?? [] : [];
  const tripStats = hasDetail
    ? detail.trip_stats
    : { total_trips: 0, hours_online: 0, average_earnings: 0 };
  const overallRating = hasDetail ? detail.rating ?? 0 : 0;

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
    return hasDetail ? detail.ratings ?? [] : [];
  }, [ratingsResponse, hasDetail, detail]);

  const ratingBreakdown = useMemo(
    () => buildRatingBreakdown(ratingsList),
    [ratingsList]
  );

  const tripCards = useMemo<TripCardData[]>(() => {
    const items = Array.isArray(tripsResponse?.items)
      ? (tripsResponse as any).items
      : Array.isArray(tripsResponse?.trips)
        ? (tripsResponse as any).trips
        : Array.isArray(tripsResponse)
          ? (tripsResponse as any)
          : [];

    return items.map((raw: any) => ({
      id: raw.ride_code || raw.id || raw.ride_id || 'TR-—',
      fare: raw.fare != null ? `$${Number(raw.fare).toFixed(2)}` : '—',
      status: raw.status || 'Completed',
      rider: raw.rider_name || raw.passenger_name || 'Rider',
      pickup: raw.pickup_address || raw.pickup || '—',
      dropoff: raw.dropoff_address || raw.destination || raw.dropoff || '—',
      date: raw.created_at ? dayjs(raw.created_at).format('MMM D') : '—',
    }));
  }, [tripsResponse]);

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

  if (!driverId) return null;

  const isInitialLoading = isLoadingDetail && !hasDetail;

  return (
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
            position: 'relative',
          }}
        >
          <RowStack spacing={'16px'}>
            <Stack spacing={'2px'}>
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
            <Stack spacing={'2px'}>
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
          </RowStack>
          <Chip
            label={statusLabel}
            size="small"
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
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
        </Box>

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
          <Stack alignItems="center" justifyContent="center" sx={{ py: '48px' }}>
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
                    <ReadOnlyField label="Phone" value={detail.phone || '—'} />
                    <ReadOnlyField label="Email" value={detail.email || '—'} />
                    <ReadOnlyField
                      label="Date of Birth"
                      value={formatDate(detail.date_of_birth)}
                    />
                    <ReadOnlyField
                      label="Member Since"
                      value={formatMonthYear(detail.created_at)}
                    />
                  </Box>
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
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12),
                            color: '#374151',
                          }}
                        >
                          Change Fleet Assignment
                        </Typography>
                        <TextField
                          value={selectedFleetId}
                          onChange={(e) => setSelectedFleetId(e.target.value)}
                          placeholder="Enter new fleet ID"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: '#F9FAFB',
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
                                fontFamily: (theme) => theme.typography.fontFamily,
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
                              isSubmittingAction ? undefined : handleChangeFleet
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
                                fontFamily: (theme) => theme.typography.fontFamily,
                                fontWeight: 600,
                                fontSize: pxToRem(12),
                                color: '#FFFFFF',
                              }}
                            >
                              {isSubmittingAction ? 'Saving...' : 'Save Fleet'}
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
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12),
                            color: '#374151',
                          }}
                        >
                          Reassign Vehicle
                        </Typography>
                        <TextField
                          value={selectedVehicleId}
                          onChange={(e) => setSelectedVehicleId(e.target.value)}
                          placeholder="Enter new vehicle ID"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              background: '#F9FAFB',
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
                                fontFamily: (theme) => theme.typography.fontFamily,
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
                              isSubmittingAction ? undefined : handleReassignVehicle
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
                                fontFamily: (theme) => theme.typography.fontFamily,
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
                          isSubmittingAction ? 'Reactivating...' : 'Reactivate Driver'
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
                            fontFamily: (theme) => theme.typography.fontFamily,
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
                                fontFamily: (theme) => theme.typography.fontFamily,
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
                                fontFamily: (theme) => theme.typography.fontFamily,
                                fontWeight: 600,
                                fontSize: pxToRem(12),
                                color: '#FFFFFF',
                              }}
                            >
                              {isSubmittingAction ? 'Suspending...' : 'Confirm'}
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
                  <SectionLabel text="Recent Trips" />
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
                {isFetchingTrips && !tripCards.length ? (
                  <Stack alignItems="center" sx={{ py: '24px' }}>
                    <CircularProgress size={20} sx={{ color: '#2F6FED' }} />
                  </Stack>
                ) : tripCards.length ? (
                  <Stack spacing={'12px'}>
                    {tripCards.map((trip, idx) => (
                      <TripCard key={`${trip.id}-${idx}`} trip={trip} />
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
                    No recent trips.
                  </Typography>
                )}
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
                        icon={<StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />}
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
                              fontFamily: (theme) => theme.typography.fontFamily,
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
                              fontFamily: (theme) => theme.typography.fontFamily,
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
                              <StarIcon sx={{ fontSize: 12, color: '#F59E0B' }} />
                            }
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
