'use client';

import {
  Box,
  Drawer,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
  linearProgressClasses,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CheckIcon from '@mui/icons-material/Check';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { DriverData } from '../../../index';

type DriverProfileCardProps = {
  driver: DriverData;
};

// ─── Profile Card Sub-components ────────────────────────────────────────────

const MetricCard = ({
  label,
  value,
  icon,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
}) => (
  <Stack
    spacing={'4px'}
    sx={{
      background: '#F7F9FB',
      borderRadius: '14px',
      padding: '12px',
      flex: 1,
    }}
  >
    <RowStack spacing={'6px'}>
      <Box sx={{ color: iconColor, display: 'flex', fontSize: 13 }}>{icon}</Box>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(11),
          color: '#9CA3AF',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </Typography>
    </RowStack>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(20),
        color: '#111827',
      }}
    >
      {value}
    </Typography>
  </Stack>
);

// ─── Drawer Section Header ──────────────────────────────────────────────────

const SectionHeader = ({ text }: { text: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(11),
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.045em',
    }}
  >
    {text}
  </Typography>
);

// ─── Key Metric Row ─────────────────────────────────────────────────────────

const KeyMetricRow = ({
  label,
  value,
  progress,
  barColor,
}: {
  label: string;
  value: string;
  progress: number;
  barColor: string;
}) => (
  <RowStack spacing={'12px'}>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(12),
        color: '#6B7280',
        minWidth: '110px',
      }}
    >
      {label}
    </Typography>
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        flex: 1,
        height: 7,
        borderRadius: '4px',
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: '#F0F4F8',
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: '4px',
          backgroundColor: barColor,
        },
      }}
    />
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(13),
        color: '#374151',
        minWidth: '50px',
        textAlign: 'right',
      }}
    >
      {value}
    </Typography>
  </RowStack>
);

// ─── Rating Row ─────────────────────────────────────────────────────────────

const RatingRow = ({
  stars,
  count,
  maxCount,
}: {
  stars: number;
  count: number;
  maxCount: number;
}) => (
  <RowStack spacing={'8px'}>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(11),
        color: '#6B7280',
        minWidth: '12px',
        textAlign: 'center',
      }}
    >
      {stars}
    </Typography>
    <StarIcon sx={{ fontSize: 11, color: '#F59E0B' }} />
    <LinearProgress
      variant="determinate"
      value={maxCount > 0 ? (count / maxCount) * 100 : 0}
      sx={{
        flex: 1,
        height: 7,
        borderRadius: '4px',
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: '#E5E7EB',
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: '4px',
          backgroundColor: '#F59E0B',
        },
      }}
    />
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 600,
        fontSize: pxToRem(12),
        color: '#374151',
        minWidth: '24px',
        textAlign: 'right',
      }}
    >
      {count}
    </Typography>
  </RowStack>
);

// ─── Trip Row ───────────────────────────────────────────────────────────────

const TripRow = ({
  tripId,
  from,
  to,
  date,
  starCount,
  isAlt,
}: {
  tripId: string;
  from: string;
  to: string;
  date: string;
  starCount: number;
  isAlt: boolean;
}) => (
  <RowStack
    spacing={'12px'}
    sx={{
      padding: '10px 16px',
      background: isAlt ? '#FAFBFC' : '#FFFFFF',
      borderBottom: '0.67px solid #F7F9FB',
    }}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(11),
        color: '#9CA3AF',
        minWidth: '48px',
      }}
    >
      {tripId}
    </Typography>
    <RowStack spacing={'4px'} sx={{ flex: 1, minWidth: 0 }}>
      <LocationOnOutlinedIcon sx={{ fontSize: 10, color: '#9CA3AF' }} />
      <Typography
        noWrap
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12),
          color: '#374151',
        }}
      >
        {from}
      </Typography>
      <ArrowForwardIcon sx={{ fontSize: 10, color: '#D1D5DB' }} />
      <Typography
        noWrap
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12),
          color: '#374151',
        }}
      >
        {to}
      </Typography>
    </RowStack>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(11),
        color: '#9CA3AF',
        minWidth: '44px',
      }}
    >
      {date}
    </Typography>
    <RowStack spacing={'4px'}>
      {Array.from({ length: starCount }).map((_, i) => (
        <StarIcon key={i} sx={{ fontSize: 10, color: '#F59E0B' }} />
      ))}
    </RowStack>
  </RowStack>
);

