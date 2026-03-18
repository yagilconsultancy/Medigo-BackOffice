'use client';
import { useState } from 'react';
import { Grid, Stack } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppCardparent,
  AppTab,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { getTodayDate } from '../../../common';
import {
  CardComponent,
  DriverComponent,
  HomeChart,
  HomeProgressBar,
  RecentActivity,
} from './ui/components';
import TripsIcon from './ui/assets/icons/trips.icon.svg';
import DriversIcon from './ui/assets/icons/drivers-icon.svg';
import PendingIcon from './ui/assets/icons/pending-icon.svg';
import RevenueIcon from './ui/assets/icons/revenue-icon.svg';
import TrendingUp from './ui/assets/icons/TrendingUp.svg';
import TrendingDown from './ui/assets/icons/TrendingDown.svg';
import RequestIcon from './ui/assets/icons/request-icon.svg';
import StartIcon from './ui/assets/icons/start-icon.svg';
import CompleteIcon from './ui/assets/icons/complete-icon.svg';
import CardIcon from './ui/assets/icons/card-icon.svg';
import NewDriverIcon from './ui/assets/icons/new-driver-icon.svg';
import { CardTitleAndDesc } from '../../modules/components/AppCardparent/ui/components';

const cardData = [
  {
    top: {
      icon: TripsIcon,
      iconBg: '#EBF2FF',
      badgeIcon: TrendingUp,
      badgeBg: '#ECFDF5',
      volumeColor: '#10B981',
      volumeNum: '+12.5%',
    },
    bottom: {
      cardNum: '3,482',
      cardDesc: 'Total Trips',
    },
  },
  {
    top: {
      icon: DriversIcon,
      iconBg: '#EEF2FF',
      badgeIcon: TrendingUp,
      badgeBg: '#ECFDF5',
      volumeColor: '#10B981',
      volumeNum: '+4.2%',
    },
    bottom: {
      cardNum: '148',
      cardDesc: 'Active Drivers',
    },
  },
  {
    top: {
      icon: PendingIcon,
      iconBg: '#FFFBEB',
      badgeIcon: TrendingDown,
      badgeBg: '#FEF2F2',
      volumeColor: '#EF4444',
      volumeNum: '-8.1%',
    },
    bottom: {
      cardNum: '37',
      cardDesc: 'Pending Bookings',
    },
  },
  {
    top: {
      icon: RevenueIcon,
      iconBg: '#ECFDF5',
      badgeIcon: TrendingUp,
      badgeBg: '#ECFDF5',
      volumeColor: '#10B981',
      volumeNum: '+18.7%',
    },
    bottom: {
      cardNum: '$84,320',
      cardDesc: 'Revenue',
    },
  },
];

const tripDataByPeriod = [
  // 7 Days
  [
    { day: 'Mon', trips: 38 },
    { day: 'Tue', trips: 55 },
    { day: 'Wed', trips: 49 },
    { day: 'Thu', trips: 63 },
    { day: 'Fri', trips: 72 },
    { day: 'Sat', trips: 41 },
    { day: 'Sun', trips: 36 },
  ],
  // 30 Days
  [
    { day: 'Week 1', trips: 245 },
    { day: 'Week 2', trips: 312 },
    { day: 'Week 3', trips: 287 },
    { day: 'Week 4', trips: 356 },
  ],
  // 90 Days
  [
    { day: 'Jan', trips: 820 },
    { day: 'Feb', trips: 932 },
    { day: 'Mar', trips: 1105 },
  ],
];

const progressDataArray = [
  { label: 'Completed', value: 68, color: '#10B981' },
  { label: 'Assigned', value: 14, color: '#6366F1' },
  { label: 'In Transit', value: 11, color: '#2F6FED' },
  { label: 'Pending', value: 7, color: '#F59E0B' },
];

const driverData = [
  {
    num: '1',
    firstName: 'Marcus',
    lastName: 'Johnson',
    trips: '312',
    value: 4.9,
    avatarBg: '#6366F1',
  },
  {
    num: '2',
    firstName: 'Sarah',
    lastName: 'Williams',
    trips: '287',
    value: 4.8,
    avatarBg: '#8B5CF6',
  },
  {
    num: '3',
    firstName: 'David',
    lastName: 'Chen',
    trips: '264',
    value: 4.8,
    avatarBg: '#F59E0B',
  },
  {
    num: '4',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    trips: '241',
    value: 4.7,
    avatarBg: '#EC4899',
  },
  {
    num: '5',
    firstName: 'James',
    lastName: 'Thompson',
    trips: '218',
    value: 4.7,
    avatarBg: '#10B981',
  },
];

