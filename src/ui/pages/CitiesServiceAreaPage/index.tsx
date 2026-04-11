'use client';

import { useState, useMemo } from 'react';
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
import {
  pxToRem,
  useGetCityKpis,
  useListCities,
  useResolvedApiQuery,
  useCitiesApi,
  CityKPIs,
  CityRow,
} from '../../../common';
import { CityServiceCard, AddCityModal, EditCityModal } from './ui/component';

// ─── Component ──────────────────────────────────────────────────────────────

export const CitiesServiceAreaPage = () => {
  // Hooks - API
  const { createCity, updateCity, toggleCity, deleteCity } = useCitiesApi();
  const { data: cityKpis } = useResolvedApiQuery(useGetCityKpis, null);
  const { data: citiesData } = useResolvedApiQuery<CityRow[]>(
    useListCities,
    []
  );

  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityRow | null>(null);

  // Derived state
  const kpiData = useMemo<CityKPIs | undefined>(() => {
    return cityKpis ? cityKpis : undefined;
  }, [cityKpis]);

  const cities = useMemo<CityRow[]>(() => {
    return citiesData || [];
  }, [citiesData]);

  // Handlers
  const handleToggle = async (id: string, currentStatus: boolean) => {
    await toggleCity({
      cityId: id,
      is_active: !currentStatus,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteCity({
      cityId: id,
    });
  };

  const statCards = useMemo(
    () => [
      {
        value: String(kpiData?.active_cities ?? 0),
        label: 'Active Cities',
        icon: <LocationOnOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />,
        iconBg: '#EBF2FF',
      },
      {
        value: String(kpiData?.total_zones ?? 0),
        label: 'Total Zones',
        icon: <GridViewOutlinedIcon sx={{ fontSize: 18, color: '#6366F1' }} />,
        iconBg: '#EEF2FF',
      },
      {
        value: String(kpiData?.cities_online ?? 0),
        label: 'Cities Online',
        icon: <WifiOutlinedIcon sx={{ fontSize: 18, color: '#059669' }} />,
        iconBg: '#ECFDF5',
      },
      {
        value: String(kpiData?.inactive_cities ?? 0),
        label: 'Inactive Cities',
        icon: <WifiOffOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />,
        iconBg: '#FEF2F2',
      },
    ],
    [kpiData]
  );

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
                  cityName={`${city.name}, ${city.province}`}
                  serviceZones={city.service_zones}
                  isActive={city.is_active}
                  drivers={city.drivers}
                  riders={city.riders}
                  totalTrips={city.total_trips}
                  onToggle={() => handleToggle(city.id, city.is_active)}
                  onEdit={() => setEditingCity(city)}
                  onDelete={() => handleDelete(city.id)}
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
        onSubmit={async (values) => {
          const success = await createCity({
            name: values.cityName,
            province: values.province,
            number_of_zones: Number(values.numberOfZones),
          });

          if (success) {
            setIsAddModalOpen(false);
          }
        }}
      />

      {/* Edit City Modal */}
      {editingCity && (
        <EditCityModal
          open={!!editingCity}
          onClose={() => setEditingCity(null)}
          cityData={{
            cityName: editingCity.name,
            province: editingCity.province,
            numberOfZones: editingCity.service_zones,
            activeDrivers: editingCity.drivers,
            activeRiders: editingCity.riders,
          }}
          onSubmit={async (values) => {
            const success = await updateCity({
              cityId: editingCity.id,
              name: values.cityName,
              province: values.province,
              number_of_zones: Number(values.numberOfZones),
            });

            if (success) {
              setEditingCity(null);
            }
          }}
        />
      )}
    </AppDashboardLayout>
  );
};
