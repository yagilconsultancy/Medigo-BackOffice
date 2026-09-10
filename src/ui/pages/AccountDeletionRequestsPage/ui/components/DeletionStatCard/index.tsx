import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

/**
 * Same shape as DispatchStatCard, but takes a rendered icon node instead of a
 * StaticImageData, so this page needs no SVG assets of its own.
 */
type DeletionStatCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
  subtitle: string;
  iconBg?: string;
};

export const DeletionStatCard = ({
  icon,
  value,
  label,
  subtitle,
  iconBg,
}: DeletionStatCardProps) => {
  return (
    <Stack
      spacing={'8px'}
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px',
        flex: 1,
        border: '0.67px solid #EAECF0',
        height: '100%',
      }}
    >
      <RowStack justifyContent="space-between">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: iconBg || '#F7F9FB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </RowStack>

      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(22),
          lineHeight: '1.3em',
          color: '#111827',
        }}
      >
        {value}
      </Typography>

      <Stack spacing={'2px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12.5),
            color: '#374151',
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11.5),
            color: '#9CA3AF',
          }}
        >
          {subtitle}
        </Typography>
      </Stack>
    </Stack>
  );
};