const recentData = [
  {
    icon: RequestIcon,
    iconBg: '#EEF2FF',
    activityTitle: 'New booking request received',
    activityDesc: 'BK-20491 · Patient: Helen Moore',
    time: '2 min ago',
  },
  {
    icon: StartIcon,
    iconBg: '#F0FDF4',
    activityTitle: 'Driver started trip',
    activityDesc: 'Marcus Johnson → Memorial Hospital',
    time: '14 min ago',
  },
  {
    icon: CompleteIcon,
    iconBg: '#ECFDF5',
    activityTitle: 'Trip completed',
    activityDesc: 'BK-20488 · Total: $47.50',
    time: '28 min ago',
  },
  {
    icon: CardIcon,
    iconBg: '#FFF7ED',
    activityTitle: 'Payment received',
    activityDesc: 'Invoice #INV-8821 · $230.00',
    time: '45 min ago',
  },
  {
    icon: NewDriverIcon,
    iconBg: '#FDF2F8',
    activityTitle: 'New driver onboarded',
    activityDesc: 'Emma Davis · Vehicle: Toyota Sienna',
    time: '1 hr ago',
  },
  {
    icon: CompleteIcon,
    iconBg: '#ECFDF5',
    activityTitle: 'Trip completed',
    activityDesc: 'BK-20485 · Total: $62.00',
    time: '1.5 hrs ago',
  },
];

// const columns = [
//   { field: "fleet", headerName: "Fleet", flex: 1.5, minWidth: 200 },
//   { field: "contact", headerName: "Contact", flex: 1.5, minWidth: 200 },
//   { field: "city", headerName: "City", flex: 1, minWidth: 150 },
//   { field: "vehicles", headerName: "Vehicles", flex: 0.7, minWidth: 120 },
//   { field: "drivers", headerName: "Drivers", flex: 0.7, minWidth: 120 },
//   { field: "revenue", headerName: "Revenue", flex: 1, minWidth: 150 },
//   { field: "status", headerName: "Status", flex: 1, minWidth: 150 },
//   { field: "joined", headerName: "Joined", flex: 1, minWidth: 150 },
//   { field: "actions", headerName: "Actions", flex: 0.5, minWidth: 100 },
// ];

// const rows = [
//   {
//     id: "FL-001",
//     fleet: "MedRide Express",
//     contact: "Jean-Pierre Côté (jpcote@medride.ca)",
//     city: "Toronto, ON",
//     vehicles: 48,
//     drivers: 42,
//     revenue: "$128,400",
//     status: "Active",
//     joined: "Jan 2024",
//     actions: "view",
//   },
//   {
//     id: "FL-002",
//     fleet: "CareTransit Co.",
//     contact: "Anya Singh (anya@caretransit.ca)",
//     city: "Vancouver, BC",
//     vehicles: 36,
//     drivers: 31,
//     revenue: "$94,200",
//     status: "Active",
//     joined: "Feb 2024",
//     actions: "view",
//   },
//   {
//     id: "FL-003",
//     fleet: "HealthHaul LLC",
//     contact: "David Kim (david@healthhaul.ca)",
//     city: "Montréal, QC",
//     vehicles: 29,
//     drivers: 24,
//     revenue: "$71,600",
//     status: "Active",
//     joined: "Mar 2024",
//     actions: "view",
//   },
//   {
//     id: "FL-004",
//     fleet: "SafeRide Medical",
//     contact: "Tina Nguyen (tina@saferidemed.ca)",
//     city: "Calgary, AB",
//     vehicles: 22,
//     drivers: 19,
//     revenue: "$58,800",
//     status: "Active",
//     joined: "Apr 2024",
//     actions: "view",
//   },
//   {
//     id: "FL-005",
//     fleet: "PatientPath Inc.",
//     contact: "Marc Beausoleil (marc@patientpath.ca)",
//     city: "Edmonton, AB",
//     vehicles: 18,
//     drivers: 16,
//     revenue: "$32,100",
//     status: "Suspended",
//     joined: "May 2024",
//     actions: "view",
//   },
//   {
//     id: "FL-006",
//     fleet: "MobiCare Transport",
//     contact: "Sandra Lee (sandra@mobicare.ca)",
//     city: "Ottawa, ON",
//     vehicles: 31,
//     drivers: 27,
//     revenue: "$83,500",
//     status: "Active",
//     joined: "Jun 2024",
//     actions: "view",
//   },
//   {
//     id: "FL-007",
//     fleet: "Apex Medical Rides",
//     contact: "Robert Gallant (robert@apexmed.ca)",
//     city: "Winnipeg, MB",
//     vehicles: 25,
//     drivers: 21,
//     revenue: "$66,900",
//     status: "Active",
//     joined: "Jul 2024",
//     actions: "view",
//   },
//   {
//     id: "FL-008",
//     fleet: "QuickCare Mobility",
//     contact: "Priya Sharma (priya@quickcare.ca)",
//     city: "Halifax, NS",
//     vehicles: 14,
//     drivers: 12,
//     revenue: "—",
//     status: "Pending",
//     joined: "Jan 2025",
//     actions: "view",
//   },
// ];

