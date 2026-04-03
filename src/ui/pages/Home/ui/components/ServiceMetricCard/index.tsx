import { Box, Stack, Typography } from '@mui/material';
import { pxToRem } from '../../../../../../common';

type ServiceMetricCardProps = {
  icon: React.ReactNode;
  iconBg?: string;
  value: string;
  label: string;
  sublabel: string;
};

export const ServiceMetricCard = ({
  icon,
  iconBg,
  value,
  label,
  sublabel,
}: ServiceMetricCardProps) => {
  return (
    <Stack spacing={'8px'}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          backgroundColor: iconBg || '#F7F9FB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Stack spacing={'2px'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(22),
            color: '#101828',
            lineHeight: '1.2em',
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12),
            color: '#364153',
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11),
            color: '#6A7282',
          }}
        >
          {sublabel}
        </Typography>
      </Stack>
    </Stack>
  );
};
