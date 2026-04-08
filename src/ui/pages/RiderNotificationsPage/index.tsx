'use client';

import { useState, useMemo } from 'react';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { CustomPagination } from '../../modules/components/GridTable/ui/components/DataGridPagination/ui/components/CustomPagination';
import { EmptyState } from '../../modules/blocks';
import {
  pxToRem,
  useGetRiderBroadcastKpis,
  useListRiderBroadcasts,
  useResolvedApiQuery,
} from '../../../common';
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

// ─── Component ──────────────────────────────────────────────────────────────

export const RiderNotificationsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data: kpisData } = useResolvedApiQuery(
    useGetRiderBroadcastKpis,
    null
  );
  const { data: broadcastsData } = useResolvedApiQuery(
    useListRiderBroadcasts,
    null,
    { page: paginationModel.page + 1, page_size: paginationModel.pageSize }
  );

  const statCards = useMemo(
    () => [
      {
        value: (kpisData?.total_sent ?? 0).toString(),
        label: 'Total Sent',
        icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
        iconBg: '#EBF2FF',
      },
      {
        value: (kpisData?.category_1_count ?? 0).toString(),
        label: kpisData?.category_1_label ?? 'Announcements',
        icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
        iconBg: '#EEF2FF',
      },
      {
        value: (kpisData?.category_2_count ?? 0).toString(),
        label: kpisData?.category_2_label ?? 'Promotions',
        icon: <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
        iconBg: '#FFFBEB',
      },
    ],
    [kpisData]
  );

  const notificationsData = useMemo<RiderNotificationRow[]>(() => {
    return (broadcastsData?.items || []).map((broadcast) => ({
      id: broadcast.id,
      title: broadcast.title,
      category: broadcast.notification_type as RiderNotificationCategory,
      description: broadcast.message,
      recipients: broadcast.audience_segment,
      sentTo: broadcast.sent_to_count,
      timestamp: new Date(broadcast.sent_at)
        .toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .replace(',', ' ·'),
      status: 'Delivered' as const,
    }));
  }, [broadcastsData]);

  const totalCount = broadcastsData?.total || 0;

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
          {notificationsData.length === 0 ? (
            <Stack
              sx={{
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EmptyState emptyState="No Rider Notifications" />
            </Stack>
          ) : (
            <Stack spacing={2}>
              {notificationsData.map((notification) => {
                const catColors = categoryColors[notification.category] || {
                  color: '#2F6FED',
                  iconBg: '#EBF2FF',
                };
                const icon = categoryIcons[notification.category] || (
                  <SettingsOutlinedIcon
                    sx={{ width: 18, height: 18, color: '#2F6FED' }}
                  />
                );

                return (
                  <NotificationInfoUI
                    key={notification.id}
                    icon={icon}
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
          )}

          <CustomPagination
            count={totalCount}
            page={paginationModel.page}
            pageSize={paginationModel.pageSize}
            onPageChange={(newPage) =>
              setPaginationModel((prev) => ({ ...prev, page: newPage }))
            }
            onPageSizeChange={(newPageSize) =>
              setPaginationModel((prev) => ({ ...prev, pageSize: newPageSize }))
            }
          />
        </Stack>
      </Stack>

      <SendRiderNotificationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </AppDashboardLayout>
  );
};
