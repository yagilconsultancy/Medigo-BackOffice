import {
  GridLoadingOverlayVariant,
  GridOverlay,
  GridOverlayProps,
  gridRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { CircularProgress, LinearProgress, Theme } from '@mui/material';
import { CSSProperties, forwardRef, ReactElement } from 'react';

const LOADING_VARIANTS: Record<
  GridLoadingOverlayVariant,
  {
    component: () => ReactElement;
    style: CSSProperties;
  }
> = {
  'circular-progress': {
    component: () => <CircularProgress color="warning" />,
    style: {},
  },
  'linear-progress': {
    component: () => <LinearProgress color="warning" />,
    style: { display: 'block' },
  },
  skeleton: {
    component: () => <></>, // No support for skeleton loading right now
    style: {},
  },
};

export type DataGridLoaderProps = GridOverlayProps & {
  variant?: GridLoadingOverlayVariant;
  noRowsVariant?: GridLoadingOverlayVariant;
};

export const DataGridLoader = forwardRef<HTMLDivElement, DataGridLoaderProps>(
  (props, ref) => {
    const {
      variant = 'linear-progress',
      noRowsVariant = 'circular-progress',
      style,
      ...other
    } = props;

    const apiRef = useGridApiContext();
    const rowsCount = useGridSelector(apiRef, gridRowCountSelector);
    const activeVariant =
      LOADING_VARIANTS[rowsCount === 0 ? noRowsVariant : variant];
    const component = activeVariant.component();

    return (
      <GridOverlay
        style={{ ...activeVariant.style, ...style }}
        {...other}
        ref={ref}
      >
        {component}
      </GridOverlay>
    );
  }
);

DataGridLoader.displayName = 'DataGridLoader';
