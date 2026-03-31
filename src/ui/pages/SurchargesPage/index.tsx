'use client';

import { useState } from 'react';
import { Box, Grid, Stack, Switch, Typography, styled } from '@mui/material';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import WbTwilightOutlinedIcon from '@mui/icons-material/WbTwilightOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { pxToRem } from '../../../common';
import { ReactNode } from 'react';

// ─── iOS Switch ─────────────────────────────────────────────────────────────

const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#2F6FED',
        opacity: 1,
        border: 0,
      },
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.5,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),
  },
}));

// ─── Types ──────────────────────────────────────────────────────────────────

type Surcharge = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  multiplier: string;
  multiplierColor: string;
  appliesTo: string;
  active: boolean;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const initialSurcharges: Surcharge[] = [
  {
    id: 'peak_hours',
    title: 'Peak Hours',
    description: 'Weekdays 7–9 AM & 4–7 PM',
    icon: <BoltOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    multiplier: '1.4×',
    multiplierColor: '#2F6FED',
    appliesTo: 'All ride types',
    active: true,
  },
  {
    id: 'night_surcharge',
    title: 'Night Surcharge',
    description: '10 PM – 5 AM daily',
    icon: <DarkModeOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
    multiplier: '1.25×',
    multiplierColor: '#6366F1',
    appliesTo: 'Standard, Medical',
    active: true,
  },
  {
    id: 'weather_rain',
    title: 'Weather – Rain',
    description: 'Active when weather alert is issued',
    icon: <WaterDropOutlinedIcon sx={{ fontSize: 20, color: '#0EA5E9' }} />,
    iconBg: '#E0F2FE',
    multiplier: '1.3×',
    multiplierColor: '#0EA5E9',
    appliesTo: 'Standard only',
    active: true,
  },
  {
    id: 'holiday_pricing',
    title: 'Holiday Pricing',
    description: 'Statutory holidays — national & provincial',
    icon: <CelebrationOutlinedIcon sx={{ fontSize: 20, color: '#EC4899' }} />,
    iconBg: '#FDF2F8',
    multiplier: '1.6×',
    multiplierColor: '#EC4899',
    appliesTo: 'All ride types',
    active: true,
  },
  {
    id: 'winter_weather',
    title: 'Winter Weather',
    description: 'Snow / ice storm warnings',
    icon: <AcUnitOutlinedIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />,
    iconBg: '#F3F4F6',
    multiplier: '1.5×',
    multiplierColor: '#9CA3AF',
    appliesTo: 'All ride types',
    active: false,
  },
  {
    id: 'early_morning',
    title: 'Early Morning',
    description: '5 AM – 7 AM (pre-peak demand boost)',
    icon: <WbTwilightOutlinedIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />,
    iconBg: '#F3F4F6',
    multiplier: '1.15×',
    multiplierColor: '#9CA3AF',
    appliesTo: 'Standard, Shared Ride',
    active: false,
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const SurchargesPage = () => {
  const [surcharges, setSurcharges] = useState<Surcharge[]>(initialSurcharges);

  const activeCount = surcharges.filter((s) => s.active).length;
  const inactiveCount = surcharges.filter((s) => !s.active).length;

  const handleToggle = (id: string) => {
    setSurcharges((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Surcharges"
          desc="Configure additional charges applied during peak periods, special conditions, or extra service requests."
        />

        {/* Stat Cards */}
        <RowStack spacing={'12px'}>
          {/* Active Surcharges */}
          <RowStack
            spacing={'12px'}
            sx={{
              flex: 1,
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
              padding: '0px 20px',
              height: 120,
            }}
          >
            <Stack spacing={'9px'} sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                Active surcharges
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(26),
                  lineHeight: '0.85em',
                  color: '#111827',
                }}
              >
                {activeCount}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '16px',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 19, color: '#059669' }} />
            </Box>
          </RowStack>

          {/* Inactive Surcharges */}
          <RowStack
            spacing={'12px'}
            sx={{
              flex: 1,
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
              padding: '0px 20px',
              height: 120,
            }}
          >
            <Stack spacing={'9px'} sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                Inactive surcharges
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(26),
                  lineHeight: '0.85em',
                  color: '#111827',
                }}
              >
                {inactiveCount}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '16px',
                background: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BlockOutlinedIcon sx={{ fontSize: 19, color: '#9CA3AF' }} />
            </Box>
          </RowStack>
        </RowStack>

        {/* Surcharge Cards Grid */}
        <Grid container spacing={'20px'}>
          {surcharges.map((surcharge) => (
            <Grid key={surcharge.id} size={{ xs: 12, md: 6 }}>
              <SurchargeCard
                surcharge={surcharge}
                onToggle={() => handleToggle(surcharge.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </AppDashboardLayout>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SurchargeCard = ({
  surcharge,
  onToggle,
}: {
  surcharge: Surcharge;
  onToggle: () => void;
}) => {
  const isInactive = !surcharge.active;

  return (
    <Stack
      spacing={'16px'}
      sx={{
        background: '#FFFFFF',
        border: `0.67px solid ${isInactive ? '#F3F4F6' : '#F0F4F8'}`,
        borderRadius: '16px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        padding: '20px',
        opacity: isInactive ? 0.75 : 1,
      }}
    >
      {/* Top Row: Icon + Title/Desc + Switch */}
      <RowStack justifyContent="space-between">
        <RowStack spacing={'12px'}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              background: isInactive ? '#F3F4F6' : surcharge.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {surcharge.icon}
          </Box>
          <Stack spacing={'2px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(14),
                color: '#111827',
              }}
            >
              {surcharge.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#9CA3AF',
              }}
            >
              {surcharge.description}
            </Typography>
          </Stack>
        </RowStack>
        <IOSSwitch checked={surcharge.active} onChange={onToggle} />
      </RowStack>

      {/* Bottom Row: Multiplier + Applies to + Status Badge */}
      <RowStack
        justifyContent="space-between"
        sx={{
          background: '#F7F9FB',
          border: '0.67px solid #F0F4F8',
          borderRadius: '14px',
          padding: '0px 16px',
          height: 72,
        }}
      >
        {/* Multiplier */}
        <Stack spacing={'2px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
            }}
          >
            Multiplier
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 800,
              fontSize: pxToRem(20),
              color: isInactive ? '#9CA3AF' : surcharge.multiplierColor,
            }}
          >
            {surcharge.multiplier}
          </Typography>
        </Stack>

        {/* Applies to */}
        <Stack spacing={'2px'} alignItems="flex-end">
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
              textAlign: 'right',
            }}
          >
            Applies to
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12.5),
              color: '#374151',
              textAlign: 'right',
            }}
          >
            {surcharge.appliesTo}
          </Typography>
        </Stack>

        {/* Status Badge */}
        <Box
          sx={{
            padding: '4px 10px',
            borderRadius: '100px',
            background: surcharge.active ? '#ECFDF5' : '#F3F4F6',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11),
              color: surcharge.active ? '#059669' : '#9CA3AF',
            }}
          >
            {surcharge.active ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
      </RowStack>
    </Stack>
  );
};
