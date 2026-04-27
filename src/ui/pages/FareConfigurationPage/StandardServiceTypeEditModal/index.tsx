'use client';

import { useMemo } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import {
  AppButton,
  AppModal,
  FormikAppTextField,
  RowStack,
} from '../../../modules/components';
import {
  pxToRem,
  usePaymentPricingApi,
  resolveRoute,
  ROUTES,
  ServiceTypeConfigResponse,
} from '../../../../common';

type StandardServiceTypeFormValues = {
  name: string;
  rate_components: {
    base_fare: string;
    surcharge_flat: string;
    max_surcharge_cap: string;
    wait_time_per_min: string;
    per_km_beyond_10km: string;
    base_fare_above_10km: string;
    insurance_gateway_fee: string;
    free_wait_time_minutes: string;
  };
  distance_rules: {
    description: string;
    per_km_rate: string;
    base_distance_km: string;
  };
  rules_and_caps: {
    applies_per_trip: string;
    max_surcharge_cap: string;
    surcharge_stacking: string;
  };
  surcharges: {
    weather: Array<{
      trigger: string;
      condition: string;
      surcharge: string;
    }>;
    rush_hour: Array<{
      days: string;
      period: string;
      surcharge: string;
    }>;
    time_based: Array<{
      period: string;
      surcharge: string;
    }>;
    weekend_holiday: Array<{
      day: string;
      surcharge: string;
    }>;
  };
  toll_charges: Record<
    string,
    {
      surcharge: string;
      estimated_toll: string;
    }
  >;
  route_pricing: Record<
    string,
    {
      label: string;
      base_fare: string;
      other_fees: string;
      distance_km: string;
      typical_total: string;
      avg_wait_charge: string;
    }
  >;
  dialysis_discounts: {
    description: string;
  };
  notes: string;
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
});

type StandardServiceTypeEditModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  configData: ServiceTypeConfigResponse | null;
};

const toStringValue = (value: unknown) =>
  value === null || value === undefined ? '' : String(value);

const toInitialArray = <T extends Record<string, any>>(
  values: T[] | undefined,
  templateKeys: Array<keyof T>
) =>
  (values ?? []).map((item) =>
    templateKeys.reduce(
      (acc, key) => {
        acc[key] = toStringValue(item?.[key]);
        return acc;
      },
      {} as Record<keyof T, string>
    )
  );

const toInitialValues = (
  configData: ServiceTypeConfigResponse | null
): StandardServiceTypeFormValues => {
  const config = configData?.config ?? {};
  const rateComponents = config.rate_components ?? {};
  const distanceRules = config.distance_rules ?? {};
  const rulesAndCaps = config.rules_and_caps ?? {};
  const surcharges = config.surcharges ?? {};
  const tollCharges = config.toll_charges ?? {};
  const routePricing = config.route_pricing ?? {};
  const dialysisDiscounts = config.dialysis_discounts ?? {};

  return {
    name: configData?.display_name || configData?.service_type || '',
    rate_components: {
      base_fare: toStringValue(rateComponents.base_fare),
      surcharge_flat: toStringValue(rateComponents.surcharge_flat),
      max_surcharge_cap: toStringValue(rateComponents.max_surcharge_cap),
      wait_time_per_min: toStringValue(rateComponents.wait_time_per_min),
      per_km_beyond_10km: toStringValue(rateComponents.per_km_beyond_10km),
      base_fare_above_10km: toStringValue(rateComponents.base_fare_above_10km),
      insurance_gateway_fee: toStringValue(
        rateComponents.insurance_gateway_fee
      ),
      free_wait_time_minutes: toStringValue(
        rateComponents.free_wait_time_minutes
      ),
    },
    distance_rules: {
      description: toStringValue(distanceRules.description),
      per_km_rate: toStringValue(distanceRules.per_km_rate),
      base_distance_km: toStringValue(distanceRules.base_distance_km),
    },
    rules_and_caps: {
      applies_per_trip: toStringValue(rulesAndCaps.applies_per_trip),
      max_surcharge_cap: toStringValue(rulesAndCaps.max_surcharge_cap),
      surcharge_stacking: toStringValue(rulesAndCaps.surcharge_stacking),
    },
    surcharges: {
      weather: toInitialArray(surcharges.weather, [
        'trigger',
        'condition',
        'surcharge',
      ]),
      rush_hour: toInitialArray(surcharges.rush_hour, [
        'days',
        'period',
        'surcharge',
      ]),
      time_based: toInitialArray(surcharges.time_based, [
        'period',
        'surcharge',
      ]),
      weekend_holiday: toInitialArray(surcharges.weekend_holiday, [
        'day',
        'surcharge',
      ]),
    },
    toll_charges: Object.entries(tollCharges as Record<string, any>).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          surcharge: toStringValue(value?.surcharge),
          estimated_toll: toStringValue(value?.estimated_toll),
        };
        return acc;
      },
      {} as StandardServiceTypeFormValues['toll_charges']
    ),
    route_pricing: Object.entries(routePricing as Record<string, any>).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          label: toStringValue(value?.label),
          base_fare: toStringValue(value?.base_fare),
          other_fees: toStringValue(value?.other_fees),
          distance_km: toStringValue(value?.distance_km),
          typical_total: toStringValue(value?.typical_total),
          avg_wait_charge: toStringValue(value?.avg_wait_charge),
        };
        return acc;
      },
      {} as StandardServiceTypeFormValues['route_pricing']
    ),
    dialysis_discounts: {
      description: toStringValue(dialysisDiscounts.description),
    },
    notes: '',
  };
};

