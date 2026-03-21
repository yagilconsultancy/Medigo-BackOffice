'use client';

import { Box, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { RowStack } from '../../modules/components';
import { pxToRem } from '../../../common';
import { ScheduledTripRow, ScheduledTrip } from './ui/components';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

const statCards = [
  { value: '6', label: 'Upcoming Trips' },
  { value: '3', label: 'Recurring' },
  { value: '1', label: 'Needs Assignment' },
];

const scheduledTrips: ScheduledTrip[] = [
  {
    id: '1',
    patientName: 'Claire Beaumont',
    bookingId: 'BK-20510',
    vehicleType: 'MediGo Wheelchair Van',
    vehicleTypeColor: '#059669',
    vehicleTypeBg: '#ECFDF5',
    recurrence: 'Tue & Thu',
    dateTime: 'Mar 11, 2026 · 09:00 AM',
    route: '120 King St W, Toronto, ON → Toronto General Hospital',
    driverName: 'Liam MacDonald',
  },
  {
    id: '2',
    patientName: 'Dorothy MacLeod',
    bookingId: 'BK-20509',
    vehicleType: 'MediGo Stretcher Van',
    vehicleTypeColor: '#6366F1',
    vehicleTypeBg: '#EEF2FF',
    recurrence: 'Mon, Wed, Fri',
    dateTime: 'Mar 12, 2026 · 08:00 AM',
    route: 'Rideau Place Care Home, Ottawa, ON → Ottawa Kidney Care Centre',
    driverName: 'Sophie Tremblay',
  },
  {
    id: '3',
    patientName: 'Joseph Nguyen',
    bookingId: 'BK-20508',
    vehicleType: 'MediGo Standard Ride',
    vehicleTypeColor: '#2F6FED',
    vehicleTypeBg: '#EBF2FF',
    dateTime: 'Mar 11, 2026 · 10:00 AM',
    route: '888 Burrard St, Vancouver, BC → BC Cancer – Vancouver Centre',
    driverName: 'David Chen',
  },
  {
    id: '4',
    patientName: 'Pierre Tremblay',
    bookingId: 'BK-20507',
    vehicleType: 'MediGo Standard Ride',
    vehicleTypeColor: '#2F6FED',
    vehicleTypeBg: '#EBF2FF',
    dateTime: 'Mar 13, 2026 · 11:30 AM',
    route: '455 Ste-Catherine St W, Montréal → Montreal General Hospital',
    driverName: 'Anna Kim',
  },
  {
    id: '5',
    patientName: "Margaret O'Brien",
    bookingId: 'BK-20506',
    vehicleType: 'MediGo Stretcher Van',
    vehicleTypeColor: '#6366F1',
    vehicleTypeBg: '#EEF2FF',
    recurrence: 'Bi-weekly',
    dateTime: 'Mar 14, 2026 · 01:00 PM',
    route: '1150 12 Ave SW, Calgary, AB → Foothills Medical Centre',
    driverName: null,
  },
  {
    id: '6',
    patientName: 'Isabelle Cote',
    bookingId: 'BK-20505',
    vehicleType: 'MediGo Standard Ride',
    vehicleTypeColor: '#2F6FED',
    vehicleTypeBg: '#EBF2FF',
    dateTime: 'Mar 15, 2026 · 02:30 PM',
    route: '800 Rene-Levesque Blvd W, Montreal → Montreal Heart Institute',
    driverName: 'Isabelle Roy',
  },
];

export const ScheduledTripsPage = () => {
  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <Stack spacing={'4px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(24),
              lineHeight: '36px',
              color: (theme) => theme.color.deepBlue,
            }}
          >
            Scheduled Trips
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(14),
              lineHeight: '21px',
              color: (theme) => theme.color.lightGrey,
            }}
          >
            Future and recurring bookings scheduled in advance
          </Typography>
        </Stack>

        {/* Stat Cards */}
        <RowStack spacing={'12px'} width="100%">
          {statCards.map((card, index) => (
            <Stack
              key={index}
              spacing={'4px'}
              sx={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '21px',
                flex: 1,
                border: '0.67px solid #EAECF0',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 800,
                  fontSize: pxToRem(32),
                  lineHeight: '48px',
                  color: (theme) => theme.color.deepBlue,
                }}
              >
                {card.value}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  lineHeight: '19.5px',
                  color: (theme) => theme.color.lightGrey,
                }}
              >
                {card.label}
              </Typography>
            </Stack>
          ))}
        </RowStack>

        {/* Upcoming Schedule Table */}
        <Stack
          sx={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '0.67px solid #EAECF0',
            overflow: 'hidden',
          }}
        >
          {/* Table Header */}
          <RowStack
            spacing={'8px'}
            sx={{
              padding: '18px 24px',
              borderBottom: '0.67px solid #F3F4F6',
            }}
          >
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: 16, color: '#2F6FED' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(18),
                color: (theme) => theme.color.deepBlue,
              }}
            >
              Upcoming Schedule
            </Typography>
          </RowStack>

          {/* Table Rows */}
          {scheduledTrips.map((trip, index) => (
            <ScheduledTripRow
              key={trip.id}
              trip={trip}
              isLast={index === scheduledTrips.length - 1}
            />
          ))}
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
