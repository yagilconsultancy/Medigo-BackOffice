import { Typography } from '@mui/material';
import { pxToRem } from '../../../../common';

type DashboardTitleProps = {
  title: string;
};

export function DashboardTitle({ title }: DashboardTitleProps) {
  return (
    <Typography
      sx={{
        fontWeight: 126,
        fontSize: pxToRem(20),
        lineHeight: '26px',
        color: (theme) => theme.color.black,
      }}
    >
      {title}
    </Typography>
  );
}
