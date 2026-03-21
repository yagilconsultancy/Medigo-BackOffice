import { Box, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { ReactNode } from 'react';

type InfoCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export const InfoCard = ({ icon, title, children }: InfoCardProps) => {
  return (
    <Stack
      spacing={'16px'}
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #EAECF0',
        borderRadius: '14px',
        padding: '20px',
      }}
    >
      <RowStack spacing={'8px'}>
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(10),
            lineHeight: '15px',
            color: (theme) => theme.color.lightGrey,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Typography>
      </RowStack>
      {children}
    </Stack>
  );
};
