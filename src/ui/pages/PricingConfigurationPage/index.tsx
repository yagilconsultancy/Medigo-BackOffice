'use client';

import { useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import VerticalAlignBottomOutlinedIcon from '@mui/icons-material/VerticalAlignBottomOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppNumberField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import { ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

type StatCard = {
  icon: ReactNode;
  iconBg: string;
  value: string;
  label: string;
};

type FareRule = {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  unit: string;
  step: number;
  decimalPlaces: number;
  min?: number;
  max?: number;
};

// ─── Stat Cards Config ──────────────────────────────────────────────────────

const statCards: StatCard[] = [
  {
    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    value: '$34.20',
    label: 'Avg Trip Fare',
  },
  {
    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />,
    iconBg: '#ECFDF5',
    value: '$8.00',
    label: 'Base Fare (Global)',
  },
  {
    icon: <BoltOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />,
    iconBg: '#FFFBEB',
    value: '1.5×',
    label: 'Surge Multiplier',
  },
  {
    icon: <BlockOutlinedIcon sx={{ fontSize: 20, color: '#EF4444' }} />,
    iconBg: '#FEF2F2',
    value: '$5.00',
    label: 'Cancellation Fee',
  },
];

// ─── Fare Rules Config ──────────────────────────────────────────────────────

const fareRulesConfig: FareRule[] = [
  {
    id: 'base_fare',
    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Global Base Fare',
    description: 'Minimum charge applied to every trip',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'distance_rate',
    icon: <StraightenOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Distance Rate (per km)',
    description: 'Applied per kilometre driven',
    unit: 'CAD/km',
    step: 0.1,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'time_rate',
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Time Rate (per minute)',
    description: 'Applied per minute the rider is in the vehicle',
    unit: 'CAD/min',
    step: 0.01,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'surge_multiplier',
    icon: <TrendingUpOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Surge Multiplier (Peak)',
    description: 'Multiplied during high-demand periods',
    unit: '×',
    step: 0.1,
    decimalPlaces: 2,
    min: 1,
  },
  {
    id: 'surge_threshold',
    icon: <PercentOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Surge Trigger Threshold',
    description: 'Surge activates when capacity exceeds this threshold',
    unit: '% demand',
    step: 5,
    decimalPlaces: 0,
    min: 0,
    max: 100,
  },
  {
    id: 'cancellation_fee',
    icon: <BlockOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Cancellation Fee',
    description: 'Charged when rider cancels within 5 minutes of pickup',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'no_show_fee',
    icon: <PersonOffOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'No-Show Fee',
    description: 'Charged when rider is not present at pickup',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'minimum_fare',
    icon: (
      <VerticalAlignBottomOutlinedIcon
        sx={{ fontSize: 17, color: '#2F6FED' }}
      />
    ),
    title: 'Minimum Fare',
    description: 'Lowest possible fare regardless of distance/time',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
];

const defaultValues: Record<string, number> = {
  base_fare: 8.0,
  distance_rate: 1.8,
  time_rate: 0.18,
  surge_multiplier: 1.5,
  surge_threshold: 85,
  cancellation_fee: 5.0,
  no_show_fee: 8.0,
  minimum_fare: 12.0,
};

// ─── Component ──────────────────────────────────────────────────────────────

export const PricingConfigurationPage = () => {
  const [fareValues, setFareValues] =
    useState<Record<string, number>>(defaultValues);

  const handleValueChange = (id: string, value: number) => {
    setFareValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Pricing Configuration"
            desc="Set global fare rules, surge pricing thresholds, and fee structures"
          />
          <AppButton
            variant="contained"
            sx={{
              background: '#2F6FED',
              borderRadius: '14px',
              padding: '10px 20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: pxToRem(13),
              '&:hover': { background: '#1E4FD9' },
            }}
          >
            Save Changes
          </AppButton>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'20px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                  padding: '20px',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    background: card.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>

                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(28),
                    lineHeight: '1em',
                    color: '#111827',
                    marginTop: '16px',
                  }}
                >
                  {card.value}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    color: '#6B7280',
                    marginTop: '12px',
                  }}
                >
                  {card.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Fare & Fee Rules Card */}
        <Stack
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Card Header */}
          <Stack
            spacing={'4px'}
            sx={{
              padding: '16px 24px',
              borderBottom: '0.67px solid #F0F4F8',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(18),
                color: '#111827',
              }}
            >
              Fare & Fee Rules
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#6B7280',
              }}
            >
              Adjust values and click Save Changes — affects all ride types
              globally
            </Typography>
          </Stack>

          {/* Fare Rules List */}
          <Stack spacing={'12px'} sx={{ padding: '24px' }}>
            {fareRulesConfig.map((rule) => (
              <RowStack
                key={rule.id}
                justifyContent="space-between"
                sx={{
                  background: '#F7F9FB',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  padding: '0px 20px',
                  height: 80,
                }}
              >
                {/* Left: Icon + Text */}
                <RowStack spacing={'16px'}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '14px',
                      background: '#EBF2FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {rule.icon}
                  </Box>
                  <Stack>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(13.5),
                        color: '#111827',
                      }}
                    >
                      {rule.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12),
                        color: '#9CA3AF',
                      }}
                    >
                      {rule.description}
                    </Typography>
                  </Stack>
                </RowStack>

                {/* Right: Number Field */}
                <AppNumberField
                  value={fareValues[rule.id]}
                  onChange={(val) => handleValueChange(rule.id, val)}
                  unit={rule.unit}
                  step={rule.step}
                  decimalPlaces={rule.decimalPlaces}
                  min={rule.min}
                  max={rule.max}
                />
              </RowStack>
            ))}
          </Stack>

          {/* Card Footer */}
          <RowStack
            justifyContent="space-between"
            sx={{
              padding: '0px 24px',
              height: 56,
              background: '#FAFBFC',
              borderTop: '0.67px solid #F0F4F8',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#9CA3AF',
              }}
            >
              Changes apply globally to all ride types unless overridden per
              ride type
            </Typography>
            <AppButton
              variant="contained"
              sx={{
                background: '#2F6FED',
                borderRadius: '14px',
                padding: '10px 24px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: pxToRem(13),
                '&:hover': { background: '#1E4FD9' },
              }}
            >
              Save Changes
            </AppButton>
          </RowStack>
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
