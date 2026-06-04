import { useMemo, useState } from 'react';
import {
  alpha,
  Box,
  Chip,
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
import { pxToRem, useListCaregivers } from '../../../../../../common';
import { CaregiverRosterRow } from '../../../../../../common/types';

type AssignCareAssistantModalProps = {
  open: boolean;
  handleClose: () => void;
  onAssign: (caregiverId: string) => void;
  isAssigning: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
};

export const AssignCareAssistantModal = ({
  open,
  handleClose,
  onAssign,
  isAssigning,
  title = 'Assign Care Assistant',
  description = 'Select a care assistant from the available list to assign to this booking.',
  confirmLabel = 'Assign Care Assistant',
}: AssignCareAssistantModalProps) => {
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string | null>(
    null
  );

  const { data: caregiversResponse, isLoading: isLoadingCaregivers } =
    useListCaregivers({
      status: 'available',
      page: 1,
      limit: 10,
    });

  // @ts-ignore
  const caregivers = useMemo<CaregiverRosterRow[]>(() => {
    if (!caregiversResponse?.success) return [];
    return caregiversResponse.data ?? [];
  }, [caregiversResponse]);
  console.log('Caregivers:', caregivers, caregiversResponse);

  const handleConfirm = () => {
    if (selectedCaregiverId) {
      onAssign(selectedCaregiverId);
    }
  };

  const handleCloseModal = () => {
    setSelectedCaregiverId(null);
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
          {isLoadingCaregivers ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          ) : caregivers.length === 0 ? (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <Typography
                sx={{
                  color: '#9CA3AF',
                  fontSize: pxToRem(13),
                  fontWeight: 500,
                }}
              >
                No available caregivers
              </Typography>
            </Stack>
          ) : (
            caregivers.map((caregiver) => {
              const isSelected = selectedCaregiverId === caregiver.caregiver_id;
              const initials = caregiver.full_name
                .split(' ')
                .map((n) => n[0])
                .filter(Boolean)
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <RowStack
                  key={caregiver.caregiver_id}
                  spacing={'10px'}
                  onClick={() => setSelectedCaregiverId(caregiver.caregiver_id)}
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
                  <Radio checked={isSelected} size="small" sx={{ p: 0 }} />
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '12px',
                      background: '#DCFCE7',
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
                        color: '#15803D',
                      }}
                    >
                      {initials || 'CA'}
                    </Typography>
                  </Box>
                  <Stack spacing={'2px'} sx={{ flex: 1, minWidth: 0 }}>
                    <RowStack spacing={'6px'} alignItems="center">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: pxToRem(13),
                          color: (theme) => theme.color.deepBlue,
                          fontFamily: (theme) => theme.typography.fontFamily,
                        }}
                      >
                        {caregiver.full_name}
                      </Typography>
                      <RowStack spacing={'2px'} alignItems="center">
                        <StarIcon sx={{ fontSize: 12, color: '#F59E0B' }} />
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: pxToRem(11),
                            color: '#6B7280',
                          }}
                        >
                          {(caregiver.rating ?? 0).toFixed(1)}
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
                      ID: {caregiver.caregiver_id}
                    </Typography>
                    <RowStack spacing={'6px'} sx={{ flexWrap: 'wrap' }}>
                      <Chip
                        label={caregiver.specialty}
                        size="small"
                        sx={{
                          background: '#EBF2FF',
                          color: '#2F6FED',
                          fontSize: pxToRem(10),
                          fontWeight: 600,
                          height: '20px',
                        }}
                      />
                      {caregiver.capabilities.slice(0, 2).map((capability) => (
                        <Chip
                          key={capability}
                          label={capability}
                          size="small"
                          sx={{
                            background: '#F7F9FB',
                            color: '#374151',
                            fontSize: pxToRem(10),
                            fontWeight: 500,
                            height: '20px',
                          }}
                        />
                      ))}
                    </RowStack>
                  </Stack>
                  <Chip
                    label={caregiver.status}
                    size="small"
                    sx={{
                      background: alpha('#059669', 0.1),
                      color: '#059669',
                      fontSize: pxToRem(10),
                      fontWeight: 700,
                    }}
                  />
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
            disabled={!selectedCaregiverId || isAssigning}
          >
            {isAssigning ? 'Processing...' : confirmLabel}
          </AppButton>
        </RowStack>
      </Stack>
    </AppModal>
  );
};
