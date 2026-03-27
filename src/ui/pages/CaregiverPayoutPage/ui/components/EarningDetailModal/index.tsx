'use client';

import { Box, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AppModal, RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type EarningDetailModalProps = {
  open: boolean;
  onClose: () => void;
  onPayNow?: () => void;
  variant: 'caregiver' | 'driver';
  data: {
    name: string;
    initials: string;
    avatarBg: string;
    id: string;
    org: string;
    date: string;
    status: string;
    netPayout: string;
    grossAmount: string;
    commissionAmount: string;
    pendingAmount: string;
    trips: number;
    earningsSplit: number;
    schedule: string;
    payoutMethod: string;
    bankAccount: string;
  } | null;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const EarningDetailModal = ({
  open,
  onClose,
  onPayNow,
  variant,
  data,
}: EarningDetailModalProps) => {
  if (!data) return null;

  const greenPercent = data.earningsSplit;
  const redPercent = 100 - greenPercent;

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="earning-detail-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: 560,
          maxWidth: 560,
          borderRadius: '24px',
          boxShadow: '0px 32px 80px 0px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
        },
      }}
    >
      <Stack>
        {/* ── Gradient Header ──────────────────────────────────────────── */}
        <Box
          sx={{
            background:
              'linear-gradient(135deg, rgba(47, 111, 237, 0.09) 0%, rgba(47, 111, 237, 0.02) 100%)',
            padding: '24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack
            justifyContent={'space-between'}
            alignItems={'flex-start'}
          >
            <RowStack spacing={'16px'}>
              {/* Avatar */}
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '20px',
                  background: data.avatarBg,
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
                    fontSize: pxToRem(18),
                    color: '#FFFFFF',
                  }}
                >
                  {data.initials}
                </Typography>
              </Box>

              <Stack spacing={'4px'}>
                <RowStack spacing={'10px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 800,
                      fontSize: pxToRem(20),
                      color: '#111827',
                      lineHeight: '1.3em',
                    }}
                  >
                    {data.name}
                  </Typography>
                  {/* Status Badge */}
                  <RowStack
                    spacing={'5px'}
                    sx={{
                      padding: '3px 10px',
                      borderRadius: '100px',
                      background:
                        data.status === 'Active' ? '#ECFDF5' : '#FEF2F2',
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '3px',
                        background:
                          data.status === 'Active' ? '#059669' : '#EF4444',
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(11),
                        color:
                          data.status === 'Active' ? '#059669' : '#EF4444',
                      }}
                    >
                      {data.status}
                    </Typography>
                  </RowStack>
                </RowStack>

                <RowStack spacing={'6px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#9CA3AF',
                      lineHeight: '1.5em',
                    }}
                  >
                    {data.id}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#D1D5DB',
                      lineHeight: '1.5em',
                    }}
                  >
                    ·
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#9CA3AF',
                      lineHeight: '1.5em',
                    }}
                  >
                    {data.org}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#D1D5DB',
                      lineHeight: '1.5em',
                    }}
                  >
                    ·
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12.5),
                      color: '#9CA3AF',
                      lineHeight: '1.5em',
                    }}
                  >
                    {data.date}
                  </Typography>
                </RowStack>
              </Stack>
            </RowStack>

            {/* Close Button */}
            <Box
              onClick={onClose}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
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
              <CloseIcon sx={{ fontSize: 15, color: '#6B7280' }} />
            </Box>
          </RowStack>
        </Box>

        {/* ── Net Payout Section ───────────────────────────────────────── */}
        <Stack
          spacing={'12px'}
          sx={{
            padding: '20px 24px',
            background: '#FAFBFC',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
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
            Net Payout — March 2026
          </Typography>

          <RowStack spacing={'16px'} alignItems={'baseline'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 800,
                fontSize: pxToRem(44),
                lineHeight: '1em',
                letterSpacing: '-0.028em',
                color: '#000000',
              }}
            >
              {data.netPayout}
            </Typography>

            <RowStack spacing={'8px'}>
              <Box
                sx={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  background: '#F0F4F8',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12),
                    color: '#6B7280',
                  }}
                >
                  Gross {data.grossAmount}
                </Typography>
              </Box>
              <Box
                sx={{
                  padding: '4px 12px',
                  borderRadius: '100px',
                  background: '#FFF1F2',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12),
                    color: '#EF4444',
                  }}
                >
                  Commission {data.commissionAmount}
                </Typography>
              </Box>
            </RowStack>
          </RowStack>
        </Stack>

        {/* ── Pending Section ──────────────────────────────────────────── */}
        <Box
          sx={{
            padding: '14px 24px',
            background: '#FFFBEB',
            borderBottom: '0.67px solid #FDE68A',
          }}
        >
          <RowStack justifyContent={'space-between'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(10),
                letterSpacing: '0.08em',
                color: '#D97706',
                textTransform: 'uppercase',
              }}
            >
              Pending
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 800,
                fontSize: pxToRem(20),
                color: '#D97706',
                lineHeight: '1em',
              }}
            >
              {data.pendingAmount}
            </Typography>
          </RowStack>
        </Box>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <Stack spacing={'20px'} sx={{ padding: '24px' }}>
          {/* 4 Stat Cards Row */}
          <RowStack spacing={'10px'}>
            {[
              {
                label: 'TRIPS',
                value: String(data.trips),
                color: '#111827',
              },
              {
                label: 'GROSS',
                value: data.grossAmount,
                color: '#111827',
              },
              {
                label: 'COMMISSION',
                value: data.commissionAmount,
                color: '#EF4444',
              },
              {
                label: 'NET PAYOUT',
                value: data.netPayout,
                color: '#059669',
              },
            ].map((stat) => (
              <Stack
                key={stat.label}
                sx={{
                  flex: 1,
                  background: '#F7F9FB',
                  borderRadius: '14px',
                  padding: '12px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(9),
                    letterSpacing: '0.08em',
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    mb: '6px',
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(16),
                    color: stat.color,
                    lineHeight: '1.2em',
                  }}
                >
                  {stat.value}
                </Typography>
              </Stack>
            ))}
          </RowStack>

          {/* Earnings Split Bar */}
          <Stack spacing={'10px'}>
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
              Earnings Split
            </Typography>

            <Box
              sx={{
                display: 'flex',
                height: 14,
                borderRadius: '100px',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${greenPercent}%`,
                  background: '#10B981',
                  transition: 'width 0.3s ease',
                }}
              />
              <Box
                sx={{
                  width: `${redPercent}%`,
                  background: '#EF4444',
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>

            <RowStack spacing={'20px'}>
              <RowStack spacing={'6px'}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10B981',
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11.5),
                    color: '#6B7280',
                  }}
                >
                  Net Earnings ({greenPercent}%)
                </Typography>
              </RowStack>
              <RowStack spacing={'6px'}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#EF4444',
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(11.5),
                    color: '#6B7280',
                  }}
                >
                  Commission ({redPercent}%)
                </Typography>
              </RowStack>
            </RowStack>
          </Stack>

          {/* Bottom 3 Info Cards */}
          <RowStack spacing={'10px'}>
            {[
              {
                label: 'SCHEDULE',
                value: data.schedule,
              },
              {
                label: 'PAYOUT METHOD',
                value: data.payoutMethod,
              },
              {
                label: 'BANK ACCOUNT',
                value: data.bankAccount,
              },
            ].map((info) => (
              <Stack
                key={info.label}
                sx={{
                  flex: 1,
                  background: '#F7F9FB',
                  borderRadius: '14px',
                  padding: '12px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(9),
                    letterSpacing: '0.08em',
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    mb: '6px',
                  }}
                >
                  {info.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 500,
                    fontSize: pxToRem(12.5),
                    color: '#374151',
                    lineHeight: '1.3em',
                  }}
                >
                  {info.value}
                </Typography>
              </Stack>
            ))}
          </RowStack>

          {/* Footer Buttons */}
          <RowStack spacing={'12px'} sx={{ pt: '4px' }}>
            <Box
              onClick={onClose}
              sx={{
                flex: variant === 'caregiver' ? 1 : 'auto',
                width: variant === 'driver' ? '100%' : 'auto',
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                cursor: 'pointer',
                '&:hover': { background: '#E5E7EB' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#374151',
                }}
              >
                Close
              </Typography>
            </Box>

            {variant === 'caregiver' && (
              <Box
                onClick={onPayNow}
                sx={{
                  flex: 1,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  background: '#2F6FED',
                  boxShadow: '0px 2px 8px 0px rgba(47, 111, 237, 0.25)',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#FFFFFF',
                  }}
                >
                  Pay Now · {data.pendingAmount}
                </Typography>
              </Box>
            )}
          </RowStack>
        </Stack>
      </Stack>
    </AppModal>
  );
};
