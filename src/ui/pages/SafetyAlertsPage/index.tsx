'use client';

import { useState, useMemo } from 'react';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AltRouteOutlinedIcon from '@mui/icons-material/AltRouteOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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
import { CustomPagination } from '../../modules/components/GridTable/ui/components/DataGridPagination/ui/components/CustomPagination';
import { EmptyState } from '../../modules/blocks';
import {
  pxToRem,
  useGetAlertKpis,
  useGetAlertFeed,
  useResolvedApiQuery,
  useAlertsApi,
} from '../../../common';

dayjs.extend(relativeTime);

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

const severityColors: Record<AlertSeverity, { color: string; bg: string }> = {
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

// API value mappings
const severityMapFromApi: Record<string, AlertSeverity> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const categoryMapFromApi: Record<string, AlertCategory> = {
  route_deviation: 'Route Deviation',
  late_arrival: 'Late Arrival',
  unexpected_stop: 'Unexpected Stop',
  speed_violation: 'Speed Violation',
  idle_vehicle: 'Idle Vehicle',
};

const statusMapFromApi: Record<string, AlertStatus> = {
  active: 'Active',
  acknowledged: 'Acknowledged',
  resolved: 'Resolved',
};

const severityMapToApi: Record<string, string> = {
  All: '',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
};

const categoryMapToApi: Record<string, string> = {
  All: '',
  'Route Deviation': 'route_deviation',
  'Late Arrival': 'late_arrival',
  'Unexpected Stop': 'unexpected_stop',
  'Speed Violation': 'speed_violation',
  'Idle Vehicle': 'idle_vehicle',
};

const statusMapToApi: Record<string, string> = {
  All: '',
  Active: 'active',
  Acknowledged: 'acknowledged',
  Resolved: 'resolved',
};

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

export const SafetyAlertsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const currentPage = useMemo<number>(() => {
    return paginationModel.page + 1;
  }, [paginationModel.page]);

  const itemsPerPage = paginationModel.pageSize;

  // Hooks
  const { acknowledgeAlert } = useAlertsApi();

  // Fetch KPIs
  const { data: kpisData } = useResolvedApiQuery(useGetAlertKpis, null);

  // Fetch alert feed with filters
  const { data: alertsListData, refetch } = useGetAlertFeed({
    page: currentPage,
    page_size: itemsPerPage,
    category:
      filters.category !== 'All'
        ? categoryMapToApi[filters.category]
        : undefined,
    severity:
      filters.severity !== 'All'
        ? severityMapToApi[filters.severity]
        : undefined,
    status:
      filters.status !== 'All' ? statusMapToApi[filters.status] : undefined,
  });

  const alertsListDataResolved = useMemo(() => {
    return alertsListData?.success ? alertsListData.data : null;
  }, [alertsListData]);

  // Transform API data to UI format
  const transformedData = useMemo<AlertRow[]>(() => {
    if (!alertsListData?.success || !alertsListData.data?.items) {
      return [];
    }

    return alertsListData.data.items.map((alert) => ({
      id: alert.id,
      alertId: `AL-${alert.alert_number}`,
      severity: severityMapFromApi[alert.severity] || 'Medium',
      category: categoryMapFromApi[alert.category] || 'Unexpected Stop',
      description: alert.description || '',
      driver: alert.driver_name || 'Unknown Driver',
      trip: alert.trip_display_id || '—',
      city: alert.city || '—',
      time: dayjs(alert.created_at).fromNow(),
      status: statusMapFromApi[alert.status] || 'Active',
    }));
  }, [alertsListData]);

  // Client-side search filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return transformedData;
    }

    const query = searchQuery.toLowerCase();
    return transformedData.filter(
      (r) =>
        r.alertId.toLowerCase().includes(query) ||
        r.driver.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.trip.toLowerCase().includes(query) ||
        r.city.toLowerCase().includes(query)
    );
  }, [searchQuery, transformedData]);

  const totalCount = alertsListDataResolved?.total || 0;
  const activeAlertCount = kpisData?.active || 0;

  const statCards = [
    {
      value: (kpisData?.active || 0).toString(),
      label: 'Active Alerts',
      icon: (
        <NotificationsActiveOutlinedIcon
          sx={{ fontSize: 18, color: '#EF4444' }}
        />
      ),
      iconBg: '#FEF2F2',
    },
    {
      value: (kpisData?.route_deviations || 0).toString(),
      label: 'Route Deviations',
      icon: <AltRouteOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
      iconBg: '#FFFBEB',
    },
    {
      value: (kpisData?.late_arrivals || 0).toString(),
      label: 'Running Late',
      icon: <ScheduleOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      iconBg: '#EEF2FF',
    },
    {
      value: (kpisData?.resolved_today || 0).toString(),
      label: 'Resolved Today',
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
      iconBg: '#ECFDF5',
    },
  ];

  const handleAcknowledge = async (alertId: string) => {
    const success = await acknowledgeAlert({ alertId });
    if (success) {
      refetch();
    }
  };

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
        const alertId = params.row.id;
        if (status === 'Active') {
          return (
            <AppButton
              variant="contained"
              onClick={() => handleAcknowledge(alertId)}
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
        {filteredData.length === 0 ? (
          <Box
            sx={{
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
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
              <EmptyState
                emptyState={
                  <Typography
                    sx={{
                      fontSize: pxToRem(14),
                      fontWeight: 400,
                      color: '#6B7280',
                      textAlign: 'center',
                    }}
                  >
                    No alerts found
                  </Typography>
                }
              />
            </Stack>
          </Box>
        ) : (
          <Box
            sx={{
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
              overflow: 'hidden',
            }}
          >
            <Stack spacing={'16px'} sx={{ padding: '24px 24px 0' }}>
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
            <AppGridtable
              columns={columns}
              data={filteredData}
              initialPageSize={itemsPerPage}
              disableRowClick
              hidePagination
              sx={{
                height: 'auto',
                width: '100%',
              }}
            >
              <></>
            </AppGridtable>
            <CustomPagination
              count={totalCount}
              page={paginationModel.page}
              pageSize={paginationModel.pageSize}
              onPageChange={(newPage) =>
                setPaginationModel((prev) => ({ ...prev, page: newPage }))
              }
              onPageSizeChange={(newPageSize) =>
                setPaginationModel({ page: 0, pageSize: newPageSize })
              }
            />
          </Box>
        )}
      </Stack>
    </AppDashboardLayout>
  );
};
