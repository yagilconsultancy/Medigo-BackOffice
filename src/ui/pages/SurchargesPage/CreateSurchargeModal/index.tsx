import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Stack,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  MenuItem,
  Chip,
  Box,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Divider,
  styled,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import {
  AppButton,
  AppModal,
  FormikAppTextField,
  RowStack,
} from '../../../modules/components';
import { SurchargeRuleCreate, pxToRem, useSurchargeApi, ROUTES, resolveRoute } from '../../../../common';

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

interface CreateSurchargeModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CreateSurchargeFormValues {
  name: string;
  description: string;
  surcharge_type: string;
  multiplier: string;
  flat_amount: string;
  applies_to: string[];
  is_active: boolean;
  sort_order: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  surcharge_type: Yup.string().required('Surcharge type is required'),
  multiplier: Yup.number()
    .min(0, 'Multiplier must be at least 0')
    .required('Multiplier is required'),
  flat_amount: Yup.number()
    .min(0, 'Flat amount must be at least 0')
    .required('Flat amount is required'),
  applies_to: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one option must be selected')
    .required('Required'),
  sort_order: Yup.number().min(0, 'Sort order must be at least 0'),
});

const SURCHARGE_TYPES = [
  { value: 'peak_hours', label: 'Peak Hours' },
  { value: 'night', label: 'Night' },
  { value: 'overnight', label: 'Overnight' },
  { value: 'early_morning', label: 'Early Morning' },
  { value: 'weather_light_snow', label: 'Weather - Light Snow' },
  { value: 'weather_heavy_snow', label: 'Weather - Heavy Snow' },
  { value: 'weather_post_storm', label: 'Weather - Post Storm' },
  { value: 'weekend_saturday', label: 'Weekend - Saturday' },
  { value: 'weekend_sunday', label: 'Weekend - Sunday' },
  { value: 'holiday', label: 'Holiday' },
];

const APPLIES_TO_OPTIONS = [
  { value: 'all', label: 'All Ride Types' },
  { value: 'standard', label: 'Standard' },
  { value: 'wheelchair', label: 'Wheelchair' },
  { value: 'stretcher', label: 'Stretcher' },
];

export const CreateSurchargeModal = ({
  open,
  setOpen,
}: CreateSurchargeModalProps) => {
  const queryClient = useQueryClient();
  const { createSurchargeRule } = useSurchargeApi();

  const initialValues: CreateSurchargeFormValues = {
    name: '',
    description: '',
    surcharge_type: '',
    multiplier: '1',
    flat_amount: '0',
    applies_to: ['all'],
    is_active: true,
    sort_order: '0',
  };

  const handleSubmit = async (
    values: CreateSurchargeFormValues,
    { setSubmitting }: FormikHelpers<CreateSurchargeFormValues>
  ) => {
    setSubmitting(true);

    const payload: SurchargeRuleCreate = {
      name: values.name,
      description: values.description || undefined,
      surcharge_type: values.surcharge_type,
      multiplier: parseFloat(values.multiplier),
      flat_amount: parseFloat(values.flat_amount),
      applies_to: values.applies_to,
      is_active: values.is_active,
      sort_order: values.sort_order ? parseInt(values.sort_order) : undefined,
      schedule: null,
    };

    const success = await createSurchargeRule(payload);

    if (success) {
      // Invalidate surcharge queries to trigger refetch
      await queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listSurchargeRules)],
      });
      await queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getSurchargeKpis)],
      });
      setOpen(false);
    }

    setSubmitting(false);
  };

  return (
    <AppModal
      open={open}
      setOpen={setOpen}
      label="create-surcharge-modal"
      padding="0"
      sx={{
        '& .MuiDialog-paper': {
          width: '440px',
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue, errors, touched }) => (
          <Form>
            <Stack>
              {/* Header */}
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
                  Create Surcharge
                </Typography>
              </Box>

              {/* Content */}
              <Box sx={{ padding: '24px' }}>
              <Stack spacing={'20px'}>
                {/* Name and Surcharge Type */}
                <Grid container spacing={'16px'}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormikAppTextField
                      name="name"
                      label="Name"
                      placeholder="Enter surcharge name"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormikAppTextField
                      name="surcharge_type"
                      label="Surcharge Type"
                      select
                      required
                    >
                      {SURCHARGE_TYPES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </FormikAppTextField>
                  </Grid>
                </Grid>

                {/* Description */}
                <FormikAppTextField
                  name="description"
                  label="Description"
                  placeholder="Enter description (optional)"
                  multiline
                  rows={3}
                />

                {/* Multiplier and Flat Amount */}
                <Grid container spacing={'16px'}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormikAppTextField
                      name="multiplier"
                      label="Multiplier"
                      type="number"
                      placeholder="1"
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormikAppTextField
                      name="flat_amount"
                      label="Flat Amount ($)"
                      type="number"
                      placeholder="0"
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                </Grid>

                {/* Applies To */}
                <FormControl
                  fullWidth
                  error={touched.applies_to && Boolean(errors.applies_to)}
                >
                  <InputLabel>Applies To *</InputLabel>
                  <Select
                    multiple
                    value={values.applies_to}
                    onChange={(e) =>
                      setFieldValue('applies_to', e.target.value)
                    }
                    input={<OutlinedInput label="Applies To *" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              APPLIES_TO_OPTIONS.find((opt) => opt.value === value)
                                ?.label || value
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                    )}
                    sx={{
                      borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#E8ECF0',
                      },
                    }}
                  >
                    {APPLIES_TO_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.applies_to && errors.applies_to && (
                    <Typography
                      sx={{
                        color: '#EF4444',
                        fontSize: pxToRem(12),
                        marginTop: '4px',
                        marginLeft: '14px',
                      }}
                    >
                      {errors.applies_to}
                    </Typography>
                  )}
                </FormControl>

                {/* Sort Order and Active Status */}
                <Grid container spacing={'16px'} alignItems="center">
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormikAppTextField
                      name="sort_order"
                      label="Sort Order"
                      type="number"
                      placeholder="0"
                      inputProps={{ min: 0, step: 1 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          checked={values.is_active}
                          onChange={(e) =>
                            setFieldValue('is_active', e.target.checked)
                          }
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 500,
                            fontSize: pxToRem(14),
                            color: '#374151',
                          }}
                        >
                          Active
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>
              </Stack>
              </Box>

              {/* Actions */}
              <Box
                sx={{
                  padding: '16px 24px',
                  borderTop: '1px solid #F0F4F8',
                }}
              >
                <RowStack spacing={'12px'} justifyContent="flex-end">
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
                    color="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Create Surcharge
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
