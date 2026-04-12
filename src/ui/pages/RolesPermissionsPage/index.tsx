'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Stack, Typography, CircularProgress } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  pxToRem,
  useListAdminRoles,
  useGetAdminRoleDetail,
  useResolvedApiQuery,
  useRolesPermissionsApi,
} from '../../../common';
import type { AdminRoleCardResponse } from '../../../common';
import {
  RoleCard,
  InviteAdminModal,
  CreateRoleModal,
  PermissionControls,
} from './ui/component';
import { EmptyState } from '../../modules/blocks';

// ─── Types ──────────────────────────────────────────────────────────────────

type AdminData = {
  id: string;
  initials: string;
  name: string;
  email: string;
  lastActive: string;
  joined: string;
};

type RoleData = {
  id: string;
  roleName: string;
  description: string;
  count: number;
  activeColor: string;
  iconBg: string;
  headerBg: string;
  icon: React.ReactNode;
  iconColor: string;
  admins: AdminData[];
};

// ─── Sample Data ────────────────────────────────────────────────────────────

// ─── Role Icon and Color Config ─────────────────────────────────────────────

const roleIconMap: Record<
  string,
  {
    icon: React.ReactNode;
    color: string;
    iconBg: string;
    headerBg: string;
  }
> = {
  'super admin': {
    icon: (
      <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
    ),
    color: '#2F6FED',
    iconBg: '#EBF2FF',
    headerBg: '#EBF2FF',
  },
  'operations admin': {
    icon: (
      <ManageAccountsOutlinedIcon sx={{ fontSize: 18, color: '#10B981' }} />
    ),
    color: '#10B981',
    iconBg: '#ECFDF5',
    headerBg: '#ECFDF5',
  },
  'finance admin': {
    icon: (
      <AccountBalanceOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />
    ),
    color: '#6366F1',
    iconBg: '#EEF2FF',
    headerBg: '#EEF2FF',
  },
  'support admin': {
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />,
    color: '#F59E0B',
    iconBg: '#FFFBEB',
    headerBg: '#FFFBEB',
  },
  'fleet manager': {
    icon: (
      <PeopleOutlineOutlinedIcon sx={{ fontSize: 18, color: '#EC4899' }} />
    ),
    color: '#EC4899',
    iconBg: '#FDF2F8',
    headerBg: '#FDF2F8',
  },
};

const defaultRoleConfig = {
  icon: <ManageAccountsOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />,
  color: '#6B7280',
  iconBg: '#F3F4F6',
  headerBg: '#F3F4F6',
};

