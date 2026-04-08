'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppNotificationSnackbar,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import { IssueDetailModal } from './ui/components';
import {
  pxToRem,
  useListRiderIssues,
  useRidersApi,
  useResolvedApiQuery,
  type RiderIssueListItem,
  type RiderIssueListResponse,
} from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type IssueType =
  | 'Support Ticket'
  | 'Complaint'
  | 'Refund Request'
  | 'No-show'
  | 'Billing Dispute'
  | 'Service Complaint';
export type Severity = 'High' | 'Medium' | 'Low';
export type IssueStatus = 'Open' | 'Under Review' | 'Resolved';

export type RiderIssue = {
  id: string;
  apiId: string;
  riderName: string;
  avatar: string;
  issueType: IssueType;
  description: string;
  date: string;
  severity: Severity;
  status: IssueStatus;
};

// ─── Config ─────────────────────────────────────────────────────────────────

const issueTypeConfig: Record<IssueType, { color: string; bg: string }> = {
  'Support Ticket': { color: '#2F6FED', bg: '#EBF2FF' },
  Complaint: { color: '#EF4444', bg: '#FEF2F2' },
  'Refund Request': { color: '#EA580C', bg: '#FFF7ED' },
  'No-show': { color: '#6366F1', bg: '#EEF2FF' },
  'Billing Dispute': { color: '#D97706', bg: '#FFFBEB' },
  'Service Complaint': { color: '#6B7280', bg: '#F3F4F6' },
};

const severityConfig: Record<Severity, { color: string; bg: string }> = {
  High: { color: '#EF4444', bg: '#FEF2F2' },
  Medium: { color: '#D97706', bg: '#FFFBEB' },
  Low: { color: '#22C55E', bg: '#F0FDF4' },
};

