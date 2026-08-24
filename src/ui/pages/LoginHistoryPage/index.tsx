'use client';

import { useState, useMemo } from 'react';
import {
  alpha,
  Avatar,
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { toast } from 'sonner';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  DashboardTitleAndDesc,
  QueryErrorState,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import {
  LoginHistoryKPIs,
  LoginRecordItem,
  formatTotalNumber,
  pxToRem,
  useGetLoginHistoryKpi,
  useGetLoginHistory,
  useExportLoginHistory,
  useResolvedApiQuery,
} from '../../../common';

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

// ─── Helpers ────────────────────────────────────────────────────────────────

const avatarColors = [
  '#2F6FED',
  '#059669',
  '#6366F1',
  '#D97706',
  '#8B5CF6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
];

const getInitials = (name: string): string => {
  if (!name || name === 'Unknown') return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarBg = (name: string, success: boolean): string => {
  if (!name || name === 'Unknown') return '#EF4444';
  if (!success) return '#EF4444';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const mapRecordToRow = (item: LoginRecordItem): LoginRow => ({
  id: item.id,
  initials: getInitials(item.admin_name),
  adminName: item.admin_name || 'Unknown',
  email: item.admin_email,
  ipAddress: item.ip_address,
  device: item.device_info,
  location: item.location || 'Unknown',
  isSuspicious: item.is_suspicious ?? false,
  time: dayjs(item.created_at).format('MMM D, YYYY · hh:mm A'),
  status: item.success ? 'Success' : 'Failed',
  avatarBg: getAvatarBg(item.admin_name, item.success),
});

// ─── Stat Cards ─────────────────────────────────────────────────────────────

const statCardConfig = [
  {
    key: 'total_logins' as const,
    label: 'Total Logins',
    icon: <LoginOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
  },
  {
    key: 'successful' as const,
    label: 'Successful',
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#059669' }} />,
    iconBg: '#ECFDF5',
  },
  {
    key: 'failed_attempts' as const,
    label: 'Failed Attempts',
    icon: <ErrorOutlineOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
    iconBg: '#FEF2F2',
  },
  {
    key: 'unique_locations' as const,
    label: 'Unique Locations',
    icon: <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
  },
];

// ─── Tab Config ─────────────────────────────────────────────────────────────

const tabs: { label: string; value: TabValue }[] = [
  { label: 'All', value: 'All' },
  { label: 'Success', value: 'Success' },
  { label: 'Failed', value: 'Failed' },
];

const tabToStatus = (tab: TabValue): 'all' | 'success' | 'failed' => {
  if (tab === 'Success') return 'success';
  if (tab === 'Failed') return 'failed';
  return 'all';
};

// ─── Component ──────────────────────────────────────────────────────────────

export const LoginHistoryPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const {
    data: loginHistoryKpi,
    isFetching: isFetchingKpi,
  } = useResolvedApiQuery(useGetLoginHistoryKpi, null);

  const { mutate: exportHistory, isPending: isExporting } =
    useExportLoginHistory();

  const payload = useMemo(
    () => ({
      status: tabToStatus(activeTab),
      search: searchQuery,
      page: paginationModel.page + 1,
      page_size: paginationModel.pageSize,
    }),
    [activeTab, searchQuery, paginationModel]
  );

  const {
    data: loginHistoryList,
    isFetching: isFetchingHistory,
    errorKind: historyErrorKind,
    refetch: refetchHistory,
  } = useResolvedApiQuery(useGetLoginHistory, null, payload);

  const kpiData = useMemo<LoginHistoryKPIs | undefined>(() => {
    return loginHistoryKpi ? loginHistoryKpi : undefined;
  }, [loginHistoryKpi]);

  const loginRows = useMemo<LoginRow[]>(() => {
    return loginHistoryList?.items?.map(mapRecordToRow) ?? [];
  }, [loginHistoryList]);

  const totalCount = loginHistoryList?.total ?? 0;

  // Must come from the KPI endpoint: counting only the current page's rows
  // under-reports the total and shifts as you page or filter.
  const suspiciousCount = kpiData?.suspicious_count ?? 0;

  const statCards = statCardConfig.map((card) => ({
    ...card,
    value: `${formatTotalNumber(kpiData?.[card.key])}`,
  }));

  const handleExportHistory = () => {
    exportHistory(payload, {
      onSuccess: (response) => {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `login-history-${dayjs().format('YYYY-MM-DD')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      onError: () => {
        toast.error('Export failed. Please try again.');
      },
    });
  };

  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

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
            <WarningAmberOutlinedIcon sx={{ fontSize: 14, color: '#EF4444' }} />
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
              background: isSuccess
                ? alpha('#059669', 0.1)
                : alpha('#EF4444', 0.1),
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
            onClick={handleExportHistory}
            disabled={isExporting}
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
            {isExporting ? 'Exporting...' : 'Export'}
          </AppButton>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {isFetchingKpi
            ? Array.from({ length: 4 }).map((_, index) => (
                <Grid key={index} size={{ xs: 6, lg: 3 }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={120}
                    sx={{ borderRadius: '14px' }}
                  />
                </Grid>
              ))
            : statCards.map((card, index) => (
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
        {suspiciousCount > 0 && (
          <RowStack
            spacing={'10px'}
            sx={{
              padding: '14px 20px',
              background: '#FEF2F2',
              borderRadius: '14px',
              border: '0.67px solid #FECACA',
            }}
          >
            <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#EF4444',
              }}
            >
              {suspiciousCount} suspicious login attempt
              {suspiciousCount > 1 ? 's' : ''} detected {'  '}
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
                component={'span'}
              >
                from unrecognized overseas IPs. Review and consider enabling
                geo-blocking.
              </Typography>
            </Typography>
          </RowStack>
        )}

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={loginRows}
          disableAutoPagination
          initialPageSize={paginationModel.pageSize}
          totalRows={totalCount}
          isFetchingData={isFetchingHistory}
          onPaginationModelChange={(model) =>
            setPaginationModel({
              page: model.page,
              pageSize: model.pageSize,
            })
          }
          disableRowClick
          sx={{ height: 'auto', width: '100%' }}
          permissionErrorState={
            historyErrorKind !== 'none' ? (
              <QueryErrorState
                kind={historyErrorKind}
                onRetry={() => refetchHistory()}
              />
            ) : undefined
          }
          emptyState={
            <Stack alignItems="center" spacing="8px" sx={{ py: 4 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  background: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: '4px',
                }}
              >
                <LoginOutlinedIcon sx={{ fontSize: 24, color: '#D1D5DB' }} />
              </Box>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(14),
                  color: '#9CA3AF',
                }}
              >
                No login records found
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#D1D5DB',
                }}
              >
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Login records will appear here as admins sign in'}
              </Typography>
            </Stack>
          }
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
                    onClick={() => handleTabChange(tab.value)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      background: isActive ? '#2F6FED' : 'transparent',
                      border: isActive ? 'none' : '0.67px solid #E5E7EB',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
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
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          color: isActive ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        {tab.value === 'All'
                          ? totalCount
                          : tab.value === 'Success'
                            ? (kpiData?.successful ?? 0)
                            : (kpiData?.failed_attempts ?? 0)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </RowStack>

            <AppSearchField
              name="search"
              placeholder="Search admin, IP, location…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPaginationModel((prev) => ({ ...prev, page: 0 }));
              }}
              boxProps={{ sx: { width: '280px' } }}
            />
          </RowStack>
        </AppGridtable>
      </Stack>
    </AppDashboardLayout>
  );
};
