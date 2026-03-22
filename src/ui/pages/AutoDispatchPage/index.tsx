'use client';

import {
  alpha,
  Box,
  Chip,
  Grid,
  Stack,
  Switch,
  SwitchProps,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { AppButton, DashboardTitleAndDesc, RowStack, StyledImage } from '../../modules/components';
import { pxToRem } from '../../../common';
import { useState } from 'react';
import { toast } from 'sonner';
import settingIcon from './ui/assets/icons/setting-icon.svg';

// ─── iOS-style Switch ────────────────────────────────────────────────────────

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#2F6FED',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#2F6FED',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

// ─── Types ──────────────────────────────────────────────────────────────────

type DistanceRadius = '2' | '5' | '10' | '15';

type FallbackOption = 'expandRadius' | 'notifyDispatch' | 'notifyRider';

// ─── Component ──────────────────────────────────────────────────────────────

export const AutoDispatchPage = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedRadius, setSelectedRadius] = useState<DistanceRadius>('5');
  const [prioritizeRating, setPrioritizeRating] = useState(true);
  const [prioritizeFleet, setPrioritizeFleet] = useState(false);
  const [matchVehicleType, setMatchVehicleType] = useState(true);
  const theme = useTheme()
  const [fallbackOptions, setFallbackOptions] = useState<Set<FallbackOption>>(
    new Set(['expandRadius', 'notifyDispatch'])
  );

  const toggleFallback = (option: FallbackOption) => {
    setFallbackOptions((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  };

  const handleSave = () => {
    toast.success('Auto dispatch settings saved successfully');
  };

  const distanceOptions: { value: DistanceRadius; label: string }[] = [
    { value: '2', label: '2 Kilometer radius' },
    { value: '5', label: '5 Kilometer radius' },
    { value: '10', label: '10 Kilometer radius' },
    { value: '15', label: '15 Kilometer radius' },
  ];

  const priorityRules = [
    {
      label: 'Prioritize by driver rating',
      description: 'Prefer higher-rated drivers',
      checked: prioritizeRating,
      onChange: () => setPrioritizeRating(!prioritizeRating),
    },
    {
      label: 'Prioritize by fleet',
      description: 'Prefer MediGo-owned drivers first',
      checked: prioritizeFleet,
      onChange: () => setPrioritizeFleet(!prioritizeFleet),
    },
    {
      label: 'Match vehicle type',
      description: 'Only assign compatible vehicle categories',
      checked: matchVehicleType,
      onChange: () => setMatchVehicleType(!matchVehicleType),
    },
  ];

  const fallbackItems: {
    key: FallbackOption;
    label: string;
    description: string;
    dotColor: string;
    selectedBg: string;
  }[] = [
    {
      key: 'expandRadius',
      label: 'Expand search radius',
      description: 'Automatically increase radius by 2 Kilometer and retry',
      dotColor: '#059669',
      selectedBg: '#ECFDF5',
    },
    {
      key: 'notifyDispatch',
      label: 'Notify dispatch team',
      description: 'Alert an admin to manually assign a driver',
      dotColor: '#EF4444',
      selectedBg: '#FEF2F2',
    },
    {
      key: 'notifyRider',
      label: 'Notify rider',
      description: 'Send the rider an update on the delay',
      dotColor: '#6B7280',
      selectedBg: '#F3F4F6',
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc 
         title='Auto Dispatch Settings'
         desc="Configure rules and logic for automatic driver-to-ride matching"
        />

        {/* Auto Dispatch Engine Card */}
        <RowStack
          justifyContent="space-between"
          sx={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '0.67px solid #EAECF0',
          }}
        >
          <RowStack spacing={'14px'}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#EBF2FF',
                border: '1.5px solid #2F6FED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <StyledImage
                src={settingIcon}
                alt="auto-dispatch"
                width={22}
                height={22}
              />
            </Box>
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: (theme) => theme.color.deepBlue,
                }}
              >
                Auto Dispatch Engine
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: (theme) => theme.color.lightGrey,
                }}
              >
                When enabled, the system automatically assigns the nearest
                suitable driver to incoming bookings.
              </Typography>
            </Stack>
          </RowStack>
          <RowStack spacing={'8px'} sx={{ flexShrink: 0 }}>
            <Chip 
             label={isEnabled ? 'Enabled' : 'Disabled'}
             sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12.5),
                color: isEnabled ? '#059669' : theme.color.lightGrey,
                background: isEnabled ? alpha("#059669", .1) : alpha(theme.color.lightGrey, .1)
             }}
            />
            <IOSSwitch
              checked={isEnabled}
              onChange={() => setIsEnabled(!isEnabled)}
            />
          </RowStack>
        </RowStack>

        {/* Distance Matching Logic + Dispatch Priority Rules */}
        <Grid container spacing={'20px'}>
          {/* Left: Distance Matching Logic */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack
              spacing={'16px'}
              sx={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 24px',
                border: '0.67px solid #EAECF0',
                height: '100%',
              }}
            >
              <Stack spacing={'4px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(15),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  Distance Matching Logic
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  Maximum radius to search for available drivers
                </Typography>
              </Stack>

              <Stack spacing={'10px'}>
                {distanceOptions.map((option) => {
                  const isSelected = selectedRadius === option.value;
                  return (
                    <RowStack
                      key={option.value}
                      spacing={'12px'}
                      onClick={() => setSelectedRadius(option.value)}
                      sx={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: isSelected
                          ? '1.5px solid #2F6FED'
                          : '1px solid #EAECF0',
                        background: isSelected ? '#EBF2FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        '&:hover': {
                          borderColor: isSelected ? '#2F6FED' : '#D1D5DB',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          border: isSelected
                            ? '5px solid #2F6FED'
                            : '2px solid #D1D5DB',
                          flexShrink: 0,
                          transition: 'all 0.15s',
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: pxToRem(13),
                          color: isSelected
                            ? '#2F6FED'
                            : (theme) => theme.color.deepBlue,
                        }}
                      >
                        {option.label}
                      </Typography>
                    </RowStack>
                  );
                })}
              </Stack>
            </Stack>
          </Grid>

          {/* Right: Dispatch Priority Rules */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack
              spacing={'16px'}
              sx={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 24px',
                border: '0.67px solid #EAECF0',
                height: '100%',
              }}
            >
              <Stack spacing={'4px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(15),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  Dispatch Priority Rules
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  Configure how drivers are ranked during auto-assignment
                </Typography>
              </Stack>

              <Stack spacing={'0px'} sx={{ flex: 1 }}>
                {priorityRules.map((rule, index) => (
                  <RowStack
                    key={rule.label}
                    justifyContent="space-between"
                    sx={{
                      padding: '16px 0',
                      borderBottom:
                        index < priorityRules.length - 1
                          ? '0.67px solid #F3F4F6'
                          : 'none',
                    }}
                  >
                    <Stack spacing={'2px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13),
                          color: (theme) => theme.color.deepBlue,
                        }}
                      >
                        {rule.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: (theme) => theme.color.lightGrey,
                        }}
                      >
                        {rule.description}
                      </Typography>
                    </Stack>
                    <IOSSwitch
                      checked={rule.checked}
                      onChange={rule.onChange}
                    />
                  </RowStack>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Fallback Behavior */}
        <Stack
          spacing={'16px'}
          sx={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '0.67px solid #EAECF0',
          }}
        >
          <Stack spacing={'4px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(15),
                color: (theme) => theme.color.deepBlue,
              }}
            >
              Fallback Behavior
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: (theme) => theme.color.lightGrey,
              }}
            >
              What happens when no driver is found within the search radius
            </Typography>
          </Stack>

          <RowStack spacing={'12px'} flexWrap="wrap">
            {fallbackItems.map((item) => {
              const isSelected = fallbackOptions.has(item.key);
              return (
                <Stack
                  key={item.key}
                  onClick={() => toggleFallback(item.key)}
                  sx={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: isSelected ? item.selectedBg : '#F7F9FB',
                    border: isSelected
                      ? `1px solid ${item.dotColor}20`
                      : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <RowStack spacing={'8px'} sx={{ marginBottom: '4px' }}>
                    <CheckCircleIcon
                      sx={{
                        width: 18,
                        height: 18,
                        color: isSelected ? item.dotColor : '#D1D5DB',
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12.5),
                        color: isSelected
                          ? (theme) => theme.color.deepBlue
                          : (theme) => theme.color.lightGrey,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </RowStack>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11),
                      color: (theme) => theme.color.lightGrey,
                      paddingLeft: '16px',
                    }}
                  >
                    {item.description}
                  </Typography>
                </Stack>
              );
            })}
          </RowStack>
        </Stack>

        {/* Save Button */}
        <Box>
          <AppButton
            onClick={handleSave}
            sx={{
              background: (theme) => theme.palette.primary.main,
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: pxToRem(13),
              borderRadius: '10px',
              padding: '12px 32px',
              '&:hover': {
                background: '#2563EB',
              },
            }}
          >
            Save Settings
          </AppButton>
        </Box>
      </Stack>
    </AppDashboardLayout>
  );
};