const statusConfig: Record<IssueStatus, { color: string; bg: string }> = {
  Open: { color: '#D97706', bg: '#FFFBEB' },
  'Under Review': { color: '#6366F1', bg: '#EEF2FF' },
  Resolved: { color: '#059669', bg: '#ECFDF5' },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const normalizeIssueType = (value?: string | null): IssueType => {
  const v = (value ?? '').toLowerCase().replace(/[_\s-]+/g, '');
  if (v === 'complaint' || v === 'servicecomplaint') return 'Complaint';
  if (v === 'refundrequest' || v === 'refund') return 'Refund Request';
  if (v === 'noshow') return 'No-show';
  if (v === 'billingdispute' || v === 'billing') return 'Billing Dispute';
  if (v === 'serviceissue') return 'Service Complaint';
  return 'Support Ticket';
};

const normalizePriority = (value?: string | null): Severity => {
  const v = (value ?? '').toLowerCase();
  if (v === 'high' || v === 'urgent' || v === 'critical') return 'High';
  if (v === 'low') return 'Low';
  return 'Medium';
};

const normalizeIssueStatus = (value?: string | null): IssueStatus => {
  const v = (value ?? '').toLowerCase().replace(/[_\s-]+/g, '');
  if (v === 'underreview' || v === 'inprogress' || v === 'investigating')
    return 'Under Review';
  if (v === 'resolved' || v === 'closed') return 'Resolved';
  return 'Open';
};

export const uiStatusToApi = (value: IssueStatus): string => {
  if (value === 'Under Review') return 'under_review';
  if (value === 'Resolved') return 'resolved';
  return 'open';
};

const DEFAULT_ISSUES: RiderIssueListResponse = {
  kpis: { open_count: 0, under_review_count: 0, resolved_count: 0 },
  issues: [],
  total: 0,
  page: 1,
  limit: 10,
  total_pages: 0,
};

const mapIssue = (item: RiderIssueListItem): RiderIssue => ({
  id: item.ticket_number || item.id,
  apiId: item.id,
  riderName: item.rider_name || 'Unknown',
  avatar: '',
  issueType: normalizeIssueType(item.issue_type),
  description: item.subject || '—',
  date: item.created_at ? dayjs(item.created_at).format('MMM D, YYYY') : '—',
  severity: normalizePriority(item.priority),
  status: normalizeIssueStatus(item.status),
});

export const RiderIssuesPage = () => {
  const { data: issuesData, refetch } = useResolvedApiQuery(
    useListRiderIssues,
    DEFAULT_ISSUES,
    { limit: 10 }
  );
  const { updateIssueStatus } = useRidersApi();

  const [selectedIssue, setSelectedIssue] = useState<RiderIssue | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const issues = useMemo<RiderIssue[]>(
    () => issuesData.issues.map(mapIssue),
    [issuesData]
  );

  const kpis = issuesData.kpis;

  const openCount = kpis.open_count;
  const reviewCount = kpis.under_review_count;
  const resolvedCount = kpis.resolved_count;

  const handleStatusChange = async (
    issue: RiderIssue,
    newStatus: IssueStatus
  ) => {
    const success = await updateIssueStatus({
      issueId: issue.apiId,
      status: uiStatusToApi(newStatus),
    });

    if (success) {
      setDetailOpen(false);
      const statusLabels: Record<IssueStatus, string> = {
        'Under Review': 'moved to Under Review',
        Resolved: 'marked as Resolved',
        Open: 'reopened',
      };
      setSnackbarMessage(`${issue.id} has been ${statusLabels[newStatus]}`);
      setSnackbarOpen(true);
      refetch();
    }
  };

  const statCards = [
    {
      value: String(openCount),
      label: 'Open Issues',
      valueColor: '#D97706',
      icon: (
        <WarningAmberOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
    },
    {
      value: String(reviewCount),
      label: 'Under Review',
      valueColor: '#6366F1',
      icon: <FindInPageOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
      iconBg: '#EEF2FF',
    },
    {
      value: String(resolvedCount),
      label: 'Resolved',
      valueColor: '#059669',
      icon: (
        <CheckCircleOutlineOutlinedIcon
          sx={{ fontSize: 18, color: '#059669' }}
        />
      ),
      iconBg: '#ECFDF5',
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Rider Issues"
          desc="Complaints, refund requests, and support tickets filed by riders"
        />

        {/* Stat Cards */}
        <Grid container spacing={'16px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                  padding: '20px',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '14px',
                    background: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
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
                    color: card.valueColor,
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

        {/* Issues List */}
        {issues.length === 0 ? (
          <Box sx={{ height: 400, width: '100%' }}>
            <EmptyState animationSrc="/empty.json" />
          </Box>
        ) : (
          <Stack spacing={'12px'}>
            {issues.map((issue) => {
              const nameParts = issue.riderName.split(' ');
              const initials =
                nameParts.length > 1
                  ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
                  : nameParts[0].charAt(0);

              const typeConfig = issueTypeConfig[issue.issueType];
              const sevConfig = severityConfig[issue.severity];
              const statConfig = statusConfig[issue.status];

              return (
                <RowStack
                  key={issue.apiId}
                  sx={{
                    background: '#FFFFFF',
                    border: '0.67px solid #F0F4F8',
                    borderRadius: '14px',
                    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                    padding: '14px 20px',
                  }}
                >
                  {/* Avatar */}
                  <Avatar
                    src={issue.avatar || undefined}
                    alt={issue.riderName}
                    sx={{
                      width: 40,
                      height: 40,
                      fontSize: pxToRem(13),
                      fontWeight: 600,
                      background: '#E5E7EB',
                      color: '#9CA3AF',
                      flexShrink: 0,
                      mr: '14px',
                    }}
                  >
                    {initials}
                  </Avatar>

                  {/* Name + Chip + Description */}
                  <Stack sx={{ flex: 1, minWidth: 0, mr: '16px' }}>
                    <RowStack spacing={'8px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                          lineHeight: '1.5em',
                        }}
                      >
                        {issue.riderName}
                      </Typography>
                      <Box
                        sx={{
                          padding: '1px 10px',
                          borderRadius: '100px',
                          background: typeConfig.bg,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(11),
                            color: typeConfig.color,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {issue.issueType}
                        </Typography>
                      </Box>
                    </RowStack>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(13),
                        color: '#6B7280',
                        lineHeight: '1.5em',
                      }}
                    >
                      {issue.description}
                    </Typography>
                  </Stack>

                  {/* Date */}
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#6B7280',
                      width: 100,
                      flexShrink: 0,
                      textAlign: 'center',
                    }}
                  >
                    {issue.date}
                  </Typography>

                  {/* Severity */}
                  <Box
                    sx={{
                      width: 80,
                      flexShrink: 0,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '2px 10px',
                        borderRadius: '100px',
                        background: sevConfig.bg,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          color: sevConfig.color,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {issue.severity}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status */}
                  <Box
                    sx={{
                      width: 100,
                      flexShrink: 0,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '2px 10px',
                        borderRadius: '100px',
                        background: statConfig.bg,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          color: statConfig.color,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {issue.status}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Button */}
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedIssue(issue);
                      setDetailOpen(true);
                    }}
                    sx={{
                      background: alpha('#2F6FED', 0.1),
                      color: '#2F6FED',
                      flexShrink: 0,
                      '&:hover': { background: alpha('#2F6FED', 0.18) },
                    }}
                  >
                    <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </RowStack>
              );
            })}
          </Stack>
        )}
      </Stack>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        issue={selectedIssue}
        onStatusChange={handleStatusChange}
      />

      {/* Snackbar */}
      <AppNotificationSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </AppDashboardLayout>
  );
};