// ─── Strength/Flag Chip ─────────────────────────────────────────────────────

const GreenChip = ({ text, icon }: { text: string; icon: React.ReactNode }) => (
  <RowStack
    spacing={'8px'}
    sx={{
      background: '#ECFDF5',
      border: '0.67px solid #BBF7D0',
      borderRadius: '14px',
      padding: '10px 12px',
    }}
  >
    <Box sx={{ color: '#059669', display: 'flex', fontSize: 12 }}>{icon}</Box>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(12),
        color: '#065F46',
      }}
    >
      {text}
    </Typography>
  </RowStack>
);

// ─── Sample Data ────────────────────────────────────────────────────────────

const monthlyTripsData = [
  { month: 'Sep', trips: 30 },
  { month: 'Oct', trips: 38 },
  { month: 'Nov', trips: 35 },
  { month: 'Dec', trips: 28 },
  { month: 'Jan', trips: 42 },
  { month: 'Feb', trips: 50 },
  { month: 'Mar', trips: 48 },
  { month: 'Apr', trips: 45 },
  { month: 'May', trips: 46 },
];

const ratingBreakdown = [
  { stars: 5, count: 78 },
  { stars: 4, count: 18 },
  { stars: 3, count: 3 },
  { stars: 2, count: 1 },
  { stars: 1, count: 0 },
];

const recentTrips = [
  {
    tripId: 'T-8821',
    from: 'Toronto General Hospital',
    to: '120 King St W, Toronto',
    date: 'Mar 13',
    starCount: 5,
  },
  {
    tripId: 'T-8819',
    from: 'Sunnybrook Health',
    to: '1225 Gladstone Ave',
    date: 'Mar 13',
    starCount: 5,
  },
  {
    tripId: 'T-8814',
    from: 'The Ottawa Hospital',
    to: '455 Ste-Catherine St W',
    date: 'Mar 12',
    starCount: 4,
  },
  {
    tripId: 'T-8810',
    from: "St. Michael's Hospital",
    to: '800 Rene-Levesque Blvd W',
    date: 'Mar 12',
    starCount: 5,
  },
  {
    tripId: 'T-8805',
    from: 'Ottawa Kidney Care Centre',
    to: '321 Elgin St, Ottawa',
    date: 'Mar 11',
    starCount: 5,
  },
];

const strengths = [
  'Top rated driver fleet-wide',
  'Zero safety incidents in 90 days',
  '98% acceptance rate',
];

// ─── Full Report Drawer ─────────────────────────────────────────────────────

