'use client';

import { useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  Stack,
  Switch,
  Typography,
  styled,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlineOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import AllInclusiveOutlinedIcon from '@mui/icons-material/AllInclusiveOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { pxToRem } from '../../../common';
import { ReactNode } from 'react';

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

type Package = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  price: string;
  rides: string;
  discount: string;
  validity: string;
  subscribers: number;
  active: boolean;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const initialPackages: Package[] = [
  {
    id: 'ride_bundle_10',
    title: '10-Ride Bundle',
    description: 'Prepaid bundle of 10 standard rides',
    icon: <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    category: 'Rider',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    price: '$79.00',
    rides: '10 rides',
    discount: '7% off',
    validity: '60 days',
    subscribers: 312,
    active: true,
  },
  {
    id: 'ride_bundle_20',
    title: '20-Ride Bundle',
    description: 'Prepaid bundle of 20 standard rides — best value',
    icon: <LocalOfferOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
    iconBg: '#ECFDF5',
    category: 'Rider',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    price: '$145.00',
    rides: '20 rides',
    discount: '14% off',
    validity: '90 days',
    subscribers: 198,
    active: true,
  },
  {
    id: 'monthly_unlimited',
    title: 'Monthly Unlimited',
    description: 'Unlimited standard rides within one calendar month',
    icon: <AllInclusiveOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
    category: 'Subscription',
    categoryColor: '#6366F1',
    categoryBg: '#EEF2FF',
    price: '$189.00',
    rides: 'Unlimited',
    discount: 'Up to 20%',
    validity: '30 days',
    subscribers: 87,
    active: true,
  },
  {
    id: 'corporate_50',
    title: 'Corporate Plan \u2013 50',
    description: '50-ride block for corporate accounts & healthcare orgs',
    icon: <BusinessOutlinedIcon sx={{ fontSize: 18, color: '#EC4899' }} />,
    iconBg: '#FDF2F8',
    category: 'Corporate',
    categoryColor: '#EC4899',
    categoryBg: '#FDF2F8',
    price: '$340.00',
    rides: '50 rides',
    discount: '20% off',
    validity: '120 days',
    subscribers: 24,
    active: true,
  },
  {
    id: 'corporate_100',
    title: 'Corporate Plan \u2013 100',
    description: '100-ride block — priority dispatch + invoice billing',
    icon: <BusinessOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />,
    iconBg: '#FFFBEB',
    category: 'Corporate',
    categoryColor: '#EC4899',
    categoryBg: '#FDF2F8',
    price: '$620.00',
    rides: '100 rides',
    discount: '27% off',
    validity: '180 days',
    subscribers: 11,
    active: true,
  },
  {
    id: 'community_access',
    title: 'Community Access',
    description: 'Subsidized plan for low-income riders — social program',
    icon: (
      <VolunteerActivismOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
    ),
    iconBg: '#F1F5F9',
    category: 'Rider',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    price: '$29.00',
    rides: '10 rides',
    discount: '65% off',
    validity: '30 days',
    subscribers: 156,
    active: true,
  },
  {
    id: 'medical_vip',
    title: 'Medical VIP Monthly',
    description: 'Priority Medical Priority + Wheelchair rides, monthly',
    icon: (
      <MedicalServicesOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
    ),
    iconBg: '#F3F4F6',
    category: 'Subscription',
    categoryColor: '#6366F1',
    categoryBg: '#EEF2FF',
    price: '$249.00',
    rides: 'Unlimited priority',
    discount: '15% off',
    validity: '30 days',
    subscribers: 43,
    active: false,
  },
];

// ─── Filter Tabs ────────────────────────────────────────────────────────────

const filterTabs = ['All', 'Rider', 'Corporate', 'Subscription'] as const;
type FilterTab = (typeof filterTabs)[number];

// ─── Component ──────────────────────────────────────────────────────────────

export const RecurringPackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const activeCount = packages.filter((p) => p.active).length;
  const totalSubscribers = packages.reduce((sum, p) => sum + p.subscribers, 0);
  const packageTypes = new Set(packages.map((p) => p.category)).size;

  const handleToggle = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const filteredPackages =
    activeFilter === 'All'
      ? packages
      : packages.filter((p) => p.category === activeFilter);

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Recurring Packages"
          desc="Create and manage subscription-based or bundled ride plans with fixed pricing and usage limits."
        />

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
                {activeCount}
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
                {totalSubscribers}
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

            {/* Filter Tabs */}
            <RowStack spacing={'0px'}>
              {filterTabs.map((tab) => (
                <Box
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  sx={{
                    padding: '6px 16px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    background:
                      activeFilter === tab ? '#2F6FED' : 'transparent',
                    border:
                      activeFilter === tab ? 'none' : '0.67px solid #E8ECF0',
                    marginLeft: activeFilter === tab ? 0 : '-0.67px',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(12.5),
                      color: activeFilter === tab ? '#FFFFFF' : '#6B7280',
                    }}
                  >
                    {tab}
                  </Typography>
                </Box>
              ))}
            </RowStack>
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
    </AppDashboardLayout>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const PackageCard = ({
  pkg,
  onToggle,
}: {
  pkg: Package;
  onToggle: () => void;
}) => {
  const isInactive = !pkg.active;

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
              background: isInactive ? '#F3F4F6' : pkg.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {pkg.icon}
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
                {pkg.title}
              </Typography>
              <Chip
                label={pkg.category}
                size="small"
                sx={{
                  background: pkg.categoryBg,
                  color: pkg.categoryColor,
                  fontWeight: 600,
                  fontSize: pxToRem(10.5),
                  height: 22,
                  borderRadius: '100px',
                }}
              />
            </RowStack>
          </Stack>
        </RowStack>
        <IOSSwitch checked={pkg.active} onChange={onToggle} />
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
          { label: 'Price', value: pkg.price },
          { label: 'Rides', value: pkg.rides },
          { label: 'Discount', value: pkg.discount },
          { label: 'Validity', value: pkg.validity },
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

      {/* Footer: Subscribers + Status Badge */}
      <RowStack
        justifyContent="space-between"
        sx={{
          borderTop: '0.67px solid #E8ECF0',
          paddingTop: '12px',
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#9CA3AF',
          }}
        >
          {pkg.subscribers} active subscribers
        </Typography>
        <Box
          sx={{
            padding: '4px 12px',
            borderRadius: '20px',
            background: pkg.active ? '#ECFDF5' : '#F3F4F6',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11),
              color: pkg.active ? '#059669' : '#9CA3AF',
            }}
          >
            {pkg.active ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
      </RowStack>
    </Stack>
  );
};
