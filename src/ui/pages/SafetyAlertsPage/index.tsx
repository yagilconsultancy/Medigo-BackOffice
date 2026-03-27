'use client';

import { useState, useMemo } from 'react';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AltRouteOutlinedIcon from '@mui/icons-material/AltRouteOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  AppFilterPopover,
  FilterSection,
} from '../../modules/components/AppFilterPopover';
import { GridColSpec } from '../../modules/components/GridTable';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type AlertSeverity = 'High' | 'Medium' | 'Low';
type AlertCategory =
  | 'Route Deviation'
  | 'Late Arrival'
  | 'Unexpected Stop'
  | 'Speed Violation'
  | 'Idle Vehicle';
type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

type AlertRow = {
  id: string;
  alertId: string;
  severity: AlertSeverity;
  category: AlertCategory;
  description: string;
  driver: string;
  trip: string;
  city: string;
  time: string;
  status: AlertStatus;
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const severityColors: Record<
  AlertSeverity,
  { color: string; bg: string }
> = {
  High: { color: '#DC2626', bg: '#FEF2F2' },
  Medium: { color: '#D97706', bg: '#FFFBEB' },
  Low: { color: '#CA8A04', bg: '#FEFCE8' },
};

const categoryColors: Record<AlertCategory, string> = {
  'Route Deviation': '#DB2777',
  'Late Arrival': '#D97706',
  'Unexpected Stop': '#6366F1',
  'Speed Violation': '#EF4444',
  'Idle Vehicle': '#F59E0B',
};

const statusColors: Record<AlertStatus, string> = {
  Active: '#2F6FED',
  Acknowledged: '#6366F1',
  Resolved: '#059669',
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const alertsData: AlertRow[] = [
  {
    id: '1',
    alertId: 'AL-441',
    severity: 'High',
    category: 'Route Deviation',
    description: 'Driver deviated 3.7 km from approved route',
    driver: 'Liam MacDonald',
    trip: 'TR-8801',
    city: 'Toronto, ON',
    time: '2 min ago',
    status: 'Acknowledged',
  },
  {
    id: '2',
    alertId: 'AL-440',
    severity: 'Medium',
    category: 'Late Arrival',
    description: 'Driver running late by 18 minutes — rider waiting',
    driver: 'Sophie Tremblay',
    trip: 'TR-8800',
    city: 'Ottawa, ON',
    time: '10 min ago',
    status: 'Active',
  },
  {
    id: '3',
    alertId: 'AL-439',
    severity: 'High',
    category: 'Unexpected Stop',
    description: 'Vehicle stopped unexpectedly for 8 minutes',
    driver: 'David Chen',
    trip: 'TR-8799',
    city: 'Vancouver, BC',
    time: '24 min ago',
    status: 'Active',
  },
  {
    id: '4',
    alertId: 'AL-438',
    severity: 'Low',
    category: 'Speed Violation',
    description: 'Driver speed slightly above limit (68 km/h in 60 zone)',
    driver: 'Aisha Mensah',
    trip: 'TR-8798',
    city: 'Calgary, AB',
    time: '35 min ago',
    status: 'Acknowledged',
  },
  {
    id: '5',
    alertId: 'AL-437',
    severity: 'Medium',
    category: 'Late Arrival',
    description: 'Passenger not picked up at scheduled time',
    driver: 'Marc Lefebvre',
    trip: 'TR-8797',
    city: 'Montréal, QC',
    time: '1 hr ago',
    status: 'Acknowledged',
  },
  {
    id: '6',
    alertId: 'AL-436',
    severity: 'High',
    category: 'Route Deviation',
    description: 'Route deviation detected — 5.0 km off approved path',
    driver: 'Anna Kim',
    trip: 'TR-8796',
    city: 'Edmonton, AB',
    time: '1.2 hr ago',
    status: 'Resolved',
  },
  {
    id: '7',
    alertId: 'AL-435',
    severity: 'Low',
    category: 'Late Arrival',
    description: 'Driver running late by 5 minutes',
    driver: "Ryan O'Brien",
    trip: 'TR-8794',
    city: 'Winnipeg, MB',
    time: '2 hrs ago',
    status: 'Resolved',
  },
  {
    id: '8',
    alertId: 'AL-434',
    severity: 'Medium',
    category: 'Idle Vehicle',
    description: 'Vehicle idling for more than 15 minutes at pickup',
    driver: 'Liam MacDonald',
    trip: 'TR-8790',
    city: 'Toronto, ON',
    time: '3 hrs ago',
    status: 'Resolved',
  },
];

// ─── Filter Config ──────────────────────────────────────────────────────────

const filterSections: FilterSection[] = [
  {
    label: 'Severity',
    key: 'severity',
    options: ['All', 'High', 'Medium', 'Low'],
  },
  {
    label: 'Category',
    key: 'category',
    options: [
      'All',
      'Route Deviation',
      'Late Arrival',
      'Unexpected Stop',
      'Speed Violation',
      'Idle Vehicle',
    ],
  },
  {
    label: 'Status',
    key: 'status',
    options: ['All', 'Active', 'Acknowledged', 'Resolved'],
  },
];

const defaultFilters: Record<string, string> = {
  severity: 'All',
  category: 'All',
  status: 'All',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const SafetyAlertsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(defaultFilters);

  const filteredData = useMemo(() => {
    let filtered = alertsData;

    if (filters.severity !== 'All') {
      filtered = filtered.filter((r) => r.severity === filters.severity);
    }
    if (filters.category !== 'All') {
      filtered = filtered.filter((r) => r.category === filters.category);
    }
    if (filters.status !== 'All') {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.alertId.toLowerCase().includes(query) ||
          r.driver.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.trip.toLowerCase().includes(query) ||
          r.city.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, filters]);

  const activeAlertCount = useMemo(
    () => alertsData.filter((r) => r.status === 'Active').length,
    []
  );

  const statCards = [
    {
      value: '12',
      label: 'Active Alerts',
      icon: (
        <NotificationsActiveOutlinedIcon
          sx={{ fontSize: 18, color: '#EF4444' }}
        />
      ),
      iconBg: '#FEF2F2',
    },
    {
      value: '4',
      label: 'Route Deviations',
      icon: (
        <AltRouteOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
    },
    {
      value: '6',
      label: 'Running Late',
      icon: (
        <ScheduleOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
      ),
      iconBg: '#EEF2FF',
    },
    {
      value: '28',
      label: 'Resolved Today',
      icon: (
        <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />
      ),
      iconBg: '#ECFDF5',
    },
  ];

  const columns: GridColSpec<AlertRow>[] = [
    {
      field: 'severity',
      headerName: 'Severity',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => {
        const severity = params.value as AlertSeverity;
        const colors = severityColors[severity];
        return (
          <Chip
            label={severity}
            sx={{
              background: colors.bg,
              color: colors.color,
              fontWeight: 700,
              fontSize: pxToRem(11.5),
              fontFamily: (theme) => theme.typography.fontFamily,
              borderRadius: '16px',
              height: '26px',
            }}
          />
        );
      },
    },
    {
      field: 'alertId',
      headerName: 'Alert ID',
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: '#2F6FED',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => {
        const category = params.value as AlertCategory;
        const color = categoryColors[category];
        return (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12.5),
              color: color,
            }}
          >
            {category}
          </Typography>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 260,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#374151',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'driver',
      headerName: 'Driver',
      flex: 0.9,
      minWidth: 130,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'trip',
      headerName: 'Trip',
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'time',
      headerName: 'Time',
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#9CA3AF',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 110,
      renderCell: (params) => {
        const status = params.value as AlertStatus;
        const color = statusColors[status];
        return (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11.5),
              color: color,
            }}
          >
            {status}
          </Typography>
        );
      },
    },
    {
      field: 'actions' as string,
      headerName: 'Action',
      flex: 0.7,
      minWidth: 110,
      sortable: false,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === 'Active') {
          return (
            <AppButton
              variant="contained"
              sx={{
                background: '#2F6FED',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '4px 12px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: pxToRem(12),
                fontFamily: (theme) => theme.typography.fontFamily,
                minWidth: 'unset',
                height: 30,
                boxShadow: 'none',
                '&:hover': {
                  background: '#2558C9',
                  boxShadow: 'none',
                },
              }}
            >
              Acknowledge
            </AppButton>
          );
        }
        return (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              color: '#9CA3AF',
            }}
          >
            —
          </Typography>
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
            title="Safety Alerts"
            desc="Real-time vehicle and driver safety alerts flagged by the system"
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 14px',
              borderRadius: '10px',
              background: '#FEF2F2',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#EF4444',
                whiteSpace: 'nowrap',
              }}
            >
              {activeAlertCount} Active Alerts
            </Typography>
          </Box>
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

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredData}
          initialPageSize={10}
          disableRowClick
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <Stack spacing={'16px'} width={'100%'}>
            <RowStack justifyContent={'space-between'} width={'100%'}>
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(16),
                    color: '#111827',
                    lineHeight: '24px',
                  }}
                >
                  Alert Feed
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12.5),
                    color: '#6B7280',
                    lineHeight: '18px',
                  }}
                >
                  All system-generated safety alerts sorted by recency
                </Typography>
              </Stack>
              <RowStack spacing={'10px'}>
                <AppFilterPopover
                  sections={filterSections}
                  filters={filters}
                  onFilterChange={(key, value) =>
                    setFilters((prev) => ({ ...prev, [key]: value }))
                  }
                  onReset={() => setFilters(defaultFilters)}
                />
                <AppSearchField
                  name="search"
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  boxProps={{
                    sx: { width: '220px' },
                  }}
                />
              </RowStack>
            </RowStack>
          </Stack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
