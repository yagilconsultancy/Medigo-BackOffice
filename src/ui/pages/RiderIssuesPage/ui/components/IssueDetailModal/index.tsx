'use client';

import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import {
  pxToRem,
  useGetRiderIssueDetail,
  useResolvedApiQuery,
  type RiderIssueDetailResponse,
} from '../../../../../../common';
import type { RiderIssue, IssueType, Severity, IssueStatus } from '../../..';

// ─── Types ──────────────────────────────────────────────────────────────────

type IssueDetailModalProps = {
  open: boolean;
  onClose: () => void;
  issue: RiderIssue | null;
  onStatusChange?: (issue: RiderIssue, newStatus: IssueStatus) => void;
};

type ActivityEntry = {
  id: string;
  text: string;
  by: string;
  time: string;
  type: 'system' | 'agent' | 'user';
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

const activityTypeConfig: Record<string, { color: string; bg: string }> = {
  system: { color: '#9CA3AF', bg: '#F3F4F6' },
  agent: { color: '#2F6FED', bg: '#EBF2FF' },
  user: { color: '#059669', bg: '#ECFDF5' },
};

// ─── Component ──────────────────────────────────────────────────────────────

export const IssueDetailModal = ({
  open,
  onClose,
  issue,
  onStatusChange,
}: IssueDetailModalProps) => {
  const { data: detail } = useResolvedApiQuery(
    useGetRiderIssueDetail,
    null as unknown as RiderIssueDetailResponse,
    issue?.apiId ?? ''
  );

  const activities = useMemo<ActivityEntry[]>(() => {
    if (!detail) return [];

    const initial: ActivityEntry = {
      id: 'initial',
      text: detail.description || issue?.description || '',
      by: detail.rider_name || issue?.riderName || 'Rider',
      time: detail.created_at
        ? dayjs(detail.created_at).format('MMM D [at] h:mm A')
        : '—',
      type: 'user',
    };

    const noteEntries: ActivityEntry[] = (detail.notes ?? []).map((note) => ({
      id: note.id,
      text: note.note_text,
      by: note.action || 'Support Agent',
      time: note.created_at
        ? dayjs(note.created_at).format('MMM D [at] h:mm A')
        : '—',
      type: 'agent',
    }));

    return [initial, ...noteEntries];
  }, [detail, issue]);

  if (!issue) return null;

  const typeConf = issueTypeConfig[issue.issueType];
  const sevConf = severityConfig[issue.severity];

  const nameParts = issue.riderName.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const btnSx = {
    width: 30,
    height: 30,
    borderRadius: '8px',
    background: '#F3F4F6',
    border: '0.67px solid #E5E7EB',
  };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="issue-detail-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: '560px',
          maxHeight: '90vh',
          borderRadius: '16px',
          boxShadow: '0px 24px 64px 0px rgba(0, 0, 0, 0.14)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack spacing={'10px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: '#111827',
              }}
            >
              {issue.id}
            </Typography>
            <Box
              sx={{
                padding: '2px 10px',
                borderRadius: '100px',
                background: typeConf.bg,
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(11),
                  color: typeConf.color,
                }}
              >
                {issue.issueType}
              </Typography>
            </Box>
            <Box
              sx={{
                padding: '2px 10px',
                borderRadius: '100px',
                background: sevConf.bg,
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(11),
                  color: sevConf.color,
                }}
              >
                {issue.severity}
              </Typography>
            </Box>
          </RowStack>

          <IconButton onClick={onClose} sx={btnSx}>
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* Scrollable content */}
        <Stack
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          {/* Rider Info */}
          <RowStack
            spacing={'12px'}
            sx={{
              padding: '16px 24px',
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            <Avatar
              alt={issue.riderName}
              sx={{
                width: 38,
                height: 38,
                fontSize: pxToRem(12),
                fontWeight: 600,
                background: '#E5E7EB',
                color: '#9CA3AF',
              }}
            >
              {initials}
            </Avatar>
            <Stack>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(14),
                  color: '#111827',
                }}
              >
                {issue.riderName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                }}
              >
                {issue.date}
              </Typography>
            </Stack>
          </RowStack>

          {/* Description */}
          <Stack
            sx={{
              padding: '16px 24px',
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#374151',
                lineHeight: '1.7em',
              }}
            >
              {detail?.description || issue.description}
            </Typography>
          </Stack>

          {/* Activity Log */}
          <Stack spacing={'0px'} sx={{ padding: '16px 24px 24px' }}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(12),
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                mb: '12px',
              }}
            >
              Activity Log
            </Typography>

            {activities.length <= 1 ? (
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: '#9CA3AF',
                  padding: '12px 0',
                }}
              >
                No activity yet.
              </Typography>
            ) : (
              <Stack spacing={'12px'}>
                {activities.slice(1).map((entry) => {
                  const entryConf = activityTypeConfig[entry.type];
                  return (
                    <RowStack
                      key={entry.id}
                      spacing={'10px'}
                      sx={{
                        alignItems: 'flex-start',
                        padding: '10px 12px',
                        background: '#F7F9FB',
                        border: '0.67px solid #F0F4F8',
                        borderRadius: '10px',
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '12px',
                          background: entryConf.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          mt: '1px',
                        }}
                      >
                        {entry.type === 'system' && (
                          <SettingsOutlinedIcon
                            sx={{ fontSize: 12, color: entryConf.color }}
                          />
                        )}
                        {entry.type === 'agent' && (
                          <SupportAgentOutlinedIcon
                            sx={{ fontSize: 12, color: entryConf.color }}
                          />
                        )}
                        {entry.type === 'user' && (
                          <PersonOutlinedIcon
                            sx={{ fontSize: 12, color: entryConf.color }}
                          />
                        )}
                      </Box>
                      <Stack sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: (theme) =>
                              theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(12.5),
                            color: '#374151',
                            lineHeight: '1.5em',
                          }}
                        >
                          {entry.text}
                        </Typography>
                        <RowStack spacing={'6px'} sx={{ mt: '2px' }}>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 500,
                              fontSize: pxToRem(11),
                              color: '#9CA3AF',
                            }}
                          >
                            {entry.time}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(11),
                              color: '#C4CAD4',
                            }}
                          >
                            ·
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 500,
                              fontSize: pxToRem(11),
                              color: '#9CA3AF',
                            }}
                          >
                            {entry.by}
                          </Typography>
                        </RowStack>
                      </Stack>
                    </RowStack>
                  );
                })}
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* Footer — status-dependent action */}
        <RowStack
          sx={{
            padding: '16px 24px',
            borderTop: '0.67px solid #F0F4F8',
          }}
        >
          {issue.status === 'Open' && (
            <Box
              onClick={() => onStatusChange?.(issue, 'Under Review')}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '41px',
                background: '#EEF2FF',
                border: '0.67px solid #C7D2FE',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
                '&:hover': { opacity: 0.85 },
              }}
            >
              <FindInPageOutlinedIcon sx={{ fontSize: 14, color: '#6366F1' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#6366F1',
                }}
              >
                Move to Under Review
              </Typography>
            </Box>
          )}

          {issue.status === 'Under Review' && (
            <Box
              onClick={() => onStatusChange?.(issue, 'Resolved')}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '41px',
                background: '#ECFDF5',
                border: '0.67px solid #BBF7D0',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
                '&:hover': { opacity: 0.85 },
              }}
            >
              <CheckCircleOutlinedIcon
                sx={{ fontSize: 14, color: '#059669' }}
              />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#059669',
                }}
              >
                Mark as Resolved
              </Typography>
            </Box>
          )}

          {issue.status === 'Resolved' && (
            <Box
              onClick={() => onStatusChange?.(issue, 'Open')}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '41px',
                background: '#FFFBEB',
                border: '0.67px solid #FDE68A',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
                '&:hover': { opacity: 0.85 },
              }}
            >
              <ReplayOutlinedIcon sx={{ fontSize: 14, color: '#D97706' }} />
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#D97706',
                }}
              >
                Reopen Ticket
              </Typography>
            </Box>
          )}
        </RowStack>
      </Stack>
    </AppModal>
  );
};
