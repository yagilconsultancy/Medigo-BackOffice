'use client';

import { useState, useMemo } from 'react';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  DashboardTitleAndDesc,
  RowStack,
  AppButton,
  AppSearchField,
} from '../../modules/components';
import { CustomPagination } from '../../modules/components/GridTable/ui/components/DataGridPagination/ui/components/CustomPagination';
import {
  ActivityLogKPIs,
  ActivityLogItem,
  formatTotalNumber,
  pxToRem,
  useGetActivityAnalytics,
  useGetActivityList,
  useResolvedApiQuery,
} from '../../../common';
import { LogStatCard, LogEntryRow } from './ui/components';

// ─── Category Style Map ──────────────────────────────────────────────────────

const categoryStyleMap: Record<
  string,
  {
    color: string;
    bg: string;
    icon: React.ReactNode;
  }
> = {
  Admin: {
    color: '#EF4444',
    bg: '#FEF2F2',
    icon: (
      <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
    ),
  },
  Fleet: {
    color: '#EA580C',
    bg: '#FFF7ED',
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: '#EA580C' }} />,
  },
  Driver: {
    color: '#6366F1',
    bg: '#EEF2FF',
    icon: <PersonOffOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
  },
  Finance: {
    color: '#059669',
    bg: '#ECFDF5',
    icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
  },
  Support: {
    color: '#2F6FED',
    bg: '#EBF2FF',
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
  },
  Settings: {
    color: '#D97706',
    bg: '#FFFBEB',
    icon: <TuneOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
  },
  Dispatch: {
    color: '#22C55E',
    bg: '#F0FDF4',
    icon: <SendOutlinedIcon sx={{ fontSize: 18, color: '#22C55E' }} />,
  },
  Notification: {
    color: '#8B5CF6',
    bg: '#F5F3FF',
    icon: (
      <NotificationsNoneOutlinedIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />
    ),
  },
  Safety: {
    color: '#EA580C',
    bg: '#FFF7ED',
    icon: <ReportProblemOutlinedIcon sx={{ fontSize: 18, color: '#EA580C' }} />,
  },
  Booking: {
    color: '#2F6FED',
    bg: '#EBF2FF',
    icon: <EventBusyOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
  },
};

const defaultCategoryStyle = {
  color: '#6B7280',
  bg: '#F3F4F6',
  icon: <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />,
};

const getCategoryStyle = (category: string) =>
  categoryStyleMap[category] || defaultCategoryStyle;

// ─── Component ──────────────────────────────────────────────────────────────

export const ActivityLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [severityChange] = useState<
    'all' | 'info' | 'warning' | 'critical'
  >('all');

  const currentPage = useMemo<number>(() => {
    return paginationModel.page + 1;
  }, [paginationModel.page]);

  const itemsPerPage = useMemo<number>(() => {
    return paginationModel.pageSize || 5;
  }, [paginationModel.pageSize]);

  const payload = useMemo(() => {
    return {
      severity: severityChange,
      search: searchQuery,
      page: currentPage,
      page_size: itemsPerPage,
    };
  }, [severityChange, searchQuery, currentPage, itemsPerPage]);

  const { data: activityKpi } = useResolvedApiQuery(
    useGetActivityAnalytics,
    null
  );
  const { data: activityLists, isLoading } = useResolvedApiQuery(
    useGetActivityList,
    null,
    payload
  );

  const activityKpiData = useMemo<ActivityLogKPIs | undefined>(() => {
    return activityKpi ? activityKpi : undefined;
  }, [activityKpi]);

  const logItems = useMemo<ActivityLogItem[]>(() => {
    return activityLists?.items ?? [];
  }, [activityLists]);

  const totalCount = activityLists?.total ?? 0;

  const statCards = [
    {
      icon: (
        <FormatListBulletedOutlinedIcon
          sx={{ fontSize: 20, color: '#2F6FED' }}
        />
      ),
      iconBg: '#EBF2FF',
      value: `${formatTotalNumber(activityKpiData?.total_logs)}`,
      label: 'Total Logs',
    },
    {
      icon: <InfoOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
      value: `${formatTotalNumber(activityKpiData?.info)}`,
      label: 'Info',
    },
    {
      icon: (
        <WarningAmberOutlinedIcon sx={{ fontSize: 20, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
      value: `${formatTotalNumber(activityKpiData?.warnings)}`,
      label: 'Warnings',
    },
    {
      icon: (
        <ErrorOutlineOutlinedIcon sx={{ fontSize: 20, color: '#EF4444' }} />
      ),
      iconBg: '#FEF2F2',
      value: `${formatTotalNumber(activityKpiData?.critical)}`,
      label: 'Critical',
    },
  ];

  const handlePageChange = (newPage: number) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPaginationModel({ page: 0, pageSize: newPageSize });
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Activity Logs"
            desc="Complete audit trail of all admin actions across the platform"
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
              '&:hover': {
                background: '#F0F4F8',
                boxShadow: 'none',
              },
            }}
          >
            Export Logs
          </AppButton>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'20px'}>
          {statCards.map((card) => (
            <Grid key={card.label} size={{ xs: 6, lg: 3 }}>
              <LogStatCard
                icon={card.icon}
                iconBg={card.iconBg}
                value={card.value}
                label={card.label}
              />
            </Grid>
          ))}
        </Grid>

        {/* Log List Section */}
        <Stack
          sx={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '0.67px solid #F0F4F8',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Section Header */}
          <RowStack
            sx={{
              padding: '20px 24px',
              width: '100%',
            }}
            justifyContent={'space-between'}
          >
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  color: '#111827',
                }}
              >
                Admin Activity
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: '#9CA3AF',
                }}
              >
                Recent actions performed by administrators
              </Typography>
            </Stack>
            <RowStack spacing={'12px'}>
              <AppSearchField
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPaginationModel((prev) => ({ ...prev, page: 0 }));
                }}
                boxProps={{
                  sx: { width: 240 },
                }}
              />
            </RowStack>
          </RowStack>

          <Divider sx={{ borderColor: '#F0F4F8' }} />

          {/* Log Entries */}
          <Stack>
            {!isLoading && logItems.length === 0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing="8px"
                sx={{ padding: '60px 24px' }}
              >
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
                  <FormatListBulletedOutlinedIcon
                    sx={{ fontSize: 24, color: '#D1D5DB' }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(14),
                    color: '#9CA3AF',
                  }}
                >
                  No activity logs found
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
                    : 'Activity logs will appear here as actions are performed'}
                </Typography>
              </Stack>
            ) : (
              logItems.map((item) => {
                const style = getCategoryStyle(item.category);
                return (
                  <LogEntryRow
                    key={item.id}
                    id={item.id}
                    action={item.action_title}
                    category={item.category}
                    categoryBg={style.bg}
                    categoryColor={style.color}
                    description={
                      item.admin_name
                        ? `${item.admin_name} · ${item.action_description}`
                        : item.action_description
                    }
                    date={dayjs(item.created_at).format(
                      'MMM D, YYYY · hh:mm A'
                    )}
                    icon={style.icon}
                    iconBg={style.bg}
                  />
                );
              })
            )}
          </Stack>

          {/* Pagination */}
          {totalCount > 0 && (
            <CustomPagination
              count={totalCount}
              page={paginationModel.page}
              pageSize={paginationModel.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
