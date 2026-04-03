'use client';

import { useMemo } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import {
  Box,
  Divider,
  Grid,
  Stack,
  Switch,
  styled,
  Typography,
} from '@mui/material';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  DashboardTitleAndDesc,
  FormikAppTextField,
  RowStack,
} from '../../modules/components';
import {
  SecurityKPIs,
  UpdateSecuritySettingsRequest,
  formatTotalNumber,
  pxToRem,
  useGetSecurityKpi,
  useGetSecurityData,
  useResolvedApiQuery,
} from '../../../common';
import { useSecurityApi } from '../../../common/hooks/api';

// ─── iOS Switch ─────────────────────────────────────────────────────────────

const IOSSwitch = styled(Switch)(() => ({
  width: 44,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 3,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(18px)',
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
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 13,
    backgroundColor: '#D1D5DB',
    opacity: 1,
  },
}));

// ─── Types ──────────────────────────────────────────────────────────────────

interface SecurityFormValues {
  two_factor_enabled: boolean;
  ip_geo_blocking_enabled: boolean;
  ip_whitelist_enabled: boolean;
  audit_logging_enabled: boolean;
  session_timeout_hours: string;
  max_failed_login_attempts: string;
  min_password_length: string;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_special_chars: boolean;
}

// ─── Auth Settings Config ───────────────────────────────────────────────────

const authSettingsConfig = [
  {
    field: 'two_factor_enabled' as const,
    name: 'Two-Factor Authentication (2FA)',
    description: 'Require all admins to use 2FA on every login',
    enabledLabel: 'Enabled',
  },
  {
    field: 'ip_geo_blocking_enabled' as const,
    name: 'IP Geo-Blocking',
    description: 'Block login attempts from non-Canadian IP addresses',
    enabledLabel: 'Active',
  },
  {
    field: 'ip_whitelist_enabled' as const,
    name: 'IP Whitelist (Allowlist)',
    description: 'Only allow logins from pre-approved IP addresses',
    enabledLabel: 'Enabled',
  },
  {
    field: 'audit_logging_enabled' as const,
    name: 'Audit Logging',
    description: 'Record all admin actions in the activity log',
    enabledLabel: 'Always On',
    locked: true,
  },
];

// ─── Password Policy Config ─────────────────────────────────────────────────

const passwordPolicyConfig = [
  { field: 'require_uppercase' as const, label: 'Require uppercase letters' },
  {
    field: 'require_special_chars' as const,
    label: 'Require special characters',
  },
  { field: 'require_numbers' as const, label: 'Require numbers' },
  { field: 'require_lowercase' as const, label: 'Require lowercase letters' },
];

// ─── Stat Card Config ────────────────────────────────────────────────────────

