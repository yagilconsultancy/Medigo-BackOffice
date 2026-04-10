'use client';

import { useMemo } from 'react';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import LocalTaxiOutlinedIcon from '@mui/icons-material/LocalTaxiOutlined';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import {
  pxToRem,
  useResolvedApiQuery,
  useGetFleetComposition,
} from '../../../common';

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryData = {
  name: string;
  badge: string;
  vehicleCount: number;
  percentage: number;
  color: string;
  bgLight: string;
  icon: React.ReactNode;
  description: string;
  baseFare: string;
  perMile: string;
  requirements: string[];
  commonVehicles: string[];
};

// ─── Category Configuration ─────────────────────────────────────────────────

const getCategoryConfig = (category: string) => {
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes('standard')) {
    return {
      badge: 'Standard',
      color: '#2F6FED',
      bgLight: '#EBF2FF',
      icon: <LocalTaxiOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      description: 'Regular sedan or minivan for ambulatory patients who can walk independently.',
    };
  }

  if (categoryLower.includes('wheelchair') || categoryLower.includes('wav')) {
    return {
      badge: 'WAV',
      color: '#059669',
      bgLight: '#ECFDF5',
      icon: <AccessibleOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
      description: 'Specially equipped vehicles with ramps or lifts for wheelchair users.',
    };
  }

  if (categoryLower.includes('assist')) {
    return {
      badge: 'Assist',
      color: '#D97706',
      bgLight: '#FFFBEB',
      icon: <VolunteerActivismOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
      description: 'Driver provides door-to-door assistance for patients who need help getting to/from the vehicle.',
    };
  }

  if (categoryLower.includes('stretcher')) {
    return {
      badge: 'Stretcher',
      color: '#EF4444',
      bgLight: '#FEF2F2',
      icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
      description: 'For non-ambulatory patients who must remain lying down during transport.',
    };
  }

  // Default
  return {
    badge: 'Other',
    color: '#6B7280',
    bgLight: '#F3F4F6',
    icon: <LocalTaxiOutlinedIcon sx={{ fontSize: 18, color: '#6B7280' }} />,
    description: 'Medical transportation service.',
  };
};

// ─── Component ───────────────────────────────────────────────────────────────

