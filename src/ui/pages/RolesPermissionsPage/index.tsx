'use client';

import React, { useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
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
import { pxToRem } from '../../../common';
import { RoleCard, InviteAdminModal, PermissionControls } from './ui/component';

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

const roles: RoleData[] = [
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
  const [activeRoleId, setActiveRoleId] = useState(roles[0].id);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const activeRole = roles.find((r) => r.id === activeRoleId) ?? roles[0];

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
                  background: activeRole.headerBg,
                  borderBottom: '0.67px solid #F0F4F8',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '14px',
                    background: activeRole.activeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {React.cloneElement(
                    activeRole.icon as React.ReactElement<{ sx: object }>,
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
                    {activeRole.roleName}
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
                    {activeRole.description}
                  </Typography>
                </Stack>
                <RowStack spacing={'6px'}>
                  <PeopleOutlineOutlinedIcon
                    sx={{ fontSize: 14, color: activeRole.activeColor }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: activeRole.activeColor,
                      lineHeight: '1.5em',
                    }}
                  >
                    {activeRole.admins.length} admin
                    {activeRole.admins.length !== 1 ? 's' : ''}
                  </Typography>
                </RowStack>
              </RowStack>

              {/* Admin List */}
              <Stack spacing={'12px'} sx={{ padding: '20px 24px' }}>
                {activeRole.admins.map((admin) => (
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
                        background: activeRole.activeColor,
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
                ))}
              </Stack>
            </Stack>
          </Stack>
        )}

        {/* Permission Controls Tab */}
        {mainTab === 'permissions' && <PermissionControls />}
      </Stack>

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
