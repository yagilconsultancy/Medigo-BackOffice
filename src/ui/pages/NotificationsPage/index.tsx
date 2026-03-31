'use client';

import { useState } from 'react';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import { NotificationInfoUI, SendNotificationModal } from './ui/component';

// ─── Types ──────────────────────────────────────────────────────────────────

type NotificationCategory =
  | 'Maintenance'
  | 'Policy Update'
  | 'Security Alert'
  | 'System Update'
  | 'System Alert';

type NotificationRow = {
  id: string;
  title: string;
  category: NotificationCategory;
  description: string;
  recipients: string;
  sentTo: number;
  timestamp: string;
  status: 'Delivered';
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const categoryColors: Record<
  NotificationCategory,
  { color: string; iconBg: string }
> = {
  Maintenance: { color: '#D97706', iconBg: '#FEF3C7' },
  'Policy Update': { color: '#6366F1', iconBg: '#EEF2FF' },
  'Security Alert': { color: '#EF4444', iconBg: '#FEE2E2' },
  'System Update': { color: '#059669', iconBg: '#D1FAE5' },
  'System Alert': { color: '#EA580C', iconBg: '#FFF7ED' },
};

const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
  Maintenance: (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#D97706' }} />
  ),
  'Policy Update': (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#6366F1' }} />
  ),
  'Security Alert': (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#EF4444' }} />
  ),
  'System Update': (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#059669' }} />
  ),
  'System Alert': (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#EA580C' }} />
  ),
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const notificationsData: NotificationRow[] = [
  {
    id: '1',
    title: 'Scheduled Maintenance – Mar 12, 2026',
    category: 'Maintenance',
    description:
      'The dashboard will be unavailable from 2:00 AM – 4:00 AM EST on March 12 for system upgrades. Please plan accordingly.',
    recipients: 'All Admins',
    sentTo: 8,
    timestamp: 'Mar 4, 2026 · 04:00 PM',
    status: 'Delivered',
  },
  {
    id: '2',
    title: 'New Admin Login Policy Effective Apr 1',
    category: 'Policy Update',
    description:
      'Starting April 1, all admin accounts will require 2FA enabled. Accounts without 2FA will be locked until compliant.',
    recipients: 'All Admins',
    sentTo: 8,
    timestamp: 'Mar 1, 2026 · 10:00 AM',
    status: 'Delivered',
  },
  {
    id: '3',
    title: 'Suspicious Login Attempt Detected',
    category: 'Security Alert',
    description:
      'A failed login was detected from an unrecognized IP (103.45.62.88, Lagos, NG). The attempt was blocked automatically.',
    recipients: 'Super Admin',
    sentTo: 2,
    timestamp: 'Feb 28, 2026 · 09:14 PM',
    status: 'Delivered',
  },
  {
    id: '4',
    title: 'Database Backup Completed Successfully',
    category: 'System Update',
    description:
      'The nightly database backup completed without errors. Backup size: 4.2 GB. Storage usage: 38%.',
    recipients: 'Super Admin',
    sentTo: 2,
    timestamp: 'Feb 28, 2026 · 03:00 AM',
    status: 'Delivered',
  },
  {
    id: '5',
    title: 'API Rate Limit Warning – Twilio SMS',
    category: 'System Alert',
    description:
      'Twilio SMS API usage reached 85% of the monthly limit. Consider upgrading the plan to avoid service interruptions.',
    recipients: 'Super Admin',
    sentTo: 2,
    timestamp: 'Feb 25, 2026 · 01:18 PM',
    status: 'Delivered',
  },
  {
    id: '6',
    title: 'Scheduled Maintenance – Feb 10, 2026',
    category: 'Maintenance',
    description:
      'System downtime scheduled from 1:00 AM – 3:00 AM EST on Feb 10 for infrastructure upgrades.',
    recipients: 'All Admins',
    sentTo: 8,
    timestamp: 'Feb 7, 2026 · 05:00 PM',
    status: 'Delivered',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const NotificationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statCards = [
    {
      value: '42',
      label: 'Total Sent',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
      iconBg: '#FEF3C7',
    },
    {
      value: '8',
      label: 'Maintenance',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
      iconBg: '#FEF3C7',
    },
    {
      value: '3',
      label: 'Policy Updates',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
      iconBg: '#EEF2FF',
    },
    {
      value: '2',
      label: 'System Alerts',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#EA580C' }} />,
      iconBg: '#FFF7ED',
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="System Notifications"
            desc="Platform-wide alerts, maintenance notices, and security updates sent to admin accounts"
          />
          <AppButton
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setIsModalOpen(true)}
            sx={{
              background: '#2F6FED',
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
                background: '#2558C9',
                boxShadow: 'none',
              },
            }}
          >
            Send Notification
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

        {/* Notifications List */}
        <Stack
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
            padding: '16px 24px',
          }}
          spacing={3}
          divider={<Divider />}
        >
          <Stack spacing={0.5}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(16),
                color: '#111827',
                lineHeight: '24px',
              }}
            >
              System Notification History
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: 'text.secondary',
                lineHeight: '19px',
              }}
            >
              All notifications sent to admin accounts
            </Typography>
          </Stack>

          {/* Notification Rows */}
          <Stack spacing={2}>
            {notificationsData.map((notification) => {
              const catColors = categoryColors[notification.category];

              return (
                <NotificationInfoUI
                  key={notification.id}
                  icon={categoryIcons[notification.category]}
                  infoBg={catColors.iconBg}
                  cardTitle={notification.title}
                  cardChipLabel={notification.category}
                  chipColor={catColors.color}
                  cardDesc={notification.description}
                  admin={notification.recipients}
                  num={notification.sentTo}
                  date={notification.timestamp}
                />
              );
            })}
          </Stack>
        </Stack>
      </Stack>

      <SendNotificationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) => {
          console.log('Send notification:', values);
          setIsModalOpen(false);
        }}
      />
    </AppDashboardLayout>
  );
};
