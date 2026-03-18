import {
  GridLoadingOverlayVariant,
  GridOverlay,
  GridOverlayProps,
  gridRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { CircularProgress, LinearProgress } from "@mui/material";
import { CSSProperties, forwardRef, ReactElement } from "react";

const LOADING_VARIANTS: Record<
  GridLoadingOverlayVariant,
  {
    component: () => ReactElement;
    style: CSSProperties;
  }
> = {
  "circular-progress": {
    component: () => <CircularProgress color="primary" />,
    style: {},
  },
  "linear-progress": {
    component: () => <LinearProgress color="primary" />,
    style: { display: "block" },
  },
  skeleton: {
    component: () => <></>,
    style: {},
  },
};

export type DataGridLoaderProps = GridOverlayProps & {
  variant?: GridLoadingOverlayVariant;
  noRowsVariant?: GridLoadingOverlayVariant;
};

export const DataGridLoader = forwardRef<HTMLDivElement, DataGridLoaderProps>(
  function DataGridLoader(props, ref) {
    const {
      variant = "linear-progress",
      noRowsVariant = "circular-progress",
      style,
      ...other
    } = props;

    const apiRef = useGridApiContext();
    const rowsCount = useGridSelector(apiRef, gridRowCountSelector);
    const activeVariant =
      LOADING_VARIANTS[rowsCount === 0 ? noRowsVariant : variant];
    const Component = activeVariant.component;

    return (
      <GridOverlay style={{ ...activeVariant.style, ...style }} {...other} ref={ref}>
        <Component />
      </GridOverlay>
    );
  }
);

// **This is the key line** to satisfy `react/display-name`:
DataGridLoader.displayName = "DataGridLoader";
