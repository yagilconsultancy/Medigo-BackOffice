import { Formik, Form, FormikHelpers } from 'formik';
import { Box, Button, Grid, Stack, Switch, Typography } from '@mui/material';
import {
  AppModal,
  AppButton,
  FormikAppTextField,
  RowStack,
} from '../../../modules/components';
import { pxToRem, RidePackageCreate } from '../../../../common';
import { usePaymentPricingApi } from '../../../../common/hooks/api';

interface CreatePackageModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
}

export const CreatePackageModal = ({
  open,
  setOpen,
}: CreatePackageModalProps) => {
  const { createPackage } = usePaymentPricingApi();

  const initialValues: PackageFormValues = {
    name: '',
    description: '',
    package_type: 'rider',
    price: '',
    ride_count: '',
    is_unlimited: false,
    discount_percent: '',
    validity_days: '30',
    sort_order: '0',
  };

  const handleSubmit = async (
    values: PackageFormValues,
    { setSubmitting, resetForm }: FormikHelpers<PackageFormValues>
  ) => {
    const payload: RidePackageCreate = {
      name: values.name,
      description: values.description,
      package_type: values.package_type,
      price: Number(values.price),
      rides_included: values.is_unlimited ? -1 : Number(values.ride_count),
      validity_days: Number(values.validity_days),
      is_active: true,
      discount_percentage: values.discount_percent
        ? Number(values.discount_percent)
        : null,
    };

    setSubmitting(true);
    const success = await createPackage(payload);
    setSubmitting(false);

    if (success) {
      resetForm();
      setOpen(false);
    }
  };

  return (
    <AppModal open={open} setOpen={setOpen} label="Create New Package">
      <Formik<PackageFormValues>
        initialValues={initialValues}
        enableReinitialize
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
                    Create Package
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
