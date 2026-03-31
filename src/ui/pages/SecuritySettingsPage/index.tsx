'use client';

import { useState } from 'react';
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
  AppTextField,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { pxToRem } from '../../../common';

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

type ToggleSetting = {
  id: string;
  name: string;
  description: string;
  status: 'Enabled' | 'Active' | 'Always On' | 'Off';
  isOn: boolean;
  locked?: boolean;
};

type PolicyRow = {
  label: string;
  value: string;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const initialAuthSettings: ToggleSetting[] = [
  {
    id: '1',
    name: 'Two-Factor Authentication (2FA)',
    description: 'Require all admins to use 2FA on every login',
    status: 'Enabled',
    isOn: true,
  },
  {
    id: '2',
    name: 'IP Geo-Blocking',
    description: 'Block login attempts from non-Canadian IP addresses',
    status: 'Active',
    isOn: true,
  },
  {
    id: '3',
    name: 'IP Whitelist (Allowlist)',
    description: 'Only allow logins from pre-approved IP addresses',
    status: 'Off',
    isOn: false,
  },
  {
    id: '4',
    name: 'Audit Logging',
    description: 'Record all admin actions in the activity log',
    status: 'Always On',
    isOn: true,
    locked: true,
  },
];

const passwordPolicyRows: PolicyRow[] = [
  { label: 'Minimum password length', value: '12 characters' },
  { label: 'Require uppercase letters', value: 'Required' },
  { label: 'Require special characters', value: 'Required' },
  { label: 'Password expiry', value: '90 days' },
  { label: 'Password history', value: 'Last 5' },
];

// ─── Stat Card Data ─────────────────────────────────────────────────────────

const statCards = [
  {
    value: '8/8',
    label: '2FA Enabled',
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
    iconBg: '#ECFDF5',
  },
  {
    value: 'Strict',
    label: 'Password Policy',
    icon: <GppGoodOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
  },
  {
    value: '4h',
    label: 'Session Timeout',
    icon: <TimerOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
  },
  {
    value: '14',
    label: 'Threats Blocked',
    icon: <ShieldOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
    iconBg: '#FFFBEB',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const SecuritySettingsPage = () => {
  const [authSettings, setAuthSettings] =
    useState<ToggleSetting[]>(initialAuthSettings);
  const [sessionTimeout, setSessionTimeout] = useState('4');
  const [maxAttempts, setMaxAttempts] = useState('5');

  const handleToggle = (id: string) => {
    setAuthSettings((prev) =>
      prev.map((s) => {
        if (s.id === id && !s.locked) {
          const newIsOn = !s.isOn;
          return {
            ...s,
            isOn: newIsOn,
            status: newIsOn
              ? s.status === 'Off'
                ? 'Enabled'
                : s.status
              : 'Off',
          };
        }
        return s;
      })
    );
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Security Settings"
            desc="Configure authentication policies, session controls, and platform security rules"
          />
          <AppButton
            variant="contained"
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
              {authSettings.map((setting, index) => (
                <Box key={setting.id}>
                  {index > 0 && <Divider sx={{ borderColor: '#F0F4F8' }} />}
                  <RowStack
                    justifyContent={'space-between'}
                    sx={{ padding: '16px 0' }}
                  >
                    <Stack spacing={'4px'} sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13.5),
                          color: '#111827',
                        }}
                      >
                        {setting.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
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
                          background: setting.isOn
                            ? 'rgba(16, 185, 129, 0.09)'
                            : 'rgba(156, 163, 175, 0.09)',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 500,
                            fontSize: pxToRem(11.5),
                            color: setting.isOn ? '#10B981' : '#9CA3AF',
                          }}
                        >
                          {setting.status}
                        </Typography>
                      </Box>
                      <IOSSwitch
                        checked={setting.isOn}
                        disabled={setting.locked}
                        onChange={() => handleToggle(setting.id)}
                      />
                    </RowStack>
                  </RowStack>
                </Box>
              ))}
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
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12.5),
                        color: (theme) => theme.color.deepBlue,
                        lineHeight: '19px',
                      }}
                    >
                      Session Timeout (hours)
                    </Typography>
                    <AppTextField
                      type="number"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      sx={{
                        width: '100%',
                        // padding: '10px 14px',
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
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(11.5),
                        color: '#9CA3AF',
                        lineHeight: '17.25px',
                      }}
                    >
                      Admin sessions expire after this period of inactivity
                    </Typography>
                  </Stack>

                  <Divider sx={{ borderColor: '#F0F4F8' }} />

                  {/* Max Failed Login Attempts */}
                  <Stack spacing={'6px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12.5),
                        color: (theme) => theme.color.deepBlue,
                        lineHeight: '19px',
                      }}
                    >
                      Max Failed Login Attempts
                    </Typography>
                    <AppTextField
                      type="number"
                      value={maxAttempts}
                      onChange={(e) => setMaxAttempts(e.target.value)}
                      sx={{
                        width: '100%',
                        // padding: '10px 14px',
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
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(11.5),
                        color: '#9CA3AF',
                        lineHeight: '17.25px',
                      }}
                    >
                      Account locks after this many failed login attempts
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

                <Stack spacing={'0px'} sx={{ flex: 1 }}>
                  {passwordPolicyRows.map((row, index) => (
                    <Box key={row.label}>
                      {index > 0 && <Divider sx={{ borderColor: '#F0F4F8' }} />}
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
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(13),
                            color: '#374151',
                          }}
                        >
                          {row.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(13),
                            color: '#2F6FED',
                          }}
                        >
                          {row.value}
                        </Typography>
                      </RowStack>
                    </Box>
                  ))}
                </Stack>

                <AppButton
                  variant="contained"
                  sx={{
                    background: '#2F6FED',
                    color: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '10px 24px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    fontFamily: (theme) => theme.typography.fontFamily,
                    boxShadow: 'none',
                    alignSelf: 'flex-start',
                    marginTop: '20px',
                    '&:hover': {
                      background: '#2558C9',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Update Policy
                </AppButton>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
