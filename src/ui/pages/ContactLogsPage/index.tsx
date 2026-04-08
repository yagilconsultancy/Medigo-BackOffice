'use client';

import { useMemo, useState } from 'react';
import { alpha, Box, Chip, Stack, Grid, Typography } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import {
  pxToRem,
  useGetContactKpis,
  useListContactLogs,
  useResolvedApiQuery,
} from '../../../common';
import { EmptyState } from '../../modules/blocks';
import { CustomPagination } from '../../modules/components/GridTable/ui/components/DataGridPagination/ui/components/CustomPagination';
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

// ─── Component ──────────────────────────────────────────────────────────────

export const ContactLogsPage = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data: kpisData } = useResolvedApiQuery(useGetContactKpis, null);
  const { data: logsData } = useResolvedApiQuery(useListContactLogs, null, {
    page: paginationModel.page + 1,
    page_size: paginationModel.pageSize,
  });

  const statCards = useMemo(
    () => [
      {
        value: (kpisData?.phone_calls ?? 0).toString(),
        label: 'Phone Calls',
        valueColor: '#2F6FED',
      },
      {
        value: (kpisData?.live_chats ?? 0).toString(),
        label: 'Live Chats',
        valueColor: '#7C3AED',
      },
      {
        value: (kpisData?.emails_sent ?? 0).toString(),
        label: 'Emails Sent',
        valueColor: '#EA580C',
      },
    ],
    [kpisData]
  );

  const contactLogs = useMemo<ContactLogRow[]>(() => {
    return (logsData?.items || []).map((log) => {
      const durationStr = log.duration_seconds
        ? `${Math.floor(log.duration_seconds / 60)} min ${log.duration_seconds % 60} sec`
        : undefined;

      return {
        id: log.id,
        name: log.user_name,
        role: log.user_role as Role,
        channel: log.channel as Channel,
        subject: log.description,
        agent: log.agent_name,
        duration: durationStr,
        outcome: log.outcome,
        dateTime: new Date(log.created_at)
          .toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
          .replace(',', ' ·'),
      };
    });
  }, [logsData]);

  const totalCount = logsData?.total || 0;
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
        <Stack
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
            padding: '16px 24px',
          }}
          spacing={'10px'}
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
              Recent Communications
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
              Contact history with riders, drivers, and fleet partners
            </Typography>
          </Stack>

          {contactLogs.length === 0 ? (
            <Stack
              sx={{
                // height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EmptyState emptyState="No Contact Logs" />
            </Stack>
          ) : (
            <Stack spacing={'10px'}>
              {contactLogs.map((log) => {
                const ch = channelConfig[log.channel] || {
                  color: '#2F6FED',
                  icon: (
                    <PhoneOutlinedIcon
                      sx={{ fontSize: 18, color: '#2F6FED' }}
                    />
                  ),
                };
                const rColor = roleColors[log.role] || {
                  bg: '#F3F4F6',
                  color: '#6B7280',
                };

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
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
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
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
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
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
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
    </AppDashboardLayout>
  );
};
