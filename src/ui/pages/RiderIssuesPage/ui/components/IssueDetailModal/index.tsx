'use client';

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
import { pxToRem } from '../../../../../../common';
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

// ─── Activity Log Data ──────────────────────────────────────────────────────

const activityLogs: Record<string, ActivityEntry[]> = {
  'IS-001': [
    {
      id: '1',
      text: "Rider reports that her scheduled driver didn't arrive for booking BK-20491 on Mar 9 at 9:00 AM. She missed her 10:00am appointment to oncology department. Responded to St. Martin General Hospital, this is impacting her trust and confidence that the driver has been unreliable.",
      by: 'Helen Moore',
      time: 'Mar 9 at 9:45 AM',
      type: 'user',
    },
    {
      id: '2',
      text: 'Ticket auto-assigned to support queue. Driver assigned: Marcos Johnson.',
      by: 'system',
      time: 'Mar 9 at 9:46 AM',
      type: 'system',
    },
    {
      id: '3',
      text: 'Support assigned to unique liaison Johnson Sr. for review.',
      by: 'system',
      time: 'Mar 9 at 10:15 AM',
      type: 'system',
    },
    {
      id: '4',
      text: 'Ticket escalated to Operations Mgr position by system.',
      by: 'system',
      time: 'Mar 9 at 10:45 AM',
      type: 'system',
    },
  ],
  'IS-002': [
    {
      id: '1',
      text: 'Rider exhibited abusive behaviour toward driver during trip. Driver filed complaint with dash-cam evidence.',
      by: 'Driver Report',
      time: 'Mar 8 at 2:30 PM',
      type: 'agent',
    },
    {
      id: '2',
      text: 'Ticket created and assigned for review.',
      by: 'system',
      time: 'Mar 8 at 2:31 PM',
      type: 'system',
    },
    {
      id: '3',
      text: 'Case escalated to safety team for investigation.',
      by: 'system',
      time: 'Mar 8 at 3:00 PM',
      type: 'system',
    },
  ],
  'IS-003': [
    {
      id: '1',
      text: 'Rider cancelled trip but refund has not been processed. Requesting immediate refund of $38.00.',
      by: 'Nancy White',
      time: 'Mar 7 at 11:20 AM',
      type: 'user',
    },
    {
      id: '2',
      text: 'Refund request logged. Awaiting finance team review.',
      by: 'system',
      time: 'Mar 7 at 11:21 AM',
      type: 'system',
    },
  ],
  'IS-004': [
    {
      id: '1',
      text: '3 consecutive no-shows detected for rider. Automatic flag triggered.',
      by: 'system',
      time: 'Mar 6 at 8:00 AM',
      type: 'system',
    },
    {
      id: '2',
      text: 'Rider contacted via email to confirm future bookings.',
      by: 'Support Agent',
      time: 'Mar 6 at 9:15 AM',
      type: 'agent',
    },
  ],
  'IS-005': [
    {
      id: '1',
      text: 'Rider reports duplicate charge on trip BK-20102. Amount: $45.00 charged twice.',
      by: 'Patricia Clark',
      time: 'Mar 4 at 3:40 PM',
      type: 'user',
    },
    {
      id: '2',
      text: 'Finance team confirmed duplicate charge. Refund initiated.',
      by: 'Support Agent',
      time: 'Mar 4 at 4:30 PM',
      type: 'agent',
    },
    {
      id: '3',
      text: 'Refund of $45.00 processed successfully. Ticket resolved.',
      by: 'system',
      time: 'Mar 5 at 10:00 AM',
      type: 'system',
    },
    {
      id: '4',
      text: 'Status changed to "Resolved" by system.',
      by: 'system',
      time: 'Mar 5 at 10:01 AM',
      type: 'system',
    },
  ],
  'IS-006': [
    {
      id: '1',
      text: 'Rider experienced 45-minute wait for scheduled pickup. Expected wait was 10 minutes.',
      by: 'Lisa Anderson',
      time: 'Mar 3 at 7:15 AM',
      type: 'user',
    },
    {
      id: '2',
      text: 'Driver reassigned. Apology credit of $10.00 issued to rider account.',
      by: 'Support Agent',
      time: 'Mar 3 at 9:00 AM',
      type: 'agent',
    },
    {
      id: '3',
      text: 'Rider confirmed satisfaction. Ticket resolved.',
      by: 'Lisa Anderson',
      time: 'Mar 3 at 11:30 AM',
      type: 'user',
    },
  ],
};

// ─── Component ──────────────────────────────────────────────────────────────

export const IssueDetailModal = ({
  open,
  onClose,
  issue,
  onStatusChange,
}: IssueDetailModalProps) => {
  if (!issue) return null;

  const typeConf = issueTypeConfig[issue.issueType];
  const sevConf = severityConfig[issue.severity];
  const activities = activityLogs[issue.id] || [];

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
              {activities.length > 0 ? activities[0].text : issue.description}
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
                          fontFamily: (theme) => theme.typography.fontFamily,
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
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 500,
                            fontSize: pxToRem(11),
                            color: '#9CA3AF',
                          }}
                        >
                          {entry.time}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(11),
                            color: '#C4CAD4',
                          }}
                        >
                          ·
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
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
