'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
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
import { pxToRem } from '../../../common';
import {
  EarningDetailModal,
  ConfirmPayoutModal,
} from './ui/components';

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

// ─── Stat Cards ─────────────────────────────────────────────────────────────

const statCards = [
  {
    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    value: '$48,920',
    label: 'Total Caregiver Payouts (Mar)',
    subtext: '+11.4% vs Feb',
  },
  {
    icon: <PeopleOutlineIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
    value: '38',
    label: 'Active Caregivers',
    subtext: 'Paid this month',
  },
  {
    icon: <AssignmentOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />,
    iconBg: '#ECFDF5',
    value: '1,640',
    label: 'Total Assignments',
    subtext: 'Completed trips',
  },
  {
    icon: <ShowChartOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />,
    iconBg: '#FFFBEB',
    value: '$1,287',
    label: 'Avg Payout / Caregiver',
    subtext: 'This month',
  },
];

// ─── Donut Chart Data ───────────────────────────────────────────────────────

const donutData = [
  { name: 'PSW', value: 35, color: '#2F6FED' },
  { name: 'RPN', value: 23, color: '#6366F1' },
  { name: 'RN', value: 20, color: '#10B981' },
  { name: 'OT', value: 12, color: '#93C5FD' },
  { name: 'PT', value: 7, color: '#A5B4FC' },
  { name: 'Other', value: 3, color: '#6EE7B7' },
];

// ─── Earnings Distribution Data ─────────────────────────────────────────────

const earningsDistribution = [
  {
    initials: 'AO',
    bg: '#2F6FED',
    name: 'Amara Osei',
    specialty: 'PSW',
    city: 'Toronto, ON',
    assignments: 210,
    fee: '-$2,520',
    net: '$10,080',
    progress: 100,
    barColor: '#2F6FED',
  },
  {
    initials: 'SL',
    bg: '#6366F1',
    name: 'Sophie Lavoie',
    specialty: 'RPN',
    city: 'Montreal, QC',
    assignments: 185,
    fee: '-$2,220',
    net: '$8,880',
    progress: 88,
    barColor: '#6366F1',
  },
  {
    initials: 'PN',
    bg: '#10B981',
    name: 'Priya Nair',
    specialty: 'RN',
    city: 'Vancouver, BC',
    assignments: 162,
    fee: '-$1,944',
    net: '$7,776',
    progress: 77,
    barColor: '#10B981',
  },
  {
    initials: 'MT',
    bg: '#2F6FED',
    name: 'Marcus Tremblay',
    specialty: 'PSW',
    city: 'Calgary, AB',
    assignments: 148,
    fee: '-$1,776',
    net: '$7,104',
    progress: 70,
    barColor: '#2F6FED',
  },
  {
    initials: 'FD',
    bg: '#6366F1',
    name: 'Fatou Diallo',
    specialty: 'OT',
    city: 'Edmonton, AB',
    assignments: 130,
    fee: '-$1,560',
    net: '$6,240',
    progress: 62,
    barColor: '#6366F1',
  },
  {
    initials: 'HT',
    bg: '#9CA3AF',
    name: 'Hina Takahashi',
    specialty: 'PT',
    city: 'Ottawa, ON',
    assignments: 112,
    fee: '-$1,344',
    net: '$5,376',
    progress: 53,
    barColor: '#9CA3AF',
  },
];

// ─── Table Data ─────────────────────────────────────────────────────────────

