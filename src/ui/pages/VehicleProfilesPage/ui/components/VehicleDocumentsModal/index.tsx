'use client';

import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import type { VehicleProfileCardData } from '../VehicleProfileCard';

// ─── Types ──────────────────────────────────────────────────────────────────

type VehicleDocumentsModalProps = {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleProfileCardData | null;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const VehicleDocumentsModal = ({
  open,
  onClose,
  vehicle,
}: VehicleDocumentsModalProps) => {
  if (!vehicle) return null;

  const documents = [
    {
      icon: <SecurityOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      title: 'Vehicle Insurance',
      status: 'Valid',
      detail: vehicle.insurance,
    },
    {
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      title: 'Registration',
      status: 'Valid',
      detail: vehicle.registration,
    },
    {
      icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      title: 'Safety Inspection',
      status: 'Valid',
      detail: 'Mar 1, 2026 · Passed',
    },
    {
      icon: <FingerprintOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      title: 'VIN Verification',
      status: 'Verified',
      detail: vehicle.vin,
    },
    {
      icon: <HandshakeOutlinedIcon sx={{ fontSize: 13, color: '#9CA3AF' }} />,
      title: 'Fleet Agreement',
      status: 'Valid',
      detail: 'Signed · Jan 2024',
    },
  ];

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="vehicle-documents-modal"
      sx={{
        '& .MuiDialog-paper': {
          width: '440px',
          maxWidth: '440px',
          borderRadius: '16px',
          boxShadow: '0px 20px 60px 0px rgba(0, 0, 0, 0.15)',
          padding: 0,
          overflow: 'visible',
        },
      }}
    >
      <Stack>
        {/* Header */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <Stack spacing={'2px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                lineHeight: '1.5em',
                color: '#111827',
              }}
            >
              Vehicle Documents
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                lineHeight: '1.5em',
                color: '#9CA3AF',
              }}
            >
              {vehicle.vehicle} · {vehicle.vehicleId}
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* Document Rows */}
        <Stack spacing={'12px'} sx={{ padding: '20px 24px' }}>
          {documents.map((doc) => (
            <Stack
              key={doc.title}
              sx={{
                background: '#F7F9FB',
                borderRadius: '14px',
                padding: '12px 16px',
                gap: '4px',
              }}
            >
              <RowStack justifyContent={'space-between'}>
                <RowStack spacing={'8px'}>
                  {doc.icon}
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      lineHeight: '1.5em',
                      color: '#374151',
                    }}
                  >
                    {doc.title}
                  </Typography>
                </RowStack>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: '#ECFDF5',
                  }}
                >
                  <CheckCircleOutlinedIcon
                    sx={{ fontSize: 9, color: '#059669' }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(11),
                      lineHeight: '1.5em',
                      color: '#059669',
                    }}
                  >
                    {doc.status}
                  </Typography>
                </Box>
              </RowStack>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  lineHeight: '1.5em',
                  color: '#9CA3AF',
                  paddingLeft: '21px',
                }}
              >
                {doc.detail}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Close Button */}
        <Box sx={{ padding: '0 24px 20px' }}>
          <Box
            onClick={onClose}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              borderRadius: '9px',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                lineHeight: '1.5em',
                color: '#374151',
              }}
            >
              Close
            </Typography>
          </Box>
        </Box>
      </Stack>
    </AppModal>
  );
};
