'use client';

import {
  Box,
  LinearProgress,
  Stack,
  Typography,
  linearProgressClasses,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DriverFeedback = {
  date: string;
  quote: string;
  reviewerName: string;
  reviewerInitials: string;
  starCount: number;
};

export type DriverRatingData = {
  id: string;
  rank: number;
  name: string;
  company: string;
  rating: number;
  reviews: number;
  trend: { value: string; direction: 'up' | 'down' | 'stable' };
  badge: { text: string; color: string; bg: string };
  accentGradient: string;
  avatarColor: string;
  initials: string;
  ratingDistribution: { stars: number; count: number; pct: number }[];
  serviceAttributes: {
    label: string;
    value: number;
    gradient: string;
  }[];
  recentFeedback: DriverFeedback[];
};

type DriverRatingCardProps = {
  driver: DriverRatingData;
};

// ─── Section Header ─────────────────────────────────────────────────────────

const SectionHeader = ({ text }: { text: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(10),
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.065em',
    }}
  >
    {text}
  </Typography>
);

// ─── Rank Medal ──────────────────────────────────────────────────────────────

const RankMedal = ({ rank }: { rank: number }) => {
  const medals: Record<number, string> = {
    1: '\uD83E\uDD47',
    2: '\uD83E\uDD48',
    3: '\uD83E\uDD49',
  };
  return (
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 800,
        fontSize: pxToRem(13),
        color: '#6B7280',
      }}
    >
      {medals[rank] || ''} #{rank}
    </Typography>
  );
};

// ─── Rating Bar Color ────────────────────────────────────────────────────────

const getRatingBarGradient = (stars: number) => {
  if (stars >= 4)
    return 'linear-gradient(90deg, rgba(245,158,11,0.47) 0%, rgba(245,158,11,1) 100%)';
  if (stars === 3)
    return 'linear-gradient(90deg, rgba(251,146,60,0.47) 0%, rgba(251,146,60,1) 100%)';
  return 'linear-gradient(90deg, rgba(239,68,68,0.47) 0%, rgba(239,68,68,1) 100%)';
};

// ─── Service Attribute Icon Map ──────────────────────────────────────────────

