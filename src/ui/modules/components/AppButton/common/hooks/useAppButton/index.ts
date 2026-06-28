import { AppButtonProps } from '../../../index';
import { CircularProgressProps, useTheme } from '@mui/material';
import { useState } from 'react';

export const useAppButton = ({
  variant = 'contained',
  color = 'primary',
}: Pick<AppButtonProps, 'variant' | 'color'>) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const buttonTheme = theme.button as
    | Record<
        string,
        Record<
          string,
          {
            background: string;
            color: string;
            hoverBackground: string;
            hoverColor: string;
          }
        >
      >
    | undefined;

  const buttonVariant = variant as string;
  const buttonColor = color as string;
  const fallbackStyles = {
    background: 'transparent',
    color: theme.palette.primary.main,
    hoverBackground: 'transparent',
    hoverColor: theme.palette.primary.dark ?? theme.palette.primary.main,
  };

  const resolvedStyles =
    buttonTheme?.[buttonVariant]?.[buttonColor] ??
    buttonTheme?.contained?.primary ??
    fallbackStyles;

  const {
    background,
    color: themeColor,
    hoverBackground,
    hoverColor,
  } = resolvedStyles;

  const styles: AppButtonProps['sx'] = {
    background,
    color: themeColor,
    columnGap: '10px',

    '&:hover': {
      background: `${hoverBackground} !important`,
      color: hoverColor,
    },
    '&:disabled': {
      background,
      color: themeColor,
      opacity: 0.5,
    },
  };

  const loaderStyles: CircularProgressProps['sx'] = {
    color: themeColor,
    marginRight: '20px',
  };

  return {
    styles,
    loaderStyles,
    isHovered,
    setIsHovered,
  };
};
