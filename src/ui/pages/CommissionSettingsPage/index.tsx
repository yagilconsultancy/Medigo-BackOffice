'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  linearProgressClasses,
} from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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

type CommissionSlice = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  color: string;
  defaultValue: number;
};

type StatCard = {
  label: string;
  iconBg: string;
  icon: ReactNode;
};

// ─── Config ─────────────────────────────────────────────────────────────────

const commissionSlices: CommissionSlice[] = [
  {
    id: 'platform',
    title: 'Platform Commission',
    description: 'Medigo\u2019s revenue cut from each completed trip fare',
    icon: <StorefrontOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: 'rgba(47, 111, 237, 0.09)',
    color: '#2F6FED',
    defaultValue: 18,
  },
  {
    id: 'driver',
    title: 'Driver Payout',
    description: 'Driver\u2019s net share paid out per trip after platform cut',
    icon: <DirectionsCarOutlinedIcon sx={{ fontSize: 18, color: '#10B981' }} />,
    iconBg: 'rgba(16, 185, 129, 0.09)',
    color: '#10B981',
    defaultValue: 47,
  },
  {
    id: 'fleet',
    title: 'Fleet Commission',
    description:
      'Fleet partner\u2019s share of each trip assigned through them',
    icon: <BusinessOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
    iconBg: 'rgba(99, 102, 241, 0.09)',
    color: '#6366F1',
    defaultValue: 20,
  },
  {
    id: 'caregiver',
    title: 'Caregiver Payout',
    description:
      'Caregiver\u2019s share for accompanying and assisting the rider',
    icon: (
      <VolunteerActivismOutlinedIcon sx={{ fontSize: 18, color: '#EC4899' }} />
    ),
    iconBg: 'rgba(236, 72, 153, 0.09)',
    color: '#EC4899',
    defaultValue: 10,
  },
  {
    id: 'reserve',
    title: 'Reserve / Buffer',
    description: 'Held in reserve for dispute refunds and chargebacks',
    icon: <SavingsOutlinedIcon sx={{ fontSize: 18, color: '#F59E0B' }} />,
    iconBg: 'rgba(245, 158, 11, 0.09)',
    color: '#F59E0B',
    defaultValue: 5,
  },
];

const statCardsConfig: StatCard[] = [
  {
    label: 'Platform Cut',
    iconBg: '#EBF2FF',
    icon: <StorefrontOutlinedIcon sx={{ fontSize: 19, color: '#2F6FED' }} />,
  },
  {
    label: 'Driver Share',
    iconBg: '#ECFDF5',
    icon: <DirectionsCarOutlinedIcon sx={{ fontSize: 19, color: '#10B981' }} />,
  },
  {
    label: 'Fleet Share',
    iconBg: '#EEF2FF',
    icon: <BusinessOutlinedIcon sx={{ fontSize: 19, color: '#6366F1' }} />,
  },
  {
    label: 'Caregiver Share',
    iconBg: '#FDF2F8',
    icon: (
      <VolunteerActivismOutlinedIcon sx={{ fontSize: 19, color: '#EC4899' }} />
    ),
  },
  {
    label: 'Reserve Buffer',
    iconBg: '#FFFBEB',
    icon: <SavingsOutlinedIcon sx={{ fontSize: 19, color: '#F59E0B' }} />,
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const CommissionSettingsPage = () => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(commissionSlices.map((s) => [s.id, s.defaultValue]))
  );

  const total = Object.values(values).reduce((sum, v) => sum + v, 0);
  const isValid = total === 100;

  const handleValueChange = (id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Commission Settings"
            desc="Configure how each trip fare is split between the platform, drivers, fleets, and reserve"
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
        <Grid container spacing={'12px'}>
          {statCardsConfig.map((card, index) => {
            const sliceId = commissionSlices[index].id;
            const val = values[sliceId];
            return (
              <Grid key={card.label} size={{ xs: 6, lg: 2.4 }}>
                <RowStack
                  spacing={'12px'}
                  sx={{
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
                        fontWeight: 700,
                        fontSize: pxToRem(26),
                        lineHeight: '0.85em',
                        color: '#111827',
                      }}
                    >
                      {val}%
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12),
                        color: '#6B7280',
                      }}
                    >
                      {card.label}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '14px',
                      background: card.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </Box>
                </RowStack>
              </Grid>
            );
          })}
        </Grid>

        {/* Commission Structure Card */}
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
              Commission Structure
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#6B7280',
              }}
            >
              All values must add up to exactly 100% — adjust sliders or input
              fields
            </Typography>
          </Stack>

          {/* Commission Rows */}
          <Stack spacing={'12px'} sx={{ padding: '24px' }}>
            {commissionSlices.map((slice) => (
              <CommissionRow
                key={slice.id}
                slice={slice}
                value={values[slice.id]}
                onChange={(val) => handleValueChange(slice.id, val)}
              />
            ))}

            {/* Validation Row */}
            <RowStack
              justifyContent="space-between"
              sx={{
                background: isValid ? '#EBF2FF' : '#FEF2F2',
                border: `0.67px solid ${isValid ? '#D4E4FF' : '#FECACA'}`,
                borderRadius: '16px',
                padding: '16px 20px',
              }}
            >
              <Stack spacing={'2px'}>
                <RowStack spacing={'6px'}>
                  {isValid ? (
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 16, color: '#2F6FED' }}
                    />
                  ) : (
                    <ErrorOutlineIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                  )}
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13.5),
                      color: isValid ? '#2F6FED' : '#EF4444',
                    }}
                  >
                    {isValid
                      ? '\u2713 Commission structure is valid'
                      : 'Commission structure is invalid'}
                  </Typography>
                </RowStack>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#9CA3AF',
                  }}
                >
                  Adjust the values above until the total reaches 100%
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 800,
                  fontSize: pxToRem(22),
                  color: isValid ? '#2F6FED' : '#EF4444',
                }}
              >
                {total}%
              </Typography>
            </RowStack>
          </Stack>
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const CommissionRow = ({
  slice,
  value,
  onChange,
}: {
  slice: CommissionSlice;
  value: number;
  onChange: (val: number) => void;
}) => (
  <Stack
    spacing={'16px'}
    sx={{
      background: '#F7F9FB',
      border: '0.67px solid #F0F4F8',
      borderRadius: '16px',
      padding: '20px',
    }}
  >
    {/* Top: Icon + Title/Desc + NumberField */}
    <RowStack justifyContent="space-between">
      <RowStack spacing={'16px'}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '14px',
            background: slice.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {slice.icon}
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
            {slice.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: '#9CA3AF',
            }}
          >
            {slice.description}
          </Typography>
        </Stack>
      </RowStack>

      <AppNumberField
        value={value}
        onChange={onChange}
        unit="%"
        step={1}
        decimalPlaces={0}
        min={0}
        max={100}
      />
    </RowStack>

    {/* Progress Bar */}
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 8,
        borderRadius: 100,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: '#E8ECF0',
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 100,
          backgroundColor: slice.color,
        },
      }}
    />
  </Stack>
);
