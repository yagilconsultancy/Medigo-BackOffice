'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Avatar, Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { CustomPagination } from '../../modules/components/GridTable/ui/components/DataGridPagination/ui/components/CustomPagination';
import { EmptyState } from '../../modules/blocks';
import {
  pxToRem,
  useGetRidersProfiles,
  type AdminRiderProfileCard,
} from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RiderProfile = {
  id: string;
  name: string;
  avatar: string;
  dob: string;
  memberSince: string;
  totalRides: number;
  ridesColor: string;
  email: string;
  phone: string;
  lastRide: string;
  insurance: string;
  emergency: string;
  payment: string;
  paymentColor: string;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (value?: string | null): string =>
  value ? dayjs(value).format('MMM D, YYYY') : '—';

const mapRiderProfile = (item: AdminRiderProfileCard): RiderProfile => {
  const fullName =
    `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() || 'Unknown';
  const insurance =
    item.insurance_provider || item.insurance_policy_number
      ? `${item.insurance_provider ?? ''}${
          item.insurance_policy_number
            ? ` #${item.insurance_policy_number}`
            : ''
        }`.trim()
      : '—';
  const emergency = item.emergency_contact_name
    ? `${item.emergency_contact_name}${
        item.emergency_contact_relationship
          ? ` · ${item.emergency_contact_relationship}`
          : ''
      }`
    : '—';
  const payment =
    item.payment_brand || item.payment_last_four
      ? `${item.payment_brand ?? ''}${
          item.payment_last_four ? ` ••${item.payment_last_four}` : ''
        }`.trim()
      : '—';
  const totalRides = item.total_rides ?? 0;

  return {
    id: item.user_id,
    name: fullName,
    avatar: item.avatar_url ?? '',
    dob: formatDate(item.date_of_birth),
    memberSince: formatDate(item.member_since),
    totalRides,
    ridesColor: totalRides >= 50 ? '#059669' : '#2F6FED',
    email: item.email ?? '—',
    phone: item.phone ?? '—',
    lastRide: formatDate(item.last_ride),
    insurance,
    emergency,
    payment,
    paymentColor: '#2F6FED',
  };
};

// ─── Info Row ───────────────────────────────────────────────────────────────

const InfoRow = ({
  icon,
  label,
  value,
  valueNode,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
}) => (
  <RowStack
    spacing={'10px'}
    sx={{
      padding: '8px 0',
      borderBottom: '0.67px solid #F5F7FA',
    }}
  >
    {icon}
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12),
        color: '#9CA3AF',
        width: 80,
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    {valueNode || (
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(12.5),
          color: '#374151',
        }}
      >
        {value}
      </Typography>
    )}
  </RowStack>
);

// ─── Rider Card ─────────────────────────────────────────────────────────────

const RiderCard = ({ rider }: { rider: RiderProfile }) => {
  const nameParts = rider.name.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const iconSx = { fontSize: 14, color: '#C4CAD4' };

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
      {/* Header */}
      <RowStack
        justifyContent={'space-between'}
        sx={{
          padding: '18px 20px',
          borderBottom: '0.67px solid #F0F4F8',
        }}
      >
        <RowStack spacing={'12px'}>
          <Avatar
            src={rider.avatar || undefined}
            alt={rider.name}
            sx={{
              width: 46,
              height: 46,
              fontSize: pxToRem(14),
              fontWeight: 600,
              background: '#E5E7EB',
              color: '#9CA3AF',
              borderRadius: '23px',
            }}
          >
            {initials}
          </Avatar>
          <Stack spacing={0}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: '#111827',
                lineHeight: '1.5em',
              }}
            >
              {rider.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11.5),
                color: '#9CA3AF',
                lineHeight: '1.5em',
              }}
            >
              DOB: {rider.dob} · Since {rider.memberSince}
            </Typography>
          </Stack>
        </RowStack>

        {/* Ride count */}
        <Stack alignItems={'flex-end'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 800,
              fontSize: pxToRem(26),
              color: rider.ridesColor,
              lineHeight: '1.1em',
            }}
          >
            {rider.totalRides}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
            }}
          >
            total rides
          </Typography>
        </Stack>
      </RowStack>

      {/* Info Rows */}
      <Stack sx={{ padding: '4px 20px 20px' }}>
        <InfoRow
          icon={<EmailOutlinedIcon sx={iconSx} />}
          label="Email"
          value={rider.email}
        />
        <InfoRow
          icon={<PhoneOutlinedIcon sx={iconSx} />}
          label="Phone"
          value={rider.phone}
        />
        <InfoRow
          icon={<CalendarTodayOutlinedIcon sx={iconSx} />}
          label="Last Ride"
          value={rider.lastRide}
        />
        <InfoRow
          icon={<LocalHospitalOutlinedIcon sx={iconSx} />}
          label="Insurance"
          value={rider.insurance}
        />
        <InfoRow
          icon={<PersonOutlinedIcon sx={iconSx} />}
          label="Emergency"
          value={rider.emergency}
        />
        <InfoRow
          icon={<PaymentOutlinedIcon sx={iconSx} />}
          label="Payment"
          valueNode={
            <Box
              sx={{
                padding: '2px 12px',
                borderRadius: '100px',
                background:
                  rider.paymentColor === '#EF4444' ? '#FEF2F2' : '#EEF3FF',
                border: `0.67px solid ${rider.paymentColor === '#EF4444' ? '#FECACA' : '#C7D7F9'}`,
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(11.5),
                  color: rider.paymentColor,
                }}
              >
                {rider.payment}
              </Typography>
            </Box>
          }
        />
      </Stack>
    </Box>
  );
};

// ─── Component ──────────────────────────────────────────────────────────────

export const RiderProfilesPage = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Note: useGetRidersProfiles returns a flat paginated response
  // (RiderProfileCardsPaginatedResponse) with `data` + `total` + `page` + ...
  // rather than an ApiResponse<T> envelope, so useResolvedApiQuery doesn't
  // fit here — we need access to `total` for the pagination control.
  const { data: profilesResponse, isFetching } = useGetRidersProfiles({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });

  const profiles = profilesResponse?.data ?? [];
  const totalCount = profilesResponse?.total ?? 0;

  const riders = useMemo<RiderProfile[]>(
    () => profiles.map(mapRiderProfile),
    [profiles]
  );

  const handlePageChange = (newPage: number) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPaginationModel({ page: 0, pageSize: newPageSize });
  };

  if (isFetching) {
    return (
      <AppDashboardLayout>
        <Stack spacing={'24px'}>
          <Stack spacing={'6px'}>
            <Skeleton
              variant="rectangular"
              height={28}
              width={240}
              sx={{ borderRadius: '8px' }}
            />
            <Skeleton
              variant="rectangular"
              height={16}
              width={420}
              sx={{ borderRadius: '8px' }}
            />
          </Stack>
          <Grid container spacing={'20px'}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, md: 6 }}>
                <Skeleton
                  variant="rectangular"
                  height={360}
                  sx={{ borderRadius: '16px' }}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </AppDashboardLayout>
    );
  }

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Rider Profiles"
          desc="Personal details, payment methods, and emergency contacts for all riders"
        />

        {/* Rider Cards Grid */}
        {riders.length === 0 ? (
          <Box sx={{ height: 400, width: '100%' }}>
            <EmptyState animationSrc="/empty.json" />
          </Box>
        ) : (
          <Grid container spacing={'20px'}>
            {riders.map((rider) => (
              <Grid key={rider.id} size={{ xs: 12, md: 6 }}>
                <RiderCard rider={rider} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalCount > 0 && (
          <Box
            sx={{
              background: '#FFFFFF',
              border: '0.67px solid #E8ECF0',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <CustomPagination
              count={totalCount}
              page={paginationModel.page}
              pageSize={paginationModel.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </Box>
        )}
      </Stack>
    </AppDashboardLayout>
  );
};