const toNumberOrExisting = (value: string, existing: unknown) =>
  value.trim() === '' ? existing : Number(value);

const toBooleanOrExisting = (value: string, existing: unknown) => {
  if (value.trim() === '') return existing;
  return value.toLowerCase() === 'true';
};

export const StandardServiceTypeEditModal = ({
  open,
  setOpen,
  configData,
}: StandardServiceTypeEditModalProps) => {
  const queryClient = useQueryClient();
  const { updateServiceTypeConfig } = usePaymentPricingApi();

  const initialValues = useMemo(
    () => toInitialValues(configData),
    [configData]
  );
  const routeKeys = useMemo(
    () => Object.keys(configData?.config?.route_pricing ?? {}),
    [configData]
  );
  const tollKeys = useMemo(
    () => Object.keys(configData?.config?.toll_charges ?? {}),
    [configData]
  );

  const handleSubmit = async (
    values: StandardServiceTypeFormValues,
    { setSubmitting }: FormikHelpers<StandardServiceTypeFormValues>
  ) => {
    if (!configData) {
      setSubmitting(false);
      return;
    }

    const existingConfig = configData.config ?? {};
    const payload = {
      name: values.name,
      config: {
        ...existingConfig,
        rate_components: {
          ...(existingConfig.rate_components ?? {}),
          base_fare: toNumberOrExisting(
            values.rate_components.base_fare,
            existingConfig.rate_components?.base_fare
          ),
          surcharge_flat: toNumberOrExisting(
            values.rate_components.surcharge_flat,
            existingConfig.rate_components?.surcharge_flat
          ),
          max_surcharge_cap: toNumberOrExisting(
            values.rate_components.max_surcharge_cap,
            existingConfig.rate_components?.max_surcharge_cap
          ),
          wait_time_per_min: toNumberOrExisting(
            values.rate_components.wait_time_per_min,
            existingConfig.rate_components?.wait_time_per_min
          ),
          per_km_beyond_10km: toNumberOrExisting(
            values.rate_components.per_km_beyond_10km,
            existingConfig.rate_components?.per_km_beyond_10km
          ),
          base_fare_above_10km: toNumberOrExisting(
            values.rate_components.base_fare_above_10km,
            existingConfig.rate_components?.base_fare_above_10km
          ),
          insurance_gateway_fee: toNumberOrExisting(
            values.rate_components.insurance_gateway_fee,
            existingConfig.rate_components?.insurance_gateway_fee
          ),
          free_wait_time_minutes: toNumberOrExisting(
            values.rate_components.free_wait_time_minutes,
            existingConfig.rate_components?.free_wait_time_minutes
          ),
        },
        distance_rules: {
          ...(existingConfig.distance_rules ?? {}),
          description:
            values.distance_rules.description.trim() === ''
              ? existingConfig.distance_rules?.description
              : values.distance_rules.description,
          per_km_rate: toNumberOrExisting(
            values.distance_rules.per_km_rate,
            existingConfig.distance_rules?.per_km_rate
          ),
          base_distance_km: toNumberOrExisting(
            values.distance_rules.base_distance_km,
            existingConfig.distance_rules?.base_distance_km
          ),
        },
        rules_and_caps: {
          ...(existingConfig.rules_and_caps ?? {}),
          applies_per_trip: toBooleanOrExisting(
            values.rules_and_caps.applies_per_trip,
            existingConfig.rules_and_caps?.applies_per_trip
          ),
          max_surcharge_cap: toNumberOrExisting(
            values.rules_and_caps.max_surcharge_cap,
            existingConfig.rules_and_caps?.max_surcharge_cap
          ),
          surcharge_stacking: toBooleanOrExisting(
            values.rules_and_caps.surcharge_stacking,
            existingConfig.rules_and_caps?.surcharge_stacking
          ),
        },
        surcharges: {
          ...(existingConfig.surcharges ?? {}),
          weather: (configData.config.surcharges?.weather ?? []).map(
            (item: any, index: number) => ({
              ...item,
              trigger:
                values.surcharges.weather[index]?.trigger?.trim() === ''
                  ? item.trigger
                  : values.surcharges.weather[index]?.trigger,
              condition:
                values.surcharges.weather[index]?.condition?.trim() === ''
                  ? item.condition
                  : values.surcharges.weather[index]?.condition,
              surcharge: toNumberOrExisting(
                values.surcharges.weather[index]?.surcharge ?? '',
                item.surcharge
              ),
            })
          ),
          rush_hour: (configData.config.surcharges?.rush_hour ?? []).map(
            (item: any, index: number) => ({
              ...item,
              days:
                values.surcharges.rush_hour[index]?.days?.trim() === ''
                  ? item.days
                  : values.surcharges.rush_hour[index]?.days,
              period:
                values.surcharges.rush_hour[index]?.period?.trim() === ''
                  ? item.period
                  : values.surcharges.rush_hour[index]?.period,
              surcharge: toNumberOrExisting(
                values.surcharges.rush_hour[index]?.surcharge ?? '',
                item.surcharge
              ),
            })
          ),
          time_based: (configData.config.surcharges?.time_based ?? []).map(
            (item: any, index: number) => ({
              ...item,
              period:
                values.surcharges.time_based[index]?.period?.trim() === ''
                  ? item.period
                  : values.surcharges.time_based[index]?.period,
              surcharge: toNumberOrExisting(
                values.surcharges.time_based[index]?.surcharge ?? '',
                item.surcharge
              ),
            })
          ),
          weekend_holiday: (
            configData.config.surcharges?.weekend_holiday ?? []
          ).map((item: any, index: number) => ({
            ...item,
            day:
              values.surcharges.weekend_holiday[index]?.day?.trim() === ''
                ? item.day
                : values.surcharges.weekend_holiday[index]?.day,
            surcharge: toNumberOrExisting(
              values.surcharges.weekend_holiday[index]?.surcharge ?? '',
              item.surcharge
            ),
          })),
        },
        toll_charges: tollKeys.reduce(
          (acc, key) => {
            const existing = existingConfig.toll_charges?.[key] ?? {};
            acc[key] = {
              ...existing,
              surcharge: toNumberOrExisting(
                values.toll_charges[key]?.surcharge ?? '',
                existing.surcharge
              ),
              estimated_toll:
                values.toll_charges[key]?.estimated_toll?.trim() === ''
                  ? existing.estimated_toll
                  : values.toll_charges[key]?.estimated_toll,
            };
            return acc;
          },
          {} as Record<string, any>
        ),
        route_pricing: routeKeys.reduce(
          (acc, key) => {
            const existing = existingConfig.route_pricing?.[key] ?? {};
            acc[key] = {
              ...existing,
              label:
                values.route_pricing[key]?.label?.trim() === ''
                  ? existing.label
                  : values.route_pricing[key]?.label,
              base_fare: toNumberOrExisting(
                values.route_pricing[key]?.base_fare ?? '',
                existing.base_fare
              ),
              other_fees: toNumberOrExisting(
                values.route_pricing[key]?.other_fees ?? '',
                existing.other_fees
              ),
              distance_km: toNumberOrExisting(
                values.route_pricing[key]?.distance_km ?? '',
                existing.distance_km
              ),
              typical_total: toNumberOrExisting(
                values.route_pricing[key]?.typical_total ?? '',
                existing.typical_total
              ),
              avg_wait_charge: toNumberOrExisting(
                values.route_pricing[key]?.avg_wait_charge ?? '',
                existing.avg_wait_charge
              ),
            };
            return acc;
          },
          {} as Record<string, any>
        ),
        dialysis_discounts: {
          ...(existingConfig.dialysis_discounts ?? {}),
          description:
            values.dialysis_discounts.description.trim() === ''
              ? existingConfig.dialysis_discounts?.description
              : values.dialysis_discounts.description,
        },
      },
      notes: values.notes || undefined,
    };

    setSubmitting(true);
    const serviceType = configData.service_type;
    const success = await updateServiceTypeConfig(serviceType, payload as any);
    setSubmitting(false);

    if (success) {
      setOpen(false);
      await queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getServiceTypeConfig, serviceType)],
      });
    }
  };

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="edit-standard-config"
      padding="0"
      sx={{
        '& .MuiDialog-paper': {
          width: '1100px',
        },
      }}
    >
      <Formik<StandardServiceTypeFormValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack>
              <Box
                sx={{
                  padding: '24px',
                  borderBottom: '1px solid #F0F4F8',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(20),
                    color: '#111827',
                  }}
                >
                  Edit Standard Fare Configuration
                </Typography>
              </Box>

              <Box sx={{ padding: '24px' }}>
                <Stack spacing="24px">
                  <Grid container spacing="16px">
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormikAppTextField name="name" label="Name" required />
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(15),
                        color: '#111827',
                        mb: '12px',
                      }}
                    >
                      Rate Components
                    </Typography>
                    <Grid container spacing="16px">
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rate_components.base_fare"
                          label="Base Fare"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rate_components.surcharge_flat"
                          label="Surcharge Flat"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rate_components.max_surcharge_cap"
                          label="Max Surcharge Cap"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rate_components.wait_time_per_min"
                          label="Wait Time Per Min"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rate_components.per_km_beyond_10km"
                          label="Per Km Beyond 10km"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rate_components.base_fare_above_10km"
                          label="Base Fare Above 10km"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rate_components.insurance_gateway_fee"
                          label="Insurance Gateway Fee"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rate_components.free_wait_time_minutes"
                          label="Free Wait Time Minutes"
                          type="number"
                          inputProps={{ min: 0, step: 1 }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(15),
                        color: '#111827',
                        mb: '12px',
                      }}
                    >
                      Distance Rules
                    </Typography>
                    <Grid container spacing="16px">
                      <Grid size={{ xs: 12 }}>
                        <FormikAppTextField
                          name="distance_rules.description"
                          label="Description"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormikAppTextField
                          name="distance_rules.per_km_rate"
                          label="Per Km Rate"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormikAppTextField
                          name="distance_rules.base_distance_km"
                          label="Base Distance Km"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(15),
                        color: '#111827',
                        mb: '12px',
                      }}
                    >
                      Rules & Caps
                    </Typography>
                    <Grid container spacing="16px">
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rules_and_caps.applies_per_trip"
                          label="Applies Per Trip"
                          helperText="Enter true or false"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rules_and_caps.max_surcharge_cap"
                          label="Max Surcharge Cap"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rules_and_caps.surcharge_stacking"
                          label="Surcharge Stacking"
                          helperText="Enter true or false"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(15),
                        color: '#111827',
                        mb: '12px',
                      }}
                    >
                      Surcharges
                    </Typography>
                    <Stack spacing="20px">
                      <Box
                        sx={{
                          border: '1px solid #E8ECF0',
                          borderRadius: '14px',
                          padding: '16px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(13),
                            color: '#111827',
                            mb: '12px',
                          }}
                        >
                          Weather
                        </Typography>
                        <Stack spacing="16px">
                          {initialValues.surcharges.weather.map((_, index) => (
                            <Grid container spacing="16px" key={index}>
                              <Grid size={{ xs: 12, md: 4 }}>
                                <FormikAppTextField
                                  name={`surcharges.weather.${index}.trigger`}
                                  label={`Trigger ${index + 1}`}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 4 }}>
                                <FormikAppTextField
                                  name={`surcharges.weather.${index}.condition`}
                                  label={`Condition ${index + 1}`}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, md: 4 }}>
                                <FormikAppTextField
                                  name={`surcharges.weather.${index}.surcharge`}
                                  label={`Surcharge ${index + 1}`}
                                  type="number"
                                  inputProps={{ min: 0, step: 0.01 }}
                                />
                              </Grid>
                            </Grid>
                          ))}
                        </Stack>
                      </Box>

                      <Box
                        sx={{
                          border: '1px solid #E8ECF0',
                          borderRadius: '14px',
                          padding: '16px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(13),
                            color: '#111827',
                            mb: '12px',
                          }}
                        >
                          Rush Hour
                        </Typography>
                        <Stack spacing="16px">
                          {initialValues.surcharges.rush_hour.map(
                            (_, index) => (
                              <Grid container spacing="16px" key={index}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <FormikAppTextField
                                    name={`surcharges.rush_hour.${index}.days`}
                                    label={`Days ${index + 1}`}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <FormikAppTextField
                                    name={`surcharges.rush_hour.${index}.period`}
                                    label={`Period ${index + 1}`}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <FormikAppTextField
                                    name={`surcharges.rush_hour.${index}.surcharge`}
                                    label={`Surcharge ${index + 1}`}
                                    type="number"
                                    inputProps={{ min: 0, step: 0.01 }}
                                  />
                                </Grid>
                              </Grid>
                            )
                          )}
                        </Stack>
                      </Box>

                      <Box
                        sx={{
                          border: '1px solid #E8ECF0',
                          borderRadius: '14px',
                          padding: '16px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(13),
                            color: '#111827',
                            mb: '12px',
                          }}
                        >
                          Time Based
                        </Typography>
                        <Stack spacing="16px">
                          {initialValues.surcharges.time_based.map(
                            (_, index) => (
                              <Grid container spacing="16px" key={index}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <FormikAppTextField
                                    name={`surcharges.time_based.${index}.period`}
                                    label={`Period ${index + 1}`}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <FormikAppTextField
                                    name={`surcharges.time_based.${index}.surcharge`}
                                    label={`Surcharge ${index + 1}`}
                                    type="number"
                                    inputProps={{ min: 0, step: 0.01 }}
                                  />
                                </Grid>
                              </Grid>
                            )
                          )}
                        </Stack>
                      </Box>

                      <Box
                        sx={{
                          border: '1px solid #E8ECF0',
                          borderRadius: '14px',
                          padding: '16px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(13),
                            color: '#111827',
                            mb: '12px',
                          }}
                        >
                          Weekend Holiday
                        </Typography>
                        <Stack spacing="16px">
                          {initialValues.surcharges.weekend_holiday.map(
                            (_, index) => (
                              <Grid container spacing="16px" key={index}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <FormikAppTextField
                                    name={`surcharges.weekend_holiday.${index}.day`}
                                    label={`Day ${index + 1}`}
                                  />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <FormikAppTextField
                                    name={`surcharges.weekend_holiday.${index}.surcharge`}
                                    label={`Surcharge ${index + 1}`}
                                    type="number"
                                    inputProps={{ min: 0, step: 0.01 }}
                                  />
                                </Grid>
                              </Grid>
                            )
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(15),
                        color: '#111827',
                        mb: '12px',
                      }}
                    >
                      Toll Charges
                    </Typography>
                    <Stack spacing="16px">
                      {tollKeys.map((key) => (
                        <Box
                          key={key}
                          sx={{
                            border: '1px solid #E8ECF0',
                            borderRadius: '14px',
                            padding: '16px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 700,
                              fontSize: pxToRem(13),
                              color: '#111827',
                              mb: '12px',
                            }}
                          >
                            {key.replaceAll('_', ' ')}
                          </Typography>
                          <Grid container spacing="16px">
                            <Grid size={{ xs: 12, md: 6 }}>
                              <FormikAppTextField
                                name={`toll_charges.${key}.surcharge`}
                                label="Surcharge"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <FormikAppTextField
                                name={`toll_charges.${key}.estimated_toll`}
                                label="Estimated Toll"
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(15),
                        color: '#111827',
                        mb: '12px',
                      }}
                    >
                      Route Pricing
                    </Typography>
                    <Stack spacing="16px">
                      {routeKeys.map((key) => (
                        <Box
                          key={key}
                          sx={{
                            border: '1px solid #E8ECF0',
                            borderRadius: '14px',
                            padding: '16px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 700,
                              fontSize: pxToRem(13),
                              color: '#111827',
                              mb: '12px',
                            }}
                          >
                            {key.replaceAll('_', ' ')}
                          </Typography>
                          <Grid container spacing="16px">
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${key}.label`}
                                label="Label"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${key}.base_fare`}
                                label="Base Fare"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${key}.other_fees`}
                                label="Other Fees"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${key}.distance_km`}
                                label="Distance Km"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${key}.typical_total`}
                                label="Typical Total"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${key}.avg_wait_charge`}
                                label="Avg Wait Charge"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(15),
                        color: '#111827',
                        mb: '12px',
                      }}
                    >
                      Dialysis Discounts
                    </Typography>
                    <FormikAppTextField
                      name="dialysis_discounts.description"
                      label="Description"
                      multiline
                      rows={4}
                    />
                  </Box>

                  <FormikAppTextField
                    name="notes"
                    label="Notes"
                    multiline
                    rows={3}
                  />
                </Stack>
              </Box>

              <Box
                sx={{
                  padding: '16px 24px',
                  borderTop: '1px solid #F0F4F8',
                }}
              >
                <RowStack justifyContent="flex-end" spacing="12px">
                  <AppButton
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </AppButton>
                  <AppButton
                    type="submit"
                    variant="contained"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </AppButton>
                </RowStack>
              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
};
