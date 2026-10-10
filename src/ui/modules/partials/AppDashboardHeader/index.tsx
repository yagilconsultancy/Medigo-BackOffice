'use client';

import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import { RowStack } from '../../components';
import { ChangePasswordModal } from '../AppDashboardSidebar/ui/components/ChangePasswordModal';
import { LogoutModal } from '../AppDashboardSidebar/ui/components/LogoutModal';
import {
  getRefreshToken,
  pxToRem,
  useAuthApi,
  useGetUserProfile,
  useResolvedApiQuery,
} from '@/common';
import { KeyboardEvent, MouseEvent, useState } from 'react';

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
  const { changePassword, logout } = useAuthApi();
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Generate initials from first and last name
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
  };

  const initials = getInitials(userProfile?.first_name, userProfile?.last_name);
  const fullName =
    `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim();
  const profileMenuOpen = Boolean(profileMenuAnchorEl);

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setProfileMenuAnchorEl(event.currentTarget);
    }
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleProfileMenuClose();
    setOpenLogoutModal(true);
  };

  const handleChangePasswordClick = () => {
    handleProfileMenuClose();
    setOpenChangePasswordModal(true);
  };

  const handleCloseLogoutModal = () => {
    setOpenLogoutModal(false);
  };

  const handleCloseChangePasswordModal = () => {
    setOpenChangePasswordModal(false);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    const refreshToken = getRefreshToken();
    await logout({ refresh_token: refreshToken ?? '' });
    setIsLoggingOut(false);
    setOpenLogoutModal(false);
  };
  return (
    <>
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
        <RowStack width={'100%'} justifyContent={'space-between'}>
          <Box />
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              aria-label="Open account menu"
              aria-haspopup="true"
              aria-expanded={profileMenuOpen || undefined}
              onClick={handleProfileMenuOpen}
              onKeyDown={handleProfileMenuKeyDown}
              sx={{
                p: 0.5,
                borderRadius: '999px',
                border: '0.67px solid #E8ECF0',
                background: '#FFFFFF',
                '&:hover': {
                  background: '#F7F9FB',
                },
              }}
            >
              <RowStack spacing={1} alignItems="center">
                <Avatar
                  src={userProfile?.avatar_url}
                  alt={fullName}
                  sx={{
                    bgcolor: '#2F6FED',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    width: 36,
                    height: 36,
                  }}
                >
                  {!userProfile?.avatar_url && initials}
                </Avatar>
                <KeyboardArrowDownIcon
                  sx={{
                    color: '#6B7280',
                    fontSize: 20,
                  }}
                />
              </RowStack>
            </IconButton>
          </Stack>
        </RowStack>
      </AppBar>

      <Popover
        open={profileMenuOpen}
        anchorEl={profileMenuAnchorEl}
        onClose={handleProfileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 280,
            borderRadius: '16px',
            border: '0.67px solid #E8ECF0',
            boxShadow: '0px 24px 60px rgba(15, 23, 42, 0.12)',
            overflow: 'hidden',
          },
        }}
      >
        <Stack sx={{ p: 1.5 }}>
          <RowStack spacing={1.25} sx={{ px: 0.5, pb: 1 }}>
            <Avatar
              src={userProfile?.avatar_url}
              alt={fullName}
              sx={{
                bgcolor: '#2F6FED',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: pxToRem(13),
                width: 40,
                height: 40,
              }}
            >
              {!userProfile?.avatar_url && initials}
            </Avatar>
            <Stack spacing={0.25}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontSize: pxToRem(14),
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {fullName || 'Admin User'}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontSize: pxToRem(12),
                  fontWeight: 400,
                  color: '#6B7280',
                }}
              >
                {userProfile?.email || 'Administrator'}
              </Typography>
            </Stack>
          </RowStack>

          <Divider sx={{ my: 1 }} />

          <MenuItem
            onClick={handleChangePasswordClick}
            sx={{
              borderRadius: '12px',
              py: 1.2,
              px: 1.25,
              gap: 1.25,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: '#2563EB' }}>
              <LockResetIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: pxToRem(13.5),
                fontWeight: 600,
                color: '#111827',
              }}
            >
              Change Password
            </Typography>
          </MenuItem>

          <MenuItem
            onClick={handleLogoutClick}
            sx={{
              borderRadius: '12px',
              py: 1.2,
              px: 1.25,
              gap: 1.25,
              color: '#EF4444',
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: '#EF4444' }}>
              <LogoutIcon sx={{ fontSize: 18, transform: 'scaleX(-1)' }} />
            </ListItemIcon>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: pxToRem(13.5),
                fontWeight: 600,
              }}
            >
              Logout
            </Typography>
          </MenuItem>
        </Stack>
      </Popover>

      <LogoutModal
        open={openLogoutModal}
        handleClose={handleCloseLogoutModal}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
      <ChangePasswordModal
        open={openChangePasswordModal}
        handleClose={handleCloseChangePasswordModal}
        onSubmit={changePassword}
      />
    </>
  );
};
