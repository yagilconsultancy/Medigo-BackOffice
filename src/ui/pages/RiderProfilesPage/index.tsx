'use client';

import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { pxToRem } from '../../../common';

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

// ─── Mock Data ──────────────────────────────────────────────────────────────

const ridersData: RiderProfile[] = [
  {
    id: 'R-001',
    name: 'Helen Moore',
    avatar: '',
    dob: 'Mar 14, 1954',
    memberSince: 'Jan 8, 2024',
    totalRides: 42,
    ridesColor: '#2F6FED',
    email: 'helen.moore@email.com',
    phone: '+1 416 555 0123',
    lastRide: 'Mar 9, 2026',
    insurance: 'Blue Cross Canada #BC-881234',
    emergency: 'Frank Moore · Husband',
    payment: 'Blue Cross · Visa ••4521',
    paymentColor: '#2F6FED',
  },
  {
    id: 'R-002',
    name: 'Robert Garcia',
    avatar: '',
    dob: 'Jul 22, 1980',
    memberSince: 'Feb 14, 2024',
    totalRides: 31,
    ridesColor: '#2F6FED',
    email: 'r.garcia@email.com',
    phone: '+1 514 555 0198',
    lastRide: 'Mar 8, 2026',
    insurance: 'Sun Life #SL-554321',
    emergency: 'Maria Garcia · Wife',
    payment: 'Sun Life Direct',
    paymentColor: '#2F6FED',
  },
  {
    id: 'R-003',
    name: 'Patricia Clark',
    avatar: '',
    dob: 'Feb 26, 1948',
    memberSince: 'May 20, 2024',
    totalRides: 56,
    ridesColor: '#059669',
    email: 'p.clark@email.com',
    phone: '+1 613 555 0147',
    lastRide: 'Mar 9, 2026',
    insurance: 'OHIP #OH-447812',
    emergency: 'Bill Clark · Son',
    payment: 'OHIP',
    paymentColor: '#2F6FED',
  },
  {
    id: 'R-004',
    name: 'Daniel Martinez',
    avatar: '',
    dob: 'Aug 1, 1964',
    memberSince: 'Jun 5, 2024',
    totalRides: 87,
    ridesColor: '#059669',
    email: 'd.martinez@email.com',
    phone: '+1 604 555 0132',
    lastRide: 'Mar 9, 2026',
    insurance: 'BC MSP #MSP-336699',
    emergency: 'Rosa Martinez · Daughter',
    payment: 'BC MSP',
    paymentColor: '#2F6FED',
  },
  {
    id: 'R-005',
    name: 'Nancy White',
    avatar: '',
    dob: 'Sep 5, 1981',
    memberSince: 'Mar 3, 2024',
    totalRides: 28,
    ridesColor: '#2F6FED',
    email: 'nwhite@email.com',
    phone: '+1 403 555 0189',
    lastRide: 'Mar 7, 2026',
    insurance: 'Alberta AHCIP #AH-221876',
    emergency: 'Tom White · Son',
    payment: 'Visa ••8732',
    paymentColor: '#EF4444',
  },
  {
    id: 'R-006',
    name: 'Lisa Anderson',
    avatar: '',
    dob: 'Apr 12, 1986',
    memberSince: 'Jul 18, 2024',
    totalRides: 18,
    ridesColor: '#2F6FED',
    email: 'l.anderson@email.com',
    phone: '+1 514 555 0276',
    lastRide: 'Mar 6, 2026',
    insurance: 'Desjardins #DJ-773214',
    emergency: 'Mike Anderson · Husband',
    payment: 'Desjardins · MC ••8944',
    paymentColor: '#EF4444',
  },
];

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
  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Rider Profiles"
          desc="Personal details, payment methods, and emergency contacts for all riders"
        />

        {/* Rider Cards Grid */}
        <Grid container spacing={'20px'}>
          {ridersData.map((rider) => (
            <Grid key={rider.id} size={{ xs: 12, md: 6 }}>
              <RiderCard rider={rider} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </AppDashboardLayout>
  );
};
