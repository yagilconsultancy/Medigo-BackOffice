'use client';

import { useMemo } from 'react';
import { Box, Stack, Typography, Skeleton } from '@mui/material';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import MoneyOffOutlinedIcon from '@mui/icons-material/MoneyOffOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import {
  pxToRem,
  useGetCancellationKpis,
  useGetCancellationPolicies,
  useResolvedApiQuery,
} from '../../../common';
import { ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

type StatCard = {
  value: string;
  label: string;
  iconBg: string;
  icon: ReactNode;
};

type OverviewFeeRow = {
  window: string;
  ambulatory: string;
  wheelchair: string;
  stretcher: string;
};

type BreakdownRow = {
  window: string;
  fee: string;
  whoReceives: string;
  notes: string;
};

type ServiceBreakdown = {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  color: string;
  rows: BreakdownRow[];
  footnote: string;
};

// ─── Data ───────────────────────────────────────────────────────────────────

const statCards: StatCard[] = [
  {
    value: '3',
    label: 'Service Types',
    iconBg: '#EBF2FF',
    icon: <CategoryOutlinedIcon sx={{ fontSize: 19, color: '#2F6FED' }} />,
  },
  {
    value: '5',
    label: 'Fee Tiers',
    iconBg: '#EEF2FF',
    icon: <LayersOutlinedIcon sx={{ fontSize: 19, color: '#6366F1' }} />,
  },
  {
    value: '$85',
    label: 'Max No-Show Fee',
    iconBg: '#FEF2F2',
    icon: <MoneyOffOutlinedIcon sx={{ fontSize: 19, color: '#EF4444' }} />,
  },
  {
    value: '24h+',
    label: 'Free Window',
    iconBg: '#ECFDF5',
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 19, color: '#10B981' }} />,
  },
];

const policyRules = [
  'All cancellation fees display up to 24 hours before the scheduled pickup time.',
  'The cancellation clock is calculated from scheduled pickup time \u2014 not from when the cancellation is requested.',
  'No-show is defined as the driver/crew arriving within 10 minutes of scheduled time and the rider not appearing.',
  'Driver dispatched fees activate when driver status changes to En Route in the app.',
  'Cancellation claims carry the highest fees \u2014 late-stage members no longer display a rider\u2019s ability to cancel.',
  'Riders and recurring clients receive one fee waiver per month for documented medical emergencies.',
];

const overviewFees: OverviewFeeRow[] = [
  {
    window: '24 hours or more before',
    ambulatory: 'FREE',
    wheelchair: 'FREE',
    stretcher: 'FREE',
  },
  {
    window: '2\u201324 hrs before pickup',
    ambulatory: '$10.00',
    wheelchair: '$15.00',
    stretcher: '$25.00',
  },
  {
    window: 'Under 2 hours before',
    ambulatory: '$20.00',
    wheelchair: '$35.00',
    stretcher: '$55.00',
  },
  {
    window: 'After driver dispatched',
    ambulatory: '$25.00',
    wheelchair: '$45.00',
    stretcher: '$70.00',
  },
  {
    window: 'No-Show',
    ambulatory: '$35.00',
    wheelchair: '$55.00',
    stretcher: '$85.00',
  },
];

