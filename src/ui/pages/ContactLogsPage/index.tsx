'use client';

import { alpha, Box, Chip, Stack, Grid, Typography } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { pxToRem } from '../../../common';
import { ContactStatCard } from './ui/components';

// ─── Types ──────────────────────────────────────────────────────────────────

type Channel = 'Phone Call' | 'Live Chat' | 'Email';
type Role = 'Rider' | 'Driver' | 'Fleet Partner';

type ContactLogRow = {
  id: string;
  name: string;
  role: Role;
  channel: Channel;
  subject: string;
  agent: string;
  duration?: string;
  outcome: string;
  dateTime: string;
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const channelConfig: Record<Channel, { color: string; icon: React.ReactNode }> =
  {
    'Phone Call': {
      color: '#2F6FED',
      icon: <PhoneOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    },
    'Live Chat': {
      color: '#7C3AED',
      icon: (
        <ChatBubbleOutlineOutlinedIcon
          sx={{ fontSize: 18, color: '#7C3AED' }}
        />
      ),
    },
    Email: {
      color: '#EA580C',
      icon: <EmailOutlinedIcon sx={{ fontSize: 18, color: '#EA580C' }} />,
    },
  };

const roleColors: Record<Role, { bg: string; color: string }> = {
  Rider: { bg: '#EBF2FF', color: '#2F6FED' },
  Driver: { bg: '#F0FDF4', color: '#059669' },
  'Fleet Partner': { bg: '#EEF2FF', color: '#6366F1' },
};

// ─── Stat Cards ─────────────────────────────────────────────────────────────

const statCards = [
  { value: '2', label: 'Phone Calls', valueColor: '#2F6FED' },
  { value: '2', label: 'Live Chats', valueColor: '#7C3AED' },
  { value: '2', label: 'Emails Sent', valueColor: '#EA580C' },
];

// ─── Data ───────────────────────────────────────────────────────────────────

const contactLogs: ContactLogRow[] = [
  {
    id: '1',
    name: 'Claire Beaumont',
    role: 'Rider',
    channel: 'Phone Call',
    subject: 'Driver no-show complaint',
    agent: 'Sandra Lee',
    duration: '4 min 22 sec',
    outcome: 'Ticket created: TKT-8801',
    dateTime: 'Mar 9, 2026 · 10:12 AM',
  },
  {
    id: '2',
    name: 'Liam MacDonald',
    role: 'Driver',
    channel: 'Live Chat',
    subject: 'Payment dispute on trip BK-20480',
    agent: 'Marcus Bell',
    duration: '8 min',
    outcome: 'Escalated to Finance Admin',
    dateTime: 'Mar 9, 2026 · 09:44 AM',
  },
  {
    id: '3',
    name: 'MedRide Express',
    role: 'Fleet Partner',
    channel: 'Email',
    subject: 'February revenue statement attached',
    agent: 'System',
    outcome: 'Delivered successfully',
    dateTime: 'Mar 9, 2026 · 09:00 AM',
  },
  {
    id: '4',
    name: 'Joseph Nguyen',
    role: 'Rider',
    channel: 'Phone Call',
    subject: 'Request to reschedule trip BK-20493',
    agent: 'Angela Brooks',
    duration: '2 min 54 sec',
    outcome: 'Booking rescheduled for Mar 11',
    dateTime: 'Mar 8, 2026 · 03:30 PM',
  },
  {
    id: '5',
    name: "Ryan O'Brien",
    role: 'Driver',
    channel: 'Live Chat',
    subject: 'Suspension appeal',
    agent: 'Sandra Lee',
    duration: '6 min',
    outcome: 'Case escalated to Operations Admin',
    dateTime: 'Mar 8, 2026 · 01:15 PM',
  },
  {
    id: '6',
    name: 'Dorothy MacLeod',
    role: 'Rider',
    channel: 'Email',
    subject: 'Monthly ride summary',
    agent: 'System',
    outcome: 'Opened by recipient',
    dateTime: 'Mar 7, 2026 · 08:00 AM',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const ContactLogsPage = () => {
  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Contact Logs"
          desc="Communication history with riders, drivers, and fleet partners"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 4 }}>
              <ContactStatCard
                value={card.value}
                label={card.label}
                valueColor={card.valueColor}
              />
            </Grid>
          ))}
        </Grid>

        {/* Recent Communications */}
        <Stack spacing={'10px'}>
          {contactLogs.map((log) => {
            const ch = channelConfig[log.channel];
            const rColor = roleColors[log.role];

            return (
              <RowStack
                key={log.id}
                justifyContent={'space-between'}
                sx={{
                  padding: '12px',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                }}
              >
                {/* Left: Icon + Info */}
                <RowStack spacing={'12px'}>
                  {/* Channel Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: alpha(ch.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {ch.icon}
                  </Box>

                  {/* Info */}
                  <Stack spacing={'4px'}>
                    {/* Row 1: Name + Role Chip + Channel Chip */}
                    <RowStack spacing={'8px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        {log.name}
                      </Typography>

                      {/* Role Chip */}
                      <Chip
                        label={log.role}
                        size="small"
                        sx={{
                          background: rColor.bg,
                          color: rColor.color,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          height: '22px',
                          borderRadius: '100px',
                        }}
                      />

                      {/* Channel Chip */}
                      <Chip
                        label={log.channel}
                        size="small"
                        sx={{
                          background: alpha(ch.color, 0.1),
                          color: ch.color,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          height: '22px',
                          borderRadius: '100px',
                        }}
                      />
                    </RowStack>

                    {/* Row 2: Subject */}
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(13),
                        color: '#374151',
                      }}
                    >
                      {log.subject}
                    </Typography>

                    {/* Row 3: Agent + Duration + Outcome */}
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12),
                        color: '#9CA3AF',
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 500,
                          fontSize: pxToRem(12),
                          color: '#6B7280',
                        }}
                      >
                        Agent:
                      </Typography>{' '}
                      {log.agent}
                      {log.duration && (
                        <>
                          {'  ·  '}
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 500,
                              fontSize: pxToRem(12),
                              color: '#6B7280',
                            }}
                          >
                            Duration:
                          </Typography>{' '}
                          {log.duration}
                        </>
                      )}
                      {'  ·  '}
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 500,
                          fontSize: pxToRem(12),
                          color: '#6B7280',
                        }}
                      >
                        Outcome:
                      </Typography>{' '}
                      {log.outcome}
                    </Typography>
                  </Stack>
                </RowStack>

                {/* Right: Date */}
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#9CA3AF',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {log.dateTime}
                </Typography>
              </RowStack>
            );
          })}
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
