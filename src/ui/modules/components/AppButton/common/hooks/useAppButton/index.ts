import { AppButtonProps } from '../../../index';
import { CircularProgressProps, useTheme } from '@mui/material';
import { useState } from 'react';

export const useAppButton = ({
  variant = 'contained',
  color = 'primary',
}: Pick<AppButtonProps, 'variant' | 'color'>) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const buttonVariant = variant as keyof typeof theme.button;
  const buttonColor =
    color as keyof (typeof theme.button)[typeof buttonVariant];
  const {
    background,
    color: themeColor,
    hoverBackground,
    hoverColor,
  } = theme.button[buttonVariant][buttonColor];

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
