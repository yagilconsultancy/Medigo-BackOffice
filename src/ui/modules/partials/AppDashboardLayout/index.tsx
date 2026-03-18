import { ReactNode, useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { AppDashboardSideBar } from '../AppDashboardSidebar';
import { AppDashBoardHeader } from '../AppDashboardHeader';
// import { AppHeader, AppSideBar } from '@/ui/modules/partials';

export type AppLayoutProps = {
  children: ReactNode;
};

export const AppDashboardLayout = ({ children }: AppLayoutProps) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));

  const drawerWidth = isXs ? '80%' : 259; // Width when sidebar is open
  const collapsedWidth = isXs ? 0 : 72; // Width when sidebar is collapsed

  // Initialize sidebar as open
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handler to toggle sidebar state
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Sidebar */}
      <AppDashboardSideBar open={sidebarOpen} onToggle={handleSidebarToggle} />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: sidebarOpen ? `${drawerWidth}px` : `${collapsedWidth}px`,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          padding: {
            xs: '16px',
            sm: '24px 30px',
          },
          width: {
            xs: 'calc(100% - 0px)',
            sm: sidebarOpen
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${collapsedWidth}px)`,
          },
          background: '#F7F9FB',
        }}
      >
        {/* Header */}
        <AppDashBoardHeader
          sidebarOpen={sidebarOpen}
          drawerWidth={drawerWidth}
          collapsedWidth={collapsedWidth}
        />

        {/* Content */}
        <Box
          sx={{
            flexGrow: 1,
            // marginLeft: '31px',
            // marginY: '28px',
            // marginRight: '47px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </Box>
  );
};
