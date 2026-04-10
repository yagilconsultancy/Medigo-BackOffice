'use client';

import { useState, useMemo } from 'react';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppSearchField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { CustomPagination } from '../../modules/components/GridTable/ui/components/DataGridPagination/ui/components/CustomPagination';
import { EmptyState } from '../../modules/blocks';
import {
  pxToRem,
  useGetDisciplinaryKpis,
  useListDisciplinaryActions,
  useReinstateDisciplinaryAction,
  useResolvedApiQuery,
} from '../../../common';
import { IssueDisciplinaryActionModal } from './ui/components';
import dayjs from 'dayjs';

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

const actionTypeMapFromApi: Record<string, ActionType> = {
  account_suspension: 'Account Suspension',
  driving_suspension: 'Driving Suspension',
  written_warning: 'Written Warning',
  account_warning: 'Account Warning',
  driving_ban: 'Driving Ban',
};

const severityMapFromApi: Record<string, ActionSeverity> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const statusMapFromApi: Record<string, ActionStatus> = {
  active: 'Active',
  issued: 'Issued',
  expired: 'Expired',
  reinstated: 'Reinstated',
};

const statusMapToApi: Record<string, string> = {
  All: '',
  Active: 'active',
  Issued: 'issued',
  Expired: 'expired',
  Reinstated: 'reinstated',
};

const statusTabs = ['All', 'Active', 'Issued', 'Expired', 'Reinstated'];

export const DisciplinaryActionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 6,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hooks
  const { mutateAsync: reinstateDisciplinaryAction } =
    useReinstateDisciplinaryAction();

  // Fetch KPIs
  const { data: kpisData } = useResolvedApiQuery(useGetDisciplinaryKpis, null);

  // Fetch disciplinary actions list
  const { data: actionsListData, refetch } = useListDisciplinaryActions({
    page: paginationModel.page + 1,
    page_size: paginationModel.pageSize,
    status: activeTab !== 'All' ? statusMapToApi[activeTab] : undefined,
  });

  // Transform API data to UI format
  const transformedData = useMemo<DisciplinaryRow[]>(() => {
    if (!actionsListData?.success || !actionsListData.data?.items) {
      return [];
    }

    return actionsListData.data.items.map((action) => {
      const issuedDate = dayjs(action.issued_at);
      const expiresDate = action.expires_at ? dayjs(action.expires_at) : null;

      return {
        id: action.id,
        actionId: `DA-${action.action_number}`,
        incidentId: action.incident_number
          ? `INC-${action.incident_number}`
          : '—',
        actionType:
          actionTypeMapFromApi[action.action_type] || 'Written Warning',
        severity: severityMapFromApi[action.severity] || 'Medium',
        status: statusMapFromApi[action.status] || 'Issued',
        subjectName: action.subject_name || 'Unknown',
        subjectRole: action.subject_type === 'driver' ? 'Driver' : 'Rider',
        issuedBy: action.issued_by_name || 'Unknown',
        issuedDate: issuedDate.format('MMM D, YYYY'),
        duration: action.duration_text || '—',
        expiresDate: expiresDate ? expiresDate.format('MMM D, YYYY') : '—',
      };
    });
  }, [actionsListData]);

  // Client-side search filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return transformedData;
    }

    const query = searchQuery.toLowerCase();
    return transformedData.filter(
      (r) =>
        r.actionId.toLowerCase().includes(query) ||
        r.subjectName.toLowerCase().includes(query) ||
        r.incidentId.toLowerCase().includes(query)
    );
  }, [searchQuery, transformedData]);

  const paginatedData = filteredData;
  const totalCount =
    actionsListData?.success && actionsListData.data?.total
      ? actionsListData.data.total
      : 0;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleReinstate = async (actionId: string) => {
    try {
      await reinstateDisciplinaryAction({ actionId });
      refetch();
    } catch (error) {
      console.error('Error reinstating disciplinary action:', error);
    }
  };

  const statCards = [
    {
      value: (kpisData?.total || 0).toString(),
      label: 'Total Actions',
      icon: <GavelOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
      iconBg: '#EEF2FF',
    },
    {
      value: (kpisData?.suspensions || 0).toString(),
      label: 'Suspensions',
      icon: <BlockOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
      iconBg: '#FEF2F2',
    },
    {
      value: (kpisData?.warnings || 0).toString(),
      label: 'Warnings Issued',
      icon: (
        <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
    },
    {
      value: (kpisData?.reinstated || 0).toString(),
      label: 'Reinstated',
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#059669' }} />,
      iconBg: '#ECFDF5',
    },
  ];

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
          {paginatedData.length === 0 ? (
            <Box sx={{ padding: '40px 24px' }}>
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
                    No disciplinary actions found
                  </Typography>
                }
              />
            </Box>
          ) : (
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
                                onClick={() => handleReinstate(row.id)}
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
                            fontFamily: (theme) => theme.typography.fontFamily,
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
          )}

          {/* Pagination */}
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
