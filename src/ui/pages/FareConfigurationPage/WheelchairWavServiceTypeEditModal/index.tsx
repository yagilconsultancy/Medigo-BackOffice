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

type RoutePricingForm = {
  label: string;
  wait: string;
  total: string;
  other_fees: string;
  base_access: string;
  distance_km: string;
  min_protected: string;
};

type CommissionBreakdownForm = {
  total: string;
  medigo_18: string;
  vendor_82: string;
};

type WheelchairConfigFormValues = {
  name: string;
  platform_commission: string;
  vendor_terms: {
    onboarding_fee: string;
    commission_percent: string;
    certification_required: string;
    accessibility_fee_passthrough: string;
    off_platform_restriction_months: string;
  };
  rate_components: {
    base_fare: string;
    surcharge_flat: string;
    accessibility_fee: string;
    max_surcharge_cap: string;
    wait_time_per_min: string;
    per_km_beyond_10km: string;
    insurance_gateway_fee: string;
    free_wait_time_minutes: string;
    minimum_fare_protection: string;
  };
  route_pricing: Record<string, RoutePricingForm>;
  commission_breakdown: Record<string, CommissionBreakdownForm>;
  notes: string;
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  platform_commission: Yup.number()
    .min(0, 'Platform commission must be at least 0')
    .max(1, 'Platform commission must be 1 or less')
    .required('Platform commission is required'),
  vendor_terms: Yup.object({
    onboarding_fee: Yup.number().min(0).required(),
    commission_percent: Yup.number().min(0).required(),
    certification_required: Yup.string().required(),
    accessibility_fee_passthrough: Yup.string().required(),
    off_platform_restriction_months: Yup.number().min(0).required(),
  }),
  rate_components: Yup.object({
    base_fare: Yup.number().min(0).required(),
    surcharge_flat: Yup.number().min(0).required(),
    accessibility_fee: Yup.number().min(0).required(),
    max_surcharge_cap: Yup.number().min(0).required(),
    wait_time_per_min: Yup.number().min(0).required(),
    per_km_beyond_10km: Yup.number().min(0).required(),
    insurance_gateway_fee: Yup.number().min(0).required(),
    free_wait_time_minutes: Yup.number().min(0).required(),
    minimum_fare_protection: Yup.number().min(0).required(),
  }),
  notes: Yup.string(),
});

type WheelchairWavServiceTypeEditModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  configData: ServiceTypeConfigResponse | null;
};

const toStringValue = (value: unknown) =>
  value === null || value === undefined ? '' : String(value);

const toInitialValues = (
  configData: ServiceTypeConfigResponse | null
): WheelchairConfigFormValues => {
  const config = configData?.config ?? {};
  const vendorTerms = config.vendor_terms ?? {};
  const routePricing = config.route_pricing ?? {};
  const rateComponents = config.rate_components ?? {};
  const commissionBreakdown = config.commission_breakdown ?? {};

  return {
    name: configData?.display_name || configData?.service_type || '',
    platform_commission: toStringValue(config.platform_commission),
    vendor_terms: {
      onboarding_fee: toStringValue(vendorTerms.onboarding_fee),
      commission_percent: toStringValue(vendorTerms.commission_percent),
      certification_required: toStringValue(vendorTerms.certification_required),
      accessibility_fee_passthrough: toStringValue(
        vendorTerms.accessibility_fee_passthrough
      ),
      off_platform_restriction_months: toStringValue(
        vendorTerms.off_platform_restriction_months
      ),
    },
    rate_components: {
      base_fare: toStringValue(rateComponents.base_fare),
      surcharge_flat: toStringValue(rateComponents.surcharge_flat),
      accessibility_fee: toStringValue(rateComponents.accessibility_fee),
      max_surcharge_cap: toStringValue(rateComponents.max_surcharge_cap),
      wait_time_per_min: toStringValue(rateComponents.wait_time_per_min),
      per_km_beyond_10km: toStringValue(rateComponents.per_km_beyond_10km),
      insurance_gateway_fee: toStringValue(
        rateComponents.insurance_gateway_fee
      ),
      free_wait_time_minutes: toStringValue(
        rateComponents.free_wait_time_minutes
      ),
      minimum_fare_protection: toStringValue(
        rateComponents.minimum_fare_protection
      ),
    },
    route_pricing: Object.entries(routePricing as Record<string, any>).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          label: toStringValue(value?.label),
          wait: toStringValue(value?.wait),
          total: toStringValue(value?.total),
          other_fees: toStringValue(value?.other_fees),
          base_access: toStringValue(value?.base_access),
          distance_km: toStringValue(value?.distance_km),
          min_protected: toStringValue(value?.min_protected),
        };
        return acc;
      },
      {} as Record<string, RoutePricingForm>
    ),
    commission_breakdown: Object.entries(
      commissionBreakdown as Record<string, any>
    ).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          total: toStringValue(value?.total),
          medigo_18: toStringValue(value?.medigo_18),
          vendor_82: toStringValue(value?.vendor_82),
        };
        return acc;
      },
      {} as Record<string, CommissionBreakdownForm>
    ),
    notes: '',
  };
};