export const HomePage = () => {
  const today = getTodayDate();
  const [activeTripTab, setActiveTripTab] = useState(0);
  return (
    <AppDashboardLayout>
      <Stack spacing={3}>
        <DashboardTitleAndDesc
          title="Analytics Dashboard"
          desc={`Overview of operations as of today, ${today}`}
        />
        <Grid container spacing={'20px'}>
          {cardData.map((card, index) => (
            <Grid
              size={{
                sm: 6,
                lg: 3,
              }}
              key={index}
            >
              <CardComponent {...card} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={'20px'}>
          <Grid
            size={{
              sm: 12,
              lg: 7,
            }}
          >
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <RowStack width={'100%'} justifyContent={'space-between'}>
                  <CardTitleAndDesc
                    title="Trip Volume Trend"
                    desc="Number of trips over time"
                  />
                  <AppTab
                    tabs={[
                      { label: '7 Days' },
                      { label: '30 Days' },
                      { label: '90 Days' },
                    ]}
                    onChange={(index) => setActiveTripTab(index)}
                  />
                </RowStack>
                <HomeChart
                  data={tripDataByPeriod[activeTripTab]}
                  xKey="day"
                  yKey="trips"
                />
              </Stack>
            </AppCardparent>
          </Grid>
          <Grid
            size={{
              sm: 12,
              lg: 5,
            }}
          >
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <CardTitleAndDesc
                  title="Trip Volume Trend"
                  desc="Number of trips over time"
                />
                <Stack spacing={'20px'}>
                  {progressDataArray.map((progress, index) => (
                    <HomeProgressBar {...progress} key={index} />
                  ))}
                </Stack>
              </Stack>
            </AppCardparent>
          </Grid>
        </Grid>
        <Grid container spacing={'20px'}>
          <Grid
            size={{
              sm: 12,
              lg: 6,
            }}
          >
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <CardTitleAndDesc
                  title="Top Performing Drivers"
                  desc="Ranked by trips completed this month"
                />
                {driverData.map((driver, index) => (
                  <DriverComponent {...driver} key={index} />
                ))}
              </Stack>
            </AppCardparent>
          </Grid>
          <Grid
            size={{
              sm: 12,
              lg: 6,
            }}
          >
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <CardTitleAndDesc
                  title="Recent Activity"
                  desc="Latest system events and updates"
                />
                {recentData.map((recent, index) => (
                  <RecentActivity {...recent} key={index} />
                ))}
              </Stack>
            </AppCardparent>
          </Grid>
        </Grid>
      </Stack>
    </AppDashboardLayout>
  );
};

{
  /* <AppGridtable
          columns={columns}
          // isFetchingData={isFetching}
          data={rows}
          // onRowClick={handleRowClicked}
          // onPaginationModelChange={setPaginationModel}
          // initialPageSize={itemsPerPage}
          // permissionErrorState={
          //   has403Error ? (
          //     <PermissionError
          //       message={
          //         errorMessage || "You do not have permission to access this resource."
          //       }
          //     />
          //   ) : undefined
          // }
          // emptyState={
          //   !customersData.length ? (
          //     <EmptyState
          //       emptyState={
          //         <Typography
          //           sx={{
          //             fontSize: pxToRem(14),
          //             fontWeight: 400,
          //             color: "text.primary",
          //             lineHeight: "140%",
          //           }}
          //         >
          //           No Registered user at this time
          //         </Typography>
          //       }
          //     />
          //   ) : undefined
          // }
          sx={{
            height: "auto",
            width: "100%",
            // minHeight: !customersData.length ? "400px" : "auto",
          }}
        >
          <Typography variant="h6">Customers</Typography>
        </AppGridtable> */
}
