import { Formik, Form, FormikHelpers } from 'formik';
import { Box, Button, Grid, Stack, Switch, Typography } from '@mui/material';
import * as Yup from 'yup';
import {
  AppModal,
  AppButton,
  FormikAppTextField,
  RowStack,
} from '../../../modules/components';
import {
  pxToRem,
  RidePackage,
  RidePackageUpdate,
} from '../../../../common';
import { usePaymentPricingApi } from '../../../../common/hooks/api';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES, resolveRoute } from '../../../../common';

interface EditPackageModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pkg: RidePackage | null;
}

interface PackageFormValues {
  name: string;
  description: string;
  package_type: string;
  price: string;
  ride_count: string;
  is_unlimited: boolean;
  discount_percent: string;
  validity_days: string;
  sort_order: string;
  is_active: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Package name is required'),
  description: Yup.string(),
  package_type: Yup.string().required('Package type is required'),
  price: Yup.number()
    .min(0, 'Price must be at least 0')
    .required('Price is required'),
  ride_count: Yup.number().when('is_unlimited', {
    is: false,
    then: (schema) =>
      schema
        .min(1, 'Ride count must be at least 1')
        .required('Ride count is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  discount_percent: Yup.number()
    .min(0, 'Discount must be at least 0')
    .max(100, 'Discount cannot exceed 100')
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? null : value
    ),
  validity_days: Yup.number()
    .min(1, 'Validity must be at least 1 day')
    .required('Validity is required'),
  sort_order: Yup.number().min(0, 'Sort order must be at least 0'),
  is_active: Yup.boolean(),
});

const initialValuesFromPackage = (
  pkg: RidePackage | null
): PackageFormValues => ({
  name: pkg?.name || '',
  description: pkg?.description || '',
  package_type: pkg?.package_type || 'rider',
  price: pkg ? String(pkg.price) : '',
  ride_count:
    pkg && pkg.rides_included !== -1 ? String(pkg.rides_included) : '',
  is_unlimited: pkg?.rides_included === -1,
  discount_percent:
    pkg?.discount_percent !== undefined && pkg?.discount_percent !== null
      ? String(pkg.discount_percent)
      : pkg?.discount_percentage !== undefined &&
          pkg?.discount_percentage !== null
        ? String(pkg.discount_percentage)
      : '',
  validity_days: pkg ? String(pkg.validity_days) : '30',
  sort_order: '0',
  is_active: pkg?.is_active ?? true,
});

export const EditPackageModal = ({
  open,
  setOpen,
  pkg,
}: EditPackageModalProps) => {
  const queryClient = useQueryClient();
  const { updatePackage } = usePaymentPricingApi();

  const handleSubmit = async (
    values: PackageFormValues,
    { setSubmitting, resetForm }: FormikHelpers<PackageFormValues>
  ) => {
    if (!pkg) {
      setSubmitting(false);
      return;
    }

    const payload: RidePackageUpdate = {
      name: values.name,
      description: values.description || undefined,
      package_type: values.package_type,
      price: Number(values.price),
      ride_count: values.is_unlimited ? null : Number(values.ride_count),
      is_unlimited: values.is_unlimited,
      discount_percent: values.discount_percent
        ? Number(values.discount_percent)
        : null,
      validity_days: Number(values.validity_days),
      sort_order: values.sort_order ? Number(values.sort_order) : 0,
      is_active: values.is_active,
    };

    setSubmitting(true);
    const success = await updatePackage(pkg.id, payload);
    setSubmitting(false);

    if (success) {
      setOpen(false);
      resetForm();
      await queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listPackages)],
      });
      await queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getPackageKpis)],
      });
    }
  };

  return (
    <AppModal open={open} setOpen={setOpen} label="Edit Package">
      <Formik<PackageFormValues>
        initialValues={initialValuesFromPackage(pkg)}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => {
          const hasEmptyFields =
            !values.name ||
            !values.price ||
            !values.package_type ||
            (!values.is_unlimited && !values.ride_count);

          return (
            <Form>
              <Stack spacing="20px">
                {/* Package Name */}
                <Stack spacing="6px">
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#111827',
                    }}
                  >
                    Package Name *
                  </Typography>
                  <FormikAppTextField
                    name="name"
                    placeholder="e.g., 10-Ride Bundle"
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                </Stack>

                {/* Description */}
                <Stack spacing="6px">
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#111827',
                    }}
                  >
                    Description
                  </Typography>
                  <FormikAppTextField
                    name="description"
                    placeholder="Brief description of the package"
                    multiline
                    rows={3}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                </Stack>

                {/* Package Type */}
                <Stack spacing="6px">
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#111827',
                    }}
                  >
                    Package Type *
                  </Typography>
                  <FormikAppTextField
                    name="package_type"
                    select
                    SelectProps={{ native: true }}
                    disabled
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  >
                    <option value="rider">Rider</option>
                    <option value="corporate">Corporate</option>
                    <option value="subscription">Subscription</option>
                    <option value="medical">Medical</option>
                  </FormikAppTextField>
                </Stack>

                {/* Price and Discount */}
                <Grid container spacing="16px">
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing="6px">
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13),
                          color: '#111827',
                        }}
                      >
                        Price ($) *
                      </Typography>
                      <FormikAppTextField
                        name="price"
                        type="number"
                        placeholder="0.00"
                        sx={{
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                          },
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing="6px">
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13),
                          color: '#111827',
                        }}
                      >
                        Discount (%)
                      </Typography>
                      <FormikAppTextField
                        name="discount_percent"
                        type="number"
                        placeholder="0"
                        inputProps={{ min: 0, max: 100, step: 0.01 }}
                        sx={{
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                          },
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>

                {/* Unlimited Toggle */}
                <RowStack
                  justifyContent="space-between"
                  sx={{
                    padding: '14px 16px',
                    background: '#F7F9FB',
                    borderRadius: '10px',
                    border: '0.67px solid #E8ECF0',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#374151',
                    }}
                  >
                    Unlimited Rides
                  </Typography>
                  <Switch
                    checked={values.is_unlimited}
                    onChange={(e) =>
                      setFieldValue('is_unlimited', e.target.checked)
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2F6FED',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          backgroundColor: '#2F6FED',
                        },
                    }}
                  />
                </RowStack>

                {/* Ride Count (only if not unlimited) */}
                {!values.is_unlimited && (
                  <Stack spacing="6px">
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(13),
                        color: '#111827',
                      }}
                    >
                      Number of Rides *
                    </Typography>
                    <FormikAppTextField
                      name="ride_count"
                      type="number"
                      placeholder="10"
                      sx={{
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                        },
                      }}
                    />
                  </Stack>
                )}

                {/* Validity Days */}
                <Stack spacing="6px">
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#111827',
                    }}
                  >
                    Validity (Days)
                  </Typography>
                  <FormikAppTextField
                    name="validity_days"
                    type="number"
                    placeholder="30"
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                      },
                    }}
                  />
                </Stack>

                {/* Active Toggle */}
                <RowStack
                  justifyContent="space-between"
                  sx={{
                    padding: '14px 16px',
                    background: '#F7F9FB',
                    borderRadius: '10px',
                    border: '0.67px solid #E8ECF0',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#374151',
                    }}
                  >
                    Active
                  </Typography>
                  <Switch
                    checked={values.is_active}
                    onChange={(e) =>
                      setFieldValue('is_active', e.target.checked)
                    }
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#2F6FED',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          backgroundColor: '#2F6FED',
                        },
                    }}
                  />
                </RowStack>

                {/* Action Buttons */}
                <RowStack
                  spacing="12px"
                  justifyContent="flex-end"
                  sx={{ pt: '8px' }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: '10px',
                      padding: '8px 20px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      fontFamily: (theme) => theme.typography.fontFamily,
                      borderColor: '#E8ECF0',
                      color: '#6B7280',
                      '&:hover': {
                        borderColor: '#D1D5DB',
                        background: '#F9FAFB',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <AppButton
                    type="submit"
                    variant="contained"
                    disabled={hasEmptyFields || isSubmitting}
                    isLoading={isSubmitting}
                    sx={{
                      background: '#2F6FED',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      padding: '8px 20px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      fontFamily: (theme) => theme.typography.fontFamily,
                      boxShadow: 'none',
                      '&:hover': {
                        background: '#2558C9',
                        boxShadow: 'none',
                      },
                      '&.Mui-disabled': {
                        background: '#93B4F5',
                        color: '#FFFFFF',
                      },
                    }}
                  >
                    Update Package
                  </AppButton>
                </RowStack>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </AppModal>
  );
};