const DriverFullReportDrawer = ({
  driver,
  open,
  onClose,
}: {
  driver: DriverData;
  open: boolean;
  onClose: () => void;
}) => {
  const maxRatingCount = Math.max(...ratingBreakdown.map((r) => r.count));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 580,
          boxShadow: '-4px 0px 48px 0px rgba(0, 0, 0, 0.16)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Sticky Header */}
      <RowStack
        justifyContent="space-between"
        sx={{
          padding: '20px 24px',
          borderBottom: '0.67px solid #F0F4F8',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(16),
            color: '#111827',
          }}
        >
          Full Performance Report
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            width: 30,
            height: 30,
            borderRadius: '8px',
            background: '#F3F4F6',
            border: '0.67px solid #E5E7EB',
          }}
        >
          <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
        </IconButton>
      </RowStack>

      {/* Scrollable Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <Stack spacing={'24px'}>
          {/* 1. Driver Profile Card (Blue Gradient) */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2F6FED 0%, #1A5FCC 100%)',
              borderRadius: '16px',
              padding: '20px',
              position: 'relative',
            }}
          >
            <RowStack spacing={'16px'} alignItems="center">
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 800,
                    fontSize: pxToRem(24),
                    color: '#FFFFFF',
                  }}
                >
                  {driver.initials}
                </Typography>
              </Box>
              <Stack spacing={'4px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 800,
                    fontSize: pxToRem(20),
                    color: '#FFFFFF',
                  }}
                >
                  {driver.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  MediGo · Toyota Sienna 2022
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  +1 416 555 9944 · Joined Jan 2024
                </Typography>
                <RowStack spacing={'4px'}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} sx={{ fontSize: 13, color: '#FCD34D' }} />
                  ))}
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(13),
                      color: '#FCD34D',
                      marginLeft: '4px',
                    }}
                  >
                    {driver.rating}
                  </Typography>
                </RowStack>
              </Stack>
            </RowStack>
            {/* Active Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '100px',
                padding: '4px 14px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(12),
                  color: '#FFFFFF',
                }}
              >
                Active
              </Typography>
            </Box>
          </Box>

          {/* 2. Key Metrics */}
          <Stack spacing={'10px'}>
            <SectionHeader text="Key Metrics" />
            <Stack spacing={'10px'}>
              <KeyMetricRow
                label="Completion Rate"
                value={`${driver.completionRate}%`}
                progress={driver.completionRate}
                barColor="#10B981"
              />
              <KeyMetricRow
                label="On-Time Rate"
                value={`${driver.onTimeRate}%`}
                progress={driver.onTimeRate}
                barColor="#2F6FED"
              />
              <KeyMetricRow
                label="Acceptance Rate"
                value="98%"
                progress={98}
                barColor="#6366F1"
              />
              <KeyMetricRow
                label="Safety Score"
                value={driver.safetyScore}
                progress={parseInt(driver.safetyScore)}
                barColor="#F59E0B"
              />
            </Stack>
          </Stack>

          {/* 3. Monthly Trips Bar Chart */}
          <Stack spacing={'10px'}>
            <SectionHeader text="Monthly Trips (Last 7 Months)" />
            <Box
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                padding: '16px 12px 8px',
              }}
            >
              <ResponsiveContainer width="100%" height={130}>
                <BarChart
                  data={monthlyTripsData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F0F4F8"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: pxToRem(9),
                      fill: '#9CA3AF',
                      fontWeight: 400,
                    }}
                    dy={4}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: pxToRem(9),
                      fill: '#C4CAD4',
                      fontWeight: 400,
                    }}
                    domain={[0, 55]}
                    ticks={[0, 28, 55]}
                  />
                  <Bar
                    dataKey="trips"
                    fill="#2F6FED"
                    fillOpacity={0.8}
                    radius={[3, 3, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Stack>

          {/* 4. Rating Breakdown */}
          <Stack spacing={'10px'}>
            <SectionHeader text="Rating Breakdown" />
            <Box
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                padding: '16px',
              }}
            >
              <Stack spacing={'8px'}>
                {ratingBreakdown.map((r) => (
                  <RatingRow
                    key={r.stars}
                    stars={r.stars}
                    count={r.count}
                    maxCount={maxRatingCount}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>

          {/* 5. Recent Trips */}
          <Stack spacing={'10px'}>
            <SectionHeader text="Recent Trips" />
            <Box
              sx={{
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                overflow: 'hidden',
              }}
            >
              {recentTrips.map((trip, i) => (
                <TripRow key={trip.tripId} {...trip} isAlt={i % 2 === 1} />
              ))}
            </Box>
          </Stack>

          {/* 6. Strengths & Flags */}
          <RowStack spacing={'16px'} alignItems="flex-start">
            <Stack spacing={'10px'} sx={{ flex: 1 }}>
              <SectionHeader text="Strengths" />
              <Stack spacing={'8px'}>
                {strengths.map((s) => (
                  <GreenChip
                    key={s}
                    text={s}
                    icon={<CheckIcon sx={{ fontSize: 'inherit' }} />}
                  />
                ))}
              </Stack>
            </Stack>
            <Stack spacing={'10px'} sx={{ flex: 1 }}>
              <SectionHeader text="Flags" />
              <GreenChip
                text="No issues flagged"
                icon={<InfoOutlinedIcon sx={{ fontSize: 'inherit' }} />}
              />
            </Stack>
          </RowStack>

          {/* 7. Monthly Earnings Card */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2F6FED 0%, #1A5FCC 100%)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <RowStack spacing={'16px'} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BarChartOutlinedIcon sx={{ fontSize: 22, color: '#FFFFFF' }} />
              </Box>
              <Stack sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(11),
                    color: 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.045em',
                  }}
                >
                  Monthly Earnings
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 800,
                    fontSize: pxToRem(30),
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                  }}
                >
                  {driver.monthlyEarnings}
                </Typography>
              </Stack>
              <Stack alignItems="flex-end">
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {driver.trips} trips
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(13),
                    color: '#FFFFFF',
                  }}
                >
                  MediGo
                </Typography>
              </Stack>
            </RowStack>
          </Box>
        </Stack>
      </Box>

      {/* Sticky Footer */}
      <Box
        sx={{
          padding: '16px 24px',
          borderTop: '0.67px solid #F0F4F8',
          background: '#FAFBFF',
          flexShrink: 0,
        }}
      >
        <Box
          onClick={onClose}
          sx={{
            background: '#F7F9FB',
            border: '0.67px solid #E8ECF0',
            borderRadius: '10px',
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            '&:hover': {
              background: '#EFF6FF',
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#374151',
            }}
          >
            Close Report
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

export const DriverProfileCard = ({ driver }: DriverProfileCardProps) => {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        padding: '24px',
        height: '100%',
      }}
    >
      <Stack spacing={'20px'}>
        {/* Title */}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(18),
            color: '#111827',
          }}
        >
          Driver Profile
        </Typography>

        {/* Profile Header */}
        <Stack alignItems="center" spacing={'10px'}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: driver.avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(20),
                color: '#FFFFFF',
              }}
            >
              {driver.initials}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(16),
              color: '#111827',
            }}
          >
            {driver.name}
          </Typography>
          <RowStack spacing={'4px'}>
            <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(14),
                color: '#374151',
              }}
            >
              {driver.rating} rating
            </Typography>
          </RowStack>
        </Stack>

        {/* Metric Grid 2x2 */}
        <Stack spacing={'12px'}>
          <RowStack spacing={'12px'}>
            <MetricCard
              label="Total Trips"
              value={String(driver.trips)}
              icon={<LocalShippingOutlinedIcon sx={{ fontSize: 'inherit' }} />}
              iconColor="#2F6FED"
            />
            <MetricCard
              label="Completion"
              value={`${driver.completionRate}%`}
              icon={<CheckCircleOutlineIcon sx={{ fontSize: 'inherit' }} />}
              iconColor="#10B981"
            />
          </RowStack>
          <RowStack spacing={'12px'}>
            <MetricCard
              label="On-Time Rate"
              value={`${driver.onTimeRate}%`}
              icon={<AccessTimeOutlinedIcon sx={{ fontSize: 'inherit' }} />}
              iconColor="#6366F1"
            />
            <MetricCard
              label="Safety Score"
              value={driver.safetyScore}
              icon={<ShieldOutlinedIcon sx={{ fontSize: 'inherit' }} />}
              iconColor="#F59E0B"
            />
          </RowStack>
        </Stack>

        {/* Monthly Earnings Banner */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2F6FED 0%, #1A5FCC 100%)',
            borderRadius: '14px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11),
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.045em',
              marginBottom: '4px',
            }}
          >
            Monthly Earnings
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(28),
              color: '#FFFFFF',
            }}
          >
            {driver.monthlyEarnings}
          </Typography>
        </Box>

        {/* View Full Report Button */}
        <Box
          onClick={() => setReportOpen(true)}
          sx={{
            border: '0.67px solid #E5E7EB',
            borderRadius: '14px',
            background: '#F7F9FB',
            padding: '12px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            '&:hover': {
              background: '#EFF6FF',
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13.5),
              color: '#374151',
            }}
          >
            View Full Report
          </Typography>
        </Box>
      </Stack>

      {/* Full Report Drawer */}
      <DriverFullReportDrawer
        driver={driver}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </Box>
  );
};
