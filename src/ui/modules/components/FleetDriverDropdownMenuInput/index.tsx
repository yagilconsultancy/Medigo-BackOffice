import {
  Avatar,
  Box,
  Menu,
  MenuItem,
  Stack,
  Typography,
  Rating,
} from '@mui/material';
import React, { useMemo, useRef, useState } from 'react';
import { pxToRem, useGetFleetCompanyDrivers } from '../../../../common';
import { AppSearchField } from '../TextField';
import { RowStack } from '../RowStack';
import { EmptyState } from '../../blocks';

export interface FleetDriverInputData {
  id: string;
  displayName: string;
  imageUri?: string;
  vehicleInfo: string;
  licensePlate?: string;
  rating: number;
}

export interface FleetDriverDropdownMenuInputProps {
  fleetId?: string;
  handleDriverSelected: (driver: FleetDriverInputData) => void;
  selectedDriverId?: string;
  selectedDriverName?: string;
}

export const FleetDriverDropdownMenuInput = ({
  fleetId,
  handleDriverSelected,
  selectedDriverId,
  selectedDriverName,
}: FleetDriverDropdownMenuInputProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuButtonRef = useRef<HTMLDivElement>(null);

  // Fetch drivers for the selected fleet
  const { data: driversData, isLoading: isLoadingDrivers } =
    useGetFleetCompanyDrivers({
      businessId: fleetId || '',
      limit: 50,
      page: 1,
    });

  const isDisabled = !fleetId;

  // Transform API data to FleetDriverInputData format
  const driverList = useMemo<FleetDriverInputData[]>(() => {
    if (!driversData?.success || !driversData.data) return [];

    return driversData.data
      .map((driver) => {
        const vehicleInfo = [
          driver.vehicle_make,
          driver.vehicle_model,
          driver.vehicle_year,
        ]
          .filter(Boolean)
          .join(' ');

        const displayName =
          driver.vehicle_plate?.trim() ||
          `Driver ${driver.user_id.slice(0, 8).toUpperCase()}`;

        return {
          id: driver.user_id,
          displayName,
          imageUri: driver.vehicle_photo_url || undefined,
          vehicleInfo: vehicleInfo || 'No vehicle info',
          licensePlate: driver.vehicle_plate || undefined,
          rating: driver.rating || 0,
        };
      })
      .filter((driver) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          driver.displayName.toLowerCase().includes(query) ||
          driver.vehicleInfo.toLowerCase().includes(query) ||
          driver.licensePlate?.toLowerCase().includes(query)
        );
      });
  }, [driversData, searchQuery]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (isDisabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const onDriverSelected = (driver: FleetDriverInputData) => {
    setAnchorEl(null);
    setSearchQuery('');

    handleDriverSelected(driver);
  };

  const menuWidth = menuButtonRef.current?.offsetWidth || 0;

  return (
    <>
      <Box
        ref={menuButtonRef}
        onClick={handleMenuOpen}
        sx={{
          p: '10px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(81, 93, 101, 0.20)',
          background: isDisabled ? '#F9FAFB' : '#FFF',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.6 : 1,
          '&:hover': {
            border: isDisabled
              ? '1px solid rgba(81, 93, 101, 0.20)'
              : `1px solid rgba(81, 93, 101, 1)`,
            transition: '.3s ease',
          },
        }}
      >
        <Typography
          sx={{
            fontSize: pxToRem(14),
            fontWeight: 400,
            opacity: selectedDriverName ? '1' : '0.5',
            color: selectedDriverName ? '#374151' : 'inherit',
          }}
        >
          {isDisabled
            ? 'Select a fleet company first'
            : selectedDriverName || 'Select a driver'}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              width: menuWidth,
              maxHeight: '500px',
              mt: '8px',
              borderRadius: '8px',
              boxShadow:
                '0 14px 22px -9px rgba(16, 25, 40, 0.14), 0 0 3px -1px rgba(16, 25, 40, 0.04)',
              '& .MuiList-root': {
                padding: '8px',
              },
            },
          },
        }}
      >
        <Box
          sx={{
            p: '8px 12px',
            position: 'sticky',
            top: 0,
            background: '#FFF',
            zIndex: 1,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <AppSearchField
            variant={'filled'}
            placeholder="Search driver"
            onChange={handleSearchChange}
            onKeyDown={handleSearch}
            value={searchQuery}
            boxProps={{
              sx: {
                width: '100%',
              },
            }}
          />
        </Box>

        <Stack
          spacing={'16px'}
          sx={{
            maxHeight: '380px',
            p: '8px 12px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#F4F4F4',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#CCC',
              borderRadius: '4px',
            },
          }}
        >
          {isLoadingDrivers ? (
            <Stack
              justifyContent={'center'}
              alignItems={'center'}
              sx={{ height: '200px' }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(14),
                  fontWeight: 400,
                  color: '#6B7280',
                }}
              >
                Loading drivers...
              </Typography>
            </Stack>
          ) : driverList.length > 0 ? (
            driverList.map((driver) => (
              <MenuItem
                key={driver.id}
                onClick={() => onDriverSelected(driver)}
                sx={{
                  p: '16px',
                  borderRadius: '8px',
                  background: '#FFF',
                  border: `1px solid rgba(81, 93, 101, 0.20)`,
                  boxShadow:
                    '0 14px 22px -9px rgba(16, 25, 40, 0.14), 0 0 3px -1px rgba(16, 25, 40, 0.04)',
                  cursor: 'pointer',
                  '&:hover': {
                    border: `1px solid rgba(81, 93, 101, 1)`,
                    transition: '.3s ease',
                  },
                }}
              >
                <RowStack spacing={'12px'} sx={{ width: '100%' }}>
                  <Avatar
                    src={driver.imageUri}
                    alt={driver.displayName}
                    sx={{
                      width: 44,
                      height: 44,
                      backgroundColor: !driver.imageUri
                        ? 'primary.main'
                        : 'transparent',
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {driver.displayName.charAt(0).toUpperCase()}
                  </Avatar>

                  <Stack spacing={'4px'} sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: pxToRem(14),
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      {driver.displayName}
                    </Typography>

                    <RowStack spacing={'8px'}>
                      <Typography
                        sx={{
                          fontSize: pxToRem(12),
                          fontWeight: 400,
                          color: '#6B7280',
                        }}
                      >
                        {driver.vehicleInfo}
                      </Typography>

                      {driver.rating > 0 && (
                        <RowStack spacing={'4px'}>
                          <Typography
                            sx={{
                              fontSize: pxToRem(12),
                              fontWeight: 500,
                              color: '#374151',
                            }}
                          >
                            •
                          </Typography>
                          <Rating
                            value={driver.rating}
                            readOnly
                            size="small"
                            precision={0.1}
                            sx={{
                              fontSize: pxToRem(14),
                              '& .MuiRating-iconFilled': {
                                color: '#FFC107',
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: pxToRem(12),
                              fontWeight: 500,
                              color: '#374151',
                            }}
                          >
                            {driver.rating.toFixed(1)}
                          </Typography>
                        </RowStack>
                      )}
                    </RowStack>

                    {driver.licensePlate && (
                      <Typography
                        sx={{
                          fontSize: pxToRem(12),
                          fontWeight: 400,
                          color: '#9CA3AF',
                        }}
                      >
                        Plate: {driver.licensePlate}
                      </Typography>
                    )}
                  </Stack>
                </RowStack>
              </MenuItem>
            ))
          ) : (
            <EmptyState
              emptyState={
                <Typography
                  sx={{
                    fontSize: pxToRem(16),
                    fontWeight: 400,
                    textAlign: 'center',
                  }}
                >
                  No drivers found
                </Typography>
              }
            />
          )}
        </Stack>
      </Menu>
    </>
  );
};
