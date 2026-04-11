'use client';

import { useState, useMemo } from 'react';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  pxToRem,
  useGetRideTypeKpis,
  useListRideTypes,
  useResolvedApiQuery,
  useRideTypesApi,
  RideTypeKPIs,
  RideTypeResponse,
} from '../../../common';
import {
  RideTypeCard,
  AddRideTypeModal,
  EditRideTypeModal,
} from './ui/component';

// ─── Stat Card Config ────────────────────────────────────────────────────────

const statCardConfig = [
  {
    label: 'Ride Types',
    icon: <DirectionsCarOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    getValue: (kpi?: RideTypeKPIs) => kpi?.total_ride_types?.toString() ?? '0',
  },
  {
    label: 'Active',
    icon: (
      <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />
    ),
    iconBg: '#ECFDF5',
    getValue: (kpi?: RideTypeKPIs) => kpi?.active?.toString() ?? '0',
  },
  {
    label: 'Inactive',
    icon: <HighlightOffOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />,
    iconBg: '#F3F4F6',
    getValue: (kpi?: RideTypeKPIs) => kpi?.inactive?.toString() ?? '0',
  },
  {
    label: 'Avg Base Fare',
    icon: <PaidOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
    iconBg: '#EBF2FF',
    getValue: (kpi?: RideTypeKPIs) =>
      kpi?.avg_base_fare != null ? `$${kpi.avg_base_fare.toFixed(2)}` : '$0',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const RideTypesPage = () => {
  // Hooks - API
  const { createRideType, updateRideType, toggleRideType, deleteRideType } =
    useRideTypesApi();
  const { data: rideTypeKpis } = useResolvedApiQuery(useGetRideTypeKpis, null);
  const { data: rideTypesData } = useResolvedApiQuery<RideTypeResponse[]>(
    useListRideTypes,
    []
  );

  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRideType, setEditingRideType] =
    useState<RideTypeResponse | null>(null);

  // Derived state
  const kpiData = useMemo<RideTypeKPIs | undefined>(() => {
    return rideTypeKpis ? rideTypeKpis : undefined;
  }, [rideTypeKpis]);

  const rideTypes = useMemo<RideTypeResponse[]>(() => {
    return rideTypesData || [];
  }, [rideTypesData]);

  const statCards = statCardConfig.map((card) => ({
    ...card,
    value: card.getValue(kpiData),
  }));

  // Handlers
  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleRideType({
      rideTypeId: id,
      is_active: !currentStatus,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteRideType({
      rideTypeId: id,
    });
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Ride Types"
            desc="Configure available medical transportation ride categories, descriptions, and base pricing"
          />
          <AppButton
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setIsAddModalOpen(true)}
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
            Add Ride Type
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

        {/* Ride Categories Section */}
        <Stack
          sx={{
            background: (theme) => theme.palette.background.default,
            padding: '24px',
            borderRadius: '14px',
          }}
          spacing={3}
          divider={<Divider />}
        >
          {/* Section Header */}
          <Stack spacing={'4px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(16),
                color: '#111827',
                lineHeight: '24px',
              }}
            >
              Ride Categories
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(13),
                color: '#6B7280',
                lineHeight: '19px',
              }}
            >
              Manage available ride types, toggle availability, and configure
              per-type pricing
            </Typography>
          </Stack>

          {/* Ride Type Cards */}
          <Stack spacing={'16px'}>
            {rideTypes.map((rideType) => (
              <RideTypeCard
                key={rideType.id}
                name={rideType.display_name}
                description={rideType.description ?? ''}
                isActive={rideType.is_active}
                baseFare={rideType.base_fare}
                perKm={rideType.per_km_rate}
                perMin={rideType.per_min_rate}
                minFare={rideType.min_fare}
                onToggle={() => handleToggle(rideType.id, rideType.is_active)}
                onEdit={() => setEditingRideType(rideType)}
                onDelete={() => handleDelete(rideType.id)}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>

      {/* Add Ride Type Modal */}
      <AddRideTypeModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={async (values) => {
          const success = await createRideType({
            service_type: values.rideTypeName
              .toLowerCase()
              .replace(/\s+/g, '_'),
            display_name: values.rideTypeName,
            description: values.description || null,
            base_fare: Number(values.baseFare),
            per_km_rate: Number(values.perKmRate),
            per_min_rate: Number(values.perMinRate || 0),
            min_fare: Number(values.minFare || 0),
          });

          if (success) {
            setIsAddModalOpen(false);
          }
        }}
      />

      {/* Edit Ride Type Modal */}
      {editingRideType && (
        <EditRideTypeModal
          open={!!editingRideType}
          onClose={() => setEditingRideType(null)}
          rideTypeData={{
            name: editingRideType.display_name,
            description: editingRideType.description ?? '',
            baseFare: editingRideType.base_fare,
            perKmRate: editingRideType.per_km_rate,
            perMinRate: editingRideType.per_min_rate,
            minFare: editingRideType.min_fare,
          }}
          onSubmit={async (values) => {
            const success = await updateRideType({
              rideTypeId: editingRideType.id,
              display_name: values.rideTypeName,
              description: values.description || null,
              base_fare: Number(values.baseFare),
              per_km_rate: Number(values.perKmRate),
              per_min_rate: Number(values.perMinRate),
              min_fare: Number(values.minFare),
            });

            if (success) {
              setEditingRideType(null);
            }
          }}
        />
      )}
    </AppDashboardLayout>
  );
};
