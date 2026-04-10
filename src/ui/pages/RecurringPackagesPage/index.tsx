'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  Stack,
  Switch,
  Typography,
  styled,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  pxToRem,
  useResolvedApiQuery,
  useGetPackageKpis,
  useListPackages,
  RidePackage,
  PackageKPIs,
} from '../../../common';
import { usePaymentPricingApi } from '../../../common/hooks/api';
import { ReactNode } from 'react';
import { CreatePackageModal } from './CreatePackageModal';

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

// ─── Types ──────────────────────────────────────────────────────────────────

type PackageUI = RidePackage & {
  icon: ReactNode;
  iconBg: string;
  categoryColor: string;
  categoryBg: string;
};

// Helper function to get icon and colors based on package_type
const getPackageStyle = (packageType: string) => {
  const styles: Record<
    string,
    { icon: ReactNode; iconBg: string; color: string; bg: string }
  > = {
    rider: {
      icon: <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
      color: '#2F6FED',
      bg: '#EBF2FF',
    },
    corporate: {
      icon: <BusinessOutlinedIcon sx={{ fontSize: 18, color: '#EC4899' }} />,
      iconBg: '#FDF2F8',
      color: '#EC4899',
      bg: '#FDF2F8',
    },
    subscription: {
      icon: (
        <AllInclusiveOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />
      ),
      iconBg: '#EEF2FF',
      color: '#6366F1',
      bg: '#EEF2FF',
    },
    medical: {
      icon: (
        <MedicalServicesOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
      ),
      iconBg: '#F3F4F6',
      color: '#9CA3AF',
      bg: '#F3F4F6',
    },
    default: {
      icon: <Inventory2OutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
      iconBg: '#EEF2FF',
      color: '#6366F1',
      bg: '#EEF2FF',
    },
  };

  return styles[packageType.toLowerCase()] || styles.default;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const RecurringPackagesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { togglePackage } = usePaymentPricingApi();

  // Fetch KPIs and packages from API
  const { data: packageKpis } = useResolvedApiQuery(useGetPackageKpis, null);
  const { data: packageListData } = useResolvedApiQuery(useListPackages, {
    packages: [],
  });

  const kpiData = useMemo<PackageKPIs | undefined>(() => {
    return packageKpis ? packageKpis : undefined;
  }, [packageKpis]);

  const packages = useMemo<RidePackage[]>(() => {
    return packageListData?.packages || [];
  }, [packageListData]);

  const activeCount = (kpiData as any)?.active_count ?? 0;
  const totalPackages = packages.length;
  const packageTypes =
    (kpiData as any)?.type_count ??
    new Set(packages.map((p) => p.package_type)).size;

  const handleToggle = async (id: string) => {
    await togglePackage(id);
  };

  const filteredPackages = packages;

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <DashboardTitleAndDesc
            title="Recurring Packages"
            desc="Create and manage subscription-based or bundled ride plans with fixed pricing and usage limits."
          />
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
            sx={{
              background: '#2F6FED',
              color: '#FFFFFF',
              borderRadius: '14px',
              padding: '10px 20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: pxToRem(13.5),
              fontFamily: (theme) => theme.typography.fontFamily,
              height: 44,
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: '#2558C9',
                boxShadow: 'none',
              },
            }}
          >
            Create Package
          </AppButton>
        </RowStack>

        {/* Stat Cards */}
        <RowStack spacing={'12px'}>
          {/* Active Packages */}
          <RowStack
            spacing={'12px'}
            sx={{
              flex: 1,
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
              padding: '0px 20px',
              height: 120,
            }}
          > 
            <Stack spacing={'9px'} sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                Active Packages
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(26),
                  lineHeight: '0.85em',
                  color: '#111827',
                }}
              >
                {activeCount}/{totalPackages}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '16px',
                background: '#EBF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 19, color: '#2F6FED' }} />
            </Box>
          </RowStack>

          {/* Total Subscribers */}
          <RowStack
            spacing={'12px'}
            sx={{
              flex: 1,
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
              padding: '0px 20px',
              height: 120,
            }}
          >
            <Stack spacing={'9px'} sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                Total Subscribers
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(26),
                  lineHeight: '0.85em',
                  color: '#111827',
                }}
              >
                {(kpiData as any)?.total_subscribers ?? 0}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '16px',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PeopleOutlineIcon sx={{ fontSize: 19, color: '#059669' }} />
            </Box>
          </RowStack>

          {/* Package Types */}
          <RowStack
            spacing={'12px'}
            sx={{
              flex: 1,
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
              padding: '0px 20px',
              height: 120,
            }}
          >
            <Stack spacing={'9px'} sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#6B7280',
                }}
              >
                Package Types
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(26),
                  lineHeight: '0.85em',
                  color: '#111827',
                }}
              >
                {packageTypes}
              </Typography>
            </Stack>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '16px',
                background: '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Inventory2OutlinedIcon sx={{ fontSize: 19, color: '#6366F1' }} />
            </Box>
          </RowStack>
        </RowStack>

        {/* Packages List Card */}
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
            spacing={'16px'}
            sx={{
              padding: '16px 24px',
              borderBottom: '0.67px solid #F0F4F8',
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
                All Packages
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                Ride bundles, subscriptions, and corporate plans
              </Typography>
            </Stack>
          </Stack>

          {/* Package Cards Grid */}
          <Grid container spacing={'16px'} sx={{ padding: '24px' }}>
            {filteredPackages.map((pkg) => (
              <Grid key={pkg.id} size={{ xs: 12, md: 6 }}>
                <PackageCard pkg={pkg} onToggle={() => handleToggle(pkg.id)} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>

      {/* Create Package Modal */}
      <CreatePackageModal
        open={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
      />
    </AppDashboardLayout>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const PackageCard = ({
  pkg,
  onToggle,
}: {
  pkg: RidePackage;
  onToggle: () => void;
}) => {
  const isInactive = !pkg.is_active;
  const style = getPackageStyle(pkg.package_type);

  return (
    <Stack
      spacing={'16px'}
      sx={{
        background: '#F7F9FB',
        border: '0.67px solid #F0F4F8',
        borderRadius: '16px',
        padding: '20px',
        opacity: isInactive ? 0.7 : 1,
      }}
    >
      {/* Top Row: Icon + Title/Category + Switch */}
      <RowStack justifyContent="space-between">
        <RowStack spacing={'12px'}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '14px',
              background: isInactive ? '#F3F4F6' : style.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {style.icon}
          </Box>
          <Stack spacing={'4px'}>
            <RowStack spacing={'8px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: '#111827',
                }}
              >
                {pkg.name}
              </Typography>
              <Chip
                label={pkg.package_type}
                size="small"
                sx={{
                  background: style.bg,
                  color: style.color,
                  fontWeight: 600,
                  fontSize: pxToRem(10.5),
                  height: 22,
                  borderRadius: '100px',
                  textTransform: 'capitalize',
                }}
              />
            </RowStack>
          </Stack>
        </RowStack>
        <IOSSwitch checked={pkg.is_active} onChange={onToggle} />
      </RowStack>

      {/* Description */}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(13),
          color: '#9CA3AF',
        }}
      >
        {pkg.description}
      </Typography>

      {/* Stats Row: Price, Rides, Discount, Validity */}
      <Grid container spacing={'12px'}>
        {[
          {
            label: 'Price',
            value: `$${typeof pkg.price === 'number' ? pkg.price.toFixed(2) : Number(pkg.price || 0).toFixed(2)}`,
          },
          {
            label: 'Rides',
            value: (pkg as any).is_unlimited
              ? 'Unlimited'
              : `${(pkg as any).ride_count ?? 0} rides`,
          },
          {
            label: 'Discount',
            value: (pkg as any).discount_percent
              ? `${Number((pkg as any).discount_percent).toFixed(0)}% off`
              : 'N/A',
          },
          { label: 'Validity', value: `${pkg.validity_days} days` },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Stack
              sx={{
                background: '#FFFFFF',
                border: '0.67px solid #F0F4F8',
                borderRadius: '14px',
                padding: '14px 16px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(11),
                  color: '#9CA3AF',
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(16),
                  color: '#374151',
                }}
              >
                {stat.value}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>

      {/* Footer: Status Badge */}
      <RowStack
        justifyContent="flex-end"
        sx={{
          borderTop: '0.67px solid #E8ECF0',
          paddingTop: '12px',
        }}
      >
        <Box
          sx={{
            padding: '4px 12px',
            borderRadius: '20px',
            background: pkg.is_active ? '#ECFDF5' : '#F3F4F6',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11),
              color: pkg.is_active ? '#059669' : '#9CA3AF',
            }}
          >
            {pkg.is_active ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
      </RowStack>
    </Stack>
  );
};
