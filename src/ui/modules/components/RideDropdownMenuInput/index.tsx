import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { pxToRem, useGetAllRides } from '../../../../common';
import { AppSearchField } from '../TextField';
import { RowStack } from '../RowStack';
import { EmptyState } from '../../blocks';
import dayjs from 'dayjs';

export interface RideInputData {
  id: string;
  pickup_address: string;
  destination_address: string;
  scheduledAt: string;
  status: string;
  rideType: string;
}

export interface RideDropdownMenuInputProps {
  handleRideSelected: (ride: RideInputData) => void;
  selectedRideId?: string;
  selectedRideDisplay?: string;
}

export const RideDropdownMenuInput = ({
  handleRideSelected,
  selectedRideDisplay,
}: RideDropdownMenuInputProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuButtonRef = useRef<HTMLDivElement>(null);

  // Fetch rides
  const { data: ridesData, isLoading } = useGetAllRides({
    page: 1,
    limit: 20,
  });

  // Transform API data to RideInputData format
  const rideList = useMemo<RideInputData[]>(() => {
    if (ridesData?.success && Array.isArray(ridesData.data)) {
      return ridesData.data.map((ride) => ({
        id: ride.id,
        pickup_address: ride.pickup_address,
        destination_address: ride.destination_address,
        scheduledAt: ride.scheduled_at,
        status: ride.status,
        rideType: ride.ride_type,
      }));
    }

    return [];
  }, [ridesData]);

  // Client-side search filter
  const filteredRides = useMemo(() => {
    if (!searchQuery.trim()) {
      return rideList;
    }

    const query = searchQuery.toLowerCase();
    return rideList.filter(
      (ride) =>
        ride.pickup_address.toLowerCase().includes(query) ||
        ride.destination_address.toLowerCase().includes(query) ||
        ride.status.toLowerCase().includes(query) ||
        ride.rideType.toLowerCase().includes(query)
    );
  }, [searchQuery, rideList]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
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

  const onRideSelected = (ride: RideInputData) => {
    setAnchorEl(null);
    setSearchQuery('');

    handleRideSelected(ride);
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
          background: '#FFF',
          cursor: 'pointer',
          '&:hover': {
            border: `1px solid rgba(81, 93, 101, 1)`,
            transition: '.3s ease',
          },
        }}
      >
        <Typography
          sx={{
            fontSize: pxToRem(14),
            fontWeight: 400,
            opacity: selectedRideDisplay ? '1' : '0.5',
            color: selectedRideDisplay ? '#374151' : 'inherit',
          }}
        >
          {selectedRideDisplay || 'Select a ride/trip'}
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
            placeholder="Search rides..."
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
          {isLoading ? (
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
                Loading rides...
              </Typography>
            </Stack>
          ) : filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <MenuItem
                key={ride.id}
                onClick={() => onRideSelected(ride)}
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
                <Stack spacing={'8px'} sx={{ width: '100%' }}>
                  <RowStack spacing={'8px'}>
                    <Typography
                      sx={{
                        fontSize: pxToRem(13),
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      {ride.rideType.replace('_', ' ').toUpperCase()}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: pxToRem(12),
                        fontWeight: 500,
                        color: '#374151',
                      }}
                    >
                      •
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: pxToRem(12),
                        fontWeight: 500,
                        color:
                          ride.status === 'completed'
                            ? '#059669'
                            : ride.status === 'in_progress'
                              ? '#2F6FED'
                              : '#6B7280',
                        textTransform: 'capitalize',
                      }}
                    >
                      {ride.status.replace('_', ' ')}
                    </Typography>
                  </RowStack>

                  <Typography
                    sx={{
                      fontSize: pxToRem(12),
                      fontWeight: 400,
                      color: '#6B7280',
                    }}
                  >
                    <strong style={{ color: '#374151' }}>From:</strong>{' '}
                    {ride.pickup_address}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: pxToRem(12),
                      fontWeight: 400,
                      color: '#6B7280',
                    }}
                  >
                    <strong style={{ color: '#374151' }}>To:</strong>{' '}
                    {ride.destination_address}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: pxToRem(11.5),
                      fontWeight: 400,
                      color: '#9CA3AF',
                    }}
                  >
                    Scheduled:{' '}
                    {dayjs(ride.scheduledAt).format('MMM D, YYYY h:mm A')}
                  </Typography>
                </Stack>
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
                  No rides found
                </Typography>
              }
            />
          )}
        </Stack>
      </Menu>
    </>
  );
};
