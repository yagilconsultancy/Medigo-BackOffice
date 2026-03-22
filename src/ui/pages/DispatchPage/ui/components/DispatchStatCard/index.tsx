import { Box, Stack, Typography } from '@mui/material';
import { RowStack, StyledImage } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { ReactNode } from 'react';
import { StaticImageData } from 'next/image';

type DispatchStatCardProps = {
  icon: StaticImageData;
  value: string;
  label: string;
  subtitle: string;
  badge?: {
    text: string;
    color: string;
    bg: string;
  };
  link?: {
    text: string;
    color: string;
  };
  progress?: string;
};

export const DispatchStatCard = ({
  icon,
  value,
  label,
  subtitle,
  badge,
  link,
  progress,
}: DispatchStatCardProps) => {
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
            background: '#F7F9FB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <StyledImage
            src={icon}
            alt="icon"
            sx={{
              width: '17px',
              height: '17px',
            }}
          />
        </Box>
        {badge && (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(10.5),
              color: badge.color,
              background: badge.bg,
              borderRadius: '8px',
              padding: '3px 8px',
            }}
          >
            {badge.text}
          </Typography>
        )}
        {link && (
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(11),
              color: link.color,
              cursor: 'pointer',
            }}
          >
            {link.text}
          </Typography>
        )}
      </RowStack>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 800,
          fontSize: pxToRem(28),
          lineHeight: '36px',
          color: (theme) => theme.color.deepBlue,
        }}
      >
        {value}
      </Typography>
      <Stack spacing={'2px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: (theme) => theme.color.deepBlue,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11.5),
            color: (theme) => theme.color.lightGrey,
          }}
        >
          {subtitle}
        </Typography>
      </Stack>
      {progress && (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: (theme) => theme.color.lightGrey,
          }}
        >
          {progress}
        </Typography>
      )}
    </Stack>
  );
};
