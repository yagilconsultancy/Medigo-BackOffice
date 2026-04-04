import {
  Box,
  CSSObject,
  Drawer,
  Stack,
  Theme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { AdminInfo, Header } from './ui/components';
import { SidebarLinks, SidebarLinksProps } from './ui/blocks';
import userIcon from './ui/assets/icons/user.svg';

// Sidebar icons
import dashboardIcon from './ui/assets/icons/dashboard-icon.svg';
import bookingIcon from './ui/assets/icons/booking-icon.svg';
import dispatchIcon from './ui/assets/icons/dispatch-Icon.svg';
import gpsIcon from './ui/assets/icons/gps-Icon.svg';
import fleetIcon from './ui/assets/icons/fleet-Icon.svg';
import driverManagementIcon from './ui/assets/icons/drivermanagement-Icon.svg';
import driverPerformanceIcon from './ui/assets/icons/driverperformanceIcon.svg';
import riderManagementIcon from './ui/assets/icons/ridermanagementIcon.svg';
import vehicleIcon from './ui/assets/icons/vihicle-Icon.svg';
import paymentIcon from './ui/assets/icons/payment-Icon.svg';
import invoiceIcon from './ui/assets/icons/invoice-Icon.svg';
import safetyIcon from './ui/assets/icons/safety-Icon.svg';
import notificationIcon from './ui/assets/icons/notification-Icon.svg';
import supportIcon from './ui/assets/icons/support-icon.svg';
import settingsIcon from './ui/assets/icons/settings-icon.svg';
import rolesIcon from './ui/assets/icons/roles-icon.svg';
import logsIcon from './ui/assets/icons/logs-Icon.svg';

const sidebarList: SidebarLinksProps['sidebarList'] = [
  {
    header: 'MAIN MENU',
    items: [
      {
        icon: dashboardIcon,
        text: 'Dashboard Overview',
        link: '/',
      },
    ],
  },
  {
    header: 'OTHERS',
    items: [
      {
        icon: bookingIcon,
        text: 'Booking Management',
        dropdown: [
          { text: 'All Bookings', link: '/bookings' },
          { text: 'Pending Bookings', link: '/bookings/pending' },
          { text: 'Scheduled Trips', link: '/bookings/scheduled' },
          { text: 'Cancelled Trips', link: '/bookings/cancelled' },
        ],
      },
      {
        icon: dispatchIcon,
        text: 'Dispatch Center',
        dropdown: [
          { text: 'Live Dispatch Map', link: '/dispatch' },
          { text: 'Ride Management', link: '/dispatch/rides' },
          { text: 'Auto Dispatch Settings', link: '/dispatch/settings' },
        ],
      },
      // {
      //   icon: gpsIcon,
      //   text: 'GPS Tracking',
      //   dropdown: [
      //     { text: 'Live Driver Map', link: '/gps' },
      //     { text: 'Active Trip Map', link: '/gps/trips' },
      //     { text: 'Driver Route History', link: '/gps/history' },
      //   ],
      // },
      {
        icon: fleetIcon,
        text: 'Fleet Management',
        dropdown: [
          { text: 'Fleet Applications', link: '/fleet' },
          { text: 'Fleet Companies', link: '/fleet/companies' },
          { text: 'Fleet Profiles', link: '/fleet/profiles' },
          { text: 'Fleet Vehicles', link: '/fleet/vehicles' },
        ],
      },
      {
        icon: settingsIcon,
        text: 'Service Management',
        dropdown: [{ text: 'Service Provider', link: '/services/providers' }],
      },
      {
        icon: riderManagementIcon,
        text: 'Facility & Client Mgt',
        dropdown: [
          { text: 'All Riders', link: '/riders' },
          { text: 'Rider Profiles', link: '/riders/profiles' },
          { text: 'Rider Activity', link: '/riders/activity' },
          { text: 'Rider Issues', link: '/riders/issues' },
        ],
      },
      {
        icon: vehicleIcon,
        text: 'Vehicle Management',
        dropdown: [
          { text: 'All Vehicles', link: '/vehicles' },
          { text: 'Vehicle Profiles', link: '/vehicles/profiles' },
          { text: 'Vehicle Documents', link: '/vehicles/documents' },
          { text: 'Vehicle Categories', link: '/vehicles/categories' },
        ],
      },
      {
        icon: paymentIcon,
        text: 'Payment Management',
        dropdown: [
          { text: 'Transactions', link: '/payments' },
          { text: 'Revenue Dashboard', link: '/payments/revenue' },
          { text: 'Driver Payout', link: '/payments/driver-payout' },
          { text: 'Caregiver Payout', link: '/payments/caregiver-payout' },
          { text: 'Refund Management', link: '/payments/refunds' },
        ],
      },
      {
        icon: invoiceIcon,
        text: 'Pricing Management',
        dropdown: [
          { text: 'Pricing Dashboard', link: '/pricing' },
          { text: 'Fare Configuration', link: '/pricing/fares' },
          { text: 'Surcharges', link: '/pricing/surcharges' },
          { text: 'Recurring & Packages', link: '/pricing/recurring' },
          { text: 'Pricing Configuration', link: '/pricing/configuration' },
          { text: 'Pricing Logs', link: '/pricing/logs' },
          { text: 'Commission Settings', link: '/pricing/commissions' },
          { text: 'Cancellation Policy', link: '/pricing/cancellation' },
        ],
      },
      {
        icon: safetyIcon,
        text: 'Safety & Incidents',
        dropdown: [
          { text: 'Incident Report', link: '/safety' },
          { text: 'Safety Alerts', link: '/safety/reports' },
          { text: 'Incident Investigation', link: '/safety/investigations' },
          { text: 'Disciplinary Actions', link: '/safety/disciplinary' },
        ],
      },
      {
        icon: notificationIcon,
        text: 'Notifications',
        dropdown: [
          { text: 'System Notifications', link: '/notifications' },
          { text: 'Rider Notifications', link: '/notifications/riders' },
          { text: 'Driver Notifications', link: '/notifications/drivers' },
          { text: 'Fleet Notifications', link: '/notifications/fleet' },
        ],
      },
      {
        icon: supportIcon,
        text: 'Support & Service',
        dropdown: [
          { text: 'Support Ticket', link: '/support' },
          { text: 'Trip Issue Resolution', link: '/support/issues' },
          { text: 'Contact Logs', link: '/support/contacts' },
        ],
      },
      {
        icon: rolesIcon,
        text: 'Dashboard Settings',
        dropdown: [
          { text: 'Cities & Service Area', link: '/settings/areas' },
          { text: 'Ride Types', link: '/settings/ride-types' },
          { text: 'Roles & Permissions', link: '/settings/permissions' },
        ],
      },
      {
        icon: logsIcon,
        text: 'System Logs & Security',
        dropdown: [
          { text: 'Activity Logs', link: '/logs' },
          { text: 'Login History', link: '/logs/history' },
          { text: 'Security Settings', link: '/logs/security' },
        ],
      },
    ],
  },
];

export type AppDashboardSideBarProps = {
  open: boolean;
  onToggle: () => void;
};

export function AppDashboardSideBar({
  open,
  onToggle,
}: AppDashboardSideBarProps) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const DRAWER_WIDTH = isXs ? '80%' : 259; // Width when sidebar is open
  const COLLAPSED_WIDTH = isXs ? 0 : 72;
  const openedMixin = (theme: Theme): CSSObject => ({
    width: DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'visible',
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'visible',
    width: COLLAPSED_WIDTH,
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        overflow: 'visible',
        height: '100vh',
        maxHeight: '100vh',
        zIndex: theme.zIndex.appBar + 1,
        ...(open && {
          ...openedMixin(theme),
        }),
        ...(!open && {
          ...closedMixin(theme),
        }),
      }}
    >
      <Drawer
        variant={isXs ? 'temporary' : 'permanent'}
        open={open}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          zIndex: theme.zIndex.appBar + 11,
          borderRight: `1px solid #E8ECF0 !important`,
          position: 'relative',

          '& .MuiDrawer-paper': {
            background: (theme) => theme.palette.background.default,
            height: '100%',
            border: 'none',
            '::-webkit-scrollbar': { display: 'none' },
            borderRight: `1px solid #E8ECF0 !important`,
            scrollbarWidth: 'none',
            zIndex: theme.zIndex.appBar + 1,
            ...(open && {
              ...openedMixin(theme),
            }),
            ...(!open && {
              ...closedMixin(theme),
            }),
          },
        }}
      >
        <Stack justifyContent={'space-between'} height={'100%'}>
          {/* Header - fixed at top */}
          <Box
            sx={{
              paddingY: '12px',
              paddingRight: '12px',
              borderBottom: '0.67px solid #E8ECF0',
              zIndex: 9999,
            }}
          >
            <Header isSidebarOpen={open} handleClick={onToggle} />
          </Box>

          {/* Sidebar Links - scrollable */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              '::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            <SidebarLinks sidebarList={sidebarList} isSidebarOpen={open} />
          </Box>

          {/* Admin User - fixed at bottom */}
          <Box
            sx={{
              padding: '12px',
              borderTop: '0.67px solid #E8ECF0',
            }}
          >
            <AdminInfo
              userName="Admin User"
              userMail="admin@medigotransport.com"
              icon={userIcon}
              isSideBarOpen={open}
            />
          </Box>
        </Stack>
      </Drawer>
    </Box>
  );
}
