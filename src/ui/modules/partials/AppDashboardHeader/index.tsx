'use client';

import {
  AppBar,
  Avatar,
  Badge,
  Toolbar
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { AppSearchField, RowStack } from '../../components';
import { IconComponent } from './ui/components';
import { toast } from 'sonner';
import usericon from './ui/assets/icons/user.svg';

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
  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        height: sidebarOpen ? '75px' : "auto",
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
        <RowStack width={"100%"} justifyContent={'space-between'}>
          <AppSearchField 
           placeholder='Search bookings, drivers, or trips…'
          />
          <RowStack spacing={1}>
            <IconComponent
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
            />
            <Avatar
              src={usericon.src}
              alt="user"
              sx={{
                width: '40px',
                height: '40px',
              }}
            />
          </RowStack>
        </RowStack>
      </>
    </AppBar>
  );
};
