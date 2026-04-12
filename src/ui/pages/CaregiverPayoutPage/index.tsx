'use client';

import { useState, useMemo } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  AppDatePickerPopover,
  AppFilterPopover,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { FilterSection } from '../../modules/components/AppFilterPopover';
import {
  pxToRem,
  useGetPayoutKpis,
  useGetEarningsBreakdown,
  useGetPayoutsBySpecialty,
  useGetDriverEarningsList,
  useResolvedApiQuery,
} from '../../../common';
import { EarningDetailModal, ConfirmPayoutModal } from './ui/components';
import { EmptyState } from '../../modules/blocks';

// ─── Types ──────────────────────────────────────────────────────────────────

type CaregiverStatus = 'Active' | 'Suspended';

type CaregiverRow = {
  id: string;
  caregiverId: string;
  name: string;
  initials: string;
  avatarBg: string;
  city: string;
  specialty: string;
  assignments: number;
  gross: string;
  fee: string;
  netPayout: string;
  pending: string;
  pendingValue: number;
  status: CaregiverStatus;
};

// ─── Specialty Colors ───────────────────────────────────────────────────────

const specialtyColors: Record<string, string> = {
  PSW: '#2F6FED',
  RPN: '#6366F1',
  RN: '#10B981',
  OT: '#93C5FD',
  PT: '#A5B4FC',
  Other: '#6EE7B7',
};

// ─── Filter Sections ────────────────────────────────────────────────────────

