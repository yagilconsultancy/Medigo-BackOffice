'use client';

import { Box, Grid, Stack, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppGridtable,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RouteRow = {
  id: string;
  route: string;
  standard: string;
  wheelchair: string;
  stretcher: string;
};

type PriceChange = {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  iconBg: string;
  date: string;
  status: 'Active' | 'Pending';
  changedBy: string;
  oldPrice: string;
  newPrice: string;
};

type HealthItem = {
  id: string;
  text: string;
  type: 'ok' | 'warning';
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const routeData: RouteRow[] = [
  {
    id: '1',
    route: 'Local (Milton)',
    standard: '$14.56',
    wheelchair: '$54.56',
    stretcher: '$131.56',
  },
  {
    id: '2',
    route: 'Georgetown',
    standard: '$22.06',
    wheelchair: '$55.36',
    stretcher: '$149.56',
  },
  {
    id: '3',
    route: 'Oakville',
    standard: '$35.56',
    wheelchair: '$72.16',
    stretcher: '$177.56',
  },
  {
    id: '4',
    route: 'Burlington',
    standard: '$40.06',
    wheelchair: '$78.76',
    stretcher: '$192.06',
  },
  {
    id: '5',
    route: 'Brampton',
    standard: '$44.56',
    wheelchair: '$85.36',
    stretcher: '$205.56',
  },
  {
    id: '6',
    route: 'Mississauga',
    standard: '$57.31',
    wheelchair: '$105.06',
    stretcher: '$236.31',
  },
];

const priceChanges: PriceChange[] = [
  {
    id: '1',
    title: 'Base Fare (≤10 km)',
    category: 'Standard',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    iconBg: '#EBF2FF',
    date: 'Mar 20 · 2:10 PM',
    status: 'Active',
    changedBy: 'Marcus Bell',
    oldPrice: '$11.00',
    newPrice: '$12.00',
  },
  {
    id: '2',
    title: 'Accessibility Fee',
    category: 'Wheelchair (WAV)',
    categoryColor: '#6366F1',
    categoryBg: '#EEF2FF',
    iconBg: '#EEF2FF',
    date: 'Mar 19 · 10:30 AM',
    status: 'Active',
    changedBy: 'Angela Brooks',
    oldPrice: '$12.00',
    newPrice: '$15.00',
  },
  {
    id: '3',
    title: 'Per-km Rate (>10 km)',
    category: 'Standard',
    categoryColor: '#2F6FED',
    categoryBg: '#EBF2FF',
    iconBg: '#EBF2FF',
    date: 'Mar 18 · 4:45 PM',
    status: 'Active',
    changedBy: 'Marcus Bell',
    oldPrice: '$1.80',
    newPrice: '$2.00',
  },
  {
    id: '4',
    title: 'Stretcher Surcharge',
    category: 'Stretcher',
    categoryColor: '#EF4444',
    categoryBg: '#FEF2F2',
    iconBg: '#FEF2F2',
    date: 'Mar 17 · 9:15 AM',
    status: 'Active',
    changedBy: 'Kevin Walsh',
    oldPrice: '$80.00',
    newPrice: '$85.00',
  },
  {
    id: '5',
    title: 'Wait Time Rate',
    category: 'Wheelchair (WAV)',
    categoryColor: '#6366F1',
    categoryBg: '#EEF2FF',
    iconBg: '#EEF2FF',
    date: 'Mar 16 · 1:00 PM',
    status: 'Active',
    changedBy: 'Angela Brooks',
    oldPrice: '$0.40',
    newPrice: '$0.50',
  },
];

const healthItems: HealthItem[] = [
  {
    id: '1',
    text: 'Standard Vehicle fares configured (Milton area)',
    type: 'ok',
  },
  { id: '2', text: 'WAV accessibility fee set ($15.00)', type: 'ok' },
  { id: '3', text: 'WAV minimum fare protection active ($45.00)', type: 'ok' },
  { id: '4', text: 'Stretcher attendant fee configured ($35.00)', type: 'ok' },
  { id: '5', text: 'Surge rules set for all service types', type: 'ok' },
  {
    id: '6',
    text: 'PSW Caregiver rates defined ($38/hr → $34/hr)',
    type: 'ok',
  },
  { id: '7', text: 'Toll charges confirmed for Hwy 407 routes', type: 'ok' },
  {
    id: '8',
    text: 'Hospital Discharge Package — pending launch review (Apr 2026)',
    type: 'warning',
  },
  { id: '9', text: 'Dialysis monthly packages — renewal due', type: 'warning' },
];

// ─── Stat Cards Config ──────────────────────────────────────────────────────

const statCards = [
  {
    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 22, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    value: '$1.24M',
    label: 'Monthly Revenue',
    badge: '+14.2%',
  },
  {
    icon: <TrendingUpOutlinedIcon sx={{ fontSize: 22, color: '#10B981' }} />,
    iconBg: '#ECFDF5',
    value: '$42.80',
    label: 'Avg. Trip Value',
    badge: '+8.5%',
  },
  {
    icon: <CategoryOutlinedIcon sx={{ fontSize: 22, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
    value: '5',
    label: 'Active Service Types',
    badge: '12 zones',
  },
  {
    icon: (
      <WorkspacePremiumOutlinedIcon sx={{ fontSize: 22, color: '#F59E0B' }} />
    ),
    iconBg: '#FFFBEB',
    value: '38%',
    label: 'Premium Services',
    badge: '+3.2%',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const PricingDashboardPage = () => {
  const columns: GridColSpec<RouteRow>[] = [
    {
      field: 'route',
      headerName: 'Route Destination',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <RowStack spacing={'8px'}>
          <LocationOnOutlinedIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13.5),
              color: '#111827',
            }}
          >
            {params.value}
          </Typography>
        </RowStack>
      ),
    },
    {
      field: 'standard',
      headerName: 'Standard',
      flex: 0.9,
      minWidth: 120,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'wheelchair',
      headerName: 'Wheelchair (WAV)',
      flex: 1.2,
      minWidth: 150,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'stretcher',
      headerName: 'Stretcher',
      flex: 0.9,
      minWidth: 120,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#111827',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Pricing Management"
          desc="Manage fare zones, surcharges, packages, and pricing rules across all cities"
        />

        {/* Stat Cards */}
        <Grid container spacing={'20px'}>
          {statCards.map((card, index) => (
            <Grid key={index} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
                  padding: '24px',
                  height: '100%',
                }}
              >
                <RowStack justifyContent="space-between">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      background: card.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <RowStack
                    spacing={'6px'}
                    sx={{
                      background: '#F7F9FB',
                      border: '0.67px solid #E8ECF0',
                      borderRadius: '100px',
                      padding: '4px 10px',
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 12, color: '#10B981' }} />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(12),
                        color: '#10B981',
                      }}
                    >
                      {card.badge}
                    </Typography>
                  </RowStack>
                </RowStack>

                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 800,
                    fontSize: pxToRem(32),
                    lineHeight: '1em',
                    letterSpacing: '-0.02em',
                    color: '#111827',
                    marginTop: '20px',
                  }}
                >
                  {card.value}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(13.5),
                    color: '#6B7280',
                    marginTop: '14px',
                  }}
                >
                  {card.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Route Pricing Comparison Table */}
        <AppGridtable
          columns={columns}
          data={routeData}
          initialPageSize={10}
          hidePagination
          disableRowClick
          sx={{
            height: 'auto',
            width: '100%',
          }}
        >
          <Stack spacing={'3px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(16),
                color: '#111827',
              }}
            >
              Route Pricing Comparison
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#6B7280',
              }}
            >
              Milton-area routes — estimated fare across service types
            </Typography>
          </Stack>
        </AppGridtable>

        {/* Bottom Grid: Recent Price Changes + Pricing Health */}
        <Stack direction="row" spacing={'20px'} sx={{ alignItems: 'stretch' }}>
          {/* Recent Pricing Changes */}
          <Stack
            sx={{
              flex: 2,
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            <Stack
              spacing={'3px'}
              sx={{
                padding: '20px 24px',
                borderBottom: '0.67px solid #F0F4F8',
                background: 'linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(16),
                  color: '#111827',
                }}
              >
                Recent Pricing Changes
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                Latest updates across all service types and fare zones
              </Typography>
            </Stack>

            <Stack spacing={'12px'} sx={{ padding: '24px' }}>
              {priceChanges.map((change) => (
                <PriceChangeCard key={change.id} change={change} />
              ))}
            </Stack>
          </Stack>

          {/* Pricing Health */}
          <Stack
            sx={{
              flex: 1,
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            <Stack
              spacing={'8px'}
              sx={{
                padding: '20px 24px',
                borderBottom: '0.67px solid #F0F4F8',
                background: 'linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 100%)',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(16),
                  color: '#111827',
                }}
              >
                Pricing Health
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#6B7280',
                }}
              >
                Configuration checklist
              </Typography>
            </Stack>

            <Stack spacing={'10px'} sx={{ padding: '20px' }}>
              {healthItems.map((item) => (
                <HealthCheckItem key={item.id} item={item} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const PriceChangeCard = ({ change }: { change: PriceChange }) => (
  <Stack
    spacing={'12px'}
    sx={{
      background: '#FAFBFC',
      border: '0.67px solid #F0F4F8',
      borderRadius: '14px',
      padding: '16px',
    }}
  >
    {/* Top Row */}
    <RowStack justifyContent="space-between">
      {/* Left: Icon + Title + Category */}
      <RowStack spacing={'12px'}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: change.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AttachMoneyOutlinedIcon
            sx={{ fontSize: 16, color: change.categoryColor }}
          />
        </Box>
        <Stack>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(14),
              color: '#111827',
              lineHeight: '1.5em',
            }}
          >
            {change.title}
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              padding: '2px 10px',
              borderRadius: '100px',
              background: change.categoryBg,
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(10.5),
                color: change.categoryColor,
              }}
            >
              {change.category}
            </Typography>
          </Box>
        </Stack>
      </RowStack>

      {/* Right: Date + Status */}
      <Stack alignItems="flex-end" spacing={'4px'}>
        <RowStack spacing={'6px'}>
          <AccessTimeOutlinedIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(11.5),
              color: '#9CA3AF',
            }}
          >
            {change.date}
          </Typography>
        </RowStack>
        <Box
          sx={{
            padding: '2px 10px',
            borderRadius: '100px',
            background: '#ECFDF5',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(10.5),
              color: '#059669',
            }}
          >
            {change.status}
          </Typography>
        </Box>
      </Stack>
    </RowStack>

    {/* Bottom Row */}
    <RowStack justifyContent="space-between">
      {/* Changed By */}
      <RowStack spacing={'8px'}>
        <PersonOutlineOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(12.5),
            color: '#6B7280',
          }}
        >
          {change.changedBy}
        </Typography>
      </RowStack>

      {/* Price Change */}
      <RowStack spacing={'12px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: '#9CA3AF',
          }}
        >
          {change.oldPrice}
        </Typography>
        <ArrowForwardIcon sx={{ fontSize: 14, color: '#10B981' }} />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 800,
            fontSize: pxToRem(15),
            color: '#10B981',
          }}
        >
          {change.newPrice}
        </Typography>
      </RowStack>
    </RowStack>
  </Stack>
);

const HealthCheckItem = ({ item }: { item: HealthItem }) => {
  const isWarning = item.type === 'warning';
  return (
    <RowStack
      spacing={'12px'}
      sx={{
        background: isWarning ? '#FEF2F2' : 'rgba(232, 236, 240, 0.18)',
        border: `1.33px solid ${isWarning ? '#FECACA' : 'rgba(75, 85, 99, 0.05)'}`,
        borderRadius: '14px',
        padding: '14px 13px',
      }}
    >
      {isWarning ? (
        <ErrorOutlineIcon
          sx={{ fontSize: 15, color: '#EF4444', flexShrink: 0 }}
        />
      ) : (
        <CheckCircleOutlineIcon
          sx={{ fontSize: 15, color: '#374151', flexShrink: 0 }}
        />
      )}
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(12),
          lineHeight: '1.5em',
          color: isWarning ? '#991B1B' : '#374151',
        }}
      >
        {item.text}
      </Typography>
    </RowStack>
  );
};