const statCardConfig = [
  {
    label: '2FA Enabled',
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
    iconBg: '#ECFDF5',
    getValue: (kpi?: SecurityKPIs) =>
      kpi?.two_fa_enabled_count != null && kpi?.total_admin_count != null
        ? `${kpi.two_fa_enabled_count}/${kpi.total_admin_count}`
        : '0/0',
  },
  {
    label: 'Password Policy',
    icon: <GppGoodOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    getValue: (kpi?: SecurityKPIs) => kpi?.password_policy ?? 'N/A',
  },
  {
    label: 'Session Timeout',
    icon: <TimerOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
    getValue: (kpi?: SecurityKPIs) =>
      kpi?.session_timeout_hours != null
        ? `${kpi.session_timeout_hours}h`
        : '0h',
  },
  {
    label: 'Threats Blocked',
    icon: <ShieldOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
    iconBg: '#FFFBEB',
    getValue: (kpi?: SecurityKPIs) =>
      `${formatTotalNumber(kpi?.threats_blocked)}`,
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const SecuritySettingsPage = () => {
  const { updateSecuritySettings } = useSecurityApi();
  const { data: securityKpi } = useResolvedApiQuery(useGetSecurityKpi, null);
  const { data: securityData } = useResolvedApiQuery(useGetSecurityData, null);

  const kpiData = useMemo<SecurityKPIs | undefined>(() => {
    return securityKpi ? securityKpi : undefined;
  }, [securityKpi]);

  const statCards = statCardConfig.map((card) => ({
    ...card,
    value: card.getValue(kpiData),
  }));

  const initialValues: SecurityFormValues = useMemo(() => {
    return {
      two_factor_enabled: securityData?.two_factor_enabled ?? false,
      ip_geo_blocking_enabled: securityData?.ip_geo_blocking_enabled ?? false,
      ip_whitelist_enabled: securityData?.ip_whitelist_enabled ?? false,
      audit_logging_enabled: securityData?.audit_logging_enabled ?? true,
      session_timeout_hours:
        securityData?.session_timeout_hours?.toString() ?? '',
      max_failed_login_attempts: '5',
      min_password_length: securityData?.min_password_length?.toString() ?? '',
      require_uppercase: securityData?.require_uppercase ?? false,
      require_lowercase: securityData?.require_lowercase ?? false,
      require_numbers: securityData?.require_numbers ?? false,
      require_special_chars: securityData?.require_special_chars ?? false,
    };
  }, [securityData]);

  const textFieldSx = {
    width: '100%',
    borderRadius: '10px',
    border: '0.67px solid #E8ECF0',
    background: '#F7F9FB',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    fontSize: pxToRem(13),
    color: '#6366F1',
    outline: 'none',
    '&:focus': {
      borderColor: '#2F6FED',
    },
  };

  const handleSubmit = async (
    values: SecurityFormValues,
    { setSubmitting }: FormikHelpers<SecurityFormValues>
  ) => {
    const payload: UpdateSecuritySettingsRequest = {
      two_factor_enabled: values.two_factor_enabled,
      ip_geo_blocking_enabled: values.ip_geo_blocking_enabled,
      ip_whitelist_enabled: values.ip_whitelist_enabled,
      audit_logging_enabled: values.audit_logging_enabled,
      session_timeout_hours: Number(values.session_timeout_hours),
      min_password_length: Number(values.min_password_length),
      require_uppercase: values.require_uppercase,
      require_lowercase: values.require_lowercase,
      require_numbers: values.require_numbers,
      require_special_chars: values.require_special_chars,
    };

    setSubmitting(true);
    await updateSecuritySettings(payload);
    setSubmitting(false);
  };

  return (
    <AppDashboardLayout>
      <Formik<SecurityFormValues>
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, dirty, isSubmitting, setFieldValue }) => {
          const hasEmptyTextFields =
            !values.session_timeout_hours ||
            !values.max_failed_login_attempts ||
            !values.min_password_length;

          const isSaveDisabled = !dirty || isSubmitting || hasEmptyTextFields;

          return (
            <Form>
              <Stack spacing={'24px'}>
                {/* Header */}
                <RowStack justifyContent={'space-between'}>
                  <DashboardTitleAndDesc
                    title="Security Settings"
                    desc="Configure authentication policies, session controls, and platform security rules"
                  />
                  <AppButton
                    type="submit"
                    variant="contained"
                    disabled={isSaveDisabled}
                    isLoading={isSubmitting}
                    sx={{
                      background: '#2F6FED',
                      color: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '8px 20px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      fontFamily: (theme) => theme.typography.fontFamily,
                      height: 40,
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
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
                    Save Changes
                  </AppButton>
                </RowStack>

                {/* Stat Cards */}
                <Grid container spacing={'12px'}>
                  {statCards.map((card, index) => (
                    <Grid key={index} size={{ xs: 6, lg: 3 }}>
                      <Stack
                        sx={{
                          background: '#FFFFFF',
                          border: '0.67px solid #F0F4F8',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            background: card.iconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px',
                          }}
                        >
                          {card.icon}
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(24),
                            lineHeight: '1.3em',
                            color: '#111827',
                          }}
                        >
                          {card.value}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 500,
                            fontSize: pxToRem(12.5),
                            lineHeight: '1.5em',
                            color: '#6B7280',
                            marginTop: '2px',
                          }}
                        >
                          {card.label}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>

                {/* Settings Sections */}
                <Stack spacing={'24px'}>
                  {/* Authentication Section */}
                  <Stack
                    sx={{
                      background: '#FFFFFF',
                      border: '0.67px solid #F0F4F8',
                      borderRadius: '16px',
                      boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                      overflow: 'hidden',
                    }}
                  >
                    <Stack spacing={'4px'} sx={{ padding: '24px 24px 0' }}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(16),
                          color: '#111827',
                        }}
                      >
                        Authentication
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(13),
                          color: '#6B7280',
                        }}
                      >
                        Login and verification settings for admin accounts
                      </Typography>
                    </Stack>

                    <Stack sx={{ padding: '20px 24px 24px' }} spacing={'0px'}>
                      {authSettingsConfig.map((setting, index) => {
                        const isOn = values[setting.field];
                        const status = setting.locked
                          ? setting.enabledLabel
                          : isOn
                            ? setting.enabledLabel
                            : 'Off';

                        return (
                          <Box key={setting.field}>
                            {index > 0 && (
                              <Divider sx={{ borderColor: '#F0F4F8' }} />
                            )}
                            <RowStack
                              justifyContent={'space-between'}
                              sx={{ padding: '16px 0' }}
                            >
                              <Stack spacing={'4px'} sx={{ flex: 1 }}>
                                <Typography
                                  sx={{
                                    fontFamily: (theme) =>
                                      theme.typography.fontFamily,
                                    fontWeight: 600,
                                    fontSize: pxToRem(13.5),
                                    color: '#111827',
                                  }}
                                >
                                  {setting.name}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontFamily: (theme) =>
                                      theme.typography.fontFamily,
                                    fontWeight: 400,
                                    fontSize: pxToRem(12.5),
                                    color: '#9CA3AF',
                                  }}
                                >
                                  {setting.description}
                                </Typography>
                              </Stack>
                              <RowStack spacing={'12px'}>
                                <Box
                                  sx={{
                                    padding: '3px 10px',
                                    borderRadius: '100px',
                                    background: isOn
                                      ? 'rgba(16, 185, 129, 0.09)'
                                      : 'rgba(156, 163, 175, 0.09)',
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: (theme) =>
                                        theme.typography.fontFamily,
                                      fontWeight: 500,
                                      fontSize: pxToRem(11.5),
                                      color: isOn ? '#10B981' : '#9CA3AF',
                                    }}
                                  >
                                    {status}
                                  </Typography>
                                </Box>
                                <IOSSwitch
                                  checked={isOn}
                                  disabled={setting.locked}
                                  onChange={() =>
                                    setFieldValue(setting.field, !isOn)
                                  }
                                />
                              </RowStack>
                            </RowStack>
                          </Box>
                        );
                      })}
                    </Stack>
                  </Stack>

                  {/* Session Controls + Password Policy — side by side */}
                  <Grid container spacing={'24px'}>
                    {/* Session Controls */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <Stack
                        sx={{
                          background: '#FFFFFF',
                          border: '0.67px solid #F0F4F8',
                          borderRadius: '16px',
                          boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                          padding: '24px',
                          height: '100%',
                        }}
                        spacing={1}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(16),
                            color: (theme) => theme.color.deepBlue,
                          }}
                        >
                          Session Controls
                        </Typography>

                        <Stack spacing={'20px'}>
                          {/* Session Timeout */}
                          <Stack spacing={'6px'}>
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 600,
                                fontSize: pxToRem(12.5),
                                color: (theme) => theme.color.deepBlue,
                                lineHeight: '19px',
                              }}
                            >
                              Session Timeout (hours)
                            </Typography>
                            <FormikAppTextField
                              name="session_timeout_hours"
                              type="number"
                              sx={textFieldSx}
                            />
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 400,
                                fontSize: pxToRem(11.5),
                                color: '#9CA3AF',
                                lineHeight: '17.25px',
                              }}
                            >
                              Admin sessions expire after this period of
                              inactivity
                            </Typography>
                          </Stack>

                          <Divider sx={{ borderColor: '#F0F4F8' }} />

                          {/* Max Failed Login Attempts */}
                          <Stack spacing={'6px'}>
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 600,
                                fontSize: pxToRem(12.5),
                                color: (theme) => theme.color.deepBlue,
                                lineHeight: '19px',
                              }}
                            >
                              Max Failed Login Attempts
                            </Typography>
                            <FormikAppTextField
                              name="max_failed_login_attempts"
                              type="number"
                              InputProps={{ readOnly: true }}
                              sx={textFieldSx}
                            />
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 400,
                                fontSize: pxToRem(11.5),
                                color: '#9CA3AF',
                                lineHeight: '17.25px',
                              }}
                            >
                              Account locks after this many failed login
                              attempts
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Grid>

                    {/* Password Policy */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <Stack
                        sx={{
                          background: '#FFFFFF',
                          border: '0.67px solid #F0F4F8',
                          borderRadius: '16px',
                          boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                          padding: '24px',
                          height: '100%',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(16),
                            color: '#111827',
                            marginBottom: '20px',
                          }}
                        >
                          Password Policy
                        </Typography>

                        {/* Min Password Length */}
                        <Stack spacing={'6px'} sx={{ marginBottom: '16px' }}>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(12.5),
                              color: (theme) => theme.color.deepBlue,
                              lineHeight: '19px',
                            }}
                          >
                            Minimum Password Length
                          </Typography>
                          <FormikAppTextField
                            name="min_password_length"
                            type="number"
                            sx={textFieldSx}
                          />
                        </Stack>

                        {/* Password Requirement Toggles */}
                        <Stack spacing={'0px'} sx={{ flex: 1 }}>
                          {passwordPolicyConfig.map((policy, index) => {
                            const isOn = values[policy.field];
                            return (
                              <Box key={policy.field}>
                                {index > 0 && (
                                  <Divider sx={{ borderColor: '#F0F4F8' }} />
                                )}
                                <RowStack
                                  justifyContent={'space-between'}
                                  sx={{
                                    padding: '14px 16px',
                                    background: '#F7F9FB',
                                    borderRadius: '14px',
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: (theme) =>
                                        theme.typography.fontFamily,
                                      fontWeight: 400,
                                      fontSize: pxToRem(13),
                                      color: '#374151',
                                    }}
                                  >
                                    {policy.label}
                                  </Typography>
                                  <RowStack spacing={'10px'}>
                                    <Typography
                                      sx={{
                                        fontFamily: (theme) =>
                                          theme.typography.fontFamily,
                                        fontWeight: 600,
                                        fontSize: pxToRem(13),
                                        color: isOn ? '#2F6FED' : '#9CA3AF',
                                      }}
                                    >
                                      {isOn ? 'Required' : 'Not Required'}
                                    </Typography>
                                    <IOSSwitch
                                      checked={isOn}
                                      onChange={() =>
                                        setFieldValue(policy.field, !isOn)
                                      }
                                    />
                                  </RowStack>
                                </RowStack>
                              </Box>
                            );
                          })}
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </AppDashboardLayout>
  );
};
