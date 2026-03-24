'use client';

import {
  Box,
  LinearProgress,
  Stack,
  Typography,
  linearProgressClasses,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { DriverData } from '../../../index';

type DriverRankingsTableProps = {
  drivers: DriverData[];
  selectedDriverId: string;
  onSelectDriver: (id: string) => void;
};

export const DriverRankingsTable = ({
  drivers,
  selectedDriverId,
  onSelectDriver,
}: DriverRankingsTableProps) => {
  return (
    <Box
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Stack spacing={'4px'} sx={{ padding: '24px 24px 16px' }}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(18),
            color: '#111827',
          }}
        >
          Driver Rankings
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          Click a driver to view their detailed profile
        </Typography>
      </Stack>

      {/* Table Header */}
      <RowStack
        sx={{
          background: '#F7F9FB',
          padding: '10px 24px',
          borderBottom: '0.67px solid #F0F4F8',
        }}
      >
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12),
            color: '#6B7280',
            width: '60px',
          }}
        >
          #
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12),
            color: '#6B7280',
            flex: 1,
          }}
        >
          Driver
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12),
            color: '#6B7280',
            width: '80px',
          }}
        >
          Trips
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12),
            color: '#6B7280',
            width: '90px',
          }}
        >
          Rating
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12),
            color: '#6B7280',
            width: '160px',
          }}
        >
          Completion Rate
        </Typography>
      </RowStack>

      {/* Table Body */}
      <Stack>
        {drivers.map((driver, index) => {
          const isSelected = driver.id === selectedDriverId;
          const isLast = index === drivers.length - 1;
          return (
            <RowStack
              key={driver.id}
              onClick={() => onSelectDriver(driver.id)}
              sx={{
                padding: '12px 24px',
                cursor: 'pointer',
                background: isSelected ? '#EFF6FF' : 'transparent',
                borderLeft: isSelected
                  ? '2.67px solid #2F6FED'
                  : '2.67px solid transparent',
                borderBottom: isLast
                  ? 'none'
                  : isSelected
                    ? '0.67px solid #2F6FED'
                    : '0.67px solid #F0F4F8',
                transition: 'background 0.15s ease',
                '&:hover': {
                  background: isSelected ? '#EFF6FF' : '#F9FAFB',
                },
              }}
            >
              {/* Rank */}
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 700,
                  fontSize: pxToRem(13),
                  color: '#9CA3AF',
                  width: '60px',
                }}
              >
                #{index + 1}
              </Typography>

              {/* Driver */}
              <RowStack spacing={'10px'} sx={{ flex: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: driver.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(11),
                      color: '#FFFFFF',
                    }}
                  >
                    {driver.initials}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13.5),
                    color: '#111827',
                  }}
                >
                  {driver.name}
                </Typography>
              </RowStack>

              {/* Trips */}
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(13),
                  color: '#374151',
                  width: '80px',
                }}
              >
                {driver.trips}
              </Typography>

              {/* Rating */}
              <RowStack spacing={'4px'} sx={{ width: '90px' }}>
                <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(13),
                    color: '#374151',
                  }}
                >
                  {driver.rating}
                </Typography>
              </RowStack>

              {/* Completion Rate */}
              <RowStack spacing={'10px'} sx={{ width: '160px' }}>
                <LinearProgress
                  variant="determinate"
                  value={driver.completionRate}
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: '3px',
                    [`&.${linearProgressClasses.colorPrimary}`]: {
                      backgroundColor: '#E5E7EB',
                    },
                    [`& .${linearProgressClasses.bar}`]: {
                      borderRadius: '3px',
                      backgroundColor: '#2F6FED',
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(12.5),
                    color: '#374151',
                    minWidth: '32px',
                  }}
                >
                  {driver.completionRate}%
                </Typography>
              </RowStack>
            </RowStack>
          );
        })}
      </Stack>
    </Box>
  );
};
