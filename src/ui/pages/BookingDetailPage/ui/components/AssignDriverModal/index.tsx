import { useState } from 'react';
import {
  alpha,
  Box,
  CircularProgress,
  Divider,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import {
  AppButton,
  AppModal,
  RowStack,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { AvailableDriverResponse } from '../../../../../../common/types';

type AssignDriverModalProps = {
  open: boolean;
  handleClose: () => void;
  drivers: AvailableDriverResponse[];
  isLoadingDrivers: boolean;
  onAssign: (driverId: string) => void;
  isAssigning: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
};

export const AssignDriverModal = ({
  open,
  handleClose,
  drivers,
  isLoadingDrivers,
  onAssign,
  isAssigning,
  title = 'Assign Driver',
  description = 'Select a driver from the available list to assign to this booking.',
  confirmLabel = 'Assign Driver',
}: AssignDriverModalProps) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedDriverId) {
      onAssign(selectedDriverId);
    }
  };

  const handleCloseModal = () => {
    setSelectedDriverId(null);
    handleClose();
  };

  return (
    <AppModal label={title} open={open} setOpen={handleCloseModal}>
      <Stack spacing={2} divider={<Divider />}>
        <Stack spacing={0.5}>
          <Typography
            sx={{
              color: (theme) => theme.color.deepBlue,
              fontWeight: 700,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(15),
              lineHeight: '22.5px',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
            }}
          >
            {description}
          </Typography>
        </Stack>

        <Stack spacing={'8px'} sx={{ maxHeight: 320, overflowY: 'auto' }}>
          {isLoadingDrivers ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : drivers.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <Typography
                sx={{
                  color: '#9CA3AF',
                  fontSize: pxToRem(13),
                  fontWeight: 500,
                }}
              >
                No available drivers
              </Typography>
            </Stack>
          ) : (
            drivers.map((driver) => {
              const isSelected = selectedDriverId === driver.driver_id;
              const vehicleLabel = [
                driver.vehicle_make,
                driver.vehicle_model,
                driver.vehicle_type,
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <RowStack
                  key={driver.driver_id}
                  spacing={'10px'}
                  onClick={() => setSelectedDriverId(driver.driver_id)}
                  sx={{
                    background: isSelected ? alpha('#2F6FED', 0.06) : '#F7F9FB',
                    border: isSelected
                      ? '1px solid #2F6FED'
                      : '1px solid transparent',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      background: isSelected
                        ? alpha('#2F6FED', 0.08)
                        : '#F0F2F5',
                    },
                  }}
                >
                  <Radio
                    checked={isSelected}
                    size="small"
                    sx={{ p: 0 }}
                  />
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '12px',
                      background: '#E0E7FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: pxToRem(12),
                        color: '#4338CA',
                      }}
                    >
                      {driver.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </Typography>
                  </Box>
                  <Stack spacing={'2px'} sx={{ flex: 1, minWidth: 0 }}>
                    <RowStack spacing={'6px'}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: pxToRem(13),
                          color: (theme) => theme.color.deepBlue,
                          fontFamily: (theme) => theme.typography.fontFamily,
                        }}
                      >
                        {driver.name}
                      </Typography>
                      <RowStack spacing={'2px'}>
                        <StarIcon
                          sx={{ fontSize: 12, color: '#F59E0B' }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: pxToRem(11),
                            color: '#6B7280',
                          }}
                        >
                          {driver.rating.toFixed(1)}
                        </Typography>
                      </RowStack>
                    </RowStack>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: pxToRem(11),
                        color: '#9CA3AF',
                        fontFamily: (theme) => theme.typography.fontFamily,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {[vehicleLabel, driver.vehicle_plate]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </Typography>
                  </Stack>
                </RowStack>
              );
            })
          )}
        </Stack>

        <RowStack spacing={'12px'} width={'100%'}>
          <AppButton
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              color: (theme) => theme.color.grey,
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              '&:hover': {
                background: alpha('#F7F9FB', 0.1),
              },
            }}
            fullWidth
            onClick={handleCloseModal}
          >
            Cancel
          </AppButton>
          <AppButton
            sx={{
              background: (theme) => theme.palette.primary.main,
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: pxToRem(13),
              lineHeight: '19.5px',
              '&:hover': {
                background: alpha('#2F6FED', 0.9),
              },
            }}
            fullWidth
            onClick={handleConfirm}
            disabled={!selectedDriverId || isAssigning}
          >
            {isAssigning ? 'Processing...' : confirmLabel}
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
