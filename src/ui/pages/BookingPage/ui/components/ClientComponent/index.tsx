import { Typography } from '@mui/material';
import { pxToRem } from '../../../../../../common';

type ClientComponentProps = {
  text: string;
};

export const ClientComponent = ({ text }: ClientComponentProps) => {
  return (
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        color: (theme) => theme.color.deepBlue,
        fontWeight: 600,
        fontSize: pxToRem(13),
        lineHeight: '19.5px',
      }}
    >
      {text}
    </Typography>
  );
};