const getRouteLabel = (key: string) =>
  key
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const WheelchairWavServiceTypeEditModal = ({
  open,
  setOpen,
  configData,
}: WheelchairWavServiceTypeEditModalProps) => {
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
  const commissionKeys = useMemo(
    () => Object.keys(configData?.config?.commission_breakdown ?? {}),
    [configData]
  );

  const handleSubmit = async (
    values: WheelchairConfigFormValues,
    { setSubmitting }: FormikHelpers<WheelchairConfigFormValues>
  ) => {
    if (!configData) {
      setSubmitting(false);
      return;
    }

    const payload = {
      name: values.name,
      config: {
        ...configData.config,
        vendor_terms: {
          onboarding_fee: Number(values.vendor_terms.onboarding_fee),
          commission_percent: Number(values.vendor_terms.commission_percent),
          certification_required: values.vendor_terms.certification_required,
          accessibility_fee_passthrough:
            values.vendor_terms.accessibility_fee_passthrough === 'true',
          off_platform_restriction_months: Number(
            values.vendor_terms.off_platform_restriction_months
          ),
        },
        route_pricing: routeKeys.reduce(
          (acc, key) => {
            acc[key] = {
              ...(configData.config.route_pricing?.[key] ?? {}),
              label: values.route_pricing[key]?.label,
              wait: Number(values.route_pricing[key]?.wait),
              total: Number(values.route_pricing[key]?.total),
              other_fees: Number(values.route_pricing[key]?.other_fees),
              base_access: Number(values.route_pricing[key]?.base_access),
              distance_km: Number(values.route_pricing[key]?.distance_km),
              min_protected: Number(values.route_pricing[key]?.min_protected),
            };
            return acc;
          },
          {} as Record<string, any>
        ),
        rate_components: {
          ...(configData.config.rate_components ?? {}),
          base_fare: Number(values.rate_components.base_fare),
          surcharge_flat: Number(values.rate_components.surcharge_flat),
          accessibility_fee: Number(values.rate_components.accessibility_fee),
          max_surcharge_cap: Number(values.rate_components.max_surcharge_cap),
          wait_time_per_min: Number(values.rate_components.wait_time_per_min),
          per_km_beyond_10km: Number(values.rate_components.per_km_beyond_10km),
          insurance_gateway_fee: Number(
            values.rate_components.insurance_gateway_fee
          ),
          free_wait_time_minutes: Number(
            values.rate_components.free_wait_time_minutes
          ),
          minimum_fare_protection: Number(
            values.rate_components.minimum_fare_protection
          ),
        },
        platform_commission: Number(values.platform_commission),
        commission_breakdown: commissionKeys.reduce(
          (acc, key) => {
            acc[key] = {
              ...(configData.config.commission_breakdown?.[key] ?? {}),
              total: Number(values.commission_breakdown[key]?.total),
              medigo_18: Number(values.commission_breakdown[key]?.medigo_18),
              vendor_82: Number(values.commission_breakdown[key]?.vendor_82),
            };
            return acc;
          },
          {} as Record<string, any>
        ),
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
      label="edit-wheelchair-config"
      padding="0"
      sx={{
        '& .MuiDialog-paper': {
          width: '980px',
        },
      }}
    >
      <Formik<WheelchairConfigFormValues>
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
                  Edit Wheelchair Fare Configuration
                </Typography>
              </Box>

              <Box sx={{ padding: '24px' }}>
                <Stack spacing="24px">
                  <Grid container spacing="16px">
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormikAppTextField name="name" label="Name" required />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormikAppTextField
                        name="platform_commission"
                        label="Platform Commission"
                        type="number"
                        inputProps={{ min: 0, max: 1, step: 0.01 }}
                      />
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
                      Vendor Terms
                    </Typography>
                    <Grid container spacing="16px">
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="vendor_terms.onboarding_fee"
                          label="Onboarding Fee"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="vendor_terms.commission_percent"
                          label="Commission Percent"
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="vendor_terms.off_platform_restriction_months"
                          label="Off-Platform Restriction Months"
                          type="number"
                          inputProps={{ min: 0, step: 1 }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <FormikAppTextField
                          name="vendor_terms.certification_required"
                          label="Certification Required"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <FormikAppTextField
                          name="vendor_terms.accessibility_fee_passthrough"
                          label="Accessibility Fee Passthrough"
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
                          name="rate_components.accessibility_fee"
                          label="Accessibility Fee"
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
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormikAppTextField
                          name="rate_components.minimum_fare_protection"
                          label="Minimum Fare Protection"
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
                      Route Pricing
                    </Typography>
                    <Stack spacing="16px">
                      {routeKeys.map((routeKey) => (
                        <Box
                          key={routeKey}
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
                            {getRouteLabel(routeKey)}
                          </Typography>
                          <Grid container spacing="16px">
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${routeKey}.label`}
                                label="Label"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${routeKey}.distance_km`}
                                label="Distance Km"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${routeKey}.wait`}
                                label="Wait"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${routeKey}.base_access`}
                                label="Base Access"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${routeKey}.other_fees`}
                                label="Other Fees"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${routeKey}.min_protected`}
                                label="Min Protected"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${routeKey}.total`}
                                label="Total"
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
                      Commission Breakdown
                    </Typography>
                    <Stack spacing="16px">
                      {commissionKeys.map((routeKey) => (
                        <Box
                          key={routeKey}
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
                            {getRouteLabel(routeKey)}
                          </Typography>
                          <Grid container spacing="16px">
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`commission_breakdown.${routeKey}.total`}
                                label="Total"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`commission_breakdown.${routeKey}.medigo_18`}
                                label="Medigo 18%"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`commission_breakdown.${routeKey}.vendor_82`}
                                label="Vendor 82%"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </Stack>
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
