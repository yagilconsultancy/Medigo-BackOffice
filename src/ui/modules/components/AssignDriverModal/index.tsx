import { Box, IconButton, Stack, Typography } from '@mui/material';
import { AppButton, AppModal, RowStack, StyledImage } from '..';
import { pxToRem } from '../../../../common';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import checkIcon from './assets/icons/check-Icon.svg';

type Driver = {
  id: string;
  initials: string;
  initialsColor: string;
  name: string;
  vehicle: string;
  rating: number;
};

type AssignDriverModalProps = {
  open: boolean;
  handleClose: () => void;
  bookingId: string;
  patientName: string;
  rideType: string;
  pickup: string;
  destination: string;
  dateTime: string;
  drivers: Driver[];
};

export const AssignDriverModal = ({
  open,
  handleClose,
  bookingId,
  patientName,
  rideType,
  pickup,
  destination,
  dateTime,
  drivers,
}: AssignDriverModalProps) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const handleConfirm = () => {
    handleClose();
    setSelectedDriverId(null);
  };

  const handleCancel = () => {
    handleClose();
    setSelectedDriverId(null);
  };

  return (
    <AppModal label="assign-driver" open={open} setOpen={handleCancel}>
      <Stack spacing={'16px'} sx={{ width: '480px' }}>
        {/* Header */}
        <RowStack justifyContent="space-between">
          <Stack spacing={'0px'}>
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
                fontSize: pxToRem(12.5),
                color: (theme) => theme.color.lightGrey,
              }}
            >
              {bookingId} · {patientName} · {rideType}
            </Typography>
          </Stack>
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

        {/* Route Info */}
        <Stack
          spacing={'2px'}
          sx={{
            background: '#F7F9FB',
            borderRadius: '14px',
            padding: '14px 16px',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: (theme) => theme.color.lightGrey,
              textTransform: 'uppercase',
            }}
          >
            Pickup → Destination
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(13),
              color: (theme) => theme.color.grey,
            }}
          >
            {pickup} → {destination}
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(12),
              color: (theme) => theme.color.lightGrey,
            }}
          >
            {dateTime}
          </Typography>
        </Stack>

        {/* Select Driver Label */}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: (theme) => theme.color.grey,
          }}
        >
          Select Available Driver
        </Typography>

        {/* Driver List */}
        <Stack spacing={'8px'}>
          {drivers.map((driver) => {
            const isSelected = selectedDriverId === driver.id;
            return (
              <RowStack
                key={driver.id}
                spacing={'12px'}
                onClick={() => setSelectedDriverId(driver.id)}
                sx={{
                  background: isSelected ? '#EBF2FF' : '#F7F9FB',
                  borderRadius: '10px',
                  padding: '15px 16px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  '&:hover': {
                    background: isSelected ? '#EBF2FF' : '#F0F2F5',
                  },
                }}
              >
                {/* Avatar */}
                <Box
                  sx={{
                    width: 34,
                    height: 34,
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
                      fontSize: pxToRem(12),
                      color: '#FFFFFF',
                    }}
                  >
                    {driver.initials}
                  </Typography>
                </Box>

                {/* Driver Info */}
                <Stack sx={{ flex: 1 }}>
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
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 500,
                      fontSize: pxToRem(12),
                      color: (theme) => theme.color.lightGrey,
                    }}
                  >
                    {driver.vehicle}
                  </Typography>
                </Stack>

                {/* Rating */}
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(12),
                    color: '#059669',
                  }}
                >
                  ★ {driver.rating}
                </Typography>

                {/* Checkmark for selected */}
                {isSelected && (
                  <StyledImage
                    src={checkIcon}
                    alt="selected"
                    width={16}
                    height={16}
                  />
                )}
              </RowStack>
            );
          })}
        </Stack>

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
          <AppButton
            fullWidth
            onClick={handleConfirm}
            disabled={!selectedDriverId}
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
            Confirm Assignment
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