const caregiverFilterSections: FilterSection[] = [
  {
    label: 'Specialty',
    key: 'specialty',
    options: ['All', 'PSW', 'RPN', 'RN', 'OT', 'PT'],
  },
  {
    label: 'Status',
    key: 'status',
    options: ['All', 'Active', 'Suspended'],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const CaregiverPayoutPage = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs('2026-03-10')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaregiver, setSelectedCaregiver] =
    useState<CaregiverRow | null>(null);
  const [earningDetailOpen, setEarningDetailOpen] = useState(false);
  const [confirmPayoutOpen, setConfirmPayoutOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    specialty: 'All',
    status: 'All',
  });
  const [page] = useState(1);
  const [pageSize] = useState(10);

  // API Hooks with is_caregiver: true
  const kpisQuery = useGetPayoutKpis({ is_caregiver: true });
  const { data: kpis } = useResolvedApiQuery(useGetPayoutKpis, null, {
    is_caregiver: true,
  });
  const isFetchingKpis = kpisQuery.isFetching;

  const breakdownQuery = useGetEarningsBreakdown({ is_caregiver: true });
  const { data: breakdownData } = useResolvedApiQuery(
    useGetEarningsBreakdown,
    null,
    { is_caregiver: true }
  );
  const isFetchingBreakdown = breakdownQuery.isFetching;

  const specialtyQuery = useGetPayoutsBySpecialty({ is_caregiver: true });
  const { data: specialtyData } = useResolvedApiQuery(
    useGetPayoutsBySpecialty,
    null,
    { is_caregiver: true }
  );
  const isFetchingSpecialty = specialtyQuery.isFetching;

  const caregiversQuery = useGetDriverEarningsList({
    is_caregiver: true,
    page,
    limit: pageSize,
    search: searchQuery.trim() || null,
    specialty: filters.specialty !== 'All' ? filters.specialty : null,
    status: filters.status !== 'All' ? filters.status : null,
  });
  const { data: caregiversListData } = useResolvedApiQuery(
    useGetDriverEarningsList,
    null,
    {
      is_caregiver: true,
      page,
      limit: pageSize,
      search: searchQuery.trim() || null,
      specialty: filters.specialty !== 'All' ? filters.specialty : null,
      status: filters.status !== 'All' ? filters.status : null,
    }
  );
  const isFetchingCaregivers = caregiversQuery.isFetching;

  const formatCurrency = (value?: number): string => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({ specialty: 'All', status: 'All' });
  };

  const statCards = useMemo(
    () => [
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
        ),
        iconBg: '#EBF2FF',
        value: formatCurrency(kpis?.total_earnings),
        label: 'Total Earnings',
        badge: '+16.2%',
        badgeBg: '#F0FDF7',
        badgeColor: '#059669',
        subtext: 'March 2026 · vs February',
      },
      {
        icon: <PeopleOutlineIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
        iconBg: '#EEF2FF',
        value: String(kpis?.active_drivers ?? 0),
        label: 'Active Caregivers',
        subtext: 'Paid this month',
      },
      {
        icon: (
          <AssignmentOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />
        ),
        iconBg: '#ECFDF5',
        value: formatCurrency(kpis?.payouts_pending_count),
        label: 'Pending Count',
        subtext: 'Awaiting processing',
      },
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
        ),
        iconBg: '#FFFBEB',
        value: formatCurrency(kpis?.payouts_pending_total),
        label: 'Pending Amount',
        subtext: 'Total pending payouts',
      },
      {
        icon: <ShowChartOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />,
        iconBg: '#ECFDF5',
        value: formatCurrency(kpis?.payouts_completed_total),
        label: 'Completed',
        subtext: 'Processed payouts',
      },
    ],
    [kpis]
  );

  const donutData = useMemo(() => {
    if (!specialtyData || !Array.isArray(specialtyData)) return [];

    return specialtyData.map((item: any, index: number) => ({
      name: item.specialty || `Specialty ${index + 1}`,
      value: item.percentage || 0,
      amount: formatCurrency(item.total_amount),
      color:
        specialtyColors[item.specialty as keyof typeof specialtyColors] ||
        '#9CA3AF',
    }));
  }, [specialtyData]);

  const earningsDistribution = useMemo(() => {
    if (!caregiversListData?.items || !Array.isArray(caregiversListData.items))
      return [];

    const sortedList = [...caregiversListData.items]
      .sort(
        (a: any, b: any) => (b.total_earnings || 0) - (a.total_earnings || 0)
      )
      .slice(0, 6);

    const maxNet = sortedList[0]?.total_earnings || 1;

    return sortedList.map((cg: any) => {
      const initials =
        cg.driver_name
          ?.split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase() || '??';

      const platformFee = (cg.total_earnings || 0) * 0.2;

      return {
        initials,
        bg:
          specialtyColors[cg.specialty as keyof typeof specialtyColors] ||
          '#9CA3AF',
        name: cg.driver_name || 'Unknown',
        specialty: cg.specialty || 'N/A',
        city: 'N/A',
        assignments: cg.completed_rides || 0,
        fee: `-${formatCurrency(platformFee)}`,
        net: formatCurrency(cg.total_earnings),
        progress: Math.round(((cg.total_earnings || 0) / maxNet) * 100),
        barColor:
          specialtyColors[cg.specialty as keyof typeof specialtyColors] ||
          '#9CA3AF',
      };
    });
  }, [caregiversListData]);

  const caregiverTableData = useMemo(() => {
    if (!caregiversListData?.items || !Array.isArray(caregiversListData.items))
      return [];

    return caregiversListData.items.map((cg: any) => {
      const initials =
        cg.driver_name
          ?.split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase() || '??';

      const gross = (cg.total_earnings || 0) / 0.8;
      const platformFee = gross - (cg.total_earnings || 0);

      return {
        id: cg.id || '',
        caregiverId: cg.driver_id || 'N/A',
        name: cg.driver_name || 'Unknown',
        initials,
        avatarBg:
          specialtyColors[cg.specialty as keyof typeof specialtyColors] ||
          '#9CA3AF',
        city: 'N/A',
        specialty: cg.specialty || 'N/A',
        assignments: cg.completed_rides || 0,
        gross: formatCurrency(gross),
        fee: `-${formatCurrency(platformFee)}`,
        netPayout: formatCurrency(cg.total_earnings),
        pending: formatCurrency(cg.pending_payout),
        pendingValue: cg.pending_payout || 0,
        status: cg.status || 'Active',
      };
    });
  }, [caregiversListData]);

  const columns: GridColSpec<CaregiverRow>[] = [
    {
      field: 'name',
      headerName: 'Caregiver',
      flex: 1.3,
      minWidth: 180,
      renderCell: (params) => (
        <RowStack spacing={'10px'}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: pxToRem(11),
              fontWeight: 700,
              background: params.row.avatarBg,
              color: '#FFFFFF',
              borderRadius: '14px',
            }}
          >
            {params.row.initials}
          </Avatar>
          <Stack spacing={0}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#111827',
                lineHeight: '1.4em',
              }}
            >
              {params.row.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11),
                color: '#9CA3AF',
                lineHeight: '1.4em',
              }}
            >
              {params.row.caregiverId}
            </Typography>
          </Stack>
        </RowStack>
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12.5),
            color: '#6B7280',
          }}
        >
          {params.row.city}
        </Typography>
      ),
    },
    {
      field: 'specialty',
      headerName: 'Specialty',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <Chip
          label={params.row.specialty}
          size="small"
          sx={{
            background: '#EEF2FF',
            color: '#6366F1',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(11.5),
            height: '24px',
            borderRadius: '100px',
          }}
        />
      ),
    },
    {
      field: 'assignments',
      headerName: 'Assignments',
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#374151',
          }}
        >
          {params.row.assignments}
        </Typography>
      ),
    },
    {
      field: 'gross',
      headerName: 'Gross Earnings',
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            color: '#111827',
          }}
        >
          {params.row.gross}
        </Typography>
      ),
    },
    {
      field: 'fee',
      headerName: 'Platform Fee (20%)',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: '#EF4444',
          }}
        >
          {params.row.fee}
        </Typography>
      ),
    },
    {
      field: 'netPayout',
      headerName: 'Net Payout',
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#10B981',
          }}
        >
          {params.row.netPayout}
        </Typography>
      ),
    },
    {
      field: 'pending',
      headerName: 'Pending',
      flex: 0.7,
      minWidth: 80,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(13),
            color: params.row.pendingValue > 0 ? '#D97706' : '#9CA3AF',
          }}
        >
          {params.row.pending}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(11.5),
            color: params.row.status === 'Active' ? '#059669' : '#EF4444',
          }}
        >
          {params.row.status}
        </Typography>
      ),
    },
    // {
    //   field: 'actions' as string,
    //   headerName: '',
    //   flex: 0.5,
    //   minWidth: 70,
    //   sortable: false,
    //   renderCell: (params) => (
    //     <RowStack spacing={'4px'}>
    //       <IconButton
    //         size="small"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           setSelectedCaregiver(params.row);
    //           setEarningDetailOpen(true);
    //         }}
    //         sx={{
    //           width: 30,
    //           height: 30,
    //           color: '#9CA3AF',
    //           '&:hover': { color: '#2F6FED', background: '#EBF2FF' },
    //         }}
    //       >
    //         <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
    //       </IconButton>
    //       <IconButton
    //         size="small"
    //         sx={{
    //           width: 30,
    //           height: 30,
    //           color: '#9CA3AF',
    //           '&:hover': { color: '#6B7280', background: '#F3F4F6' },
    //         }}
    //       >
    //         <ChatOutlinedIcon sx={{ fontSize: 16 }} />
    //       </IconButton>
    //     </RowStack>
    //   ),
    // },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header: Title + Date Picker + Export */}
        <RowStack justifyContent={'space-between'} alignItems={'flex-start'}>
          <DashboardTitleAndDesc
            title="Caregiver Payouts & Earnings"
            desc="Care assistant earnings, platform fee deductions, and monthly payout summaries"
          />

          <RowStack spacing={'12px'} sx={{ flexShrink: 0 }}>
            <AppDatePickerPopover
              value={selectedDate}
              onChange={setSelectedDate}
            />

            <AppButton
              startIcon={
                <DownloadOutlinedIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
              }
              sx={{
                padding: '10px 20px',
                background: '#2F6FED',
                borderRadius: '14px',
                boxShadow: '0px 2px 8px 0px rgba(47, 111, 237, 0.25)',
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#FFFFFF',
                textTransform: 'none',
                '&:hover': { background: '#2558C4' },
              }}
            >
              Export
            </AppButton>
          </RowStack>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'20px'} alignItems="stretch">
          {isFetchingKpis
            ? Array.from({ length: 5 }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={140}
                    sx={{ borderRadius: '16px' }}
                  />
                </Grid>
              ))
            : statCards.map((card) => (
                <Grid key={card.label} size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Stack
                    sx={{
                      background: '#FFFFFF',
                      border: '0.67px solid #F0F4F8',
                      borderRadius: '16px',
                      boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                      padding: '20px',
                      gap: '16px',
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        background: card.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Stack spacing={'4px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(24),
                          lineHeight: '1em',
                          color: '#111827',
                        }}
                      >
                        {card.value}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(13),
                          color: '#374151',
                        }}
                      >
                        {card.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#9CA3AF',
                        }}
                      >
                        {card.subtext}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              ))}
        </Grid>

        {/* Middle Section: Donut Chart + Earnings Distribution */}
        <Grid container spacing={'20px'}>
          {/* Donut Chart */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack
              sx={{
                background: '#FFFFFF',
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                padding: '24px',
                height: '100%',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                  mb: '16px',
                }}
              >
                Payouts by Specialty
              </Typography>

              {isFetchingSpecialty ? (
                <Stack alignItems="center" spacing={'12px'}>
                  <Skeleton variant="circular" width={180} height={180} />
                  <Stack spacing={'6px'} width="100%">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        variant="rectangular"
                        width="100%"
                        height={24}
                      />
                    ))}
                  </Stack>
                </Stack>
              ) : donutData.length > 0 ? (
                <>
                  {/* Donut Chart */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      mb: '24px',
                    }}
                  >
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {donutData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Label */}
                    <Stack
                      alignItems={'center'}
                      justifyContent={'center'}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(13),
                          color: '#111827',
                        }}
                      >
                        Payout
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11),
                          color: '#9CA3AF',
                        }}
                      >
                        by Specialty
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Legend */}
                  <Stack spacing={'6px'}>
                    {donutData.map((d) => (
                      <RowStack key={d.name} justifyContent={'space-between'}>
                        <RowStack spacing={'8px'}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: d.color,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(12),
                              color: '#374151',
                            }}
                          >
                            {d.name}
                          </Typography>
                        </RowStack>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12),
                            color: '#111827',
                          }}
                        >
                          {d.value}%
                        </Typography>
                      </RowStack>
                    ))}
                  </Stack>
                </>
              ) : (
                <EmptyState animationSrc="/empty.json" />
              )}
            </Stack>
          </Grid>

          {/* Earnings Distribution */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack
              sx={{
                background: '#FFFFFF',
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                padding: '24px',
                height: '100%',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                  mb: '20px',
                }}
              >
                Caregiver Earnings Distribution — March 2026
              </Typography>

              {isFetchingCaregivers ? (
                <Stack spacing={'12px'} sx={{ flex: 1 }}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Stack key={index} spacing={'8px'}>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={60}
                      />
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={7}
                        sx={{ borderRadius: '100px' }}
                      />
                    </Stack>
                  ))}
                </Stack>
              ) : earningsDistribution.length > 0 ? (
                <>
                  <Stack spacing={'12px'} sx={{ flex: 1 }}>
                    {earningsDistribution.map((cg) => (
                      <Stack key={cg.name} spacing={'8px'}>
                        <RowStack justifyContent={'space-between'}>
                          <RowStack spacing={'10px'}>
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                fontSize: pxToRem(10),
                                fontWeight: 700,
                                background: cg.bg,
                                color: '#FFFFFF',
                              }}
                            >
                              {cg.initials}
                            </Avatar>
                            <RowStack spacing={'6px'}>
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 600,
                                  fontSize: pxToRem(13),
                                  color: '#111827',
                                  lineHeight: '1.4em',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {cg.name}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 400,
                                  fontSize: pxToRem(11.5),
                                  color: '#9CA3AF',
                                  lineHeight: '1.4em',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {cg.specialty} · {cg.city}
                              </Typography>
                            </RowStack>
                          </RowStack>
                          <RowStack spacing={'16px'}>
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 400,
                                fontSize: pxToRem(12),
                                color: '#9CA3AF',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {cg.assignments} assignments
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 600,
                                fontSize: pxToRem(12),
                                color: '#EF4444',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {cg.fee}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 700,
                                fontSize: pxToRem(14),
                                color: '#10B981',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {cg.net}
                            </Typography>
                          </RowStack>
                        </RowStack>
                        <LinearProgress
                          variant="determinate"
                          value={cg.progress}
                          sx={{
                            height: 7,
                            borderRadius: '100px',
                            backgroundColor: '#F0F4F8',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: '100px',
                              backgroundColor: cg.barColor,
                            },
                          }}
                        />
                      </Stack>
                    ))}
                  </Stack>

                  {/* Summary Footer */}
                  <RowStack
                    spacing={'16px'}
                    sx={{
                      mt: '20px',
                      pt: '20px',
                      borderTop: '0.67px solid #F0F4F8',
                    }}
                  >
                    {[
                      {
                        label: 'Total Earnings',
                        value: formatCurrency(kpis?.total_earnings),
                        color: '#10B981',
                      },
                      {
                        label: 'Pending Payouts',
                        value: formatCurrency(kpis?.payouts_pending_total),
                        color: '#D97706',
                      },
                      {
                        label: 'Completed Payouts',
                        value: formatCurrency(kpis?.payouts_completed_total),
                        color: '#6B7280',
                      },
                    ].map((item) => (
                      <Stack
                        key={item.label}
                        sx={{
                          flex: 1,
                          background: '#F7F9FB',
                          borderRadius: '14px',
                          padding: '12px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(11),
                            color: '#9CA3AF',
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(16),
                            color: item.color,
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Stack>
                    ))}
                  </RowStack>
                </>
              ) : (
                <EmptyState animationSrc="/empty.json" />
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={caregiverTableData}
          initialPageSize={7}
          disableRowClick
          emptyState={<EmptyState animationSrc="/empty.json" />}
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <RowStack justifyContent={'space-between'} width={'100%'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(18),
                color: '#111827',
              }}
            >
              Caregiver Payout Details
            </Typography>

            <RowStack spacing={'8px'}>
              <AppSearchField
                name="search"
                placeholder="Search caregiver, specialty or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                boxProps={{
                  sx: { width: '280px' },
                }}
              />

              <AppFilterPopover
                sections={caregiverFilterSections}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleFilterReset}
              />
            </RowStack>
          </RowStack>
        </AppGridtable>
      </Stack>

      {/* Earning Detail Modal */}
      <EarningDetailModal
        open={earningDetailOpen}
        onClose={() => {
          setEarningDetailOpen(false);
          setSelectedCaregiver(null);
        }}
        onPayNow={() => {
          setEarningDetailOpen(false);
          setConfirmPayoutOpen(true);
        }}
        variant="caregiver"
        data={
          selectedCaregiver
            ? {
                name: selectedCaregiver.name,
                initials: selectedCaregiver.initials,
                avatarBg: selectedCaregiver.avatarBg,
                id: selectedCaregiver.caregiverId,
                org: 'MediGo',
                date: 'Mar 3, 2026',
                status: selectedCaregiver.status,
                netPayout: selectedCaregiver.netPayout,
                grossAmount: selectedCaregiver.gross,
                commissionAmount: selectedCaregiver.fee,
                pendingAmount: selectedCaregiver.pending,
                trips: selectedCaregiver.assignments,
                earningsSplit: 80,
                schedule: 'Weekly · Every Monday',
                payoutMethod: 'Direct Deposit',
                bankAccount: '••••4821',
              }
            : null
        }
      />

      {/* Confirm Payout Modal */}
      <ConfirmPayoutModal
        open={confirmPayoutOpen}
        onClose={() => {
          setConfirmPayoutOpen(false);
          setSelectedCaregiver(null);
        }}
        onConfirm={() => {
          setConfirmPayoutOpen(false);
          setSelectedCaregiver(null);
        }}
        data={
          selectedCaregiver
            ? {
                name: selectedCaregiver.name,
                id: selectedCaregiver.caregiverId,
                fleet: 'MediGo',
                payoutAmount: selectedCaregiver.pending,
                method: `Direct Deposit (••••4821)`,
                schedule: 'Weekly · Every Monday',
              }
            : null
        }
      />
    </AppDashboardLayout>
  );
};