const serviceBreakdowns: ServiceBreakdown[] = [
  {
    title: '3. Ambulatory \u2014 Cancellation Fee Breakdown',
    description:
      'Standard sedan or SUV service. Lowest cancellation fees reflect lower deployment cost and ease of redeployment to another booking.',
    icon: <DirectionsCarOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    color: '#2F6FED',
    rows: [
      {
        window: '24 hrs before pickup',
        fee: 'FREE',
        whoReceives: 'No cancellation fee applied',
        notes: 'Full charge credited to rider account',
      },
      {
        window: '2\u201324 hrs before pickup',
        fee: '$10.00',
        whoReceives: 'Medigo platform',
        notes: 'Medigo covers admin account',
      },
      {
        window: 'Under 2 hrs before',
        fee: '$20.00',
        whoReceives: 'Driver (80%) + Medigo (20%)',
        notes: 'Driver compensated for route prep, driver already en route',
      },
      {
        window: 'After driver dispatched',
        fee: '$25.00',
        whoReceives: 'Driver (80%) + Medigo (20%)',
        notes: 'Driver already en route',
      },
      {
        window: 'No-show',
        fee: '$35.00',
        whoReceives: 'Driver (80%) + Medigo (20%)',
        notes: 'Full no-show penalty',
      },
    ],
    footnote:
      '* Driver receives 80% of late cancellation and no-show fees as direct compensation for lost trip income.',
  },
  {
    title: '4. Wheelchair (WAV) \u2014 Cancellation Fee Breakdown',
    description:
      'Wheelchair accessible vehicle service managed by platform vendors. Higher fees reflect specialized vehicle preparation, ramp/lift setup, and securement equipment staging required before each trip.',
    icon: <AccessibleOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
    iconBg: '#EEF2FF',
    color: '#6366F1',
    rows: [
      {
        window: '24 hrs before pickup',
        fee: 'FREE',
        whoReceives: 'No cancellation fee applied',
        notes: 'Full charge credited to rider account',
      },
      {
        window: '2\u201324 hrs before pickup',
        fee: '$15.00',
        whoReceives: 'Vendor (82%) + Medigo (18%)',
        notes: 'Vendor compensated for booking scheduling',
      },
      {
        window: 'Under 2 hrs before',
        fee: '$35.00',
        whoReceives: 'Vendor (82%) + Medigo (18%)',
        notes: 'Vendor compensated for specialized prep',
      },
      {
        window: 'After driver dispatched',
        fee: '$45.00',
        whoReceives: 'Vendor (82%) + Medigo (18%)',
        notes: 'Vehicle already dispatched',
      },
      {
        window: 'No-show',
        fee: '$55.00',
        whoReceives: 'Vendor (82%) + Medigo (18%)',
        notes: 'Vehicle on-site, ramp/lift deployed',
      },
    ],
    footnote:
      '* WAV vendor receives 82% of cancellation and no-show fees in line with the standard platform commission split.',
  },
  {
    title: '5. Stretcher \u2014 Cancellation Fee Breakdown',
    description:
      'Highest fees across all service types. Every stretcher trip requires two crew members \u2014 driver and attendant \u2014 both of whom are compensated for their time on a no-show or late cancellation.',
    icon: (
      <MedicalServicesOutlinedIcon sx={{ fontSize: 20, color: '#DC2626' }} />
    ),
    iconBg: '#FEF2F2',
    color: '#DC2626',
    rows: [
      {
        window: '24 hrs before pickup',
        fee: 'FREE',
        whoReceives: 'No cancellation fee applied',
        notes: 'Full charge credited to rider account',
      },
      {
        window: '2\u201324 hrs before pickup',
        fee: '$25.00',
        whoReceives: 'Partnership split (50/50)',
        notes: '2-crew scheduling fee penalty',
      },
      {
        window: 'Under 2 hrs before',
        fee: '$55.00',
        whoReceives: 'Partnership split (50/50)',
        notes: 'Crew + equipment already dispatching',
      },
      {
        window: 'After driver dispatched',
        fee: '$70.00',
        whoReceives: 'Partnership split (50/50)',
        notes: '2-crew already en route',
      },
      {
        window: 'No-show',
        fee: '$85.00',
        whoReceives: 'Partnership split (50/50)',
        notes: 'Full no-show \u2014 2 crew arrived',
      },
    ],
    footnote:
      '* Stretcher cancellation fees are split 50/50 between Cynthia and her stretcher vehicle partner after deducting any direct crew costs.',
  },
];

// ─── Shared Table Styles ────────────────────────────────────────────────────

const headerCellSx = {
  fontFamily: (theme: any) => theme.typography.fontFamily,
  fontWeight: 600,
  fontSize: pxToRem(12),
  color: '#111827',
};

const bodyCellSx = {
  fontFamily: (theme: any) => theme.typography.fontFamily,
  fontWeight: 500,
  fontSize: pxToRem(13),
  color: '#374151',
};

const feeCellSx = {
  fontFamily: (theme: any) => theme.typography.fontFamily,
  fontWeight: 600,
  fontSize: pxToRem(13),
  color: '#111827',
};

// ─── Component ──────────────────────────────────────────────────────────────

