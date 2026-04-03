'use client';

import { useState, useMemo } from 'react';
import { Divider, Grid, Stack, Typography } from '@mui/material';
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
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  DashboardTitleAndDesc,
  RowStack,
  AppButton,
  AppSearchField,
  FilterSection,
} from '../../modules/components';
import { ActivityLogKPIs, formatTotalNumber, pxToRem, useGetActivityAnalytics, useGetActivityList, useResolvedApiQuery } from '../../../common';
import { LogStatCard, LogEntryRow, LogEntry } from './ui/components';

// ─── Log Entry Data ─────────────────────────────────────────────────────────

const logEntries: LogEntry[] = [
  {
    id: 'LOG-9210',
    action: 'Changed admin role assignment',
    category: 'Admin',
    categoryBg: '#FEF2F2',
    categoryColor: '#EF4444',
    description: 'John Carter \u00b7 Lena Fischer \u2192 Super Admin',
    date: 'Mar 9, 2026 \u00b7 02:14 PM',
    icon: (
      <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
    ),
    iconBg: '#FEF2F2',
  },
  {
    id: 'LOG-9209',
    action: 'Approved fleet application',
    category: 'Fleet',
    categoryBg: '#FFF7ED',
    categoryColor: '#EA580C',
    description: 'Angela Brooks \u00b7 APP-2403 \u00b7 PrimePath Medical',
    date: 'Mar 9, 2026 \u00b7 10:42 AM',
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: '#EA580C' }} />,
    iconBg: '#FFF7ED',
  },
  {
    id: 'LOG-9208',
    action: 'Suspended driver account',
    category: 'Driver',
    categoryBg: '#EEF2FF',
    categoryColor: '#6366F1',
    description: 'Angela Brooks \u00b7 Ryan O\u2019Brien \u00b7 DRV-0218',
    date: 'Mar 9, 2026 \u00b7 09:55 AM',
    icon: <PersonOffOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
  },
  {
    id: 'LOG-9207',
    action: 'Generated fleet invoice',
    category: 'Finance',
    categoryBg: '#ECFDF5',
    categoryColor: '#059669',
    description:
      'Priya Sharma \u00b7 INV-9020 \u00b7 MedRide Express \u00b7 $9,840',
    date: 'Mar 9, 2026 \u00b7 09:30 AM',
    icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
    iconBg: '#ECFDF5',
  },
  {
    id: 'LOG-9206',
    action: 'Resolved support ticket',
    category: 'Support',
    categoryBg: '#EBF2FF',
    categoryColor: '#2F6FED',
    description:
      'Sandra Lee \u00b7 TKT-8799 \u00b7 Anna Kim vs Gordon MacPherson',
    date: 'Mar 8, 2026 \u00b7 05:12 PM',
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
  },
  {
    id: 'LOG-9205',
    action: 'Updated pricing configuration',
    category: 'Settings',
    categoryBg: '#FFFBEB',
    categoryColor: '#D97706',
    description: 'Marcus Bell \u00b7 Base fare changed: $7.50 \u2192 $8.00',
    date: 'Mar 8, 2026 \u00b7 03:44 PM',
    icon: <TuneOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
    iconBg: '#FFFBEB',
  },
  {
    id: 'LOG-9204',
    action: 'Changed user role',
    category: 'Admin',
    categoryBg: '#FEF2F2',
    categoryColor: '#EF4444',
    description: 'John Carter \u00b7 Sandra Lee: Support \u2192 Finance Admin',
    date: 'Mar 8, 2026 \u00b7 02:10 PM',
    icon: (
      <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
    ),
    iconBg: '#FEF2F2',
  },
  {
    id: 'LOG-9203',
    action: 'Dispatched driver manually',
    category: 'Dispatch',
    categoryBg: '#F0FDF4',
    categoryColor: '#22C55E',
    description: 'David Kim \u00b7 Liam MacDonald \u2192 Booking BK-20491',
    date: 'Mar 8, 2026 \u00b7 11:30 AM',
    icon: <SendOutlinedIcon sx={{ fontSize: 18, color: '#22C55E' }} />,
    iconBg: '#F0FDF4',
  },
  {
    id: 'LOG-9202',
    action: 'Sent notification to all drivers',
    category: 'Notification',
    categoryBg: '#F5F3FF',
    categoryColor: '#8B5CF6',
    description: 'Angela Brooks \u00b7 Subject: New Payout Policy',
    date: 'Mar 7, 2026 \u00b7 09:28 AM',
    icon: (
      <NotificationsNoneOutlinedIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />
    ),
    iconBg: '#F5F3FF',
  },
  {
    id: 'LOG-9201',
    action: 'Exported payment report',
    category: 'Finance',
    categoryBg: '#ECFDF5',
    categoryColor: '#059669',
    description: 'Priya Sharma \u00b7 February 2026 \u00b7 PDF',
    date: 'Mar 6, 2026 \u00b7 04:00 PM',
    icon: <PictureAsPdfOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
    iconBg: '#ECFDF5',
  },
  {
    id: 'LOG-9200',
    action: 'Escalated incident to investigation',
    category: 'Safety',
    categoryBg: '#FFF7ED',
    categoryColor: '#EA580C',
    description: 'Sandra Lee \u00b7 INC-4401 \u00b7 Liam MacDonald',
    date: 'Mar 6, 2026 \u00b7 02:15 PM',
    icon: <ReportProblemOutlinedIcon sx={{ fontSize: 18, color: '#EA580C' }} />,
    iconBg: '#FFF7ED',
  },
  {
    id: 'LOG-9199',
    action: 'Cancelled booking on behalf of rider',
    category: 'Booking',
    categoryBg: '#EBF2FF',
    categoryColor: '#2F6FED',
    description: 'Marcus Bell \u00b7 BK-20480 \u00b7 Dorothy MacLeod',
    date: 'Mar 5, 2026 \u00b7 10:00 AM',
    icon: <EventBusyOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
  },
];