const hardcodedRoles: RoleData[] = [
  {
    id: 'super-admin',
    roleName: 'Super Admin',
    description: 'All system access and full administrative controls',
    count: 2,
    activeColor: '#2F6FED',
    iconBg: '#EBF2FF',
    headerBg: '#EBF2FF',
    icon: (
      <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
    ),
    iconColor: '#2F6FED',
    admins: [
      {
        id: '1',
        initials: 'LF',
        name: 'Lena Fischer',
        email: 'lena@medigo.ca',
        lastActive: 'Yesterday',
        joined: 'Mar 3, 2025',
      },
      {
        id: '2',
        initials: 'JC',
        name: 'John Carter',
        email: 'john@medigo.ca',
        lastActive: 'Today',
        joined: 'Jan 12, 2025',
      },
    ],
  },
  {
    id: 'operations-admin',
    roleName: 'Operations Admin',
    description:
      'Manages bookings, dispatch, drivers, riders, and GPS tracking',
    count: 5,
    activeColor: '#10B981',
    iconBg: '#ECFDF5',
    headerBg: '#ECFDF5',
    icon: (
      <ManageAccountsOutlinedIcon sx={{ fontSize: 18, color: '#10B981' }} />
    ),
    iconColor: '#10B981',
    admins: [
      {
        id: '3',
        initials: 'AB',
        name: 'Angela Brooks',
        email: 'angela@medigo.ca',
        lastActive: 'Yesterday',
        joined: 'Feb 8, 2025',
      },
      {
        id: '4',
        initials: 'CO',
        name: 'Christine Osei',
        email: 'c.osei@medigo.ca',
        lastActive: 'Today',
        joined: 'Feb 8, 2025',
      },
      {
        id: '5',
        initials: 'DK',
        name: 'David Kim',
        email: 'david@medigo.ca',
        lastActive: 'Yesterday',
        joined: 'Feb 8, 2025',
      },
      {
        id: '6',
        initials: 'RT',
        name: 'Rachel Torres',
        email: 'rachel@medigo.ca',
        lastActive: 'Today',
        joined: 'Mar 1, 2025',
      },
      {
        id: '7',
        initials: 'MC',
        name: 'Michael Chen',
        email: 'm.chen@medigo.ca',
        lastActive: '2 days ago',
        joined: 'Feb 15, 2025',
      },
    ],
  },
  {
    id: 'finance-admin',
    roleName: 'Finance Admin',
    description: 'Access to payments, invoices, billing, and financial reports',
    count: 3,
    activeColor: '#6366F1',
    iconBg: '#EEF2FF',
    headerBg: '#EEF2FF',
    icon: (
      <AccountBalanceOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />
    ),
    iconColor: '#6366F1',
    admins: [
      {
        id: '8',
        initials: 'PS',
        name: 'Priya Sharma',
        email: 'priya@medigo.ca',
        lastActive: 'Today',
        joined: 'Mar 20, 2025',
      },
      {
        id: '9',
        initials: 'TW',
        name: 'Thomas Wright',
        email: 'thomas@medigo.ca',
        lastActive: 'Yesterday',
        joined: 'Feb 28, 2025',
      },
      {
        id: '10',
        initials: 'EW',
        name: 'Emily Watson',
        email: 'emily@medigo.ca',
        lastActive: '3 days ago',
        joined: 'Mar 10, 2025',
      },
    ],
  },
  {
    id: 'support-admin',
    roleName: 'Support Admin',
    description:
      'Handles support tickets, rider/driver issues, and safety cases',
    count: 8,
    activeColor: '#F59E0B',
    iconBg: '#FFFBEB',
    headerBg: '#FFFBEB',
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />,
    iconColor: '#F59E0B',
    admins: [
      {
        id: '11',
        initials: 'MB',
        name: 'Marcus Bell',
        email: 'marcus@medigo.ca',
        lastActive: 'Today',
        joined: 'Jan 5, 2025',
      },
      {
        id: '12',
        initials: 'SL',
        name: 'Sandra Lee',
        email: 'sandra@medigo.ca',
        lastActive: 'Yesterday',
        joined: 'Feb 12, 2025',
      },
      {
        id: '13',
        initials: 'JP',
        name: 'James Park',
        email: 'james@medigo.ca',
        lastActive: 'Today',
        joined: 'Mar 5, 2025',
      },
      {
        id: '14',
        initials: 'LJ',
        name: 'Lisa Johnson',
        email: 'lisa@medigo.ca',
        lastActive: '2 days ago',
        joined: 'Jan 20, 2025',
      },
      {
        id: '15',
        initials: 'OH',
        name: 'Omar Hassan',
        email: 'omar@medigo.ca',
        lastActive: 'Yesterday',
        joined: 'Feb 1, 2025',
      },
      {
        id: '16',
        initials: 'NP',
        name: 'Nina Patel',
        email: 'nina@medigo.ca',
        lastActive: 'Today',
        joined: 'Mar 15, 2025',
      },
      {
        id: '17',
        initials: 'KB',
        name: 'Kevin Brown',
        email: 'kevin@medigo.ca',
        lastActive: '3 days ago',
        joined: 'Feb 22, 2025',
      },
      {
        id: '18',
        initials: 'AC',
        name: 'Amy Chen',
        email: 'amy@medigo.ca',
        lastActive: 'Yesterday',
        joined: 'Jan 18, 2025',
      },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const RolesPermissionsPage = () => {
  const [mainTab, setMainTab] = useState<'roles' | 'permissions'>('roles');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState<string>('');

  // API hooks
  const { removeRole } = useRolesPermissionsApi();

  // Fetch roles from API
  const { data: apiRolesData, refetch: refetchRoles } = useResolvedApiQuery(
    useListAdminRoles,
    [] as AdminRoleCardResponse[]
  );

  // Fetch role details when a role is selected
  const { data: roleDetailData, isFetching: isFetchingRoleDetail, refetch: refetchRoleDetail } =
    useResolvedApiQuery(useGetAdminRoleDetail, null, activeRoleId);

  // Handler to remove admin from role
  const handleRemoveAdmin = async (userId: string, roleId: string) => {
    const success = await removeRole({
      user_id: userId,
      role_id: roleId,
    });

    if (success) {
      // Refetch role details to update the admin list
      await refetchRoleDetail();
      // Refetch roles to update the count
      await refetchRoles();
    }
  };

  // Helper function to generate light background color from hex
  const getLightBg = (hexColor: string): string => {
    // Map of specific colors to their light backgrounds
    const colorBgMap: Record<string, string> = {
      '#8B5CF6': '#F5F3FF', // Purple
      '#3B82F6': '#EFF6FF', // Blue
      '#10B981': '#ECFDF5', // Green
      '#F59E0B': '#FFFBEB', // Amber/Yellow
      '#2F6FED': '#EBF2FF', // Blue (legacy)
      '#6366F1': '#EEF2FF', // Indigo
      '#EC4899': '#FDF2F8', // Pink
    };
    return colorBgMap[hexColor] || '#F3F4F6'; // Default gray background
  };

  // Map API data to UI format
  const roles: RoleData[] = useMemo(
    () =>
      apiRolesData.map((role) => {
        const normalizedName = role.name.toLowerCase();
        const config = roleIconMap[normalizedName] || defaultRoleConfig;

        // Use API color if available, otherwise fall back to roleIconMap
        const roleColor = role.color || config.color;
        const roleBg = getLightBg(roleColor);

        return {
          id: role.id,
          roleName: role.display_name,
          description: `Manages ${role.total_modules} modules`,
          count: role.admin_count,
          activeColor: roleColor,
          iconBg: roleBg,
          headerBg: roleBg,
          icon: config.icon,
          iconColor: roleColor,
          admins: [], // Admins will be fetched separately when role is selected
        };
      }),
    [apiRolesData]
  );

  // Set initial active role when roles are loaded
  useEffect(() => {
    if (roles.length > 0 && !activeRoleId) {
      setActiveRoleId(roles[0].id);
    }
  }, [roles, activeRoleId]);

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Map admins from role detail API
  const admins: AdminData[] = useMemo(() => {
    if (!roleDetailData || !roleDetailData.admins) return [];

    return roleDetailData.admins.map((admin: any) => ({
      id: admin.id || admin.admin_id || '',
      initials: getInitials(admin.name || admin.full_name || 'N/A'),
      name: admin.name || admin.full_name || 'N/A',
      email: admin.email || 'N/A',
      lastActive: admin.last_active || admin.last_login || 'N/A',
      joined: admin.created_at ? formatDate(admin.created_at) : 'N/A',
    }));
  }, [roleDetailData]);

  const activeRole = roles.find((r) => r.id === activeRoleId);

  // Merge activeRole with admins from API
  const activeRoleWithAdmins = activeRole
    ? { ...activeRole, admins }
    : undefined;

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Main Tabs */}
        <RowStack spacing={'16px'}>
          <Box
            onClick={() => setMainTab('roles')}
            sx={{
              padding: '14px 15px',
              borderRadius: '10px',
              width: 244,
              textAlign: 'center',
              cursor: 'pointer',
              background: mainTab === 'roles' ? '#2F6FED' : '#FFFFFF',
              border:
                mainTab === 'roles' ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: mainTab === 'roles' ? 500 : 400,
                fontSize: pxToRem(18),
                lineHeight: '1em',
                color: mainTab === 'roles' ? '#FFFFFF' : '#000000',
                opacity: mainTab === 'roles' ? 1 : 0.6,
              }}
            >
              Admin Roles
            </Typography>
          </Box>
          <Box
            onClick={() => setMainTab('permissions')}
            sx={{
              padding: '14px 15px',
              borderRadius: '10px',
              width: 244,
              textAlign: 'center',
              cursor: 'pointer',
              background: mainTab === 'permissions' ? '#2F6FED' : '#FFFFFF',
              border:
                mainTab === 'permissions'
                  ? 'none'
                  : '1px solid rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: mainTab === 'permissions' ? 500 : 400,
                fontSize: pxToRem(18),
                lineHeight: '1em',
                color: mainTab === 'permissions' ? '#FFFFFF' : '#000000',
                opacity: mainTab === 'permissions' ? 1 : 0.6,
              }}
            >
              Permission Controls
            </Typography>
          </Box>
        </RowStack>

        {/* Admin Roles Tab */}
        {mainTab === 'roles' && (
          <Stack spacing={'24px'}>
            {/* Header */}
            <RowStack justifyContent={'space-between'}>
              <DashboardTitleAndDesc
                title="Admin Roles"
                desc="Manage admin accounts assigned to each role and invite new team members"
              />
              <RowStack spacing={'12px'}>
                <AppButton
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => setIsCreateRoleModalOpen(true)}
                  sx={{
                    background: '#10B981',
                    color: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '8px 20px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    fontFamily: (theme) => theme.typography.fontFamily,
                    height: 40,
                    boxShadow: '0px 4px 12px 0px rgba(16, 185, 129, 0.27)',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      background: '#059669',
                      boxShadow: '0px 4px 12px 0px rgba(16, 185, 129, 0.35)',
                    },
                  }}
                >
                  Create Role
                </AppButton>
                <AppButton
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => setIsInviteModalOpen(true)}
                  sx={{
                    background: '#2F6FED',
                    color: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '8px 20px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    fontFamily: (theme) => theme.typography.fontFamily,
                    height: 40,
                    boxShadow: '0px 4px 12px 0px rgba(47, 111, 237, 0.27)',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      background: '#2558C9',
                      boxShadow: '0px 4px 12px 0px rgba(47, 111, 237, 0.35)',
                    },
                  }}
                >
                  Invite Admin
                </AppButton>
              </RowStack>
            </RowStack>

            {/* Role Cards */}
            <Grid container spacing={'12px'}>
              {roles.map((role) => (
                <Grid key={role.id} size={{ xs: 6, lg: 3 }}>
                  <RoleCard
                    icon={
                      role.id === activeRoleId
                        ? React.cloneElement(
                            role.icon as React.ReactElement<{ sx: object }>,
                            {
                              sx: { fontSize: 18, color: '#FFFFFF' },
                            }
                          )
                        : role.icon
                    }
                    count={role.count}
                    roleName={role.roleName}
                    adminLabel={`${role.count} admin${role.count !== 1 ? 's' : ''}`}
                    isActive={role.id === activeRoleId}
                    activeColor={role.activeColor}
                    iconBg={role.iconBg}
                    onClick={() => setActiveRoleId(role.id)}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Selected Role Detail */}
            {activeRoleWithAdmins && (
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                  overflow: 'hidden',
                }}
              >
                {/* Role Header */}
                <RowStack
                  spacing={'12px'}
                  sx={{
                    padding: '16px 24px',
                    background: activeRoleWithAdmins.headerBg,
                  borderBottom: '0.67px solid #F0F4F8',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '14px',
                    background: activeRoleWithAdmins.activeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {React.cloneElement(
                    activeRoleWithAdmins.icon as React.ReactElement<{ sx: object }>,
                    {
                      sx: { fontSize: 18, color: '#FFFFFF' },
                    }
                  )}
                </Box>
                <Stack sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(15),
                      color: '#111827',
                      lineHeight: '1.5em',
                    }}
                  >
                    {activeRoleWithAdmins.roleName}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#6B7280',
                      lineHeight: '1.5em',
                    }}
                  >
                    {activeRoleWithAdmins.description}
                  </Typography>
                </Stack>
                <RowStack spacing={'6px'}>
                  <PeopleOutlineOutlinedIcon
                    sx={{ fontSize: 14, color: activeRoleWithAdmins.activeColor }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: activeRoleWithAdmins.activeColor,
                      lineHeight: '1.5em',
                    }}
                  >
                    {activeRoleWithAdmins.admins.length} admin
                    {activeRoleWithAdmins.admins.length !== 1 ? 's' : ''}
                  </Typography>
                </RowStack>
              </RowStack>

              {/* Admin List */}
              <Stack spacing={'12px'} sx={{ padding: '20px 24px' }}>
                {isFetchingRoleDetail ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '40px',
                    }}
                  >
                    <CircularProgress size={32} />
                  </Box>
                ) : activeRoleWithAdmins.admins.length === 0 ? (
                  <Box sx={{ padding: '20px 0' }}>
                    <EmptyState
                      emptyState={
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(14),
                            color: '#9CA3AF',
                            textAlign: 'center',
                          }}
                        >
                          No admins assigned to this role
                        </Typography>
                      }
                    />
                  </Box>
                ) : (
                  activeRoleWithAdmins.admins.map((admin) => (
                  <RowStack
                    key={admin.id}
                    spacing={'16px'}
                    sx={{
                      padding: '16px 20px',
                      background: '#F7F9FB',
                      border: '0.67px solid #F0F4F8',
                      borderRadius: '14px',
                    }}
                  >
                    {/* Avatar */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: activeRoleWithAdmins.activeColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(13),
                          color: '#FFFFFF',
                        }}
                      >
                        {admin.initials}
                      </Typography>
                    </Box>

                    {/* Name + Email */}
                    <Stack sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                          lineHeight: '1.5em',
                        }}
                      >
                        {admin.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          color: '#9CA3AF',
                          lineHeight: '1.5em',
                        }}
                      >
                        {admin.email}
                      </Typography>
                    </Stack>

                    {/* Last Active */}
                    <Stack alignItems={'flex-end'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#9CA3AF',
                          lineHeight: '1.5em',
                        }}
                      >
                        Last active
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 500,
                          fontSize: pxToRem(12.5),
                          color: '#374151',
                          lineHeight: '1.5em',
                        }}
                      >
                        {admin.lastActive}
                      </Typography>
                    </Stack>

                    {/* Joined */}
                    <Stack alignItems={'flex-end'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#9CA3AF',
                          lineHeight: '1.5em',
                        }}
                      >
                        Joined
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 500,
                          fontSize: pxToRem(12.5),
                          color: '#374151',
                          lineHeight: '1.5em',
                        }}
                      >
                        {admin.joined}
                      </Typography>
                    </Stack>

                    {/* Remove Button */}
                    <Box
                      onClick={() => handleRemoveAdmin(admin.id, activeRoleId)}
                      sx={{
                        padding: '7px 14px',
                        background: '#FEF2F2',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        '&:hover': { background: '#FEE2E2' },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(12),
                          color: '#EF4444',
                          lineHeight: '1.5em',
                        }}
                      >
                        Remove
                      </Typography>
                    </Box>
                  </RowStack>
                  ))
                )}
              </Stack>
            </Stack>
            )}
          </Stack>
        )}

        {/* Permission Controls Tab */}
        {mainTab === 'permissions' && <PermissionControls />}
      </Stack>

      {/* Create Role Modal */}
      <CreateRoleModal
        open={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onSuccess={() => {
          refetchRoles();
        }}
      />

      {/* Invite Admin Modal */}
      <InviteAdminModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={(values) => {
          console.log('Invite admin:', values);
          setIsInviteModalOpen(false);
        }}
      />
    </AppDashboardLayout>
  );
};
