'use client';

import {
  Box,
  Collapse,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { RowStack } from '../../../../RowStack';
import { useTextFieldStyles } from '../../../common';

export type AppTextFieldProps = TextFieldProps & {
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderBottomLeftRadius?: string;
  borderWidth?: string;
  padding?: object;
  fontSize?: object;
  marginTop?: object;
  errorMessage?: string;
};

export const AppTextField = (props: AppTextFieldProps) => {
  const {
    error,
    marginTop = {
      xs: '0',
    },
    errorMessage,
    ...rest
  } = props;
  const styles = useTextFieldStyles(props);

  return (
    <Box
      sx={{
        flexGrow: 1,
        marginTop,
      }}
    >
      <TextField
        hiddenLabel
        id="filled-hidden-label-normal"
        {...rest}
        sx={styles}
        error={error}
      />
      <Collapse in={error} orientation={'vertical'}>
        <RowStack
          sx={{
            width: '100%',
          }}
          justifyContent={'flex-start'}
        >
          <Typography
            variant={'body1'}
            sx={{
              color: (theme) => theme.color.error,
              fontSize: { xs: '.875rem', md: '.875rem' },
              fontWeight: 500,
            }}
          >
            {errorMessage}
          </Typography>
        </RowStack>
      </Collapse>
    </Box>
  );
};
