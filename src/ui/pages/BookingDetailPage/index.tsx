'use client';

import { Box, Chip, Grid, Stack, Typography, alpha } from '@mui/material';
import { useParams } from 'next/navigation';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  CustomBreadCrumbs,
  DashboardTitle,
  RowStack,
  StyledImage,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import {
  StatChip,
  InfoCard,
  PersonCard,
  LiveRouteCard,
  TripTimeline,
  FareBreakdown,
} from './ui/components';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import tripstatusIcon from './ui/assets/icons/tripstatus-icon.svg';
import dollarIcon from './ui/assets/icons/dollar-icon.svg';
import distanceIcon from './ui/assets/icons/distance-icon.svg';
import timeIcon from './ui/assets/icons/time-icon.svg';
import locationIcon from './ui/assets/icons/location-icon.svg';
import clockIcon from './ui/assets/icons/clock-icon.svg';
import serviceIcon from './ui/assets/icons/service-icon.svg';
import usergroupIcon from './ui/assets/icons/usergroup-icon.svg';
import riderIcon from './ui/assets/icons/rider-icon.svg';
import driverinfoIcon from './ui/assets/icons/driverinfo-icon.svg';
import driverIcon from './ui/assets/icons/driver-icon.svg';
import careassistantIcon from './ui/assets/icons/careassistant-icon.svg';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const bookingData = {
  bookingId: 'BK-20491',
  status: 'Pending' as const,
  createdAt: 'Created Mar 9, 2026 · 08:22 AM',
  scheduledAt: 'Scheduled Mar 9, 2026 · 09:00 AM',
  stats: {
    tripStatus: 'Pending Approval',
    totalFare: '$23.64',
    distance: '3.0 Km',
    estDuration: '18 min',
    pickedUpAt: '09:04 AM',
    etaArrival: '09:22 AM',
  },
  serviceType: {
    title: 'Transport + Care Assistant',
    description: 'Driver + Care Assistant required',
    driver: 'Assigned',
    careAssistant: 'Assigned',
  },
  rider: {
    initials: 'HM',
    name: 'Helen Moore',
    phone: '+1 416 555 0123',
    email: 'claire.beaumont@email.com',
    insurance: 'Manulife #ML-881234',
    memberSince: 'Jan 2024',
  },
  driver: {
    initials: 'LM',
    name: 'Liam MacDonald',
    rating: 4.8,
    badge: 'On Trip',
    badgeColor: '#374151',
    phone: '+1 416 555 9944',
    vehicle: '2022 Toyota Sienna WAV',
    plate: 'BDNJ 148',
    totalTrips: '1,204',
  },
  careAssistant: {
    initials: 'ST',
    initialsColor: '#16A34A',
    name: 'Sophie Tremblay',
    rating: 4.7,
    phone: '+1 416 555 7731',
    specialty: 'Mobility Support',
    certs: 'PSW, First Aid',
    assignments: '287',
  },
  route: {
    pickup: '120 King St W, Toronto, ON',
    destination: 'Toronto General Hospital',
    tripProgress: 62,
  },
  timeline: [
    { time: 'Mar 9 · 08:30 AM', label: 'Booking Confirmed', isCompleted: true },
    { time: 'Mar 9 · 08:42 AM', label: 'Driver Assigned', isCompleted: true },
    { time: 'Mar 9 · 08:55 AM', label: 'Driver En Route', isCompleted: true },
    { time: 'Mar 9 · 09:04 AM', label: 'Rider Picked Up', isCompleted: true },
    {
      time: 'Mar 9 · 09:04 AM',
      label: 'In Transit',
      isCurrent: true,
      isCompleted: false,
    },
    { time: 'ETA 09:22 AM', label: 'Destination Arrived', isCompleted: false },
  ],
  adminNotes: [
    {
      initial: 'S',
      author: 'System',
      time: '08:30 AM',
      text: 'Booking auto-confirmed. Driver match found within 2 min.',
    },
    {
      initial: 'D',
      author: 'Dispatch',
      time: '08:42 AM',
      text: 'Driver Marcus Johnson assigned. Vehicle WAV-certified.',
    },
    {
      initial: 'A',
      author: 'Admin',
      time: '08:58 AM',
      text: 'Rider confirmed pickup ready. Wheelchair ramp requested.',
    },
  ],
  fare: {
    baseFare: '$15.50',
    careAssistantFee: '$5.64',
    platformFee: '$2.50',
    totalAmount: '$23.64',
    paymentMethod: 'Insurance Billed',
  },
};

