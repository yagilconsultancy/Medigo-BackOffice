'use client';

import { Box, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

export type LogEntry = {
  id: string;
  action: string;
  category: string;
  categoryBg: string;
  categoryColor: string;
  description: string;
  date: string;
  icon: React.ReactNode;
  iconBg: string;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const LogEntryRow = ({
  id,
  action,
  category,
  categoryBg,
  categoryColor,
  description,
  date,
  icon,
  iconBg,
}: LogEntry) => {
  return (
    <RowStack
      sx={{
        padding: '16px 24px',
        gap: '16px',
        borderBottom: '1px solid #F7F9FB',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '14px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      {/* Content */}
      <Stack spacing={'4px'} sx={{ flex: 1, minWidth: 0 }}>
        <RowStack spacing={'8px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(13),
              color: '#111827',
            }}
          >
            {action}
          </Typography>
          <Box
            sx={{
              padding: '2px 10px',
              borderRadius: '100px',
              background: categoryBg,
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11),
                color: categoryColor,
                whiteSpace: 'nowrap',
              }}
            >
              {category}
            </Typography>
          </Box>
        </RowStack>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(12.5),
            color: '#374151',
          }}
        >
          {description}
        </Typography>
      </Stack>

      {/* Right — Date + Log ID */}
      <Stack spacing={'2px'} sx={{ flexShrink: 0, alignItems: 'flex-end' }}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11.5),
            color: '#9CA3AF',
            whiteSpace: 'nowrap',
          }}
        >
          {date}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: '#D1D5DB',
            whiteSpace: 'nowrap',
          }}
        >
          {id}
        </Typography>
      </Stack>
    </RowStack>
  );
};