const attributeIcons: Record<string, { icon: ReactNode; color: string }> = {
  Punctuality: {
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 'inherit' }} />,
    color: '#2F6FED',
  },
  Helpfulness: {
    icon: <ThumbUpOutlinedIcon sx={{ fontSize: 'inherit' }} />,
    color: '#10B981',
  },
  Cleanliness: {
    icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 'inherit' }} />,
    color: '#6366F1',
  },
  Safety: {
    icon: <ShieldOutlinedIcon sx={{ fontSize: 'inherit' }} />,
    color: '#F59E0B',
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverRatingCard = ({ driver }: DriverRatingCardProps) => {
  const maxRatingCount = Math.max(
    ...driver.ratingDistribution.map((r) => r.count)
  );

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 6px 0px rgba(0, 0, 0, 0.07)',
        overflow: 'hidden',
      }}
    >
      {/* Top Color Bar */}
      <Box
        sx={{
          height: '3px',
          background: driver.accentGradient,
        }}
      />

      {/* Card Content — 4 Columns */}
      <RowStack alignItems="stretch" sx={{ minHeight: '220px' }}>
        {/* Column 1: Driver Profile */}
        <Stack
          spacing={'10px'}
          sx={{
            flex: 1,
            padding: '20px',
            borderRight: '0.67px solid #F0F4F8',
          }}
        >
          <SectionHeader text="Driver Profile" />

          <RowStack justifyContent="space-between">
            <RankMedal rank={driver.rank} />
            <Box
              sx={{
                background: driver.badge.bg,
                borderRadius: '100px',
                padding: '3px 10px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10.5),
                  color: driver.badge.color,
                }}
              >
                {driver.badge.text}
              </Typography>
            </Box>
          </RowStack>

          {/* Avatar */}
          <Stack alignItems="center" spacing={'8px'}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${driver.avatarColor} 0%, ${driver.avatarColor}55 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(18),
                  color: '#FFFFFF',
                }}
              >
                {driver.initials}
              </Typography>
            </Box>
            <Stack alignItems="center" spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: '#111827',
                }}
              >
                {driver.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(11),
                  color: '#9CA3AF',
                }}
              >
                {driver.company}
              </Typography>
            </Stack>
          </Stack>

          {/* Large Rating */}
          <Stack alignItems="center" spacing={'4px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 800,
                fontSize: pxToRem(34),
                color: '#111827',
                lineHeight: 1,
              }}
            >
              {driver.rating}
            </Typography>
            <RowStack spacing={'2px'}>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  sx={{
                    fontSize: 13,
                    color:
                      i < Math.round(driver.rating) ? '#F59E0B' : '#E5E7EB',
                  }}
                />
              ))}
            </RowStack>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11),
                color: '#9CA3AF',
              }}
            >
              {driver.reviews} reviews
            </Typography>
          </Stack>

          {/* Trend Badge */}
          <Stack alignItems="center">
            <RowStack
              spacing={'4px'}
              sx={{
                borderRadius: '100px',
                padding: '3px 10px',
                border:
                  driver.trend.direction === 'up'
                    ? '0.67px solid #BBF7D0'
                    : driver.trend.direction === 'down'
                      ? '0.67px solid #FECACA'
                      : '0.67px solid #E5E7EB',
                background:
                  driver.trend.direction === 'up'
                    ? '#F0FDF4'
                    : driver.trend.direction === 'down'
                      ? '#FEF2F2'
                      : 'transparent',
              }}
            >
              {driver.trend.direction === 'up' && (
                <TrendingUpIcon sx={{ fontSize: 11, color: '#059669' }} />
              )}
              {driver.trend.direction === 'down' && (
                <TrendingDownIcon sx={{ fontSize: 11, color: '#DC2626' }} />
              )}
              {driver.trend.direction === 'stable' && (
                <RemoveIcon sx={{ fontSize: 11, color: '#6B7280' }} />
              )}
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(11),
                  color:
                    driver.trend.direction === 'up'
                      ? '#059669'
                      : driver.trend.direction === 'down'
                        ? '#DC2626'
                        : '#6B7280',
                }}
              >
                {driver.trend.value}
              </Typography>
            </RowStack>
          </Stack>
        </Stack>

        {/* Column 2: Rating Distribution */}
        <Stack
          spacing={'10px'}
          sx={{
            flex: 1,
            padding: '20px',
            borderRight: '0.67px solid #F0F4F8',
          }}
        >
          <SectionHeader text="Rating Distribution" />
          <Stack spacing={'8px'} sx={{ flex: 1, justifyContent: 'center' }}>
            {driver.ratingDistribution.map((r) => (
              <RowStack key={r.stars} spacing={'6px'}>
                <RowStack spacing={'3px'} sx={{ minWidth: '28px' }}>
                  <StarIcon sx={{ fontSize: 10, color: '#F59E0B' }} />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(11.5),
                      color: '#374151',
                    }}
                  >
                    {r.stars}
                  </Typography>
                </RowStack>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      maxRatingCount > 0 ? (r.count / maxRatingCount) * 100 : 0
                    }
                    sx={{
                      height: 7,
                      borderRadius: '4px',
                      [`&.${linearProgressClasses.colorPrimary}`]: {
                        backgroundColor: '#F0F4F8',
                      },
                      [`& .${linearProgressClasses.bar}`]: {
                        borderRadius: '4px',
                        background: getRatingBarGradient(r.stars),
                      },
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11),
                    color: '#6B7280',
                    minWidth: '26px',
                    textAlign: 'right',
                  }}
                >
                  {r.count}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(10),
                    color: '#9CA3AF',
                    minWidth: '26px',
                    textAlign: 'right',
                  }}
                >
                  {r.pct}%
                </Typography>
              </RowStack>
            ))}
          </Stack>
        </Stack>

        {/* Column 3: Service Attributes */}
        <Stack
          spacing={'10px'}
          sx={{
            flex: 1,
            padding: '20px',
            borderRight: '0.67px solid #F0F4F8',
          }}
        >
          <SectionHeader text="Service Attributes" />
          <Stack spacing={'12px'} sx={{ flex: 1, justifyContent: 'center' }}>
            {driver.serviceAttributes.map((attr) => {
              const iconData = attributeIcons[attr.label];
              return (
                <Stack key={attr.label} spacing={'4px'}>
                  <RowStack justifyContent="space-between">
                    <RowStack spacing={'6px'}>
                      {iconData && (
                        <Box
                          sx={{
                            color: iconData.color,
                            display: 'flex',
                            fontSize: 13,
                          }}
                        >
                          {iconData.icon}
                        </Box>
                      )}
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(11),
                          color: '#374151',
                        }}
                      >
                        {attr.label}
                      </Typography>
                    </RowStack>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(11.5),
                        color: '#374151',
                      }}
                    >
                      {attr.value}%
                    </Typography>
                  </RowStack>
                  <LinearProgress
                    variant="determinate"
                    value={attr.value}
                    sx={{
                      height: 7,
                      borderRadius: '4px',
                      [`&.${linearProgressClasses.colorPrimary}`]: {
                        backgroundColor: '#F0F4F8',
                      },
                      [`& .${linearProgressClasses.bar}`]: {
                        borderRadius: '4px',
                        background: attr.gradient,
                      },
                    }}
                  />
                </Stack>
              );
            })}
          </Stack>
        </Stack>

        {/* Column 4: Recent Feedback */}
        <Stack
          spacing={'10px'}
          sx={{
            flex: 1,
            padding: '20px',
          }}
        >
          <SectionHeader text="Recent Feedback" />
          <Stack spacing={'10px'} sx={{ flex: 1, justifyContent: 'center' }}>
            {driver.recentFeedback.map((fb, i) => (
              <Box
                key={i}
                sx={{
                  background: '#F7F9FB',
                  borderRadius: '14px',
                  padding: '12px',
                }}
              >
                <Stack spacing={'8px'}>
                  <RowStack justifyContent="space-between">
                    <RowStack spacing={'2px'}>
                      {Array.from({ length: fb.starCount }).map((_, j) => (
                        <StarIcon
                          key={j}
                          sx={{ fontSize: 10, color: '#F59E0B' }}
                        />
                      ))}
                    </RowStack>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(10),
                        color: '#9CA3AF',
                      }}
                    >
                      {fb.date}
                    </Typography>
                  </RowStack>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11.5),
                      color: '#374151',
                      lineHeight: 1.45,
                    }}
                  >
                    &quot;{fb.quote}&quot;
                  </Typography>
                  <RowStack spacing={'6px'}>
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: `${driver.avatarColor}22`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(7),
                          color: driver.avatarColor,
                        }}
                      >
                        {fb.reviewerInitials}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(10.5),
                        color: '#6B7280',
                      }}
                    >
                      {fb.reviewerName}
                    </Typography>
                  </RowStack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </RowStack>
    </Box>
  );
};
