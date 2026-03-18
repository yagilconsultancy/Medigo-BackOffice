import { Stack, Typography, LinearProgress } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

type HomeProgressBarProps = {
  label: string;
  value: number;
  color: string;
};

export const HomeProgressBar = ({
  label,
  value,
  color,
}: HomeProgressBarProps) => {
  return (
    <Stack spacing={'8px'}>
      <RowStack justifyContent="space-between" width="100%">
        <Typography
          sx={{
            fontSize: pxToRem(13),
            fontWeight: 500,
            fontFamily: (theme) => theme.typography.fontFamily,
            color: '#374151',
            lineHeight: '19.5px',
            fontStyle: 'medium',
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: pxToRem(13),
            fontWeight: 600,
            fontFamily: (theme) => theme.typography.fontFamily,
            color: color,
            lineHeight: '19.5px',
          }}
        >
          {value}%
        </Typography>
      </RowStack>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#F0F4F8',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: color,
          },
        }}
      />
    </Stack>
  );
};
