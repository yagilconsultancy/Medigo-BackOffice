'use client';

import { useState } from 'react';
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  ReviewSuspensionsModal,
  ReviewApplicationsModal,
} from './ui/components';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type ActiveDriver = {
  id: string;
  name: string;
  avatar: string;
  fleet: string;
  statusTime: string;
  trips: number;
};

type SuspendedDriver = {
  id: string;
  name: string;
  avatar: string;
  initials?: string;
  fleet: string;
  suspendedDate: string;
  trips: number;
};

type PendingDriver = {
  id: string;
  name: string;
  initials: string;
  fleet: string;
  submittedDate: string;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const activeDrivers: ActiveDriver[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    avatar: '',
    fleet: 'MediGo',
    statusTime: 'On duty since 6:30 AM',
    trips: 312,
  },
  {
    id: '2',
    name: 'Sarah Williams',
    avatar: '',
    fleet: 'MedRide Express',
    statusTime: 'Available since 7:00 AM',
    trips: 287,
  },
  {
    id: '3',
    name: 'David Chen',
    avatar: '',
    fleet: 'MediGo',
    statusTime: 'Available since 7:15 AM',
    trips: 264,
  },
  {
    id: '4',
    name: 'James Thompson',
    avatar: '',
    fleet: 'HealthHaul LLC',
    statusTime: 'On duty since 6:45 AM',
    trips: 218,
  },
  {
    id: '5',
    name: 'Anna Kim',
    avatar: '',
    fleet: 'MediGo',
    statusTime: 'Available since 8:00 AM',
    trips: 195,
  },
  {
    id: '6',
    name: 'Grace Miller',
    avatar: '',
    fleet: 'MobiCare Transport',
    statusTime: 'Available since 8:30 AM',
    trips: 156,
  },
];

const suspendedDrivers: SuspendedDriver[] = [
  {
    id: '1',
    name: 'Tom Roberts',
    avatar: '',
    fleet: 'SafeRide Medical',
    suspendedDate: 'Suspended Mar 5, 2026',
    trips: 178,
  },
  {
    id: '2',
    name: 'Leon Torres',
    avatar: '',
    initials: 'LT',
    fleet: 'MediGo',
    suspendedDate: 'Suspended Feb 28, 2026',
    trips: 94,
  },
];

