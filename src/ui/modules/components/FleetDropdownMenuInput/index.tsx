import { Avatar, Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { pxToRem, useGetFleetCompanies } from '../../../../common';
import { AppSearchField } from '../TextField';
import { RowStack } from '../RowStack';
import { EmptyState } from '../../blocks';

export interface FleetInputData {
  id: string;
  name: string;
  logo_url?: string | null;
  contact_person?: string | null;
  vehicle_count: number;
  driver_count: number;
}

export interface FleetDropdownMenuInputProps {
  handleFleetSelected: (fleet: FleetInputData) => void;
  selectedFleetId?: string;
  selectedFleetName?: string;
}

export const FleetDropdownMenuInput = ({
  handleFleetSelected,
  selectedFleetId,
  selectedFleetName,
}: FleetDropdownMenuInputProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuButtonRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch fleet companies
  const fleetsQuery = useGetFleetCompanies({
    search: debouncedSearch || undefined,
    limit: 20,
    page: 1,
  });

  const isLoadingFleets = fleetsQuery.isLoading;

  // Transform API data to FleetInputData format
  const fleetList = useMemo<FleetInputData[]>(() => {
    const responseData = fleetsQuery.data;
    if (!responseData || !responseData.data) return [];

    return responseData.data.map((fleet) => ({
      id: fleet.id,
      name: fleet.name,
      logo_url: fleet.logo_url,
      contact_person: fleet.contact_person,
      vehicle_count: fleet.vehicle_count,
      driver_count: fleet.driver_count,
    }));
  }, [fleetsQuery.data]);

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

  const onFleetSelected = (fleet: FleetInputData) => {
    setAnchorEl(null);
    setSearchQuery('');

    handleFleetSelected(fleet);
  };

  const menuWidth = menuButtonRef.current?.offsetWidth || 0;
  const fleetToRender = useMemo(() => fleetList, [fleetList]);

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
            opacity: selectedFleetName ? '1' : '0.5',
            color: selectedFleetName ? '#374151' : 'inherit',
          }}
        >
          {selectedFleetName || 'Select a fleet company'}
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
            placeholder="Search fleet company"
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
          {isLoadingFleets ? (
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
                Loading fleet companies...
              </Typography>
            </Stack>
          ) : fleetToRender.length > 0 ? (
            fleetToRender.map((fleet) => (
              <MenuItem
                key={fleet.id}
                onClick={() => onFleetSelected(fleet)}
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
                    src={fleet.logo_url || undefined}
                    alt={fleet.name}
                    sx={{
                      width: 44,
                      height: 44,
                      backgroundColor: !fleet.logo_url
                        ? 'primary.main'
                        : 'transparent',
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {fleet.name.charAt(0).toUpperCase()}
                  </Avatar>

                  <Stack spacing={'4px'} sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: pxToRem(14),
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      {fleet.name}
                    </Typography>

                    <RowStack spacing={'8px'}>
                      <Typography
                        sx={{
                          fontSize: pxToRem(12),
                          fontWeight: 400,
                          color: '#6B7280',
                        }}
                      >
                        {fleet.vehicle_count} vehicles · {fleet.driver_count}{' '}
                        drivers
                      </Typography>
                    </RowStack>

                    {fleet.contact_person && (
                      <Typography
                        sx={{
                          fontSize: pxToRem(12),
                          fontWeight: 400,
                          color: '#9CA3AF',
                        }}
                      >
                        {fleet.contact_person}
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
                  No fleet companies found
                </Typography>
              }
            />
          )}
        </Stack>
      </Menu>
    </>
  );
};