const statusColorMap = {
  Pending: '#D97706',
  Approved: '#059669',
  Declined: '#DC2626',
};

const statIconSize = { width: 14, height: 14 };

export const BookingDetailPage = () => {
  const params = useParams();
  const bookingId = (params?.id as string) || bookingData.bookingId;
  const data = bookingData;
  const statusColor = statusColorMap[data.status];

  return (
    <AppDashboardLayout>
      <Stack spacing={'20px'}>
        <CustomBreadCrumbs
          breadcrumbsData={[
            { href: '/bookings', text: 'Booking Management' },
            { href: '/bookings', text: 'All Bookings' },
            { href: '#', text: bookingId },
          ]}
        />

        {/* Header */}
        <RowStack justifyContent="space-between" width="100%">
          <Stack spacing={'6px'}>
            <RowStack spacing={'10px'}>
              <DashboardTitle title="Booking Details" />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                  background: '#F3F4F6',
                  borderRadius: '17px',
                  padding: '4px 12px',
                }}
              >
                {bookingId}
              </Typography>
              <Chip
                label={data.status}
                sx={{
                  background: alpha(statusColor, 0.1),
                  color: statusColor,
                  fontSize: pxToRem(12),
                  fontWeight: 600,
                  height: '27px',
                  borderRadius: '16px',
                }}
              />
            </RowStack>
            <RowStack spacing={'8px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: (theme) => theme.color.lightGrey,
                }}
              >
                {data.createdAt}
              </Typography>
              <NavigateNextIcon
                sx={{ fontSize: 13, color: '#D1D5DB' }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: (theme) => theme.color.lightGrey,
                }}
              >
                {data.scheduledAt}
              </Typography>
            </RowStack>
          </Stack>

          <RowStack spacing={'8px'}>
            <AppButton
              sx={{
                background: '#F0FDF4',
                border: '0.67px solid #BBF7D0',
                color: '#16A34A',
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                borderRadius: '14px',
                '&:hover': {
                  background: alpha('#16A34A', 0.12),
                },
              }}
              startIcon={
                <PersonAddAltOutlinedIcon
                  sx={{ fontSize: 13, color: '#16A34A' }}
                />
              }
            >
              Assign Care Assistant
            </AppButton>
            <AppButton
              sx={{
                background: (theme) => theme.palette.primary.main,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                borderRadius: '14px',
                '&:hover': {
                  background: alpha('#2F6FED', 0.9),
                },
              }}
              startIcon={
                <LoopIcon
                  sx={{ fontSize: 13, color: '#FFFFFF' }}
                />
              }
            >
              Assign Driver
            </AppButton>
            <Box
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <MoreHorizIcon sx={{ fontSize: 24, color: '#6B7280' }} />
            </Box>
          </RowStack>
        </RowStack>

        {/* Stat Chips */}
        <RowStack spacing={'12px'} width="100%">
          {[
            {
              icon: <StyledImage src={tripstatusIcon} alt="trip status" {...statIconSize} />,
              label: 'Trip Status',
              value: data.stats.tripStatus,
              valueColor: '#ED8A2F',
              pulse: true,
            },
            {
              icon: <StyledImage src={dollarIcon} alt="total fare" {...statIconSize} />,
              label: 'Total Fare',
              value: data.stats.totalFare,
            },
            {
              icon: <StyledImage src={distanceIcon} alt="distance" {...statIconSize} />,
              label: 'Distance',
              value: data.stats.distance,
            },
            {
              icon: <StyledImage src={timeIcon} alt="duration" {...statIconSize} />,
              label: 'Est. Duration',
              value: data.stats.estDuration,
            },
            {
              icon: <StyledImage src={locationIcon} alt="picked up at" {...statIconSize} />,
              label: 'Picked Up At',
              value: data.stats.pickedUpAt,
            },
            {
              icon: <StyledImage src={clockIcon} alt="eta arrival" {...statIconSize} />,
              label: 'ETA Arrival',
              value: data.stats.etaArrival,
            },
          ].map((chip) => (
            <StatChip key={chip.label} {...chip} />
          ))}
        </RowStack>

        {/* Main Content: Left sidebar + Right content */}
        <Grid container spacing={'20px'}>
          {/* Left Column */}
          <Grid size={{ sm: 12, lg: 3 }}>
            <Stack spacing={'16px'}>
              {/* Service Type */}
              <InfoCard
                icon={
                  <StyledImage src={serviceIcon} alt="service type" width={12} height={12} />
                }
                title="Service Type"
              >
                <Stack spacing={'12px'}>
                  <Box
                    sx={{
                      background: '#F0FDF4',
                      borderRadius: '14px',
                      padding: '12px',
                    }}
                  >
                    <RowStack spacing={'10px'}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '14px',
                          background: '#DCFCE7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <StyledImage src={usergroupIcon} alt="service" width={18} height={18} />
                      </Box>
                      <Stack spacing={'1px'}>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(13.5),
                            color: '#15803D',
                          }}
                        >
                          {data.serviceType.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(11.5),
                            color: '#4ADE80',
                          }}
                        >
                          {data.serviceType.description}
                        </Typography>
                      </Stack>
                    </RowStack>
                  </Box>
                  <Stack spacing={'8px'}>
                    {[
                      {
                        icon: <StyledImage src={driverIcon} alt="driver" width={12} height={12} />,
                        label: 'Driver',
                        status: data.serviceType.driver,
                      },
                      {
                        icon: <StyledImage src={careassistantIcon} alt="care assistant" width={12} height={12} />,
                        label: 'Care Assistant',
                        status: data.serviceType.careAssistant,
                      },
                    ].map((row) => (
                      <RowStack
                        key={row.label}
                        justifyContent="space-between"
                        sx={{
                          background: '#F7F9FB',
                          borderRadius: '10px',
                          padding: '9px 12px',
                        }}
                      >
                        <RowStack spacing={'8px'}>
                          {row.icon}
                          <Typography
                            sx={{
                              fontFamily: (theme) => theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(10.5),
                              color: (theme) => theme.color.grey,
                            }}
                          >
                            {row.label}
                          </Typography>
                        </RowStack>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            background: alpha('#059669', 0.1),
                            color: '#059669',
                            fontSize: pxToRem(10.5),
                            fontWeight: 700,
                            height: '20px',
                            borderRadius: '10px',
                          }}
                        />
                      </RowStack>
                    ))}
                  </Stack>
                </Stack>
              </InfoCard>

              {/* Rider Information */}
              <InfoCard
                icon={
                  <StyledImage src={riderIcon} alt="rider" width={12} height={12} />
                }
                title="Rider Information"
              >
                <PersonCard
                  initials={data.rider.initials}
                  name={data.rider.name}
                  phone={data.rider.phone}
                  email={data.rider.email}
                  insurance={data.rider.insurance}
                  memberSince={data.rider.memberSince}
                />
              </InfoCard>

              {/* Driver Information */}
              <InfoCard
                icon={
                  <StyledImage src={driverinfoIcon} alt="driver info" width={12} height={12} />
                }
                title="Driver Information"
              >
                <PersonCard
                  initials={data.driver.initials}
                  name={data.driver.name}
                  rating={data.driver.rating}
                  badge={data.driver.badge}
                  badgeColor={data.driver.badgeColor}
                  phone={data.driver.phone}
                  vehicle={data.driver.vehicle}
                  plate={data.driver.plate}
                  totalTrips={data.driver.totalTrips}
                />
              </InfoCard>

              {/* Care Assistant */}
              <InfoCard
                icon={
                  <StyledImage src={careassistantIcon} alt="care assistant" width={12} height={12} />
                }
                title="Care Assistant"
              >
                <PersonCard
                  initials={data.careAssistant.initials}
                  initialsColor={data.careAssistant.initialsColor}
                  name={data.careAssistant.name}
                  rating={data.careAssistant.rating}
                  phone={data.careAssistant.phone}
                  specialty={data.careAssistant.specialty}
                  certs={data.careAssistant.certs}
                  assignments={data.careAssistant.assignments}
                />
              </InfoCard>
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid size={{ sm: 12, lg: 9 }}>
            <Stack spacing={'16px'}>
              <LiveRouteCard
                pickupAddress={data.route.pickup}
                destinationAddress={data.route.destination}
                tripProgress={data.route.tripProgress}
              />
              <TripTimeline
                entries={data.timeline}
                adminNotes={data.adminNotes}
              />
              <FareBreakdown
                baseFare={data.fare.baseFare}
                careAssistantFee={data.fare.careAssistantFee}
                platformFee={data.fare.platformFee}
                totalAmount={data.fare.totalAmount}
                paymentMethod={data.fare.paymentMethod}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </AppDashboardLayout>
  );
};
