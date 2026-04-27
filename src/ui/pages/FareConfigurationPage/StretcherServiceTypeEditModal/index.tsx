'use client';

import { useMemo, type Dispatch, type SetStateAction } from 'react';
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
  base_fare: string;
  other_fees: string;
  distance_km: string;
  attendant_fee: string;
};

type PartnershipRevenueForm = {
  net: string;
  total: string;
  your_50: string;
  op_costs: string;
  partner_50: string;
};

type StretcherServiceTypeFormValues = {
  name: string;
  rate_components: {
    base_fare: string;
    attendant_fee: string;
    surcharge_flat: string;
    max_surcharge_cap: string;
    wait_time_per_min: string;
    per_km_beyond_10km: string;
    insurance_gateway_fee: string;
    free_wait_time_minutes: string;
  };
  revenue_split: {
    description: string;
    partnership_50_50: string;
    operating_costs_deducted_first: string;
  };
  route_pricing: Record<string, RoutePricingForm>;
  partnership_revenue: Record<string, PartnershipRevenueForm>;
  notes: string;
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
});

type StretcherServiceTypeEditModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  configData: ServiceTypeConfigResponse | null;
};

const toStringValue = (value: unknown) =>
  value === null || value === undefined ? '' : String(value);

const toInitialValues = (
  configData: ServiceTypeConfigResponse | null
): StretcherServiceTypeFormValues => {
  const config = configData?.config ?? {};
  const rateComponents = config.rate_components ?? {};
  const revenueSplit = config.revenue_split ?? {};
  const routePricing = config.route_pricing ?? {};
  const partnershipRevenue = config.partnership_revenue ?? {};

  return {
    name: configData?.display_name || configData?.service_type || '',
    rate_components: {
      base_fare: toStringValue(rateComponents.base_fare),
      attendant_fee: toStringValue(rateComponents.attendant_fee),
      surcharge_flat: toStringValue(rateComponents.surcharge_flat),
      max_surcharge_cap: toStringValue(rateComponents.max_surcharge_cap),
      wait_time_per_min: toStringValue(rateComponents.wait_time_per_min),
      per_km_beyond_10km: toStringValue(rateComponents.per_km_beyond_10km),
      insurance_gateway_fee: toStringValue(
        rateComponents.insurance_gateway_fee
      ),
      free_wait_time_minutes: toStringValue(
        rateComponents.free_wait_time_minutes
      ),
    },
    revenue_split: {
      description: toStringValue(revenueSplit.description),
      partnership_50_50: toStringValue(revenueSplit.partnership_50_50),
      operating_costs_deducted_first: toStringValue(
        revenueSplit.operating_costs_deducted_first
      ),
    },
    route_pricing: Object.entries(routePricing as Record<string, any>).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          label: toStringValue(value?.label),
          wait: toStringValue(value?.wait),
          total: toStringValue(value?.total),
          base_fare: toStringValue(value?.base_fare),
          other_fees: toStringValue(value?.other_fees),
          distance_km: toStringValue(value?.distance_km),
          attendant_fee: toStringValue(value?.attendant_fee),
        };
        return acc;
      },
      {} as Record<string, RoutePricingForm>
    ),
    partnership_revenue: Object.entries(
      partnershipRevenue as Record<string, any>
    ).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          net: toStringValue(value?.net),
          total: toStringValue(value?.total),
          your_50: toStringValue(value?.your_50),
          op_costs: toStringValue(value?.op_costs),
          partner_50: toStringValue(value?.partner_50),
        };
        return acc;
      },
      {} as Record<string, PartnershipRevenueForm>
    ),
    notes: '',
  };
};

const toNumberOrExisting = (value: string, existing: unknown) =>
  value.trim() === '' ? existing : Number(value);

const toBooleanOrExisting = (value: string, existing: unknown) => {
  if (value.trim() === '') return existing;
  return value.toLowerCase() === 'true';
};