const caregiverData: CaregiverRow[] = [
  {
    id: '1',
    caregiverId: 'CG-001',
    name: 'Amara Osei',
    initials: 'AO',
    avatarBg: '#2F6FED',
    city: 'Toronto, ON',
    specialty: 'PSW',
    assignments: 210,
    gross: '$12,600',
    fee: '-$2,520',
    netPayout: '$10,080',
    pending: '$1,008',
    pendingValue: 1008,
    status: 'Active',
  },
  {
    id: '2',
    caregiverId: 'CG-002',
    name: 'Sophie Lavoie',
    initials: 'SL',
    avatarBg: '#6366F1',
    city: 'Montreal, QC',
    specialty: 'RPN',
    assignments: 185,
    gross: '$11,100',
    fee: '-$2,220',
    netPayout: '$8,880',
    pending: '$0',
    pendingValue: 0,
    status: 'Active',
  },
  {
    id: '3',
    caregiverId: 'CG-003',
    name: 'Priya Nair',
    initials: 'PN',
    avatarBg: '#10B981',
    city: 'Vancouver, BC',
    specialty: 'RN',
    assignments: 162,
    gross: '$9,720',
    fee: '-$1,944',
    netPayout: '$7,776',
    pending: '$778',
    pendingValue: 778,
    status: 'Active',
  },
  {
    id: '4',
    caregiverId: 'CG-004',
    name: 'Marcus Tremblay',
    initials: 'MT',
    avatarBg: '#2F6FED',
    city: 'Calgary, AB',
    specialty: 'PSW',
    assignments: 148,
    gross: '$8,880',
    fee: '-$1,776',
    netPayout: '$7,104',
    pending: '$0',
    pendingValue: 0,
    status: 'Active',
  },
  {
    id: '5',
    caregiverId: 'CG-005',
    name: 'Fatou Diallo',
    initials: 'FD',
    avatarBg: '#6366F1',
    city: 'Edmonton, AB',
    specialty: 'OT',
    assignments: 130,
    gross: '$7,800',
    fee: '-$1,560',
    netPayout: '$6,240',
    pending: '$624',
    pendingValue: 624,
    status: 'Active',
  },
  {
    id: '6',
    caregiverId: 'CG-006',
    name: 'Hina Takahashi',
    initials: 'HT',
    avatarBg: '#9CA3AF',
    city: 'Ottawa, ON',
    specialty: 'PT',
    assignments: 112,
    gross: '$6,720',
    fee: '-$1,344',
    netPayout: '$5,376',
    pending: '$0',
    pendingValue: 0,
    status: 'Suspended',
  },
  {
    id: '7',
    caregiverId: 'CG-007',
    name: 'James Kowalczyk',
    initials: 'JK',
    avatarBg: '#10B981',
    city: 'Winnipeg, MB',
    specialty: 'PSW',
    assignments: 98,
    gross: '$5,880',
    fee: '-$1,176',
    netPayout: '$4,704',
    pending: '$470',
    pendingValue: 470,
    status: 'Active',
  },
];

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({ specialty: 'All', status: 'All' });
  };

  const filteredCaregivers = caregiverData.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.specialty.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.caregiverId.toLowerCase().includes(q);
    const matchesSpecialty =
      filters.specialty === 'All' || c.specialty === filters.specialty;
    const matchesStatus =
      filters.status === 'All' || c.status === filters.status;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

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
            color:
              params.row.status === 'Active' ? '#059669' : '#EF4444',
          }}
        >
          {params.row.status}
        </Typography>
      ),
    },
    {
      field: 'actions' as string,
      headerName: '',
      flex: 0.5,
      minWidth: 70,
      sortable: false,
      renderCell: (params) => (
        <RowStack spacing={'4px'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCaregiver(params.row);
              setEarningDetailOpen(true);
            }}
            sx={{
              width: 30,
              height: 30,
              color: '#9CA3AF',
              '&:hover': { color: '#2F6FED', background: '#EBF2FF' },
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              width: 30,
              height: 30,
              color: '#9CA3AF',
              '&:hover': { color: '#6B7280', background: '#F3F4F6' },
            }}
          >
            <ChatOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </RowStack>
      ),
    },
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
        <Grid container spacing={'20px'}>
          {statCards.map((card) => (
            <Grid key={card.label} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                  padding: '20px',
                  gap: '16px',
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
                  <RowStack
                    key={d.name}
                    justifyContent={'space-between'}
                  >
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
                          fontFamily: (theme) => theme.typography.fontFamily,
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
                    label: 'Total Net Payouts',
                    value: '$48,920',
                    color: '#10B981',
                  },
                  {
                    label: 'Platform Fees (20%)',
                    value: '$12,230',
                    color: '#6B7280',
                  },
                  {
                    label: 'Pending Payouts',
                    value: '$2,880',
                    color: '#D97706',
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
            </Stack>
          </Grid>
        </Grid>

        {/* Table */}
        <AppGridtable
          columns={columns}
          data={filteredCaregivers}
          initialPageSize={7}
          disableRowClick
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
