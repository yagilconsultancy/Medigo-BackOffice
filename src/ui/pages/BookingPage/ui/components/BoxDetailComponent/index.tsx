import { Stack, Typography } from '@mui/material';
import { RowStack, StyledImage } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { StaticImageData } from 'next/image';

type BoxDetailComponentProps = {
  icon: StaticImageData;
  iconTag: string;
  patientName: string;
  phoneNum?: string;
};

export const BoxDetailComponent = ({
  icon,
  iconTag,
  patientName,
  phoneNum,
}: BoxDetailComponentProps) => {
  return (
    <Stack
      sx={{
        background: '#F7F9FB',
        padding: '16px',
        borderRadius: '14px',
        width: '100%',
        height: 'auto',
      }}
      alignItems="stretch"
      spacing={0.5}
    >
      <RowStack spacing={1}>
        <StyledImage
          src={icon}
          alt="icon"
          sx={{
            width: '14px',
            height: '14px',
          }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: pxToRem(12),
            lineHeight: '18px',
            color: '#6B7280',
          }}
        >
          {iconTag}
        </Typography>
      </RowStack>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(12),
          lineHeight: '18px',
          color: (theme) => theme.color.deepBlue,
        }}
      >
        {patientName}
      </Typography>
      {phoneNum && (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12),
            lineHeight: '18px',
            color: 'text.secondary',
          }}
        >
          {phoneNum}
        </Typography>
      )}
    </Stack>
  );
};
