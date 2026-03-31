'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import UnfoldLessOutlinedIcon from '@mui/icons-material/UnfoldLessOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  AppFilterPopover,
  FilterSection,
} from '../../modules/components/AppFilterPopover';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type CasePriority = 'High' | 'Medium' | 'Low';
type CaseStatus = 'In Progress' | 'Unassigned';
type CaseCategory = 'Driver Complaint' | 'Rider Complaint' | 'Accident';

type CaseRow = {
  id: string;
  caseId: string;
  incidentId: string;
  category: CaseCategory;
  priority: CasePriority;
  status: CaseStatus;
  subject: string;
  assignee: string;
  openedDate: string;
  daysAgo: string;
  progress: number;
  description?: string;
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const priorityColors: Record<CasePriority, { color: string; bg: string }> = {
  High: { color: '#EF4444', bg: '#FEF2F2' },
  Medium: { color: '#D97706', bg: '#FFFBEB' },
  Low: { color: '#22C55E', bg: '#F0FDF4' },
};

const statusColors: Record<CaseStatus, { color: string; bg: string }> = {
  'In Progress': { color: '#2F6FED', bg: '#EBF2FF' },
  Unassigned: { color: '#EF4444', bg: '#FEF2F2' },
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const casesData: CaseRow[] = [
  {
    id: '1',
    caseId: 'INV-2201',
    incidentId: 'INC-4401',
    category: 'Driver Complaint',
    priority: 'Medium',
    status: 'In Progress',
    subject: 'Liam MacDonald',
    assignee: 'Angela Brooks',
    openedDate: 'Mar 8, 2026',
    daysAgo: '1d ago',
    progress: 40,
    description: 'Interviewing rider witness. GPS data review pending.',
  },
  {
    id: '2',
    caseId: 'INV-2200',
    incidentId: 'INC-4398',
    category: 'Accident',
    priority: 'High',
    status: 'In Progress',
    subject: 'David Chen',
    assignee: 'John Carter',
    openedDate: 'Mar 5, 2026',
    daysAgo: '4d ago',
    progress: 70,
    description:
      'Reviewing dashcam footage and police report. Awaiting insurance adjuster.',
  },
  {
    id: '3',
    caseId: 'INV-2199',
    incidentId: 'INC-4395',
    category: 'Rider Complaint',
    priority: 'Medium',
    status: 'In Progress',
    subject: 'Pierre Tremblay',
    assignee: 'Marcus Bell',
    openedDate: 'Feb 28, 2026',
    daysAgo: '9d ago',
    progress: 55,
    description:
      'Gathering statements from both rider and driver. Reviewing trip logs.',
  },
  {
    id: '4',
    caseId: 'INV-2198',
    incidentId: 'INC-4392',
    category: 'Driver Complaint',
    priority: 'Low',
    status: 'Unassigned',
    subject: 'Marc Lefebvre',
    assignee: 'Unassigned',
    openedDate: 'Feb 27, 2026',
    daysAgo: '10d ago',
    progress: 10,
    description: 'Initial report filed. Awaiting assignment for investigation.',
  },
  {
    id: '5',
    caseId: 'INV-2197',
    incidentId: 'INC-4390',
    category: 'Rider Complaint',
    priority: 'Medium',
    status: 'In Progress',
    subject: 'Aisha Mensah',
    assignee: 'Sandra Lee',
    openedDate: 'Feb 22, 2026',
    daysAgo: '15d ago',
    progress: 90,
    description:
      'Final review stage. Resolution recommendation submitted to management.',
  },
  {
    id: '6',
    caseId: 'INV-2196',
    incidentId: 'INC-4388',
    category: 'Accident',
    priority: 'High',
    status: 'Unassigned',
    subject: "Ryan O'Brien",
    assignee: 'Unassigned',
    openedDate: 'Feb 20, 2026',
    daysAgo: '17d ago',
    progress: 0,
    description: 'Accident report received. Needs investigator assignment.',
  },
  {
    id: '7',
    caseId: 'INV-2195',
    incidentId: 'INC-4385',
    category: 'Driver Complaint',
    priority: 'Low',
    status: 'In Progress',
    subject: 'Sophie Tremblay',
    assignee: 'Angela Brooks',
    openedDate: 'Feb 18, 2026',
    daysAgo: '19d ago',
    progress: 80,
    description: 'Investigation complete. Disciplinary action under review.',
  },
  {
    id: '8',
    caseId: 'INV-2194',
    incidentId: 'INC-4381',
    category: 'Rider Complaint',
    priority: 'Low',
    status: 'Unassigned',
    subject: 'Jean-Paul Fortin',
    assignee: 'Unassigned',
    openedDate: 'Feb 15, 2026',
    daysAgo: '22d ago',
    progress: 5,
    description: 'Complaint registered. Pending investigator assignment.',
  },
];

// ─── Filter Config ──────────────────────────────────────────────────────────

const filterSections: FilterSection[] = [
  {
    label: 'Priority',
    key: 'priority',
    options: ['All', 'High', 'Medium', 'Low'],
  },
  {
    label: 'Status',
    key: 'status',
    options: ['All', 'In Progress', 'Unassigned'],
  },
];

const defaultFilters: Record<string, string> = {
  priority: 'All',
  status: 'All',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const IncidentInvestigationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const filteredData = useMemo(() => {
    let filtered = casesData;

    if (filters.priority !== 'All') {
      filtered = filtered.filter((r) => r.priority === filters.priority);
    }
    if (filters.status !== 'All') {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.caseId.toLowerCase().includes(query) ||
          r.incidentId.toLowerCase().includes(query) ||
          r.subject.toLowerCase().includes(query) ||
          r.assignee.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, filters]);

  const statCards = [
    {
      value: '11',
      label: 'Active Investigations',
      icon: <SearchOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
    },
    {
      value: '8',
      label: 'Assigned',
      icon: <PersonOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
      iconBg: '#ECFDF5',
    },
    {
      value: '3',
      label: 'Unassigned',
      icon: <PersonOffOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
      iconBg: '#FEF2F2',
    },
    {
      value: '4.2d',
      label: 'Avg. Duration',
      icon: <TimerOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
      iconBg: '#FFFBEB',
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Incident Investigations"
          desc="Active case reviews, assignee tracking, and investigation progress"
        />

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

        {/* Cases List */}
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
            <RowStack justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(16),
                  color: '#111827',
                  lineHeight: '24px',
                }}
              >
                Active Cases
              </Typography>
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
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  boxProps={{
                    sx: { width: '220px' },
                  }}
                />
              </RowStack>
            </RowStack>
          </Stack>

          {/* Case Rows */}
          <Stack>
            {filteredData.map((caseRow) => {
              const priColors = priorityColors[caseRow.priority];
              const statColors = statusColors[caseRow.status];
              const isUnassigned = caseRow.status === 'Unassigned';
              const isNearComplete = caseRow.progress >= 80;
              const isExpanded = expandedId === caseRow.id;

              const getProgressBarColor = () => {
                if (isNearComplete && !isUnassigned) return '#22C55E';
                if (isUnassigned) return '#F59E0B';
                return '#2F6FED';
              };

              return (
                <Box
                  key={caseRow.id}
                  sx={{
                    borderTop: '1px solid #F0F4F8',
                  }}
                >
                  <RowStack
                    spacing={'16px'}
                    sx={{ padding: '18px 24px' }}
                    alignItems={'flex-start'}
                  >
                    {/* Left Icon */}
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
                        mt: '2px',
                      }}
                    >
                      <AssignmentOutlinedIcon
                        sx={{ fontSize: 20, color: '#D97706' }}
                      />
                    </Box>

                    {/* Content Area */}
                    <Stack spacing={'10px'} sx={{ flex: 1, minWidth: 0 }}>
                      {/* Top Row: IDs + Chips + Actions */}
                      <RowStack justifyContent={'space-between'}>
                        <RowStack spacing={'10px'} sx={{ flexWrap: 'wrap' }}>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 700,
                              fontSize: pxToRem(13),
                              color: '#2F6FED',
                            }}
                          >
                            {caseRow.caseId}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(12),
                              color: '#9CA3AF',
                            }}
                          >
                            ← {caseRow.incidentId}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(12.5),
                              color: '#6B7280',
                            }}
                          >
                            {caseRow.category}
                          </Typography>
                          <Chip
                            label={caseRow.priority}
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
                            label={caseRow.status}
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

                        {/* Action Buttons */}
                        <RowStack spacing={'8px'} sx={{ flexShrink: 0 }}>
                          {isExpanded ? (
                            <RowStack
                              spacing={'4px'}
                              onClick={() => setExpandedId(null)}
                              sx={{
                                padding: '5px 12px',
                                borderRadius: '8px',
                                border: '0.67px solid #E8ECF0',
                                background: '#F7F9FB',
                                cursor: 'pointer',
                                '&:hover': { background: '#E8ECF0' },
                              }}
                            >
                              <UnfoldLessOutlinedIcon
                                sx={{ fontSize: 13, color: '#6B7280' }}
                              />
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 500,
                                  fontSize: pxToRem(12),
                                  color: '#6B7280',
                                  lineHeight: '18px',
                                }}
                              >
                                Collapse
                              </Typography>
                            </RowStack>
                          ) : (
                            <RowStack
                              spacing={'4px'}
                              onClick={() => setExpandedId(caseRow.id)}
                              sx={{
                                padding: '5px 12px',
                                borderRadius: '8px',
                                border: '0.67px solid #E8ECF0',
                                background: '#F7F9FB',
                                cursor: 'pointer',
                                '&:hover': { background: '#E8ECF0' },
                              }}
                            >
                              <StickyNote2OutlinedIcon
                                sx={{ fontSize: 13, color: '#B3B9C2' }}
                              />
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 500,
                                  fontSize: pxToRem(12),
                                  color: '#B3B9C2',
                                  lineHeight: '18px',
                                }}
                              >
                                Notes
                              </Typography>
                            </RowStack>
                          )}
                          {isUnassigned && (
                            <AppButton
                              variant="contained"
                              sx={{
                                background: '#2F6FED',
                                color: '#FFFFFF',
                                borderRadius: '8px',
                                padding: '4px 14px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: pxToRem(12),
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                minWidth: 'unset',
                                height: 30,
                                boxShadow: 'none',
                                '&:hover': {
                                  background: '#2558C9',
                                  boxShadow: 'none',
                                },
                              }}
                            >
                              Assign
                            </AppButton>
                          )}
                          {!isUnassigned && isNearComplete && (
                            <AppButton
                              variant="contained"
                              sx={{
                                background: '#ECFDF5',
                                color: '#065F46',
                                borderRadius: '8px',
                                padding: '4px 14px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: pxToRem(12),
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                minWidth: 'unset',
                                height: 30,
                                boxShadow: 'none',
                                '&:hover': {
                                  background: '#D1FAE5',
                                  boxShadow: 'none',
                                },
                              }}
                            >
                              Close Case
                            </AppButton>
                          )}
                        </RowStack>
                      </RowStack>

                      {/* Details Row */}
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12.5),
                          color: '#9CA3AF',
                          lineHeight: '18px',
                        }}
                      >
                        Subject:{' '}
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12.5),
                            color: '#374151',
                          }}
                        >
                          {caseRow.subject}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ color: '#D1D5DB', mx: '6px' }}
                        >
                          ·
                        </Typography>
                        Assignee:{' '}
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12.5),
                            color: isUnassigned ? '#EF4444' : '#374151',
                          }}
                        >
                          {caseRow.assignee}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ color: '#D1D5DB', mx: '6px' }}
                        >
                          ·
                        </Typography>
                        Opened {caseRow.openedDate}{' '}
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(12),
                            color: '#B3B9C2',
                          }}
                        >
                          ({caseRow.daysAgo})
                        </Typography>
                      </Typography>

                      {/* Full-Width Progress Bar */}
                      <RowStack spacing={'12px'} alignItems={'center'}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={caseRow.progress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#F0F4F8',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                backgroundColor: getProgressBarColor(),
                              },
                            }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 500,
                            fontSize: pxToRem(11.5),
                            color: '#6B7280',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {caseRow.progress}% complete
                        </Typography>
                      </RowStack>

                      {/* Expanded Description */}
                      {isExpanded && caseRow.description && (
                        <Box
                          sx={{
                            background: '#F7F9FB',
                            borderRadius: '10px',
                            padding: '12px 16px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(12.5),
                              color: '#6B7280',
                              lineHeight: '20px',
                            }}
                          >
                            {caseRow.description}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </RowStack>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