// ─── Filter Sections ────────────────────────────────────────────────────────

const filterSections: FilterSection[] = [
  {
    label: 'Category',
    key: 'category',
    options: [
      'All',
      'Admin',
      'Fleet',
      'Driver',
      'Finance',
      'Support',
      'Settings',
      'Dispatch',
      'Notification',
      'Safety',
      'Booking',
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const ActivityLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    category: 'All',
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [severityChange, setSeverityChange] = useState<"all" | "info" | "warning" | "critical">("all")

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
      page_size: itemsPerPage
    }
  }, [severityChange, searchQuery, currentPage, itemsPerPage])
  const { data: activityKpi } = useResolvedApiQuery(useGetActivityAnalytics, null)
  const { data: activityLists } = useResolvedApiQuery(useGetActivityList, null, payload)

  const filteredLogs = useMemo(() => {
    return logEntries.filter((log) => {
      const matchesSearch =
        !searchQuery ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filters.category === 'All' || log.category === filters.category;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, filters]);

  const activityKpiData = useMemo<ActivityLogKPIs | undefined>(() => {
    return activityKpi ? activityKpi : undefined;
  }, [activityKpi]);

  const statCards = [
    {
      icon: (
        <FormatListBulletedOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
      ),
      iconBg: '#EBF2FF',
      value: `${formatTotalNumber(activityKpiData.total_logs)}`,
      label: 'Total Logs',
    },
    {
      icon: <InfoOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
      value: `${formatTotalNumber(activityKpiData.info)}`,
      label: 'Info',
    },
    {
      icon: <WarningAmberOutlinedIcon sx={{ fontSize: 20, color: '#D97706' }} />,
      iconBg: '#FFFBEB',
      value: `${formatTotalNumber(activityKpiData.warnings)}`,
      label: 'Warnings',
    },
    {
      icon: <ErrorOutlineOutlinedIcon sx={{ fontSize: 20, color: '#EF4444' }} />,
      iconBg: '#FEF2F2',
      value: `${formatTotalNumber(activityKpiData.critical)}`,
      label: 'Critical',
    },
  ];

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
                onChange={(e) => setSearchQuery(e.target.value)}
                boxProps={{
                  sx: { width: 240 },
                }}
              />
              {/* <AppFilterPopover
                sections={filterSections}
                filters={filters}
                onFilterChange={(key, value) =>
                  setFilters((prev) => ({ ...prev, [key]: value }))
                }
                onReset={() => setFilters({ category: 'All' })}
              /> */}
            </RowStack>
          </RowStack>

          <Divider sx={{ borderColor: '#F0F4F8' }} />

          {/* Log Entries */}
          <Stack>
            {filteredLogs.map((log) => (
              <LogEntryRow key={log.id} {...log} />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
