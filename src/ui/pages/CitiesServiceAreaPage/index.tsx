'use client';

import { useState } from 'react';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import WifiOutlinedIcon from '@mui/icons-material/WifiOutlined';
import WifiOffOutlinedIcon from '@mui/icons-material/WifiOffOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { pxToRem } from '../../../common';
import { CityServiceCard, AddCityModal, EditCityModal } from './ui/component';

// ─── Types ──────────────────────────────────────────────────────────────────

type CityData = {
  id: string;
  cityName: string;
  serviceZones: number;
  isActive: boolean;
  drivers?: number;
  riders?: number;
  totalTrips?: number;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const initialCities: CityData[] = [
  {
    id: '1',
    cityName: 'Toronto, ON',
    serviceZones: 8,
    isActive: true,
    drivers: 64,
    riders: 488,
    totalTrips: 4810,
  },
  {
    id: '2',
    cityName: 'Ottawa, ON',
    serviceZones: 5,
    isActive: true,
    drivers: 22,
    riders: 192,
    totalTrips: 1840,
  },
  {
    id: '3',
    cityName: 'Montréal, QC',
    serviceZones: 7,
    isActive: true,
    drivers: 31,
    riders: 248,
    totalTrips: 2480,
  },
  {
    id: '4',
    cityName: 'Vancouver, BC',
    serviceZones: 6,
    isActive: true,
    drivers: 18,
    riders: 140,
    totalTrips: 1200,
  },
  {
    id: '5',
    cityName: 'Calgary, AB',
    serviceZones: 4,
    isActive: true,
    drivers: 12,
    riders: 98,
    totalTrips: 820,
  },
  {
    id: '6',
    cityName: 'Edmonton, AB',
    serviceZones: 3,
    isActive: true,
    drivers: 9,
    riders: 74,
    totalTrips: 640,
  },
  {
    id: '7',
    cityName: 'Winnipeg, MB',
    serviceZones: 3,
    isActive: false,
  },
  {
    id: '8',
    cityName: 'Halifax, NS',
    serviceZones: 2,
    isActive: false,
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const CitiesServiceAreaPage = () => {
  const [cities, setCities] = useState<CityData[]>(initialCities);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityData | null>(null);

  const activeCities = cities.filter((c) => c.isActive).length;
  const inactiveCities = cities.filter((c) => !c.isActive).length;
  const totalZones = cities.reduce((sum, c) => sum + c.serviceZones, 0);

  const handleToggle = (id: string) => {
    setCities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const statCards = [
    {
      value: String(activeCities),
      label: 'Active Cities',
      icon: <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
      iconBg: '#EBF2FF',
    },
    {
      value: String(totalZones),
      label: 'Total Zones',
      icon: <GridViewOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
      iconBg: '#EEF2FF',
    },
    {
      value: String(activeCities),
      label: 'Cities Online',
      icon: <WifiOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
      iconBg: '#ECFDF5',
    },
    {
      value: String(inactiveCities),
      label: 'Inactive Cities',
      icon: <WifiOffOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
      iconBg: '#FEF2F2',
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <RowStack justifyContent={'space-between'}>
          <DashboardTitleAndDesc
            title="Cities & Service Areas"
            desc="Manage active operating cities, service zones, and geographic coverage"
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
            Add City
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

        <Stack
          sx={{
            background: (theme) => theme.palette.background.default,
            padding: '24px',
            borderRadius: '14px',
          }}
          spacing={3}
          divider={<Divider />}
        >
          {/* Operating Cities Header */}
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
              Operating Cities
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
              Cities where MediGo is currently active or scheduled for launch
            </Typography>
          </Stack>

          {/* City Cards Grid */}
          <Grid container spacing={'16px'}>
            {cities.map((city) => (
              <Grid key={city.id} size={{ xs: 12, lg: 6 }}>
                <CityServiceCard
                  cityName={city.cityName}
                  serviceZones={city.serviceZones}
                  isActive={city.isActive}
                  drivers={city.drivers}
                  riders={city.riders}
                  totalTrips={city.totalTrips}
                  onToggle={() => handleToggle(city.id)}
                  onEdit={() => setEditingCity(city)}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>

      {/* Add City Modal */}
      <AddCityModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(values) => {
          const newCity: CityData = {
            id: String(cities.length + 1),
            cityName: `${values.cityName}, ${values.province}`,
            serviceZones: Number(values.numberOfZones),
            isActive: false,
          };
          setCities((prev) => [...prev, newCity]);
          setIsAddModalOpen(false);
        }}
      />

      {/* Edit City Modal */}
      {editingCity && (
        <EditCityModal
          open={!!editingCity}
          onClose={() => setEditingCity(null)}
          cityData={{
            cityName: editingCity.cityName.split(',')[0].trim(),
            province: editingCity.cityName.split(',')[1]?.trim() || '',
            numberOfZones: editingCity.serviceZones,
            activeDrivers: editingCity.drivers ?? 0,
            activeRiders: editingCity.riders ?? 0,
          }}
          onSubmit={(values) => {
            setCities((prev) =>
              prev.map((c) =>
                c.id === editingCity.id
                  ? {
                      ...c,
                      cityName: `${values.cityName}, ${values.province}`,
                      serviceZones: Number(values.numberOfZones),
                      drivers: Number(values.activeDrivers),
                      riders: Number(values.activeRiders),
                    }
                  : c
              )
            );
            setEditingCity(null);
          }}
        />
      )}
    </AppDashboardLayout>
  );
};