const pendingDrivers: PendingDriver[] = [
  {
    id: '1',
    name: 'Kevin Walsh',
    initials: 'KW',
    fleet: 'CareTransit Co.',
    submittedDate: 'Application submitted Mar 8, 2026',
  },
  {
    id: '2',
    name: 'Priya Patel',
    initials: 'PP',
    fleet: 'MediGo',
    submittedDate: 'Application submitted Mar 9, 2026',
  },
  {
    id: '3',
    name: 'Chris Johnson',
    initials: 'CJ',
    fleet: 'HealthHaul LLC',
    submittedDate: 'Application submitted Mar 7, 2026',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverStatusPage = () => {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [applicationsModalOpen, setApplicationsModalOpen] = useState(false);

  const statCards = [
    {
      value: activeDrivers.length.toString(),
      label: 'Active Drivers',
      valueColor: '#059669',
      icon: (
        <CheckCircleOutlineIcon sx={{ fontSize: 19, color: '#059669' }} />
      ),
      iconBg: '#ECFDF5',
      iconBorder: '#BBF7D0',
    },
    {
      value: suspendedDrivers.length.toString(),
      label: 'Suspended Drivers',
      valueColor: '#EF4444',
      icon: <BlockOutlinedIcon sx={{ fontSize: 19, color: '#EF4444' }} />,
      iconBg: '#FEF2F2',
      iconBorder: '#FECACA',
    },
    {
      value: pendingDrivers.length.toString(),
      label: 'Pending Approval',
      valueColor: '#D97706',
      icon: (
        <AccessTimeOutlinedIcon sx={{ fontSize: 19, color: '#D97706' }} />
      ),
      iconBg: '#FFFBEB',
      iconBorder: '#FDE68A',
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Driver Status"
          desc="Overview of all driver statuses — active, suspended, and pending approval"
        />

        {/* Stat Cards */}
        <Grid container spacing={'12px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Stack
                spacing={'12px'}
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '12px',
                    background: card.iconBg,
                    border: `0.67px solid ${card.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: pxToRem(32),
                    lineHeight: '1em',
                    color: card.valueColor,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    lineHeight: '1.5em',
                    color: '#6B7280',
                  }}
                >
                  {card.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Active Drivers Section */}
        <Box
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          <RowStack
            justifyContent={'space-between'}
            sx={{
              padding: '16px 24px',
              background: 'rgba(236, 253, 245, 0.5)',
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            <RowStack spacing={'10px'}>
              <CheckCircleOutlineIcon
                sx={{ fontSize: 16, color: '#059669' }}
              />
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                Active Drivers
              </Typography>
              <Box
                sx={{
                  padding: '2px 10px',
                  borderRadius: '100px',
                  background: '#ECFDF5',
                  border: '0.67px solid #BBF7D0',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: pxToRem(11.5),
                    color: '#059669',
                  }}
                >
                  {activeDrivers.length}
                </Typography>
              </Box>
            </RowStack>
          </RowStack>

          <Grid container spacing={'12px'} sx={{ padding: '16px 24px' }}>
            {activeDrivers.map((driver) => {
              const nameParts = driver.name.split(' ');
              const initials =
                nameParts.length > 1
                  ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
                  : nameParts[0].charAt(0);
              return (
                <Grid key={driver.id} size={{ xs: 12, md: 4 }}>
                  <RowStack
                    spacing={'12px'}
                    sx={{
                      background: '#F7F9FB',
                      border: '0.67px solid #F0F4F8',
                      borderRadius: '14px',
                      padding: '16px',
                    }}
                  >
                    <Avatar
                      src={driver.avatar || undefined}
                      alt={driver.name}
                      sx={{
                        width: 38,
                        height: 38,
                        fontSize: pxToRem(12),
                        fontWeight: 700,
                        background: '#EBF2FF',
                        color: '#2F6FED',
                        borderRadius: '19px',
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Stack spacing={0} sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                          lineHeight: '1.5em',
                        }}
                      >
                        {driver.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#9CA3AF',
                          lineHeight: '1.5em',
                        }}
                      >
                        {driver.fleet}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#6B7280',
                          lineHeight: '1.5em',
                          mt: '4px',
                        }}
                      >
                        {driver.statusTime}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#9CA3AF',
                          lineHeight: '1.5em',
                        }}
                      >
                        {driver.trips} trips completed
                      </Typography>
                    </Stack>
                  </RowStack>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Suspended Drivers Section */}
        <Box
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          <RowStack
            justifyContent={'space-between'}
            sx={{
              padding: '16px 24px',
              background: 'rgba(254, 242, 242, 0.5)',
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            <RowStack spacing={'10px'}>
              <BlockOutlinedIcon sx={{ fontSize: 16, color: '#EF4444' }} />
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                Suspended Drivers
              </Typography>
              <Box
                sx={{
                  padding: '2px 10px',
                  borderRadius: '100px',
                  background: '#FEF2F2',
                  border: '0.67px solid #FECACA',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: pxToRem(11.5),
                    color: '#EF4444',
                  }}
                >
                  {suspendedDrivers.length}
                </Typography>
              </Box>
            </RowStack>

            {suspendedDrivers.length > 0 && (
              <Box
                onClick={() => setReviewModalOpen(true)}
                sx={{
                  padding: '8px 16px',
                  borderRadius: '9px',
                  background: '#FEF2F2',
                  border: '0.67px solid #FECACA',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: pxToRem(12.5),
                    color: '#EF4444',
                    textAlign: 'center',
                  }}
                >
                  Review Suspensions
                </Typography>
              </Box>
            )}
          </RowStack>

          <Grid container spacing={'12px'} sx={{ padding: '16px 24px' }}>
            {suspendedDrivers.map((driver) => {
              const nameParts = driver.name.split(' ');
              const initials =
                driver.initials ||
                (nameParts.length > 1
                  ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
                  : nameParts[0].charAt(0));
              const hasAvatar = !!driver.avatar;
              return (
                <Grid key={driver.id} size={{ xs: 12, md: 4 }}>
                  <RowStack
                    spacing={'12px'}
                    sx={{
                      background: '#F7F9FB',
                      border: '0.67px solid #F0F4F8',
                      borderRadius: '14px',
                      padding: '16px',
                    }}
                  >
                    <Avatar
                      src={hasAvatar ? driver.avatar : undefined}
                      alt={driver.name}
                      sx={{
                        width: 38,
                        height: 38,
                        fontSize: pxToRem(12),
                        fontWeight: 700,
                        background: hasAvatar ? undefined : '#EF4444',
                        color: '#FFFFFF',
                        borderRadius: '19px',
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Stack spacing={0} sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                          lineHeight: '1.5em',
                        }}
                      >
                        {driver.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#9CA3AF',
                          lineHeight: '1.5em',
                        }}
                      >
                        {driver.fleet}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#6B7280',
                          lineHeight: '1.5em',
                          mt: '4px',
                        }}
                      >
                        {driver.suspendedDate}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#9CA3AF',
                          lineHeight: '1.5em',
                        }}
                      >
                        {driver.trips} trips completed
                      </Typography>
                    </Stack>
                  </RowStack>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Pending Approval Section */}
        <Box
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          <RowStack
            justifyContent={'space-between'}
            sx={{
              padding: '16px 24px',
              background: 'rgba(255, 251, 235, 0.5)',
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            <RowStack spacing={'10px'}>
              <AccessTimeOutlinedIcon
                sx={{ fontSize: 16, color: '#D97706' }}
              />
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                Pending Approval
              </Typography>
              <Box
                sx={{
                  padding: '2px 10px',
                  borderRadius: '100px',
                  background: '#FFFBEB',
                  border: '0.67px solid #FDE68A',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: pxToRem(11.5),
                    color: '#D97706',
                  }}
                >
                  {pendingDrivers.length}
                </Typography>
              </Box>
            </RowStack>

            <Box
              onClick={() => setApplicationsModalOpen(true)}
              sx={{
                padding: '8px 16px',
                borderRadius: '9px',
                background: '#2F6FED',
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(12.5),
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                Review Applications
              </Typography>
            </Box>
          </RowStack>

          <Grid container spacing={'12px'} sx={{ padding: '16px 24px' }}>
            {pendingDrivers.map((driver) => (
              <Grid key={driver.id} size={{ xs: 12, md: 4 }}>
                <RowStack
                  spacing={'12px'}
                  sx={{
                    background: '#F7F9FB',
                    border: '0.67px solid #F0F4F8',
                    borderRadius: '14px',
                    padding: '16px',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      fontSize: pxToRem(12),
                      fontWeight: 700,
                      background: '#9CA3AF',
                      color: '#FFFFFF',
                      borderRadius: '19px',
                    }}
                  >
                    {driver.initials}
                  </Avatar>
                  <Stack spacing={0} sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: pxToRem(13.5),
                        color: '#111827',
                        lineHeight: '1.5em',
                      }}
                    >
                      {driver.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: pxToRem(11.5),
                        color: '#9CA3AF',
                        lineHeight: '1.5em',
                      }}
                    >
                      {driver.fleet}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: pxToRem(11.5),
                        color: '#6B7280',
                        lineHeight: '1.5em',
                        mt: '4px',
                      }}
                    >
                      {driver.submittedDate}
                    </Typography>
                  </Stack>
                </RowStack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>

      {/* Review Suspensions Modal */}
      <ReviewSuspensionsModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />

      {/* Review Applications Modal */}
      <ReviewApplicationsModal
        open={applicationsModalOpen}
        onClose={() => setApplicationsModalOpen(false)}
      />
    </AppDashboardLayout>
  );
};
