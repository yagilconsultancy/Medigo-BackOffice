import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import {
  AppButton,
  AppModal,
  RowStack,
  StyledImage,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import driverAvatarIcon from '../../assets/icons/driver-avatar-icon.svg';
import pickupIcon from '../../assets/icons/pickup-icon.svg';
import destinationIcon from '../../assets/icons/destination-icon.svg';
import warningIcon from '../../assets/icons/warning-icon.svg';
import distanceIcon from '../../assets/icons/distance-icon.svg';
import checkIcon from '../../assets/icons/check-icon.svg';

type DispatchDriver = {
  id: string;
  initials: string;
  initialsColor: string;
  name: string;
  vehicle: string;
  rating: number;
  trips: number;
  distance: string;
  eta: string;
  isBestMatch?: boolean;
};

type DispatchAssignModalProps = {
  open: boolean;
  handleClose: () => void;
  bookingId: string;
  patientName: string;
  time: string;
  pickup: string;
  destination: string;
  specialNote?: string;
  drivers: DispatchDriver[];
  onConfirm?: (driverId: string) => void;
};

type SortTab = 'Nearest' | 'Rating' | 'Experience';

export const DispatchAssignModal = ({
  open,
  handleClose,
  bookingId,
  patientName,
  time,
  pickup,
  destination,
  specialNote,
  drivers,
  onConfirm,
}: DispatchAssignModalProps) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<SortTab>('Nearest');

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);

  const sortTabs: SortTab[] = ['Nearest', 'Rating', 'Experience'];

  const sortedDrivers = [...drivers].sort((a, b) => {
    if (activeSort === 'Rating') return b.rating - a.rating;
    if (activeSort === 'Experience') return b.trips - a.trips;
    return parseFloat(a.distance) - parseFloat(b.distance);
  });

  const handleConfirm = () => {
    if (selectedDriverId) {
      onConfirm?.(selectedDriverId);
    }
    handleClose();
    setSelectedDriverId(null);
  };

  const handleCancel = () => {
    handleClose();
    setSelectedDriverId(null);
  };

  return (
    <AppModal label="dispatch-assign-driver" open={open} setOpen={handleCancel}>
      <Stack spacing={'16px'} sx={{ width: '480px' }}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <RowStack spacing={'12px'}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StyledImage
                src={driverAvatarIcon}
                alt="driver"
                width={20}
                height={20}
              />
            </Box>
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  color: (theme) => theme.color.deepBlue,
                }}
              >
                Assign Driver
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#2F6FED',
                }}
              >
                Booking {bookingId}
              </Typography>
            </Stack>
          </RowStack>
          <IconButton
            onClick={handleCancel}
            sx={{
              background: '#F7F9FB',
              borderRadius: '8px',
              width: 30,
              height: 30,
            }}
          >
            <CloseIcon sx={{ fontSize: 15, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* Patient + Time */}
        <RowStack
          justifyContent="space-between"
          sx={{
            borderTop: '0.67px solid #F3F4F6',
            paddingTop: '14px',
          }}
        >
          <Stack spacing={'2px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(14),
                color: (theme) => theme.color.deepBlue,
              }}
            >
              {patientName}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11.5),
                color: (theme) => theme.color.lightGrey,
              }}
            >
              Passenger
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12.5),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {time}
          </Typography>
        </RowStack>

        {/* Route */}
        <Stack spacing={'8px'}>
          <RowStack spacing={'8px'}>
            <StyledImage src={pickupIcon} alt="pickup" width={12} height={12} />
            <Stack spacing={'1px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(10),
                  color: (theme) => theme.color.lightGrey,
                  textTransform: 'uppercase',
                }}
              >
                Pickup
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(12.5),
                  color: (theme) => theme.color.deepBlue,
                }}
              >
                {pickup}
              </Typography>
            </Stack>
          </RowStack>
          <RowStack spacing={'8px'}>
            <StyledImage
              src={destinationIcon}
              alt="destination"
              width={12}
              height={12}
            />
            <Stack spacing={'1px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(10),
                  color: (theme) => theme.color.lightGrey,
                  textTransform: 'uppercase',
                }}
              >
                Drop-off
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(12.5),
                  color: (theme) => theme.color.deepBlue,
                }}
              >
                {destination}
              </Typography>
            </Stack>
          </RowStack>
        </Stack>

        {/* Special Note */}
        {specialNote && (
          <RowStack
            spacing={'6px'}
            sx={{
              background: '#FFFBEB',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          >
            <StyledImage
              src={warningIcon}
              alt="warning"
              width={12}
              height={12}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(11.5),
                color: '#D97706',
              }}
            >
              {specialNote}
            </Typography>
          </RowStack>
        )}

        {/* Sort Tabs */}
        <RowStack justifyContent="space-between" sx={{ paddingTop: '4px' }}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(11),
              color: (theme) => theme.color.lightGrey,
              textTransform: 'uppercase',
            }}
          >
            {drivers.length} Available · Sorted by
          </Typography>
          <RowStack spacing={'4px'}>
            {sortTabs.map((tab) => (
              <Typography
                key={tab}
                onClick={() => setActiveSort(tab)}
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(11.5),
                  color:
                    activeSort === tab
                      ? (theme) => theme.color.deepBlue
                      : (theme) => theme.color.lightGrey,
                  background: activeSort === tab ? '#F3F4F6' : 'transparent',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {tab}
              </Typography>
            ))}
          </RowStack>
        </RowStack>

        {/* Driver List */}
        <Stack spacing={'8px'} sx={{ maxHeight: '320px', overflowY: 'auto' }}>
          {sortedDrivers.map((driver) => {
            const isSelected = selectedDriverId === driver.id;
            return (
              <RowStack
                key={driver.id}
                spacing={'12px'}
                onClick={() => setSelectedDriverId(driver.id)}
                sx={{
                  background: isSelected ? '#EBF2FF' : '#F7F9FB',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  border: isSelected
                    ? '1.5px solid #2F6FED'
                    : '1.5px solid transparent',
                  transition: 'all 0.15s',
                  '&:hover': {
                    background: isSelected ? '#EBF2FF' : '#F0F2F5',
                  },
                }}
              >
                {/* Avatar */}
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: driver.initialsColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(11.5),
                      color: '#FFFFFF',
                    }}
                  >
                    {driver.initials}
                  </Typography>
                </Box>

                {/* Info */}
                <Stack sx={{ flex: 1 }} spacing={'2px'}>
                  <RowStack spacing={'8px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(13),
                        color: (theme) => theme.color.deepBlue,
                      }}
                    >
                      {driver.name}
                    </Typography>
                    {driver.isBestMatch && (
                      <Chip
                        label="BEST MATCH"
                        size="small"
                        sx={{
                          background: '#FEF3C7',
                          color: '#92400E',
                          fontSize: pxToRem(9),
                          fontWeight: 700,
                          height: '18px',
                          borderRadius: '9px',
                        }}
                      />
                    )}
                  </RowStack>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11.5),
                      color: (theme) => theme.color.lightGrey,
                    }}
                  >
                    {driver.vehicle}
                  </Typography>
                  <RowStack spacing={'8px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(11),
                        color: '#F59E0B',
                      }}
                    >
                      ★ {driver.rating}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(11),
                        color: (theme) => theme.color.lightGrey,
                      }}
                    >
                      {driver.trips} trips
                    </Typography>
                  </RowStack>
                </Stack>

                {/* Distance + ETA */}
                <Stack
                  alignItems="flex-end"
                  spacing={'2px'}
                  sx={{ flexShrink: 0 }}
                >
                  <RowStack spacing={'4px'}>
                    <StyledImage
                      src={distanceIcon}
                      alt="distance"
                      width={11}
                      height={11}
                    />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12),
                        color: (theme) => theme.color.deepBlue,
                      }}
                    >
                      {driver.distance}
                    </Typography>
                  </RowStack>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(10.5),
                      color: (theme) => theme.color.lightGrey,
                    }}
                  >
                    ETA {driver.eta}
                  </Typography>
                </Stack>
              </RowStack>
            );
          })}
        </Stack>

        {/* Selected Driver Bar */}
        {selectedDriver && (
          <RowStack
            spacing={'10px'}
            sx={{
              background: '#EBF2FF',
              borderRadius: '12px',
              padding: '10px 14px',
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: selectedDriver.initialsColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(10),
                  color: '#FFFFFF',
                }}
              >
                {selectedDriver.initials}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(12),
                color: (theme) => theme.color.deepBlue,
                flex: 1,
              }}
            >
              {selectedDriver.name} · {selectedDriver.vehicle} ·{' '}
              {selectedDriver.distance} ETA {selectedDriver.eta}
            </Typography>
            <IconButton
              onClick={() => setSelectedDriverId(null)}
              size="small"
              sx={{ padding: '2px' }}
            >
              <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
            </IconButton>
          </RowStack>
        )}

        {/* Footer Buttons */}
        <RowStack spacing={'12px'} width="100%">
          <AppButton
            fullWidth
            onClick={handleCancel}
            sx={{
              background: '#F7F9FB',
              color: (theme) => theme.color.grey,
              fontWeight: 600,
              fontSize: pxToRem(13),
              borderRadius: '9px',
            }}
          >
            Cancel
          </AppButton>
          {selectedDriver && (
            <AppButton
              fullWidth
              onClick={handleConfirm}
              sx={{
                background: (theme) => theme.palette.primary.main,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: pxToRem(13),
                borderRadius: '9px',
                '&:hover': {
                  background: '#2563EB',
                },
              }}
            >
              <RowStack spacing={'6px'}>
                <StyledImage
                  src={checkIcon}
                  alt="confirm"
                  width={14}
                  height={14}
                />
                <span>Confirm Assignment</span>
              </RowStack>
            </AppButton>
          )}
        </RowStack>
      </Stack>
    </AppModal>
  );
};
