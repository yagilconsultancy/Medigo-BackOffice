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
import { NotificationInfoUI } from '../NotificationsPage/ui/component';
import { SendRiderNotificationModal } from './ui/component';

// ─── Types ──────────────────────────────────────────────────────────────────

type RiderNotificationCategory = 'Announcement' | 'Promotion';

type RiderNotificationRow = {
  id: string;
  title: string;
  category: RiderNotificationCategory;
  description: string;
  recipients: string;
  sentTo: number;
  timestamp: string;
  status: 'Delivered';
};

// ─── Color Maps ─────────────────────────────────────────────────────────────

const categoryColors: Record<
  RiderNotificationCategory,
  { color: string; iconBg: string }
> = {
  Announcement: { color: '#2F6FED', iconBg: '#EBF2FF' },
  Promotion: { color: '#D97706', iconBg: '#FFFBEB' },
};

const categoryIcons: Record<RiderNotificationCategory, React.ReactNode> = {
  Announcement: (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#2F6FED' }} />
  ),
  Promotion: (
    <SettingsOutlinedIcon sx={{ width: 18, height: 18, color: '#D97706' }} />
  ),
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const notificationsData: RiderNotificationRow[] = [
  {
    id: '1',
    title: 'Service Update – March Schedule',
    category: 'Announcement',
    description:
      'We have updated our service hours effective March 10. Visit the app for full details and booking times.',
    recipients: 'All Riders',
    sentTo: 1248,
    timestamp: 'Mar 8, 2026 · 10:00 AM',
    status: 'Delivered',
  },
  {
    id: '2',
    title: 'We Miss You! Book & Save 10%',
    category: 'Promotion',
    description:
      "It's been a while since your last ride. Book now and get 10% off your next trip with code WELCOME10.",
    recipients: 'Inactive Riders (30+ days)',
    sentTo: 94,
    timestamp: 'Mar 3, 2026 · 12:00 PM',
    status: 'Delivered',
  },
  {
    id: '3',
    title: 'New Wheelchair-Accessible Vehicles',
    category: 'Announcement',
    description:
      "We've added 12 new WAV-equipped vehicles to our fleet. Book a wheelchair-accessible ride directly from the app.",
    recipients: 'All Riders',
    sentTo: 1248,
    timestamp: 'Feb 28, 2026 · 09:00 AM',
    status: 'Delivered',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const RiderNotificationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statCards = [
    {
      value: '1,342',
      label: 'Total Sent',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
    },
    {
      value: '18',
      label: 'Announcements',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
      iconBg: '#EEF2FF',
    },
    {
      value: '9',
      label: 'Promotions',
      icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
      iconBg: '#FFFBEB',
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Rider Notifications"
            desc="Announcements, promotions, updates, and reminders sent to rider accounts"
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
            Send to Riders
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
              Rider Notification History
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
              Messages sent to rider accounts and segments
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

      <SendRiderNotificationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) => {
          console.log('Send rider notification:', values);
          setIsModalOpen(false);
        }}
      />
    </AppDashboardLayout>
  );
};
