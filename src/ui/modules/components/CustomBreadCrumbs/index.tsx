import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Typography, useTheme } from '@mui/material';
import { pxToRem } from '../../../../common';
import { StyledLink } from '../StyledLink';

interface CustomBreadcrumbsProps {
  href: string;
  text: string;
  active?: boolean;
}

type BreadcrumbsProps = {
  breadcrumbsData: CustomBreadcrumbsProps[];
};

export function CustomBreadCrumbs({ breadcrumbsData }: BreadcrumbsProps) {
  const theme = useTheme();

  const breadcrumbs = breadcrumbsData.map((breadcrumb, index) => {
    const isLast = index === breadcrumbsData.length - 1;

    if (isLast) {
      return (
        <Typography
          key={index}
          sx={{
            color: theme.palette.primary.main,
            fontFamily: theme.typography.fontFamily,
            fontSize: pxToRem(13.5),
            fontWeight: 400,
            lineHeight: '20.25px',
            fontStyle: 'normal',
          }}
        >
          {breadcrumb.text}
        </Typography>
      );
    }

    return (
      <StyledLink
        key={index}
        href={breadcrumb.href}
        sx={{
          color: theme.palette.text.secondary,
          fontFamily: theme.typography.fontFamily,
          fontSize: pxToRem(13.5),
          fontWeight: 400,
          lineHeight: '20.25px',
          fontStyle: 'normal',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {breadcrumb.text}
      </StyledLink>
    );
  });

  return (
    <Breadcrumbs
      separator={<NavigateBeforeIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
}
