import { Box, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { ReactNode } from 'react';

type StatChipProps = {
  icon: ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  pulse?: boolean;
};

export const StatChip = ({
  icon,
  label,
  value,
  valueColor,
  pulse,
}: StatChipProps) => {
  return (
    <Stack
      spacing={'4px'}
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #EAECF0',
        borderRadius: '16px',
        padding: '16px',
        flex: 1,
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      <RowStack spacing={'6px'}>
        {icon}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(10.5),
            lineHeight: '15.75px',
            color: (theme) => theme.color.lightGrey,
          }}
        >
          {label}
        </Typography>
      </RowStack>
      <RowStack spacing={'6px'}>
        {pulse && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ED8A2F',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'rgba(237, 138, 47, 0.2)',
                animation: 'pulse 2s ease-in-out infinite',
              },
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.5, transform: 'scale(1.3)' },
              },
            }}
          />
        )}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            lineHeight: '21px',
            color: valueColor || ((theme) => theme.color.deepBlue),
          }}
        >
          {value}
        </Typography>
      </RowStack>
    </Stack>
  );
};
