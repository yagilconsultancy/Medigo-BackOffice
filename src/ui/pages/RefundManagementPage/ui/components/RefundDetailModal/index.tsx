'use client';

import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RefundDetailModalProps = {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  data: {
    refundId: string;
    booking: string;
    riderName: string;
    driverName: string;
    category: string;
    reason: string;
    amount: string;
    requested: string;
    status: string;
    paymentMethod: string;
    rideType: string;
    description: string;
  } | null;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const RefundDetailModal = ({
  open,
  onClose,
  onApprove,
  onReject,
  data,
}: RefundDetailModalProps) => {
  if (!data) return null;

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="refund-detail-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 440,
          maxWidth: 440,
          borderRadius: '20px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
        },
      }}
    >
      <Stack>
        {/* ── Header ───────────────────────────────────────────────────── */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '20px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack spacing={'12px'}>
            <WarningAmberOutlinedIcon sx={{ fontSize: 22, color: '#D97706' }} />
            <Stack spacing={'2px'}>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(15),
                  color: '#111827',
                }}
              >
                Refund Detail
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(12.5),
                  color: '#9CA3AF',
                }}
              >
                {data.refundId} · Booking {data.booking}
              </Typography>
            </Stack>
          </RowStack>

          <Box
            onClick={onClose}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '8px',
              background: '#F7F9FB',
              border: '0.67px solid #E8ECF0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </Box>
        </RowStack>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <Stack spacing={'20px'} sx={{ padding: '24px' }}>
          {/* Refund Amount */}
          <Stack spacing={'8px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(10),
                letterSpacing: '0.08em',
                color: '#9CA3AF',
                textTransform: 'uppercase',
              }}
            >
              Refund Amount
            </Typography>

            <RowStack
              justifyContent={'space-between'}
              alignItems={'flex-start'}
            >
              <Stack spacing={'4px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 800,
                    fontSize: pxToRem(30),
                    lineHeight: '1em',
                    color: '#059669',
                  }}
                >
                  {data.amount}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#9CA3AF',
                  }}
                >
                  {data.rideType} · {data.paymentMethod}
                </Typography>
              </Stack>

              <Stack spacing={'6px'} alignItems={'flex-end'}>
                {/* Status Badge */}
                <RowStack
                  spacing={'5px'}
                  sx={{
                    padding: '3px 10px',
                    borderRadius: '100px',
                    background:
                      data.status === 'Pending'
                        ? '#FFFBEB'
                        : data.status === 'Approved'
                          ? '#ECFDF5'
                          : '#FEF2F2',
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '3px',
                      background:
                        data.status === 'Pending'
                          ? '#D97706'
                          : data.status === 'Approved'
                            ? '#059669'
                            : '#EF4444',
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(11),
                      color:
                        data.status === 'Pending'
                          ? '#D97706'
                          : data.status === 'Approved'
                            ? '#059669'
                            : '#EF4444',
                    }}
                  >
                    {data.status}
                  </Typography>
                </RowStack>
                {/* Category */}
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12),
                    color: '#6B7280',
                  }}
                >
                  {data.category}
                </Typography>
              </Stack>
            </RowStack>
          </Stack>

          {/* Rider & Driver Cards */}
          <RowStack spacing={'10px'}>
            {[
              {
                icon: (
                  <PersonOutlineOutlinedIcon
                    sx={{ fontSize: 14, color: '#9CA3AF' }}
                  />
                ),
                label: 'RIDER',
                value: data.riderName,
              },
              {
                icon: (
                  <DirectionsCarOutlinedIcon
                    sx={{ fontSize: 14, color: '#9CA3AF' }}
                  />
                ),
                label: 'DRIVER',
                value: data.driverName,
              },
            ].map((card) => (
              <Stack
                key={card.label}
                sx={{
                  flex: 1,
                  background: '#F7F9FB',
                  borderRadius: '14px',
                  padding: '12px',
                  border: '0.67px solid #F0F4F8',
                }}
              >
                <RowStack spacing={'6px'} sx={{ mb: '6px' }}>
                  {card.icon}
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(9),
                      letterSpacing: '0.08em',
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                    }}
                  >
                    {card.label}
                  </Typography>
                </RowStack>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#111827',
                  }}
                >
                  {card.value}
                </Typography>
              </Stack>
            ))}
          </RowStack>

          {/* Rider's Description */}
          <Stack spacing={'8px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(9),
                letterSpacing: '0.08em',
                color: '#9CA3AF',
                textTransform: 'uppercase',
              }}
            >
              Rider&apos;s Description
            </Typography>
            <Box
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #F0F4F8',
                borderRadius: '14px',
                padding: '14px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  color: '#374151',
                  lineHeight: '1.6em',
                }}
              >
                {data.description}
              </Typography>
            </Box>
          </Stack>

          {/* Bottom Info Cards */}
          <RowStack spacing={'10px'}>
            {[
              {
                icon: (
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 12, color: '#9CA3AF' }}
                  />
                ),
                label: 'REQUESTED',
                value: data.requested,
              },
              {
                icon: (
                  <CreditCardOutlinedIcon
                    sx={{ fontSize: 12, color: '#9CA3AF' }}
                  />
                ),
                label: 'PAYMENT METHOD',
                value: data.paymentMethod,
              },
              {
                icon: (
                  <LocalHospitalOutlinedIcon
                    sx={{ fontSize: 12, color: '#9CA3AF' }}
                  />
                ),
                label: 'RIDE TYPE',
                value: data.rideType,
              },
            ].map((info) => (
              <Stack
                key={info.label}
                sx={{
                  flex: 1,
                  background: '#F7F9FB',
                  borderRadius: '14px',
                  padding: '12px',
                  border: '0.67px solid #F0F4F8',
                }}
              >
                <RowStack spacing={'5px'} sx={{ mb: '6px' }}>
                  {info.icon}
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(8.5),
                      letterSpacing: '0.08em',
                      color: '#9CA3AF',
                      textTransform: 'uppercase',
                    }}
                  >
                    {info.label}
                  </Typography>
                </RowStack>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12.5),
                    color: '#374151',
                  }}
                >
                  {info.value}
                </Typography>
              </Stack>
            ))}
          </RowStack>

          {/* Footer Buttons */}
          {data.status === 'Pending' && (
            <RowStack spacing={'12px'} sx={{ pt: '4px' }}>
              <Box
                onClick={onReject}
                sx={{
                  flex: 1,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '10px',
                  background: '#FEF2F2',
                  border: '0.67px solid #FECACA',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.85 },
                }}
              >
                <CancelOutlinedIcon sx={{ fontSize: 16, color: '#EF4444' }} />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#EF4444',
                  }}
                >
                  Reject Refund
                </Typography>
              </Box>

              <Box
                onClick={onApprove}
                sx={{
                  flex: 1,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  borderRadius: '10px',
                  background: '#059669',
                  boxShadow: '0px 2px 8px 0px rgba(5, 150, 105, 0.25)',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 16, color: '#FFFFFF' }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#FFFFFF',
                  }}
                >
                  Approve Refund
                </Typography>
              </Box>
            </RowStack>
          )}
        </Stack>
      </Stack>
    </AppModal>
  );
};