export const StretcherServiceTypeEditModal = ({
  open,
  setOpen,
  configData,
}: StretcherServiceTypeEditModalProps) => {
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
  const partnershipKeys = useMemo(
    () => Object.keys(configData?.config?.partnership_revenue ?? {}),
    [configData]
  );

  const handleSubmit = async (
    values: StretcherServiceTypeFormValues,
    { setSubmitting }: FormikHelpers<StretcherServiceTypeFormValues>
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
          attendant_fee: toNumberOrExisting(
            values.rate_components.attendant_fee,
            existingConfig.rate_components?.attendant_fee
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
          insurance_gateway_fee: toNumberOrExisting(
            values.rate_components.insurance_gateway_fee,
            existingConfig.rate_components?.insurance_gateway_fee
          ),
          free_wait_time_minutes: toNumberOrExisting(
            values.rate_components.free_wait_time_minutes,
            existingConfig.rate_components?.free_wait_time_minutes
          ),
        },
        revenue_split: {
          ...(existingConfig.revenue_split ?? {}),
          description:
            values.revenue_split.description.trim() === ''
              ? existingConfig.revenue_split?.description
              : values.revenue_split.description,
          partnership_50_50: toBooleanOrExisting(
            values.revenue_split.partnership_50_50,
            existingConfig.revenue_split?.partnership_50_50
          ),
          operating_costs_deducted_first: toBooleanOrExisting(
            values.revenue_split.operating_costs_deducted_first,
            existingConfig.revenue_split?.operating_costs_deducted_first
          ),
        },
        route_pricing: routeKeys.reduce(
          (acc, key) => {
            const existing = existingConfig.route_pricing?.[key] ?? {};
            acc[key] = {
              ...existing,
              label:
                values.route_pricing[key]?.label.trim() === ''
                  ? existing.label
                  : values.route_pricing[key]?.label,
              wait: toNumberOrExisting(
                values.route_pricing[key]?.wait ?? '',
                existing.wait
              ),
              total: toNumberOrExisting(
                values.route_pricing[key]?.total ?? '',
                existing.total
              ),
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
              attendant_fee: toNumberOrExisting(
                values.route_pricing[key]?.attendant_fee ?? '',
                existing.attendant_fee
              ),
            };
            return acc;
          },
          {} as Record<string, any>
        ),
        partnership_revenue: partnershipKeys.reduce(
          (acc, key) => {
            const existing = existingConfig.partnership_revenue?.[key] ?? {};
            acc[key] = {
              ...existing,
              net: toNumberOrExisting(
                values.partnership_revenue[key]?.net ?? '',
                existing.net
              ),
              total: toNumberOrExisting(
                values.partnership_revenue[key]?.total ?? '',
                existing.total
              ),
              your_50: toNumberOrExisting(
                values.partnership_revenue[key]?.your_50 ?? '',
                existing.your_50
              ),
              op_costs: toNumberOrExisting(
                values.partnership_revenue[key]?.op_costs ?? '',
                existing.op_costs
              ),
              partner_50: toNumberOrExisting(
                values.partnership_revenue[key]?.partner_50 ?? '',
                existing.partner_50
              ),
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
      label="edit-stretcher-config"
      padding="0"
      sx={{
        '& .MuiDialog-paper': {
          width: '1100px',
        },
      }}
    >
      <Formik<StretcherServiceTypeFormValues>
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
                  Edit Stretcher Fare Configuration
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
                          name="rate_components.attendant_fee"
                          label="Attendant Fee"
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
                      Revenue Split
                    </Typography>
                    <Grid container spacing="16px">
                      <Grid size={{ xs: 12 }}>
                        <FormikAppTextField
                          name="revenue_split.description"
                          label="Description"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormikAppTextField
                          name="revenue_split.partnership_50_50"
                          label="Partnership 50/50"
                          helperText="Enter true or false"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormikAppTextField
                          name="revenue_split.operating_costs_deducted_first"
                          label="Operating Costs Deducted First"
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
                                name={`route_pricing.${key}.wait`}
                                label="Wait"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${key}.total`}
                                label="Total"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`route_pricing.${key}.attendant_fee`}
                                label="Attendant Fee"
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
                      Partnership Revenue
                    </Typography>
                    <Stack spacing="16px">
                      {partnershipKeys.map((key) => (
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
                                name={`partnership_revenue.${key}.net`}
                                label="Net"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`partnership_revenue.${key}.total`}
                                label="Total"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`partnership_revenue.${key}.your_50`}
                                label="Your 50%"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`partnership_revenue.${key}.op_costs`}
                                label="Operating Costs"
                                type="number"
                                inputProps={{ min: 0, step: 0.01 }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                              <FormikAppTextField
                                name={`partnership_revenue.${key}.partner_50`}
                                label="Partner 50%"
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