export const VehicleCategoriesPage = () => {
  // Fetch fleet composition data from API
  const { data: compositionResponse } = useResolvedApiQuery(
    useGetFleetComposition,
    null
  );

  // Map API response to UI format
  const categories = useMemo<CategoryData[]>(() => {
    if (!compositionResponse?.breakdown) return [];

    return compositionResponse.breakdown.map((item) => {
      const config = getCategoryConfig(item.category);

      return {
        name: item.display_name || item.category,
        badge: config.badge,
        vehicleCount: item.count,
        percentage: Math.round(item.percentage),
        color: config.color,
        bgLight: config.bgLight,
        icon: config.icon,
        description: config.description,
        baseFare: 'N/A', // Not provided by API
        perMile: 'N/A', // Not provided by API
        requirements: [], // Not provided by API
        commonVehicles: [], // Not provided by API
      };
    });
  }, [compositionResponse]);

  const totalVehicles = compositionResponse?.total_vehicles || 0;
  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Vehicle Categories"
          desc="MediGo's four vehicle service types, requirements, and pricing"
        />

        {/* Fleet Composition Card */}
        {categories.length > 0 && (
          <Stack
          spacing={'16px'}
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            padding: '24px',
          }}
        >
          <Stack spacing={'2px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: '#111827',
              }}
            >
              Fleet Composition
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#9CA3AF',
              }}
            >
              {totalVehicles} vehicles across all categories
            </Typography>
          </Stack>

          {/* Stacked Bar */}
          <RowStack
            sx={{
              width: '100%',
              height: 10,
              borderRadius: '100px',
              overflow: 'hidden',
              gap: '3px',
            }}
          >
            {categories.map((cat) => (
              <Box
                key={cat.name}
                sx={{
                  width: `${cat.percentage}%`,
                  height: '100%',
                  background: cat.color,
                  borderRadius: '100px',
                }}
              />
            ))}
          </RowStack>

          {/* Legend */}
          <RowStack spacing={'24px'} sx={{ flexWrap: 'wrap', gap: '12px' }}>
            {categories.map((cat) => (
              <RowStack key={cat.name} spacing={'8px'}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: cat.color,
                    flexShrink: 0,
                  }}
                />
                {cat.icon}
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12.5),
                    color: '#374151',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12.5),
                    color: '#9CA3AF',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.vehicleCount} · {cat.percentage}%
                </Typography>
              </RowStack>
            ))}
          </RowStack>
          </Stack>
        )}

        {/* Category Cards Grid */}
        {categories.length > 0 ? (
          <Grid container spacing={'20px'}>
            {categories.map((cat) => (
              <Grid key={cat.name} size={{ xs: 12, md: 6 }}>
                <Stack
                spacing={'20px'}
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                  padding: '24px',
                  height: '100%',
                }}
              >
                {/* Card Header */}
                <Stack spacing={'4px'}>
                  <RowStack spacing={'12px'}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: cat.bgLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {cat.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(15),
                        color: '#111827',
                      }}
                    >
                      {cat.name}
                    </Typography>
                    <Chip
                      label={cat.badge}
                      size="small"
                      sx={{
                        background: cat.bgLight,
                        color: cat.color,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: pxToRem(11),
                        height: '24px',
                        borderRadius: '100px',
                        '& .MuiChip-label': { px: '10px' },
                      }}
                    />
                  </RowStack>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#9CA3AF',
                      pl: '52px',
                    }}
                  >
                    {cat.vehicleCount} vehicles in fleet
                  </Typography>
                </Stack>

                {/* Description */}
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    lineHeight: '1.6em',
                    color: '#374151',
                  }}
                >
                  {cat.description}
                </Typography>

                {/* Pricing Row */}
                {cat.baseFare !== 'N/A' && cat.perMile !== 'N/A' && (
                  <RowStack spacing={'12px'}>
                  <Stack
                    sx={{
                      flex: 1,
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      borderRadius: '14px',
                      padding: '16px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(22),
                        color: '#111827',
                      }}
                    >
                      {cat.baseFare}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12),
                        color: '#9CA3AF',
                      }}
                    >
                      Base Fare
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{
                      flex: 1,
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      borderRadius: '14px',
                      padding: '16px',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(22),
                        color: '#111827',
                      }}
                    >
                      {cat.perMile}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12),
                        color: '#9CA3AF',
                      }}
                    >
                      Per Mile
                    </Typography>
                  </Stack>
                  </RowStack>
                )}

                {/* Requirements */}
                {cat.requirements.length > 0 && (
                  <Stack spacing={'10px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(10),
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                    }}
                  >
                    Requirements
                  </Typography>
                  {cat.requirements.map((req) => (
                    <RowStack key={req} spacing={'8px'}>
                      <CheckCircleOutlinedIcon
                        sx={{ fontSize: 14, color: cat.color }}
                      />
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(13),
                          color: '#374151',
                        }}
                      >
                        {req}
                      </Typography>
                    </RowStack>
                  ))}
                  </Stack>
                )}

                {/* Common Vehicles */}
                {cat.commonVehicles.length > 0 && (
                  <Stack spacing={'10px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(10),
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                    }}
                  >
                    Common Vehicles
                  </Typography>
                  <RowStack spacing={'8px'} sx={{ flexWrap: 'wrap' }}>
                    {cat.commonVehicles.map((v) => (
                      <Chip
                        key={v}
                        label={v}
                        variant="outlined"
                        size="small"
                        sx={{
                          color: cat.color,
                          borderColor: cat.color,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 500,
                          fontSize: pxToRem(12),
                          height: '28px',
                          borderRadius: '100px',
                          '& .MuiChip-label': { px: '12px' },
                        }}
                      />
                    ))}
                  </RowStack>
                  </Stack>
                )}
              </Stack>
            </Grid>
          ))}
          </Grid>
        ) : (
          <Box sx={{ py: 6 }}>
            <EmptyState
              emptyState={
                <Typography
                  sx={{
                    fontSize: pxToRem(16),
                    fontWeight: 400,
                    textAlign: 'center',
                  }}
                >
                  No vehicle categories found
                </Typography>
              }
            />
          </Box>
        )}
      </Stack>
    </AppDashboardLayout>
  );
};