export const CancellationPolicyPage = () => {
  const { data: kpisData } = useResolvedApiQuery(useGetCancellationKpis, null);
  const { data: policiesData } = useResolvedApiQuery(
    useGetCancellationPolicies,
    null
  );

  // Helper to format fee
  const formatFee = (fee: string | number) => {
    const feeNum = parseFloat(fee as any);
    return feeNum === 0 ? 'FREE' : `$${feeNum.toFixed(2)}`;
  };

  // Helper to map cancellation window to display text
  const mapWindowToDisplay = (window: string) => {
    const mapping: Record<string, string> = {
      '24_hours_plus': '24 hours or more before',
      '2_24_hours': '2–24 hrs before pickup',
      under_2_hours: 'Under 2 hours before',
      after_dispatch: 'After driver dispatched',
      no_show: 'No-Show',
    };
    return mapping[window] || window;
  };

  // Build overview fees table from API data
  const dynamicOverviewFees: OverviewFeeRow[] = useMemo(() => {
    if (!policiesData?.by_service_type) return overviewFees;

    const windows = [
      '24_hours_plus',
      '2_24_hours',
      'under_2_hours',
      'after_dispatch',
      'no_show',
    ];

    return windows.map((window) => {
      const ambulatoryPolicy = policiesData.by_service_type
        .find((st) => st.service_type === 'ambulatory')
        ?.policies.find((p) => p.cancellation_window === window);

      const wheelchairPolicy = policiesData.by_service_type
        .find((st) => st.service_type === 'wheelchair_wav')
        ?.policies.find((p) => p.cancellation_window === window);

      const stretcherPolicy = policiesData.by_service_type
        .find((st) => st.service_type === 'stretcher')
        ?.policies.find((p) => p.cancellation_window === window);

      return {
        window: mapWindowToDisplay(window),
        ambulatory: formatFee(ambulatoryPolicy?.fee || '0'),
        wheelchair: formatFee(wheelchairPolicy?.fee || '0'),
        stretcher: formatFee(stretcherPolicy?.fee || '0'),
      };
    });
  }, [policiesData]);

  // Build service breakdowns from API data
  const dynamicServiceBreakdowns: ServiceBreakdown[] = useMemo(() => {
    if (!policiesData?.by_service_type) return serviceBreakdowns;

    const serviceTypeMap: Record<
      string,
      {
        title: string;
        description: string;
        icon: ReactNode;
        iconBg: string;
        color: string;
        footnote: string;
      }
    > = {
      ambulatory: {
        title: '3. Ambulatory — Cancellation Fee Breakdown',
        description:
          'Standard sedan or SUV service. Lowest cancellation fees reflect lower deployment cost and ease of redeployment to another booking.',
        icon: (
          <DirectionsCarOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
        ),
        iconBg: '#EBF2FF',
        color: '#2F6FED',
        footnote:
          '* Driver receives 80% of late cancellation and no-show fees as direct compensation for lost trip income.',
      },
      wheelchair_wav: {
        title: '4. Wheelchair (WAV) — Cancellation Fee Breakdown',
        description:
          'Wheelchair accessible vehicle service managed by platform vendors. Higher fees reflect specialized vehicle preparation, ramp/lift setup, and securement equipment staging required before each trip.',
        icon: (
          <AccessibleOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />
        ),
        iconBg: '#EEF2FF',
        color: '#6366F1',
        footnote:
          '* WAV vendor receives 82% of cancellation and no-show fees in line with the standard platform commission split.',
      },
      stretcher: {
        title: '5. Stretcher — Cancellation Fee Breakdown',
        description:
          'Highest fees across all service types. Every stretcher trip requires two crew members — driver and attendant — both of whom are compensated for their time on a no-show or late cancellation.',
        icon: (
          <MedicalServicesOutlinedIcon
            sx={{ fontSize: 20, color: '#DC2626' }}
          />
        ),
        iconBg: '#FEF2F2',
        color: '#DC2626',
        footnote:
          '* Stretcher cancellation fees are split 50/50 between Cynthia and her stretcher vehicle partner after deducting any direct crew costs.',
      },
    };

    return policiesData.by_service_type
      .map((serviceType) => {
        const config = serviceTypeMap[serviceType.service_type];
        if (!config) return null;

        const rows: BreakdownRow[] = serviceType.policies.map((policy) => ({
          window: mapWindowToDisplay(policy.cancellation_window),
          fee: formatFee(policy.fee),
          whoReceives: policy.who_receives
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .replace('Medigo Platform', 'Medigo platform')
            .replace('Driver 80 Medigo 20', 'Driver (80%) + Medigo (20%)')
            .replace('Vendor 82 Medigo 18', 'Vendor (82%) + Medigo (18%)')
            .replace('Partnership 50 50', 'Partnership split (50/50)')
            .replace('None', 'No cancellation fee applied'),
          notes: policy.notes,
        }));

        return {
          ...config,
          rows,
        };
      })
      .filter(Boolean) as ServiceBreakdown[];
  }, [policiesData]);

  // Update stat cards with real data
  const dynamicStatCards: StatCard[] = useMemo(() => {
    const serviceTypes = policiesData?.by_service_type?.length || 3;
    const maxFee =
      policiesData?.matrix
        ?.reduce(
          (max, policy) => Math.max(max, parseFloat(policy.fee as any)),
          0
        )
        .toFixed(0) || '85';

    return [
      {
        value: serviceTypes.toString(),
        label: 'Service Types',
        iconBg: '#EBF2FF',
        icon: <CategoryOutlinedIcon sx={{ fontSize: 19, color: '#2F6FED' }} />,
      },
      {
        value: '5',
        label: 'Fee Tiers',
        iconBg: '#EEF2FF',
        icon: <LayersOutlinedIcon sx={{ fontSize: 19, color: '#6366F1' }} />,
      },
      {
        value: `$${maxFee}`,
        label: 'Max No-Show Fee',
        iconBg: '#FEF2F2',
        icon: <MoneyOffOutlinedIcon sx={{ fontSize: 19, color: '#EF4444' }} />,
      },
      {
        value: '24h+',
        label: 'Free Window',
        iconBg: '#ECFDF5',
        icon: (
          <AccessTimeOutlinedIcon sx={{ fontSize: 19, color: '#10B981' }} />
        ),
      },
    ];
  }, [policiesData]);

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Cancellation Policy"
          desc="Configure cancellation fees and policies across all service types to protect drivers and vendors from last-minute cancellations"
        />

        {/* Stat Cards */}
        <RowStack spacing={'12px'}>
          {dynamicStatCards.map((card) => (
            <RowStack
              key={card.label}
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
                    fontWeight: 700,
                    fontSize: pxToRem(26),
                    lineHeight: '0.85em',
                    color: '#111827',
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#6B7280',
                  }}
                >
                  {card.label}
                </Typography>
              </Stack>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '14px',
                  background: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </Box>
            </RowStack>
          ))}
        </RowStack>

        {/* Section 1: Policy Overview */}
        <Stack
          spacing={'20px'}
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            padding: '24px',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(16),
              color: '#111827',
            }}
          >
            1. Cancellation Policy Overview
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13.5),
              color: '#374151',
              lineHeight: '1.7em',
            }}
          >
            Medigo operates a tiered cancellation fee structure across all three
            service types (Standard Vehicle, Wheelchair WAV, Stretcher). This
            policy applies to Province of Ontario only. Halton Region is the
            current pilot site and all fees and rules defined here will apply as
            Medigo expands to other Ontario regions. Fees are designed to
            protect drivers and vendors from last-minute cancellations while
            giving clients a reasonable cancellation window for scheduling
            medical appointments.
          </Typography>

          {/* Key Policy Rules */}
          <Stack
            spacing={'12px'}
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #F0F4F8',
              borderRadius: '14px',
              padding: '20px',
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(14),
                color: '#111827',
              }}
            >
              Key Policy Rules
            </Typography>
            <Stack spacing={'8px'}>
              {policyRules.map((rule, i) => (
                <RowStack key={i} spacing={'10px'} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#2F6FED',
                      flexShrink: 0,
                      marginTop: '7px',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(13),
                      color: '#374151',
                      lineHeight: '1.6em',
                    }}
                  >
                    {rule}
                  </Typography>
                </RowStack>
              ))}
            </Stack>
          </Stack>
        </Stack>

        {/* Section 2: All Services at a Glance */}
        <Stack
          spacing={'20px'}
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #F0F4F8',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            padding: '24px',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(16),
              color: '#111827',
            }}
          >
            2. Cancellation Fees — All Services at a Glance
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13.5),
              color: '#374151',
              lineHeight: '1.7em',
            }}
          >
            The table below shows all cancellation fees across all service types
            for each cancellation window. No-show is defined as the driver
            arriving at the pickup address and client being absent after a
            10-minute wait.
          </Typography>

          {/* Overview Table */}
          <Box sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            {/* Header */}
            <RowStack
              sx={{
                background: '#F7F9FB',
                borderBottom: '0.67px solid #F0F4F8',
                padding: '12px 20px',
              }}
            >
              <Typography sx={{ ...headerCellSx, flex: 1.5 }}>
                Cancellation Window
              </Typography>
              <Typography sx={{ ...headerCellSx, flex: 1, color: '#2F6FED' }}>
                Ambulatory
              </Typography>
              <Typography sx={{ ...headerCellSx, flex: 1, color: '#6366F1' }}>
                Wheelchair (WAV)
              </Typography>
              <Typography sx={{ ...headerCellSx, flex: 1, color: '#DC2626' }}>
                Stretcher
              </Typography>
            </RowStack>

            {/* Body */}
            {dynamicOverviewFees.map((row, i) => (
              <RowStack
                key={i}
                sx={{
                  borderBottom:
                    i < dynamicOverviewFees.length - 1
                      ? '0.67px solid #F0F4F8'
                      : 'none',
                  padding: '14px 20px',
                }}
              >
                <Typography sx={{ ...bodyCellSx, flex: 1.5 }}>
                  {row.window}
                </Typography>
                <Typography
                  sx={{
                    ...feeCellSx,
                    flex: 1,
                    color: row.ambulatory === 'FREE' ? '#10B981' : '#111827',
                  }}
                >
                  {row.ambulatory}
                </Typography>
                <Typography
                  sx={{
                    ...feeCellSx,
                    flex: 1,
                    color: row.wheelchair === 'FREE' ? '#10B981' : '#111827',
                  }}
                >
                  {row.wheelchair}
                </Typography>
                <Typography
                  sx={{
                    ...feeCellSx,
                    flex: 1,
                    color: row.stretcher === 'FREE' ? '#10B981' : '#111827',
                  }}
                >
                  {row.stretcher}
                </Typography>
              </RowStack>
            ))}
          </Box>

          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              fontStyle: 'italic',
              color: '#6B7280',
              lineHeight: '1.6em',
            }}
          >
            * FREE = no charge applied. All other fees are charged automatically
            to the client payment method on file at time of cancellation or
            no-show confirmation.
          </Typography>
        </Stack>

        {/* Sections 3–5: Service Breakdowns */}
        {dynamicServiceBreakdowns.map((service) => (
          <Stack
            key={service.title}
            spacing={'20px'}
            sx={{
              background: '#FFFFFF',
              border: '0.67px solid #F0F4F8',
              borderRadius: '16px',
              boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
              padding: '24px',
            }}
          >
            {/* Service Header */}
            <RowStack spacing={'16px'}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  background: service.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {service.icon}
              </Box>
              <Stack spacing={'4px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(16),
                    color: '#111827',
                  }}
                >
                  {service.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12.5),
                    color: '#6B7280',
                  }}
                >
                  {service.description}
                </Typography>
              </Stack>
            </RowStack>

            {/* Breakdown Table */}
            <Box sx={{ borderRadius: '12px', overflow: 'hidden' }}>
              {/* Header */}
              <RowStack
                sx={{
                  background: '#F7F9FB',
                  borderBottom: '0.67px solid #F0F4F8',
                  padding: '12px 20px',
                }}
              >
                <Typography sx={{ ...headerCellSx, flex: 1.2 }}>
                  Cancellation Window
                </Typography>
                <Typography sx={{ ...headerCellSx, flex: 0.6 }}>Fee</Typography>
                <Typography sx={{ ...headerCellSx, flex: 1.3 }}>
                  Who Receives Fee
                </Typography>
                <Typography sx={{ ...headerCellSx, flex: 1.3 }}>
                  Notes
                </Typography>
              </RowStack>

              {/* Body */}
              {service.rows.map((row, i) => (
                <RowStack
                  key={i}
                  sx={{
                    borderBottom:
                      i < service.rows.length - 1
                        ? '0.67px solid #F0F4F8'
                        : 'none',
                    padding: '14px 20px',
                  }}
                >
                  <Typography sx={{ ...bodyCellSx, flex: 1.2 }}>
                    {row.window}
                  </Typography>
                  <Typography
                    sx={{
                      ...feeCellSx,
                      flex: 0.6,
                      color: row.fee === 'FREE' ? '#10B981' : '#111827',
                    }}
                  >
                    {row.fee}
                  </Typography>
                  <Typography sx={{ ...bodyCellSx, flex: 1.3 }}>
                    {row.whoReceives}
                  </Typography>
                  <Typography
                    sx={{
                      ...bodyCellSx,
                      flex: 1.3,
                      color: '#9CA3AF',
                    }}
                  >
                    {row.notes}
                  </Typography>
                </RowStack>
              ))}
            </Box>

            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                fontStyle: 'italic',
                color: '#6B7280',
                lineHeight: '1.6em',
              }}
            >
              {service.footnote}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </AppDashboardLayout>
  );
};
