'use client';

import { useState } from 'react';
import { alpha, Avatar, Box, Grid, Stack, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type LoginStatus = 'Success' | 'Failed';
type TabValue = 'All' | 'Success' | 'Failed';

type LoginRow = {
  id: string;
  initials: string;
  adminName: string;
  email: string;
  ipAddress: string;
  device: string;
  location: string;
  isSuspicious: boolean;
  time: string;
  status: LoginStatus;
  avatarBg: string;
};

// ─── Stat Cards ─────────────────────────────────────────────────────────────

const statCards = [
  {
    value: '624',
    label: 'Total Logins',
    icon: <LoginOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
  },
  {
    value: '618',
    label: 'Successful',
    icon: (
      <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#059669' }} />
    ),
    iconBg: '#ECFDF5',
  },
  {
    value: '6',
    label: 'Failed Attempts',
    icon: (
      <ErrorOutlineOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
    ),
    iconBg: '#FEF2F2',
  },
  {
    value: '9',
    label: 'Unique Locations',
    icon: (
      <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />
    ),
    iconBg: '#EEF2FF',
  },
];

// ─── Table Data ─────────────────────────────────────────────────────────────

const loginData: LoginRow[] = [
  {
    id: '1',
    initials: 'JC',
    adminName: 'John Carter',
    email: 'john@medigo.ca',
    ipAddress: '192.168.1.44',
    device: 'Chrome \u00b7 macOS',
    location: 'Toronto, ON',
    isSuspicious: false,
    time: 'Mar 9, 2026 \u00b7 08:05 AM',
    status: 'Success',
    avatarBg: '#2F6FED',
  },
  {
    id: '2',
    initials: 'AB',
    adminName: 'Angela Brooks',
    email: 'angela@medigo.ca',
    ipAddress: '10.0.0.22',
    device: 'Firefox \u00b7 Windows',
    location: 'Ottawa, ON',
    isSuspicious: false,
    time: 'Mar 9, 2026 \u00b7 07:58 AM',
    status: 'Success',
    avatarBg: '#059669',
  },
  {
    id: '3',
    initials: 'PS',
    adminName: 'Priya Sharma',
    email: 'priya@medigo.ca',
    ipAddress: '172.16.0.5',
    device: 'Safari \u00b7 macOS',
    location: 'Vancouver, BC',
    isSuspicious: false,
    time: 'Mar 8, 2026 \u00b7 11:22 PM',
    status: 'Success',
    avatarBg: '#6366F1',
  },
  {
    id: '4',
    initials: '?',
    adminName: 'Unknown',
    email: 'admin@medigo.ca',
    ipAddress: '103.45.62.88',
    device: 'Chrome \u00b7 Linux',
    location: 'Lagos, NG',
    isSuspicious: true,
    time: 'Mar 8, 2026 \u00b7 09:14 PM',
    status: 'Failed',
    avatarBg: '#EF4444',
  },
  {
    id: '5',
    initials: 'MB',
    adminName: 'Marcus Bell',
    email: 'marcus@medigo.ca',
    ipAddress: '192.168.0.88',
    device: 'Edge \u00b7 Windows',
    location: 'Calgary, AB',
    isSuspicious: false,
    time: 'Mar 8, 2026 \u00b7 08:47 AM',
    status: 'Success',
    avatarBg: '#D97706',
  },
  {
    id: '6',
    initials: 'SL',
    adminName: 'Sandra Lee',
    email: 'sandra@medigo.ca',
    ipAddress: '10.0.1.14',
    device: 'Chrome \u00b7 macOS',
    location: 'Montr\u00e9al, QC',
    isSuspicious: false,
    time: 'Mar 7, 2026 \u00b7 09:02 AM',
    status: 'Success',
    avatarBg: '#8B5CF6',
  },
  {
    id: '7',
    initials: 'LF',
    adminName: 'Lena Fischer',
    email: 'lena@medigo.ca',
    ipAddress: '192.168.2.11',
    device: 'Safari \u00b7 iPad OS',
    location: 'Edmonton, AB',
    isSuspicious: false,
    time: 'Mar 7, 2026 \u00b7 08:30 AM',
    status: 'Success',
    avatarBg: '#10B981',
  },
  {
    id: '8',
    initials: 'DK',
    adminName: 'David Kim',
    email: 'david@medigo.ca',
    ipAddress: '10.0.2.88',
    device: 'Chrome \u00b7 Windows',
    location: 'Winnipeg, MB',
    isSuspicious: false,
    time: 'Mar 6, 2026 \u00b7 07:55 AM',
    status: 'Success',
    avatarBg: '#F59E0B',
  },
  {
    id: '9',
    initials: '?',
    adminName: 'Unknown',
    email: 'john@medigo.ca',
    ipAddress: '88.99.44.21',
    device: 'Firefox \u00b7 Linux',
    location: 'Bucharest, RO',
    isSuspicious: true,
    time: 'Mar 5, 2026 \u00b7 02:44 AM',
    status: 'Failed',
    avatarBg: '#EF4444',
  },
  {
    id: '10',
    initials: 'CO',
    adminName: 'Christine Osei',
    email: 'c.osei@medigo.ca',
    ipAddress: '192.168.3.72',
    device: 'Chrome \u00b7 macOS',
    location: 'Toronto, ON',
    isSuspicious: false,
    time: 'Mar 4, 2026 \u00b7 09:10 AM',
    status: 'Success',
    avatarBg: '#2F6FED',
  },
];

// ─── Tab Config ─────────────────────────────────────────────────────────────

const tabs: { label: string; value: TabValue }[] = [
  { label: 'All', value: 'All' },
  { label: 'Success', value: 'Success' },
  { label: 'Failed', value: 'Failed' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const LoginHistoryPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tabCounts: Record<TabValue, number> = {
    All: loginData.length,
    Success: loginData.filter((r) => r.status === 'Success').length,
    Failed: loginData.filter((r) => r.status === 'Failed').length,
  };

  const filteredLogins = loginData.filter((r) => {
    if (activeTab !== 'All' && r.status !== activeTab) return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      r.adminName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.ipAddress.includes(q) ||
      r.location.toLowerCase().includes(q)
    );
  });

  const columns: GridColSpec<LoginRow>[] = [
    {
      field: 'adminName',
      headerName: 'Admin',
      flex: 1.4,
      minWidth: 180,
      renderCell: (params) => (
        <RowStack spacing={'10px'}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: pxToRem(12),
              fontWeight: 700,
              background: params.row.avatarBg,
              color: '#FFFFFF',
            }}
          >
            {params.row.initials}
          </Avatar>
          <Stack spacing={'0px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
              }}
            >
              {params.row.adminName}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11.5),
                color: '#9CA3AF',
              }}
            >
              {params.row.email}
            </Typography>
          </Stack>
        </RowStack>
      ),
    },
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      flex: 0.9,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.ipAddress}
        </Typography>
      ),
    },
    {
      field: 'device',
      headerName: 'Device',
      flex: 1,
      minWidth: 130,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.device}
        </Typography>
      ),
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <RowStack spacing={'4px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              color: params.row.isSuspicious ? '#EF4444' : '#374151',
            }}
          >
            {params.row.location}
          </Typography>
          {params.row.isSuspicious && (
            <WarningAmberOutlinedIcon
              sx={{ fontSize: 14, color: '#EF4444' }}
            />
          )}
        </RowStack>
      ),
    },
    {
      field: 'time',
      headerName: 'Time',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.row.time}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => {
        const isSuccess = params.row.status === 'Success';
        return (
          <Box
            sx={{
              padding: '4px 12px',
              borderRadius: '100px',
              background: isSuccess ? alpha('#059669', .1) : alpha('#EF4444', .1),
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11.5),
                color: isSuccess ? '#059669' : '#EF4444',
              }}
            >
              {params.row.status}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Login History"
            desc="Admin login records including device, location, IP address, and authentication status"
          />
          <AppButton
            variant="contained"
            startIcon={<ArrowDownwardIcon />}
            sx={{
              background: '#F7F9FB',
              color: '#374151',
              border: '0.67px solid #E8ECF0',
              boxShadow: 'none',
              borderRadius: '14px',
              padding: '10px 20px',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              textTransform: 'none',
              height: 40,
              whiteSpace: 'nowrap',
              '&:hover': {
                background: '#F0F4F8',
                boxShadow: 'none',
              },
            }}
          >
            Export
          </AppButton>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(24),
                    lineHeight: '1.3em',
                    color: '#111827',
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12.5),
                    lineHeight: '1.5em',
                    color: '#6B7280',
                    marginTop: '2px',
                  }}
                >
                  {card.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Suspicious Alert Banner */}
        <RowStack
          spacing={'10px'}
          sx={{
            padding: '14px 20px',
            background: '#FEF2F2',
            borderRadius: '14px',
            border: '0.67px solid #FECACA',
          }}
        >
          <WarningAmberOutlinedIcon
            sx={{ fontSize: 18, color: '#EF4444' }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#EF4444',
            }}
          >
            2 suspicious login attempts detected {"  "}
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#6B7280',
              }}
              component={"span"}
          >from unrecognized overseas
            IPs. Review and consider enabling geo-blocking.
            </Typography>
          </Typography>
        </RowStack>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredLogins}
          initialPageSize={10}
          disableRowClick
          sx={{ height: 'auto', width: '100%' }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            <RowStack spacing={'8px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(16),
                  color: '#111827',
                  marginRight: '8px',
                }}
              >
                Login Records
              </Typography>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <Box
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      background: isActive ? '#2F6FED' : 'transparent',
                      border: isActive
                        ? 'none'
                        : '0.67px solid #E5E7EB',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) =>
                          theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(13),
                        color: isActive ? '#FFFFFF' : '#6B7280',
                      }}
                    >
                      {tab.label}
                    </Typography>
                    <Box
                      sx={{
                        padding: '1px 7px',
                        borderRadius: '100px',
                        background: isActive
                          ? 'rgba(255,255,255,0.25)'
                          : '#F0F4F8',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) =>
                            theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          color: isActive ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        {tabCounts[tab.value]}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </RowStack>

            <AppSearchField
              name="search"
              placeholder="Search admin, IP, location\u2026"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              boxProps={{ sx: { width: '280px' } }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
