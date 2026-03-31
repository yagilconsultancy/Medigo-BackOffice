'use client';

import { useState } from 'react';
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
import { pxToRem } from '../../../common';
import {
  RideTypeCard,
  AddRideTypeModal,
  EditRideTypeModal,
} from './ui/component';

// ─── Types ──────────────────────────────────────────────────────────────────

type RideTypeData = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  baseFare: number;
  perKm: number;
  perMin: number;
  minFare: number;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const initialRideTypes: RideTypeData[] = [
  {
    id: '1',
    name: 'MediGo Standard Ambulatory Ride',
    description: 'Regular car for ambulatory patients — most common ride type',
    isActive: true,
    baseFare: 8.0,
    perKm: 1.8,
    perMin: 0.18,
    minFare: 12.0,
  },
  {
    id: '2',
    name: 'MediGo Standard Ride',
    description:
      'WAV-Equipped vehicles for wheelchair users and mobility device passengers',
    isActive: true,
    baseFare: 12.0,
    perKm: 2.2,
    perMin: 0.22,
    minFare: 18.0,
  },
  {
    id: '3',
    name: 'MediGo Stretcher Van',
    description:
      'Driver assists patient to/from door — for patients needing extra support',
    isActive: true,
    baseFare: 14.0,
    perKm: 2.4,
    perMin: 0.25,
    minFare: 20.0,
  },
  {
    id: '4',
    name: 'MediGo Stretcher Transport',
    description:
      'For non-ambulatory patients on stretchers; requires specialized vehicle',
    isActive: true,
    baseFare: 22.0,
    perKm: 3.8,
    perMin: 0.35,
    minFare: 35.0,
  },
  {
    id: '5',
    name: 'MediGo Bariatric Transport',
    description:
      'Specialized vehicle for bariatric patients requiring additional space and equipment',
    isActive: false,
    baseFare: 9.0,
    perKm: 1.6,
    perMin: 0.15,
    minFare: 15.0,
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const RideTypesPage = () => {
  const [rideTypes, setRideTypes] = useState<RideTypeData[]>(initialRideTypes);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRideType, setEditingRideType] = useState<RideTypeData | null>(
    null
  );

  const totalTypes = rideTypes.length;
  const activeTypes = rideTypes.filter((r) => r.isActive).length;
  const inactiveTypes = rideTypes.filter((r) => !r.isActive).length;
  const avgBaseFare =
    rideTypes.length > 0
      ? Math.round(
          rideTypes.reduce((sum, r) => sum + r.baseFare, 0) / rideTypes.length
        )
      : 0;

  const handleToggle = (id: string) => {
    setRideTypes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const statCards = [
    {
      value: String(totalTypes),
      label: 'Ride Types',
      icon: (
        <DirectionsCarOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
      ),
      iconBg: '#EBF2FF',
    },
    {
      value: String(activeTypes),
      label: 'Active',
      icon: (
        <CheckCircleOutlineOutlinedIcon
          sx={{ fontSize: 18, color: '#059669' }}
        />
      ),
      iconBg: '#ECFDF5',
    },
    {
      value: String(inactiveTypes),
      label: 'Inactive',
      icon: (
        <HighlightOffOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
      ),
      iconBg: '#F3F4F6',
    },
    {
      value: `$${avgBaseFare}`,
      label: 'Avg Base Fare',
      icon: <PaidOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
    },
  ];

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
                name={rideType.name}
                description={rideType.description}
                isActive={rideType.isActive}
                baseFare={rideType.baseFare}
                perKm={rideType.perKm}
                perMin={rideType.perMin}
                minFare={rideType.minFare}
                onToggle={() => handleToggle(rideType.id)}
                onEdit={() => setEditingRideType(rideType)}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>

      {/* Add Ride Type Modal */}
      <AddRideTypeModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(values) => {
          const newRideType: RideTypeData = {
            id: String(rideTypes.length + 1),
            name: values.rideTypeName,
            description: values.description,
            isActive: false,
            baseFare: Number(values.baseFare),
            perKm: Number(values.perKmRate),
            perMin: 0,
            minFare: 0,
          };
          setRideTypes((prev) => [...prev, newRideType]);
          setIsAddModalOpen(false);
        }}
      />

      {/* Edit Ride Type Modal */}
      {editingRideType && (
        <EditRideTypeModal
          open={!!editingRideType}
          onClose={() => setEditingRideType(null)}
          rideTypeData={{
            name: editingRideType.name,
            description: editingRideType.description,
            baseFare: editingRideType.baseFare,
            perKmRate: editingRideType.perKm,
          }}
          onSubmit={(values) => {
            setRideTypes((prev) =>
              prev.map((r) =>
                r.id === editingRideType.id
                  ? {
                      ...r,
                      name: values.rideTypeName,
                      description: values.description,
                      baseFare: Number(values.baseFare),
                      perKm: Number(values.perKmRate),
                    }
                  : r
              )
            );
            setEditingRideType(null);
          }}
        />
      )}
    </AppDashboardLayout>
  );
};
