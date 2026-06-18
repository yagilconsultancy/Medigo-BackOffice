'use client';

import { AppBar, Avatar, Badge, Box } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { RowStack } from '../../components';
import { IconComponent } from './ui/components';
import { toast } from 'sonner';
import { pxToRem, useGetUserProfile, useResolvedApiQuery } from '@/common';

type AppHeaderProps = {
  sidebarOpen: boolean;
  drawerWidth: number | string;
  collapsedWidth: number;
};

export const AppDashBoardHeader = ({
  sidebarOpen,
  drawerWidth,
  collapsedWidth,
}: AppHeaderProps) => {
  const { data: userProfile } = useResolvedApiQuery(useGetUserProfile, null);

  // Generate initials from first and last name
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  };

  const initials = getInitials(userProfile?.first_name, userProfile?.last_name);
  const fullName =
    `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim();
  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        height: sidebarOpen ? '75px' : 'auto',
        background: (theme) => theme.palette.background.default,
        padding: '12px',
        pr: { xs: '20px', lg: '80px' },
        // borderBottom: '1px solid #EBEBEB',
        border: '0.67px solid #E8ECF0',
        width: `calc(100% - ${sidebarOpen ? drawerWidth : collapsedWidth}px)`,
        marginLeft: `${sidebarOpen ? drawerWidth : collapsedWidth}px`,
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      <>
        <RowStack width={'100%'} justifyContent={'space-between'}>
          {/* <AppSearchField placeholder="Search bookings, drivers, or trips…" /> */}
          <Box />
          <RowStack spacing={1}>
            {/* <IconComponent
              icon={
                <Badge color="secondary" variant="dot">
                  <NotificationsNoneIcon />
                </Badge>
              }
              handleClick={() => toast.success('Notification')}
            />
            <IconComponent
              icon={<SettingsOutlinedIcon />}
              handleClick={() => toast.success('Settings')}
            /> */}
            <Avatar
              src={userProfile?.avatar_url}
              alt={fullName}
              sx={{
                bgcolor: '#2F6FED',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: pxToRem(13),
              }}
            >
              {!userProfile?.avatar_url && initials}
            </Avatar>
            {/* <Avatar
              src={usericon.src}
              alt="user"
              sx={{
                width: '40px',
                height: '40px',
              }}
            /> */}
          </RowStack>
        </RowStack>
      </>
    </AppBar>
  );
};
