'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import { IssueDisciplinaryActionModal } from './ui/components';

// ─── Types ──────────────────────────────────────────────────────────────────

type ActionType =
  | 'Account Suspension'
  | 'Driving Suspension'
  | 'Written Warning'
  | 'Account Warning'
  | 'Driving Ban';
type ActionSeverity = 'High' | 'Medium' | 'Low';
type ActionStatus = 'Active' | 'Issued' | 'Expired' | 'Reinstated';

type DisciplinaryRow = {
  id: string;
  actionId: string;
  incidentId: string;
  actionType: ActionType;
  severity: ActionSeverity;
  status: ActionStatus;
  subjectName: string;
  subjectRole: 'Driver' | 'Rider';
  issuedBy: string;
  issuedDate: string;
  duration: string;
  expiresDate: string;
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const actionTypeColors: Record<ActionType, { color: string; bg: string }> = {
  'Account Suspension': { color: '#EF4444', bg: '#FEF2F2' },
  'Driving Suspension': { color: '#DB2777', bg: '#FDF2F8' },
  'Written Warning': { color: '#D97706', bg: '#FFFBEB' },
  'Account Warning': { color: '#D97706', bg: '#FFFBEB' },
  'Driving Ban': { color: '#6366F1', bg: '#EEF2FF' },
};

const severityColors: Record<ActionSeverity, { color: string; bg: string }> = {
  High: { color: '#EF4444', bg: '#FEF2F2' },
  Medium: { color: '#D97706', bg: '#FFFBEB' },
  Low: { color: '#22C55E', bg: '#F0FDF4' },
};

const statusColors: Record<ActionStatus, { color: string; bg: string }> = {
  Active: { color: '#EF4444', bg: '#FEF2F2' },
  Issued: { color: '#2F6FED', bg: '#EBF2FF' },
  Expired: { color: '#6B7280', bg: '#F3F4F6' },
  Reinstated: { color: '#059669', bg: '#ECFDF5' },
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const actionsData: DisciplinaryRow[] = [
  {
    id: '1',
    actionId: 'DA-1201',
    incidentId: 'INC-4399',
    actionType: 'Account Suspension',
    severity: 'High',
    status: 'Active',
    subjectName: 'Gordon MacPherson',
    subjectRole: 'Rider',
    issuedBy: 'John Carter',
    issuedDate: 'Mar 7, 2026',
    duration: '7 days',
    expiresDate: 'Mar 14, 2026',
  },
  {
    id: '2',
    actionId: 'DA-1200',
    incidentId: 'INC-4398',
    actionType: 'Driving Suspension',
    severity: 'High',
    status: 'Active',
    subjectName: 'David Chen',
    subjectRole: 'Driver',
    issuedBy: 'Angela Brooks',
    issuedDate: 'Mar 6, 2026',
    duration: 'Pending review',
    expiresDate: 'TBD',
  },
  {
    id: '3',
    actionId: 'DA-1199',
    incidentId: 'INC-4400',
    actionType: 'Written Warning',
    severity: 'Medium',
    status: 'Issued',
    subjectName: 'Sophie Tremblay',
    subjectRole: 'Driver',
    issuedBy: 'Angela Brooks',
    issuedDate: 'Mar 8, 2026',
    duration: 'On Record',
    expiresDate: '—',
  },
  {
    id: '4',
    actionId: 'DA-1198',
    incidentId: 'INC-4395',
    actionType: 'Account Warning',
    severity: 'Medium',
    status: 'Issued',
    subjectName: 'Pierre Tremblay',
    subjectRole: 'Rider',
    issuedBy: 'Marcus Bell',
    issuedDate: 'Mar 1, 2026',
    duration: 'On Record',
    expiresDate: '—',
  },
  {
    id: '5',
    actionId: 'DA-1197',
    incidentId: 'INC-4388',
    actionType: 'Driving Suspension',
    severity: 'High',
    status: 'Expired',
    subjectName: "Ryan O'Brien",
    subjectRole: 'Driver',
    issuedBy: 'John Carter',
    issuedDate: 'Feb 22, 2026',
    duration: '14 days',
    expiresDate: 'Mar 8, 2026',
  },
  {
    id: '6',
    actionId: 'DA-1196',
    incidentId: 'INC-4381',
    actionType: 'Written Warning',
    severity: 'Low',
    status: 'Issued',
    subjectName: 'Marc Lefebvre',
    subjectRole: 'Driver',
    issuedBy: 'Sandra Lee',
    issuedDate: 'Feb 18, 2026',
    duration: 'On Record',
    expiresDate: '—',
  },
  {
    id: '7',
    actionId: 'DA-1195',
    incidentId: 'INC-4376',
    actionType: 'Driving Suspension',
    severity: 'High',
    status: 'Active',
    subjectName: 'Amina Osei',
    subjectRole: 'Driver',
    issuedBy: 'John Carter',
    issuedDate: 'Feb 10, 2026',
    duration: '30 days',
    expiresDate: 'Mar 12, 2026',
  },
  {
    id: '8',
    actionId: 'DA-1194',
    incidentId: 'INC-4372',
    actionType: 'Written Warning',
    severity: 'Medium',
    status: 'Issued',
    subjectName: 'Jean-Paul Fortin',
    subjectRole: 'Driver',
    issuedBy: 'Marcus Bell',
    issuedDate: 'Feb 5, 2026',
    duration: 'On Record',
    expiresDate: '—',
  },
];

// ─── Tab Config ─────────────────────────────────────────────────────────────

const statusTabs = ['All', 'Active', 'Issued', 'Expired', 'Reinstated'];

// ─── Component ──────────────────────────────────────────────────────────────

const ROWS_PER_PAGE = 6;

export const DisciplinaryActionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    let filtered = actionsData;

    if (activeTab !== 'All') {
      filtered = filtered.filter((r) => r.status === activeTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.actionId.toLowerCase().includes(query) ||
          r.subjectName.toLowerCase().includes(query) ||
          r.incidentId.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const paginatedData = filteredData.slice(
    currentPage * ROWS_PER_PAGE,
    (currentPage + 1) * ROWS_PER_PAGE
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const statCards = [
    {
      value: '8',
      label: 'Total Actions',
      icon: <GavelOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
      iconBg: '#EEF2FF',
    },
    {
      value: '3',
      label: 'Suspensions',
      icon: <BlockOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
      iconBg: '#FEF2F2',
    },
    {
      value: '4',
      label: 'Warnings Issued',
      icon: (
        <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
    },
    {
      value: '1',
      label: 'Reinstated',
      icon: (
        <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#059669' }} />
      ),
      iconBg: '#ECFDF5',
    },
  ];

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 3) pages.push('...');
      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages - 2, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 4) pages.push('...');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Disciplinary Actions"
            desc="Account suspensions, driving bans, and formal warnings issued to drivers and riders"
          />
          <AppButton
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              background: '#6366F1',
              color: '#FFFFFF',
              borderRadius: '14px',
              padding: '8px 20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: pxToRem(13),
              fontFamily: (theme) => theme.typography.fontFamily,
              height: 40,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: '#4F46E5',
                boxShadow: 'none',
              },
            }}
          >
            Issue Action
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

        {/* Activity Log */}
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
                Activity Log
              </Typography>
              <AppSearchField
                name="search"
                placeholder="Search by ID or subject..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                boxProps={{
                  sx: { width: '240px' },
                }}
              />
            </RowStack>

            {/* Status Tabs */}
            <RowStack spacing={'6px'}>
              {statusTabs.map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <Box
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    sx={{
                      padding: '6px 16px',
                      borderRadius: '16px',
                      background: isSelected ? '#22C55E' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 500,
                        fontSize: pxToRem(12.5),
                        color: isSelected ? '#FFFFFF' : '#6B7280',
                      }}
                    >
                      {tab}
                    </Typography>
                  </Box>
                );
              })}
            </RowStack>
          </Stack>

          {/* Rows */}
          <Stack>
            {paginatedData.map((row) => {
              const typeColors = actionTypeColors[row.actionType];
              const sevColors = severityColors[row.severity];
              const statColors2 = statusColors[row.status];
              const isActive = row.status === 'Active';

              return (
                <Box
                  key={row.id}
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
                        background: '#EEF2FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: '2px',
                      }}
                    >
                      <GavelOutlinedIcon
                        sx={{ fontSize: 20, color: '#6366F1' }}
                      />
                    </Box>

                    {/* Content Area */}
                    <Stack spacing={'8px'} sx={{ flex: 1, minWidth: 0 }}>
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
                            {row.actionId}
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
                            ← {row.incidentId}
                          </Typography>
                          <Chip
                            label={row.actionType}
                            size="small"
                            sx={{
                              background: typeColors.bg,
                              color: typeColors.color,
                              fontWeight: 600,
                              fontSize: pxToRem(11.5),
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              borderRadius: '16px',
                              height: '24px',
                            }}
                          />
                          <Chip
                            label={row.severity}
                            size="small"
                            sx={{
                              background: sevColors.bg,
                              color: sevColors.color,
                              fontWeight: 600,
                              fontSize: pxToRem(11.5),
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              borderRadius: '16px',
                              height: '24px',
                            }}
                          />
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              background: statColors2.bg,
                              color: statColors2.color,
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
                          <RowStack
                            spacing={'4px'}
                            sx={{
                              padding: '5px 12px',
                              borderRadius: '8px',
                              border: '0.67px solid #E8ECF0',
                              background: '#F7F9FB',
                              cursor: 'pointer',
                              '&:hover': { background: '#E8ECF0' },
                            }}
                          >
                            <InfoOutlinedIcon
                              sx={{ fontSize: 13, color: '#374151' }}
                            />
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 500,
                                fontSize: pxToRem(12),
                                color: '#374151',
                                lineHeight: '18px',
                              }}
                            >
                              Reason
                            </Typography>
                          </RowStack>
                          {isActive && (
                            <RowStack
                              spacing={'4px'}
                              sx={{
                                padding: '5px 12px',
                                borderRadius: '8px',
                                border: '0.67px solid #D1FAE5',
                                background: '#ECFDF5',
                                cursor: 'pointer',
                                '&:hover': { background: '#D1FAE5' },
                              }}
                            >
                              <RestoreOutlinedIcon
                                sx={{ fontSize: 13, color: '#059669' }}
                              />
                              <Typography
                                sx={{
                                  fontFamily: (theme) =>
                                    theme.typography.fontFamily,
                                  fontWeight: 500,
                                  fontSize: pxToRem(12),
                                  color: '#059669',
                                  lineHeight: '18px',
                                }}
                              >
                                Reinstate
                              </Typography>
                            </RowStack>
                          )}
                        </RowStack>
                      </RowStack>

                      {/* Details Row */}
                      <Typography
                        sx={{
                          fontFamily: (theme) =>
                            theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12.5),
                          color: '#9CA3AF',
                          lineHeight: '18px',
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: (theme) =>
                              theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(12.5),
                            color: '#374151',
                          }}
                        >
                          {row.subjectName}
                        </Typography>{' '}
                        ({row.subjectRole})
                        <Typography
                          component="span"
                          sx={{ color: '#D1D5DB', mx: '6px' }}
                        >
                          ·
                        </Typography>
                        Issued by{' '}
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: (theme) =>
                              theme.typography.fontFamily,
                            fontWeight: 500,
                            fontSize: pxToRem(12.5),
                            color: '#374151',
                          }}
                        >
                          {row.issuedBy}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ color: '#D1D5DB', mx: '6px' }}
                        >
                          ·
                        </Typography>
                        {row.issuedDate}
                      </Typography>

                      {/* Duration & Expiry */}
                      <RowStack spacing={'16px'}>
                        <Typography
                          sx={{
                            fontFamily: (theme) =>
                              theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(12),
                            color: '#9CA3AF',
                            lineHeight: '18px',
                          }}
                        >
                          Duration:{' '}
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(12),
                              color: '#374151',
                              fontStyle:
                                row.duration === 'Pending review'
                                  ? 'italic'
                                  : 'normal',
                            }}
                          >
                            {row.duration}
                          </Typography>
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) =>
                              theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(12),
                            color: '#9CA3AF',
                            lineHeight: '18px',
                          }}
                        >
                          Expires:{' '}
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(12),
                              color:
                                isActive &&
                                row.expiresDate !== '—' &&
                                row.expiresDate !== 'TBD'
                                  ? '#EF4444'
                                  : row.expiresDate === 'TBD'
                                    ? '#EF4444'
                                    : '#374151',
                            }}
                          >
                            {row.expiresDate}
                          </Typography>
                        </Typography>
                      </RowStack>
                    </Stack>
                  </RowStack>
                </Box>
              );
            })}
          </Stack>

          {/* Pagination */}
          {totalPages > 1 && (
            <RowStack
              justifyContent={'space-between'}
              sx={{
                padding: '16px 24px',
                borderTop: '0.67px solid #F0F4F8',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: '#6B7280',
                }}
              >
                Showing {currentPage * ROWS_PER_PAGE + 1}–
                {Math.min(
                  (currentPage + 1) * ROWS_PER_PAGE,
                  filteredData.length
                )}{' '}
                of {filteredData.length} actions
              </Typography>

              <RowStack spacing={'4px'}>
                <IconButton
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 0}
                  sx={{
                    background: '#F7F9FB',
                    width: 30,
                    height: 30,
                    borderRadius: '8px',
                    border: '0.67px solid #E8ECF0',
                    color: currentPage === 0 ? '#D1D5DB' : '#374151',
                  }}
                >
                  <ChevronLeftIcon sx={{ fontSize: 18 }} />
                </IconButton>

                {getPageNumbers().map((p, index) =>
                  p === '...' ? (
                    <Typography
                      key={`ellipsis-${index}`}
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontSize: pxToRem(13),
                        color: '#9CA3AF',
                        mx: '4px',
                      }}
                    >
                      ...
                    </Typography>
                  ) : (
                    <Box
                      key={p}
                      onClick={() => setCurrentPage(Number(p))}
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        background:
                          currentPage === p ? '#2F6FED' : 'transparent',
                        '&:hover': {
                          background:
                            currentPage === p ? '#2F6FED' : '#F7F9FB',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: currentPage === p ? 600 : 400,
                          fontSize: pxToRem(12.5),
                          color: currentPage === p ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        {Number(p) + 1}
                      </Typography>
                    </Box>
                  )
                )}

                <IconButton
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage >= totalPages - 1}
                  sx={{
                    background: '#F7F9FB',
                    width: 30,
                    height: 30,
                    borderRadius: '8px',
                    border: '0.67px solid #E8ECF0',
                    color:
                      currentPage >= totalPages - 1 ? '#D1D5DB' : '#374151',
                  }}
                >
                  <ChevronRightIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </RowStack>
            </RowStack>
          )}
        </Stack>
      </Stack>

      {/* Issue Disciplinary Action Modal */}
      <IssueDisciplinaryActionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) => {
          console.log('Issue action:', values);
          setIsModalOpen(false);
        }}
      />
    </AppDashboardLayout>
  );
};
