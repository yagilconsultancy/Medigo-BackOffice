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
import { SendDriverNotificationModal } from './ui/component';

// ─── Types ──────────────────────────────────────────────────────────────────

type DriverNotificationCategory =
  | 'Payout'
  | 'Surge Alert'
  | 'Compliance'
  | 'Bonus'
  | 'App Update';

type DriverNotificationRow = {
  id: string;
  title: string;
  category: DriverNotificationCategory;
  description: string;
  recipients: string;
  sentTo: number;
  timestamp: string;
  status: 'Delivered';
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const categoryColors: Record<
  DriverNotificationCategory,
  { color: string; iconBg: string }
> = {
  Payout: { color: '#059669', iconBg: '#ECFDF5' },
  'Surge Alert': { color: '#EF4444', iconBg: '#FEF2F2' },
  Compliance: { color: '#6366F1', iconBg: '#EEF2FF' },
  Bonus: { color: '#D97706', iconBg: '#FFFBEB' },
  'App Update': { color: '#2F6FED', iconBg: '#EBF2FF' },
};

const categoryIcons: Record<DriverNotificationCategory, React.ReactNode> = {
  Payout: (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#059669' }} />
  ),
  'Surge Alert': (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#EF4444' }} />
  ),
  Compliance: (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#6366F1' }} />
  ),
  Bonus: (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#D97706' }} />
  ),
  'App Update': (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#2F6FED' }} />
  ),
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const notificationsData: DriverNotificationRow[] = [
  {
    id: '1',
    title: 'Weekly Payout Schedule Update',
    category: 'Payout',
    description:
      'Driver payouts will now be processed every Monday morning. Please ensure your banking details are up to date in your driver profile.',
    recipients: 'All Drivers',
    sentTo: 148,
    timestamp: 'Mar 10, 2026 · 09:00 AM',
    status: 'Delivered',
  },
  {
    id: '2',
    title: 'Surge Zone Alert – Downtown Toronto',
    category: 'Surge Alert',
    description:
      'High demand detected in downtown Toronto from 5:00 PM – 9:00 PM. Head to the area now for increased trip rates and bonuses.',
    recipients: 'Active Drivers',
    sentTo: 62,
    timestamp: 'Mar 7, 2026 · 04:45 PM',
    status: 'Delivered',
  },
  {
    id: '3',
    title: 'Vehicle Inspection Reminder – Q1 2026',
    category: 'Compliance',
    description:
      'Mandatory bi-annual vehicle inspections are due by March 31. Please submit your inspection report through the driver app under Documents.',
    recipients: 'All Drivers',
    sentTo: 148,
    timestamp: 'Mar 3, 2026 · 10:00 AM',
    status: 'Delivered',
  },
  {
    id: '4',
    title: 'February Top Driver Bonus',
    category: 'Bonus',
    description:
      'Congratulations! You\'ve qualified for the February Top Driver Bonus. An additional $150 CAD has been added to your next payout.',
    recipients: 'Top 20 Drivers',
    sentTo: 20,
    timestamp: 'Mar 1, 2026 · 08:00 AM',
    status: 'Delivered',
  },
  {
    id: '5',
    title: 'Surge Zone Alert – Ottawa South',
    category: 'Surge Alert',
    description:
      'High demand in Ottawa South between 6:00 PM – 10:00 PM today. Head to the area for boosted rates.',
    recipients: 'Active Drivers',
    sentTo: 18,
    timestamp: 'Feb 28, 2026 · 05:30 PM',
    status: 'Delivered',
  },
  {
    id: '6',
    title: 'Mandatory App Update Required (v3.8)',
    category: 'App Update',
    description:
      'A mandatory driver app update (v3.8) is available. Please update before Feb 27 to continue receiving trip assignments.',
    recipients: 'All Drivers',
    sentTo: 148,
    timestamp: 'Feb 20, 2026 · 11:00 AM',
    status: 'Delivered',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverNotificationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statCards = [
    {
      value: '862',
      label: 'Total Sent',
      icon: (
        <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
      ),
      iconBg: '#EBF2FF',
    },
    {
      value: '14',
      label: 'Surge Alerts',
      icon: (
        <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
      ),
      iconBg: '#FEF2F2',
    },
    {
      value: '12',
      label: 'Payout Notices',
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
            title="Driver Notifications"
            desc="Surge alerts, payout notices, policy updates, and reminders sent to driver accounts"
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
            Send to Drivers
          </AppButton>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 4 }}>
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
              Driver Notification History
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
              Messages sent to driver accounts and segments
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

      <SendDriverNotificationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) => {
          console.log('Send driver notification:', values);
          setIsModalOpen(false);
        }}
      />
    </AppDashboardLayout>
  );
};
