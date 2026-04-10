import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { AppButton, AppModal, RowStack, StyledImage } from '..';
import {
  pxToRem,
  useGetAvailableDrivers,
  useResolvedApiQuery,
  useAssignDriverToBooking,
} from '../../../../common';
import CloseIcon from '@mui/icons-material/Close';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
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
  rideId: string;
  bookingId: string;
  patientName: string;
  rideType: string;
  pickup: string;
  destination: string;
  dateTime: string;
};

export const AssignDriverModal = ({
  open,
  handleClose,
  rideId,
  bookingId,
  patientName,
  rideType,
  pickup,
  destination,
  dateTime,
}: AssignDriverModalProps) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  // Fetch available drivers from API
  const { data: driversData, isLoading: isLoadingDrivers } =
    useResolvedApiQuery(useGetAvailableDrivers, [], rideId);

  // Assign driver mutation
  const assignDriverMutation = useAssignDriverToBooking();

  // Map API response to Driver[] format
  const drivers = useMemo<Driver[]>(() => {
    if (!driversData) return [];

    const colors = ['#2F6FED', '#059669', '#8B5CF6', '#F59E0B', '#EF4444'];

    return driversData.map((driver, index) => {
      const vehicleLabel = [
        driver.vehicle_make,
        driver.vehicle_model,
        driver.vehicle_type,
      ]
        .filter(Boolean)
        .join(' ');

      return {
        id: driver.driver_id,
        initials: driver.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        initialsColor: colors[index % colors.length],
        name: driver.name,
        vehicle: vehicleLabel || 'N/A',
        rating: driver.rating || 0,
      };
    });
  }, [driversData]);

  const handleConfirm = () => {
    if (!selectedDriverId) return;

    assignDriverMutation.mutate(
      { rideId, driver_id: selectedDriverId },
      {
        onSuccess: () => {
          toast.success('Driver assigned successfully');
          handleClose();
          setSelectedDriverId(null);
        },
        onError: () => {
          toast.error('Failed to assign driver');
        },
      }
    );
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
        <Stack spacing={'8px'} sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {isLoadingDrivers ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : drivers.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(13),
                  color: '#9CA3AF',
                }}
              >
                No available drivers
              </Typography>
            </Stack>
          ) : (
            drivers.map((driver) => {
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
                    ★ {driver.rating.toFixed(1)}
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
            })
          )}
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
            disabled={!selectedDriverId || assignDriverMutation.isPending}
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
            {assignDriverMutation.isPending
              ? 'Processing...'
              : 'Confirm Assignment'}
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
