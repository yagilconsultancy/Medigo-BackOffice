'use client';

import { useMemo } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Box, Grid, Stack, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
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
import {
  pxToRem,
  useGetConfigKpis,
  useGetCurrentConfig,
  useResolvedApiQuery,
  usePaymentPricingApi,
  CreateRateCardRequest,
} from '../../../common';
import { ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

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

type PricingFormValues = {
  base_fare: number;
  distance_rate: number;
  time_rate: number;
  surge_multiplier: number;
  surge_threshold: number;
  cancellation_fee: number;
  no_show_fee: number;
  minimum_fare: number;
};

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

// ─── Component ──────────────────────────────────────────────────────────────

export const PricingConfigurationPage = () => {
  const { saveConfiguration } = usePaymentPricingApi();
  const { data: kpisData } = useResolvedApiQuery(useGetConfigKpis, null);
  const { data: configData } = useResolvedApiQuery(
    useGetCurrentConfig,
    null
  );

  const initialValues: PricingFormValues = useMemo(() => {
    const config = configData?.config;

    return {
      base_fare: config?.base_fare?.flat_rate ?? 12.0,
      distance_rate: config?.base_fare?.per_km_beyond_threshold ?? 0.75,
      time_rate: config?.wait_time?.per_minute_after_free ?? 0.5,
      surge_multiplier: kpisData?.surge_multiplier ?? 1.0,
      surge_threshold: 85,
      cancellation_fee: kpisData?.cancellation_fee_avg ?? 0,
      no_show_fee: 8.0,
      minimum_fare: config?.base_fare?.flat_rate ?? 12.0,
    };
  }, [configData, kpisData]);

  const handleSubmit = async (
    values: PricingFormValues,
    { setSubmitting }: FormikHelpers<PricingFormValues>
  ) => {
    setSubmitting(true);

    // Build the payload with the nested structure expected by the API
    // Preserve existing config values and only update the fields from the form
    const payload: CreateRateCardRequest = {
      name: configData?.name || 'Global Pricing Configuration',
      config: {
        timezone: configData?.config?.timezone || 'America/Toronto',
        base_fare: {
          flat_rate: values.base_fare,
          distance_threshold_km: configData?.config?.base_fare?.distance_threshold_km || 10.0,
          per_km_beyond_threshold: values.distance_rate,
        },
        fees: configData?.config?.fees || {
          surcharge_flat_per_trip: 0.06,
          insurance_payment_gateway_fee: 1.5,
        },
        wait_time: {
          free_minutes: configData?.config?.wait_time?.free_minutes || 10,
          per_minute_after_free: values.time_rate,
        },
        max_surcharge_cap: configData?.config?.max_surcharge_cap || 18.0,
        platform_fee_percent: configData?.config?.platform_fee_percent || 0.2,
        weather_surcharges: configData?.config?.weather_surcharges || {
          light_snow: 3.0,
          heavy_snow: 5.0,
          post_storm: 3.0,
        },
        rush_hour_surcharges: configData?.config?.rush_hour_surcharges || [],
        time_of_day_surcharges: configData?.config?.time_of_day_surcharges || [],
        weekend_surcharges: configData?.config?.weekend_surcharges || {
          saturday: 3.0,
          sunday: 4.0,
        },
        holiday_surcharge: configData?.config?.holiday_surcharge || 5.0,
        highway_407_tolls: configData?.config?.highway_407_tolls || {
          milton_oakville: 8.0,
          milton_brampton: 9.0,
          milton_mississauga: 10.0,
        },
      },
      notes: configData?.notes,
    };

    await saveConfiguration(payload);
    setSubmitting(false);
  };

  const fareRulesMapping: Record<string, keyof PricingFormValues> = {
    base_fare: 'base_fare',
    distance_rate: 'distance_rate',
    time_rate: 'time_rate',
    surge_multiplier: 'surge_multiplier',
    surge_threshold: 'surge_threshold',
    cancellation_fee: 'cancellation_fee',
    no_show_fee: 'no_show_fee',
    minimum_fare: 'minimum_fare',
  };

  return (
    <AppDashboardLayout>
      <Formik<PricingFormValues>
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, dirty, isSubmitting, setFieldValue }) => (
          <Form>
            <Stack spacing={'24px'}>
              {/* Header */}
              <RowStack justifyContent="space-between">
                <DashboardTitleAndDesc
                  title="Pricing Configuration"
                  desc="Set global fare rules, surge pricing thresholds, and fee structures"
                />
                <AppButton
                  type="submit"
                  variant="contained"
                  disabled={!dirty || isSubmitting}
                  isLoading={isSubmitting}
                  sx={{
                    background: '#2F6FED',
                    borderRadius: '14px',
                    padding: '10px 20px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    '&:hover': { background: '#1E4FD9' },
                    '&.Mui-disabled': {
                      background: '#93B4F5',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  Save Changes
                </AppButton>
              </RowStack>

              {/* Stat Cards */}
              <Grid container spacing={'20px'}>
                {[
                  {
                    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
                    iconBg: '#EBF2FF',
                    value: kpisData?.avg_trip_fare ? `$${kpisData.avg_trip_fare.toFixed(2)}` : '$0.00',
                    label: 'Avg Trip Fare',
                  },
                  {
                    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />,
                    iconBg: '#ECFDF5',
                    value: `$${values.base_fare.toFixed(2)}`,
                    label: 'Base Fare (Global)',
                  },
                  {
                    icon: <BoltOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />,
                    iconBg: '#FFFBEB',
                    value: `${values.surge_multiplier.toFixed(1)}×`,
                    label: 'Surge Multiplier',
                  },
                  {
                    icon: <BlockOutlinedIcon sx={{ fontSize: 20, color: '#EF4444' }} />,
                    iconBg: '#FEF2F2',
                    value: `$${values.cancellation_fee.toFixed(2)}`,
                    label: 'Cancellation Fee',
                  },
                ].map((card, index) => (
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
                  value={values[fareRulesMapping[rule.id]]}
                  onChange={(val) => setFieldValue(fareRulesMapping[rule.id], val)}
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
              type="submit"
              variant="contained"
              disabled={!dirty || isSubmitting}
              isLoading={isSubmitting}
              sx={{
                background: '#2F6FED',
                borderRadius: '14px',
                padding: '10px 24px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: pxToRem(13),
                '&:hover': { background: '#1E4FD9' },
                '&.Mui-disabled': {
                  background: '#93B4F5',
                  color: '#FFFFFF',
                },
              }}
            >
              Save Changes
            </AppButton>
          </RowStack>
        </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
    </AppDashboardLayout>
  );
};
