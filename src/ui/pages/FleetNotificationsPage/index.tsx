'use client';

import { useState } from 'react';
import {
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import { NotificationInfoUI } from '../NotificationsPage/ui/component';
import { SendFleetNotificationModal } from './ui/component';

// ─── Types ──────────────────────────────────────────────────────────────────

type FleetNotificationCategory =
  | 'Report'
  | 'Action Required'
  | 'Policy Update'
  | 'Incentive';

type FleetNotificationRow = {
  id: string;
  title: string;
  category: FleetNotificationCategory;
  description: string;
  recipients: string;
  sentTo: number;
  timestamp: string;
  status: 'Delivered';
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const categoryColors: Record<
  FleetNotificationCategory,
  { color: string; iconBg: string }
> = {
  Report: { color: '#059669', iconBg: '#ECFDF5' },
  'Action Required': { color: '#EF4444', iconBg: '#FEF2F2' },
  'Policy Update': { color: '#6366F1', iconBg: '#EEF2FF' },
  Incentive: { color: '#D97706', iconBg: '#FFFBEB' },
};

const categoryIcons: Record<FleetNotificationCategory, React.ReactNode> = {
  Report: (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#059669' }} />
  ),
  'Action Required': (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#EF4444' }} />
  ),
  'Policy Update': (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#6366F1' }} />
  ),
  Incentive: (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#D97706' }} />
  ),
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const notificationsData: FleetNotificationRow[] = [
  {
    id: '1',
    title: 'Monthly Revenue Report – February 2026',
    category: 'Report',
    description:
      'February 2026 fleet revenue reports are now available in your Fleet Portal. Total trips: 1,288. Total revenue: $94,320. Download your statement.',
    recipients: 'All Fleet Partners',
    sentTo: 12,
    timestamp: 'Mar 5, 2026 · 08:00 AM',
    status: 'Delivered',
  },
  {
    id: '2',
    title: 'Fleet Contract Renewal – April 2026',
    category: 'Action Required',
    description:
      'Your fleet contract with Medigo is due for renewal in April 2026. Please review the updated terms and sign the renewal agreement by March 31.',
    recipients: 'Expiring Contracts (Q2)',
    sentTo: 4,
    timestamp: 'Mar 2, 2026 · 10:00 AM',
    status: 'Delivered',
  },
  {
    id: '3',
    title: 'New Driver Onboarding Requirements',
    category: 'Policy Update',
    description:
      'Effective March 1, all new drivers added to fleet accounts must complete the updated Medigo Driver Safety Module before activation.',
    recipients: 'All Fleet Partners',
    sentTo: 12,
    timestamp: 'Feb 25, 2026 · 09:00 AM',
    status: 'Delivered',
  },
  {
    id: '4',
    title: 'Monthly Revenue Report – January 2026',
    category: 'Report',
    description:
      'January 2026 revenue reports are available in your Fleet Portal. Total trips: 1,104. Total revenue: $88,400. Download your statement.',
    recipients: 'All Fleet Partners',
    sentTo: 12,
    timestamp: 'Feb 5, 2026 · 08:00 AM',
    status: 'Delivered',
  },
  {
    id: '5',
    title: 'WAV Fleet Expansion Incentive',
    category: 'Incentive',
    description:
      'Fleet partners adding WAV-certified vehicles by March 31 are eligible for a $500 onboarding bonus per vehicle. Contact your fleet manager for details.',
    recipients: 'All Fleet Partners',
    sentTo: 12,
    timestamp: 'Jan 20, 2026 · 11:00 AM',
    status: 'Delivered',
  },
  {
    id: '6',
    title: 'Fleet Performance Review – Q4 2025',
    category: 'Report',
    description:
      'Q4 2025 fleet performance summaries are available. Review your on-time rate, trip completion rate, and driver ratings in the Fleet Portal.',
    recipients: 'All Fleet Partners',
    sentTo: 12,
    timestamp: 'Jan 10, 2026 · 09:30 AM',
    status: 'Delivered',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetNotificationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statCards = [
    {
      value: '24',
      label: 'Total Sent',
      icon: (
        <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#EA580C' }} />
      ),
      iconBg: '#FFF7ED',
    },
    {
      value: '8',
      label: 'Revenue Reports',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
      iconBg: '#EEF2FF',
    },
    {
      value: '6',
      label: 'Policy Updates',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
    },
    {
      value: '24',
      label: 'Delivered',
      icon: (
        <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />
      ),
      iconBg: '#ECFDF5',
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Fleet Notifications"
            desc="Revenue reports, policy updates, contract notices, and incentives sent to fleet partners"
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
            Send to Fleet
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
              Fleet Notification History
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
              Messages sent to fleet partner accounts
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

      <SendFleetNotificationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) => {
          console.log('Send fleet notification:', values);
          setIsModalOpen(false);
        }}
      />
    </AppDashboardLayout>
  );
};
