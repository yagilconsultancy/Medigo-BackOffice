'use client';

import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CarCrashOutlinedIcon from '@mui/icons-material/CarCrashOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { CustomPagination } from '../../modules/components/GridTable/ui/components/DataGridPagination/ui/components/CustomPagination';
import { EmptyState } from '../../modules/blocks';
import { FileIncidentModal } from './ui/components';
import {
  pxToRem,
  useGetIncidentKpis,
  useListIncidents,
  useResolvedApiQuery,
} from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type IncidentCategory = 'Driver Complaint' | 'Rider Complaint' | 'Accident';
type IncidentPriority = 'Low' | 'Medium' | 'High' | 'Critical';
type IncidentStatus =
  | 'Under Investigation'
  | 'Disciplinary Action'
  | 'Resolved'
  | 'Closed';

type IncidentRow = {
  id: string;
  incidentId: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  status: IncidentStatus;
  subject: string;
  filedBy: string;
  filerRole: string;
  date: string;
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const categoryColors: Record<
  IncidentCategory,
  { color: string; bg: string; border: string }
> = {
  'Driver Complaint': {
    color: '#6366F1',
    bg: '#EEF2FF',
    border: 'rgba(0, 0, 0, 0.05)',
  },
  'Rider Complaint': {
    color: '#EF4444',
    bg: '#FEF2F2',
    border: '#EF4444',
  },
  Accident: {
    color: '#DB2777',
    bg: '#FDF2F8',
    border: '#DB2777',
  },
};

const priorityColors: Record<IncidentPriority, { color: string; bg: string }> =
  {
    Low: { color: '#22C55E', bg: '#F0FDF4' },
    Medium: { color: '#D97706', bg: '#FFFBEB' },
    High: { color: '#EF4444', bg: '#FEF2F2' },
    Critical: { color: '#DB2777', bg: '#FDF2F8' },
  };

const statusColors: Record<IncidentStatus, { color: string; bg: string }> = {
  'Under Investigation': { color: '#D97706', bg: '#FFFBEB' },
  'Disciplinary Action': { color: '#6366F1', bg: '#EEF2FF' },
  Resolved: { color: '#059669', bg: '#ECFDF5' },
  Closed: { color: '#6B7280', bg: '#F3F4F6' },
};

// ─── API Status Mapping ─────────────────────────────────────────────────────

const apiIncidentTypeToCategory: Record<string, IncidentCategory> = {
  driver_complaint: 'Driver Complaint',
  rider_complaint: 'Rider Complaint',
  accident: 'Accident',
};

const apiSeverityToPriority: Record<string, IncidentPriority> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

const apiStatusToUiStatus: Record<string, IncidentStatus> = {
  open: 'Under Investigation',
  under_investigation: 'Under Investigation',
  disciplinary_action: 'Disciplinary Action',
  resolved: 'Resolved',
  closed: 'Closed',
};

const uiCategoryToApiType: Record<string, string> = {
  'Driver Complaint': 'driver_complaint',
  'Rider Complaint': 'rider_complaint',
  Accident: 'accident',
};

// ─── Tab Config ─────────────────────────────────────────────────────────────

const tabFilters = [
  'All',
  'Driver Complaint',
  'Rider Complaint',
  'Accident',
] as const;

// ─── Component ──────────────────────────────────────────────────────────────

export const IncidentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Pagination helpers
  const currentPage = useMemo<number>(() => {
    return paginationModel.page + 1;
  }, [paginationModel.page]);

  const itemsPerPage = useMemo<number>(() => {
    return paginationModel.pageSize || 10;
  }, [paginationModel.pageSize]);

  // API Hooks
  const kpisData = useResolvedApiQuery(useGetIncidentKpis, {
    total: 0,
    driver_complaints: 0,
    rider_complaints: 0,
    accidents: 0,
  });

  const { data: incidentsListData } = useListIncidents({
    search: searchQuery || undefined,
    incident_type:
      activeTab !== 'All' ? uiCategoryToApiType[activeTab] : undefined,
    page: currentPage,
    page_size: itemsPerPage,
  });

  // Transform API data to UI format
  const incidentsData = useMemo<IncidentRow[]>(() => {
    if (!incidentsListData?.success || !incidentsListData?.data?.items)
      return [];
    return incidentsListData.data.items.map((item) => ({
      id: item.id,
      incidentId: `INC-${item.incident_number}`,
      category:
        apiIncidentTypeToCategory[item.incident_type] || 'Driver Complaint',
      priority: apiSeverityToPriority[item.severity] || 'Medium',
      status: apiStatusToUiStatus[item.status] || 'Under Investigation',
      subject: item.subject_name,
      filedBy: item.filed_by_name,
      filerRole: item.filed_by_role,
      date: dayjs(item.created_at).format('MMM D, YYYY'),
    }));
  }, [incidentsListData]);

  const KpiResolvedData = useMemo(() => {
    if (!kpisData) return null;
    return kpisData.data;
  }, [kpisData]);

  // @ts-ignore
  const totalCount = incidentsListData?.data?.total ?? 0;

  const filteredData = useMemo(() => {
    return incidentsData;
  }, [incidentsData]);

  const tabCounts = useMemo(() => {
    return {
      All: totalCount,
      'Driver Complaint': incidentsData.filter(
        (r) => r.category === 'Driver Complaint'
      ).length,
      'Rider Complaint': incidentsData.filter(
        (r) => r.category === 'Rider Complaint'
      ).length,
      Accident: incidentsData.filter((r) => r.category === 'Accident').length,
    };
  }, [incidentsData, totalCount]);

  const statCards = [
    {
      value: String(KpiResolvedData?.total ?? '--'),
      label: 'Total Reported',
      icon: (
        <ReportProblemOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
      ),
      iconBg: '#EEF2FF',
    },
    {
      value: String(KpiResolvedData?.driver_complaints ?? '--'),
      label: 'Driver Complaints',
      icon: (
        <DirectionsCarOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
    },
    {
      value: String(KpiResolvedData?.rider_complaints ?? '--'),
      label: 'Rider Complaints',
      icon: <PersonOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
      iconBg: '#FEF2F2',
    },
    {
      value: String(KpiResolvedData?.accidents ?? '--'),
      label: 'Accidents Filed',
      icon: <CarCrashOutlinedIcon sx={{ fontSize: 18, color: '#DB2777' }} />,
      iconBg: '#FDF2F8',
    },
  ];

  const handlePageChange = useCallback((newPage: number) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPaginationModel({ page: 0, pageSize: newPageSize });
  }, []);

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Incident Reports"
            desc="All filed incidents including driver complaints, rider complaints, and accidents"
          />
          <AppButton
            variant="contained"
            color="primary"
            onClick={() => setFileModalOpen(true)}
            startIcon={
              <AddOutlinedIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
            }
            sx={{
              background: '#2F6FED',
              borderRadius: '14px',
              padding: '0 18px',
              height: '40px',
              boxShadow: '0px 4px 12px 0px rgba(47, 111, 237, 0.27)',
              textTransform: 'none',
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              whiteSpace: 'nowrap',
              '&:hover': { opacity: 0.9, background: '#2F6FED' },
            }}
          >
            File Incident
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

        {/* Reports List */}
        <Stack
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          {/* List Header */}
          <Stack spacing={'16px'} sx={{ padding: '20px 24px' }}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(16),
                color: '#111827',
                lineHeight: '24px',
              }}
            >
              All Reports
            </Typography>
            <RowStack justifyContent={'space-between'}>
              <RowStack spacing={'8px'}>
                {tabFilters.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <Box
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '16px',
                        border: `0.67px solid ${isActive ? '#2F6FED' : '#E5E7EB'}`,
                        background: isActive ? '#2F6FED' : 'transparent',
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          background: isActive ? '#2F6FED' : '#F7F9FB',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(12),
                          color: isActive ? '#FFFFFF' : '#6B7280',
                          lineHeight: '18px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tab}
                      </Typography>
                      <Box
                        sx={{
                          background: isActive
                            ? 'rgba(255, 255, 255, 0.26)'
                            : 'rgba(204, 194, 194, 0.26)',
                          borderRadius: '10px',
                          padding: '1px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(11),
                            color: isActive ? '#FFFFFF' : '#6B7280',
                            lineHeight: '16px',
                          }}
                        >
                          {tabCounts[tab as keyof typeof tabCounts]}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </RowStack>
              <AppSearchField
                name="search"
                placeholder="Search by ID, subject, filer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                boxProps={{
                  sx: { width: '260px' },
                }}
              />
            </RowStack>
          </Stack>

          {/* Incident Rows */}
          {filteredData.length === 0 ? (
            <EmptyState
              emptyState={
                <Typography
                  sx={{
                    color: '#6B7280',
                    fontSize: pxToRem(14),
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  No incident reports found
                </Typography>
              }
            />
          ) : (
            <>
              <Stack>
                {filteredData.map((incident) => {
                  const catColors = categoryColors[incident.category];
                  const priColors = priorityColors[incident.priority];
                  const statColors = statusColors[incident.status];

                  return (
                    <Box
                      key={incident.id}
                      sx={{
                        borderBottom: `1px solid ${catColors.border}`,
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <RowStack
                        justifyContent={'space-between'}
                        sx={{
                          padding: '18px 24px',
                        }}
                      >
                        {/* Left: Icon + Content */}
                        <RowStack spacing={'16px'} sx={{ flex: 1 }}>
                          {/* Warning Icon */}
                          <Box
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: '12px',
                              background: '#FEF3C7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <WarningAmberOutlinedIcon
                              sx={{ fontSize: 20, color: '#D97706' }}
                            />
                          </Box>

                          {/* Content */}
                          <Stack spacing={'6px'}>
                            {/* Top line: ID + Chips */}
                            <RowStack spacing={'10px'}>
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 700,
                                  fontSize: pxToRem(13),
                                  color: '#2F6FED',
                                }}
                              >
                                {incident.incidentId}
                              </Typography>
                              <Chip
                                label={incident.category}
                                size="small"
                                sx={{
                                  background: catColors.bg,
                                  color: catColors.color,
                                  fontWeight: 600,
                                  fontSize: pxToRem(11.5),
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  borderRadius: '16px',
                                  height: '24px',
                                }}
                              />
                              <Chip
                                label={incident.priority}
                                size="small"
                                sx={{
                                  background: priColors.bg,
                                  color: priColors.color,
                                  fontWeight: 600,
                                  fontSize: pxToRem(11.5),
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  borderRadius: '16px',
                                  height: '24px',
                                }}
                              />
                              <Chip
                                label={incident.status}
                                size="small"
                                sx={{
                                  background: statColors.bg,
                                  color: statColors.color,
                                  fontWeight: 600,
                                  fontSize: pxToRem(11.5),
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  borderRadius: '16px',
                                  height: '24px',
                                }}
                              />
                            </RowStack>

                            {/* Bottom line: Details */}
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 400,
                                fontSize: pxToRem(13),
                                color: '#374151',
                                lineHeight: '20px',
                              }}
                            >
                              <Typography
                                component="span"
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 400,
                                  fontSize: pxToRem(13),
                                  color: '#6B7280',
                                }}
                              >
                                Subject:{' '}
                              </Typography>
                              {incident.subject}
                              <Typography
                                component="span"
                                sx={{
                                  color: '#D1D5DB',
                                  mx: '6px',
                                }}
                              >
                                ·
                              </Typography>
                              <Typography
                                component="span"
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 600,
                                  fontSize: pxToRem(13),
                                  color: '#374151',
                                }}
                              >
                                Filed by:
                              </Typography>{' '}
                              {incident.filedBy} ({incident.filerRole})
                              <Typography
                                component="span"
                                sx={{
                                  color: '#D1D5DB',
                                  mx: '6px',
                                }}
                              >
                                ·
                              </Typography>
                              <Typography
                                component="span"
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 400,
                                  fontSize: pxToRem(13),
                                  color: '#9CA3AF',
                                }}
                              >
                                {incident.date}
                              </Typography>
                            </Typography>
                          </Stack>
                        </RowStack>

                        {/* Right: View Button */}
                        <RowStack
                          spacing={'5px'}
                          sx={{
                            padding: '6px 16px',
                            borderRadius: '8px',
                            border: '0.67px solid #E5E7EB',
                            background: '#FFFFFF',
                            cursor: 'pointer',
                            flexShrink: 0,
                            '&:hover': { background: '#F7F9FB' },
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 500,
                              fontSize: pxToRem(13),
                              color: '#374151',
                              lineHeight: '20px',
                            }}
                          >
                            View
                          </Typography>
                        </RowStack>
                      </RowStack>
                    </Box>
                  );
                })}
              </Stack>

              {/* Pagination */}
              <CustomPagination
                count={totalCount}
                page={paginationModel.page}
                pageSize={paginationModel.pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )}
        </Stack>
      </Stack>
      {/* File Incident Modal */}
      <FileIncidentModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
      />
    </AppDashboardLayout>
  );
};
