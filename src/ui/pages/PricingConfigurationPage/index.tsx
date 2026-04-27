'use client';

import { useMemo } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';
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
  base_fare_flat_rate: number;
  distance_threshold_km: number;
  per_km_beyond_threshold: number;
  free_minutes: number;
  per_minute_after_free: number;
  surcharge_flat_per_trip: number;
  insurance_payment_gateway_fee: number;
  max_surcharge_cap: number;
  platform_fee_percent: number;
  holiday_surcharge: number;
  saturday_surcharge: number;
  sunday_surcharge: number;
};

// ─── Fare Rules Config ──────────────────────────────────────────────────────

const fareRulesConfig: FareRule[] = [
  {
    id: 'base_fare_flat_rate',
    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Base Fare',
    description: 'Flat amount charged before distance or time adjustments',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'distance_threshold_km',
    icon: <StraightenOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Distance Threshold',
    description: 'Kilometres included in the base fare',
    unit: 'km',
    step: 1,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'per_km_beyond_threshold',
    icon: <StraightenOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Rate Beyond Threshold',
    description: 'Applied for each kilometre after the threshold',
    unit: 'CAD/km',
    step: 0.1,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'free_minutes',
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Free Wait Time',
    description: 'Minutes included before wait-time charges apply',
    unit: 'min',
    step: 1,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'per_minute_after_free',
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Wait Time After Free Period',
    description: 'Charge applied per minute after free wait time',
    unit: 'CAD/min',
    step: 0.1,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'surcharge_flat_per_trip',
    icon: <SwapVertOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Flat Surcharge Per Trip',
    description: 'Administrative surcharge added to each trip',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'insurance_payment_gateway_fee',
    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Insurance Payment Gateway Fee',
    description: 'Fixed fee charged for insurance payment processing',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'max_surcharge_cap',
    icon: <PercentOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Maximum Surcharge Cap',
    description: 'Upper limit for accumulated surcharges',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'platform_fee_percent',
    icon: <PercentOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Platform Fee Percent',
    description: 'Platform cut expressed as a decimal ratio',
    unit: 'ratio',
    step: 0.01,
    decimalPlaces: 2,
    min: 0,
    max: 1,
  },
  {
    id: 'holiday_surcharge',
    icon: <PercentOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Holiday Surcharge',
    description: 'Additional amount applied on public holidays',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'saturday_surcharge',
    icon: <PercentOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Saturday Surcharge',
    description: 'Weekend uplift applied on Saturdays',
    unit: 'CAD',
    step: 0.5,
    decimalPlaces: 2,
    min: 0,
  },
  {
    id: 'sunday_surcharge',
    icon: <PercentOutlinedIcon sx={{ fontSize: 17, color: '#2F6FED' }} />,
    title: 'Sunday Surcharge',
    description: 'Weekend uplift applied on Sundays',
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
  const { data: configData } = useResolvedApiQuery(useGetCurrentConfig, null);

  const initialValues: PricingFormValues = useMemo(() => {
    const config = configData?.config;

    return {
      base_fare_flat_rate: config?.base_fare?.flat_rate ?? 21.0,
      distance_threshold_km: config?.base_fare?.distance_threshold_km ?? 10.0,
      per_km_beyond_threshold:
        config?.base_fare?.per_km_beyond_threshold ?? 0.75,
      free_minutes: config?.wait_time?.free_minutes ?? 10,
      per_minute_after_free: config?.wait_time?.per_minute_after_free ?? 0.5,
      surcharge_flat_per_trip: config?.fees?.surcharge_flat_per_trip ?? 0.06,
      insurance_payment_gateway_fee:
        config?.fees?.insurance_payment_gateway_fee ?? 1.5,
      max_surcharge_cap: config?.max_surcharge_cap ?? 18.0,
      platform_fee_percent: config?.platform_fee_percent ?? 0.2,
      holiday_surcharge: config?.holiday_surcharge ?? 5.0,
      saturday_surcharge: config?.weekend_surcharges?.saturday ?? 3.0,
      sunday_surcharge: config?.weekend_surcharges?.sunday ?? 4.0,
    };
  }, [configData]);

  const handleSubmit = async (
    values: PricingFormValues,
    { setSubmitting }: FormikHelpers<PricingFormValues>
  ) => {
    setSubmitting(true);

    try {
      // Build the payload with the nested structure expected by the API.
      // Preserve existing config values and only update the fields from the form.
      const payload: CreateRateCardRequest = {
        name: configData?.name || 'Global Pricing Configuration',
        config: {
          timezone: configData?.config?.timezone || 'America/Toronto',
          base_fare: {
            flat_rate: values.base_fare_flat_rate,
            distance_threshold_km: values.distance_threshold_km,
            per_km_beyond_threshold: values.per_km_beyond_threshold,
          },
          fees: {
            surcharge_flat_per_trip: values.surcharge_flat_per_trip,
            insurance_payment_gateway_fee: values.insurance_payment_gateway_fee,
          },
          wait_time: {
            free_minutes: values.free_minutes,
            per_minute_after_free: values.per_minute_after_free,
          },
          max_surcharge_cap: values.max_surcharge_cap,
          platform_fee_percent: values.platform_fee_percent,
          weather_surcharges: configData?.config?.weather_surcharges || {
            light_snow: 3.0,
            heavy_snow: 5.0,
            post_storm: 3.0,
          },
          rush_hour_surcharges: configData?.config?.rush_hour_surcharges || [],
          time_of_day_surcharges:
            configData?.config?.time_of_day_surcharges || [],
          weekend_surcharges: {
            saturday: values.saturday_surcharge,
            sunday: values.sunday_surcharge,
          },
          holiday_surcharge: values.holiday_surcharge,
          highway_407_tolls: configData?.config?.highway_407_tolls || {
            milton_oakville: 8.0,
            milton_brampton: 9.0,
            milton_mississauga: 10.0,
          },
        },
        notes: configData?.notes,
      };

      await saveConfiguration(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const weatherSurcharges = configData?.config?.weather_surcharges;
  const rushHourSurcharges = configData?.config?.rush_hour_surcharges ?? [];
  const timeOfDaySurcharges = configData?.config?.time_of_day_surcharges ?? [];
  const highwayTolls = configData?.config?.highway_407_tolls;
  const weekendSurcharges = configData?.config?.weekend_surcharges;

  const fareRulesMapping: Record<string, keyof PricingFormValues> = {
    base_fare_flat_rate: 'base_fare_flat_rate',
    distance_threshold_km: 'distance_threshold_km',
    per_km_beyond_threshold: 'per_km_beyond_threshold',
    free_minutes: 'free_minutes',
    per_minute_after_free: 'per_minute_after_free',
    surcharge_flat_per_trip: 'surcharge_flat_per_trip',
    insurance_payment_gateway_fee: 'insurance_payment_gateway_fee',
    max_surcharge_cap: 'max_surcharge_cap',
    platform_fee_percent: 'platform_fee_percent',
    holiday_surcharge: 'holiday_surcharge',
    saturday_surcharge: 'saturday_surcharge',
    sunday_surcharge: 'sunday_surcharge',
  };

  const formatDays = (days?: number[] | null) => {
    if (!days || days.length === 0) return 'All days';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day) => dayNames[day] ?? String(day)).join(', ');
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
                  desc="Set base fare, wait time, fees, caps, and surcharge schedules for the active rate card"
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
                    icon: (
                      <AttachMoneyOutlinedIcon
                        sx={{ fontSize: 20, color: '#2F6FED' }}
                      />
                    ),
                    iconBg: '#EBF2FF',
                    value:
                      kpisData?.avg_trip_fare != null
                        ? `$${Number(kpisData.avg_trip_fare).toFixed(2)}`
                        : '$0.00',
                    label: 'Avg Trip Fare',
                  },
                  {
                    icon: (
                      <AttachMoneyOutlinedIcon
                        sx={{ fontSize: 20, color: '#10B981' }}
                      />
                    ),
                    iconBg: '#ECFDF5',
                    value:
                      kpisData?.base_fare != null
                        ? `$${Number(kpisData.base_fare).toFixed(2)}`
                        : '$0.00',
                    label: 'Base Fare KPI',
                  },
                  {
                    icon: (
                      <PercentOutlinedIcon
                        sx={{ fontSize: 20, color: '#F59E0B' }}
                      />
                    ),
                    iconBg: '#FFFBEB',
                    value:
                      kpisData?.surge_multiplier != null
                        ? `${Number(kpisData.surge_multiplier).toFixed(1)}×`
                        : '1.0×',
                    label: 'Surge Multiplier',
                  },
                  {
                    icon: (
                      <AttachMoneyOutlinedIcon
                        sx={{ fontSize: 20, color: '#EF4444' }}
                      />
                    ),
                    iconBg: '#FEF2F2',
                    value:
                      kpisData?.cancellation_fee_avg != null
                        ? `$${Number(kpisData.cancellation_fee_avg).toFixed(2)}`
                        : '$0.00',
                    label: 'Cancellation Fee Avg',
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
                    Adjust values and click Save Changes — affects all ride
                    types globally
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
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(13.5),
                              color: '#111827',
                            }}
                          >
                            {rule.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
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
                        onChange={(val) =>
                          setFieldValue(fareRulesMapping[rule.id], val)
                        }
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
                    Changes apply globally to all ride types unless overridden
                    per ride type
                  </Typography>
                  {/* <AppButton
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
                  </AppButton> */}
                </RowStack>
              </Stack>

              {/* <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                  padding: '24px',
                  gap: '20px',
                }}
              >
                <Stack spacing={'4px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 500,
                      fontSize: pxToRem(18),
                      color: '#111827',
                    }}
                  >
                    Active Surcharge Schedule
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(13),
                      color: '#6B7280',
                    }}
                  >
                    Read-only values mirrored from the current API response
                  </Typography>
                </Stack>

                <Grid container spacing={'16px'}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={'10px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        Weather Surcharges
                      </Typography>
                      <RowStack sx={{ flexWrap: 'wrap', gap: '8px' }}>
                        {Object.entries(weatherSurcharges ?? {}).map(
                          ([name, value]) => (
                            <Chip
                              key={name}
                              label={`${name.replaceAll('_', ' ')}: $${Number(
                                value
                              ).toFixed(2)}`}
                              sx={{
                                background: '#F7F9FB',
                                color: '#111827',
                                fontWeight: 600,
                              }}
                            />
                          )
                        )}
                      </RowStack>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={'10px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        Weekend Surcharges
                      </Typography>
                      <RowStack sx={{ flexWrap: 'wrap', gap: '8px' }}>
                        {weekendSurcharges &&
                          Object.entries(weekendSurcharges).map(
                            ([name, value]) => (
                              <Chip
                                key={name}
                                label={`${name}: $${Number(value).toFixed(2)}`}
                                sx={{
                                  background: '#F7F9FB',
                                  color: '#111827',
                                  fontWeight: 600,
                                }}
                              />
                            )
                          )}
                      </RowStack>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={'10px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        Rush Hour Surcharges
                      </Typography>
                      <Stack spacing={'8px'}>
                        {rushHourSurcharges.length > 0 ? (
                          rushHourSurcharges.map((item) => (
                            <Typography
                              key={item.name}
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontSize: pxToRem(12.5),
                                color: '#4B5563',
                              }}
                            >
                              {item.name.replaceAll('_', ' ')}: $
                              {item.amount.toFixed(2)} on{' '}
                              {formatDays(item.days)} between {item.start} and{' '}
                              {item.end}
                            </Typography>
                          ))
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontSize: pxToRem(12.5),
                              color: '#9CA3AF',
                            }}
                          >
                            No rush hour surcharges configured
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={'10px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        Time of Day Surcharges
                      </Typography>
                      <Stack spacing={'8px'}>
                        {timeOfDaySurcharges.length > 0 ? (
                          timeOfDaySurcharges.map((item) => (
                            <Typography
                              key={item.name}
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontSize: pxToRem(12.5),
                                color: '#4B5563',
                              }}
                            >
                              {item.name.replaceAll('_', ' ')}: $
                              {item.amount.toFixed(2)} between {item.start} and{' '}
                              {item.end}
                            </Typography>
                          ))
                        ) : (
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontSize: pxToRem(12.5),
                              color: '#9CA3AF',
                            }}
                          >
                            No time of day surcharges configured
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Stack spacing={'10px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        Highway 407 Tolls
                      </Typography>
                      <RowStack sx={{ flexWrap: 'wrap', gap: '8px' }}>
                        {highwayTolls &&
                          Object.entries(highwayTolls).map(([name, value]) => (
                            <Chip
                              key={name}
                              label={`${name.replaceAll('_', ' ')}: $${Number(
                                value
                              ).toFixed(2)}`}
                              sx={{
                                background: '#F7F9FB',
                                color: '#111827',
                                fontWeight: 600,
                              }}
                            />
                          ))}
                      </RowStack>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack> */}
            </Stack>
          </Form>
        )}
      </Formik>
    </AppDashboardLayout>
  );
};
