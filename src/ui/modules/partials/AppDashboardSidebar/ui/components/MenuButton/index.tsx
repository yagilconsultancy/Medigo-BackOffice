import { Box, IconButton } from '@mui/material';

import sideMenuClosedIcon from '../../assets/icons/side-menu-closed.svg';
import sideMenuOpenedIcon from '../../assets/icons/side-menu-opened.svg';
import { StyledImage } from '../../../../../components';

export type MenuButtonProps = {
  onClick: () => void;
  isMenuOpen: boolean;
};

export const MenuButton = ({ onClick, isMenuOpen }: MenuButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      disableRipple
      className={isMenuOpen ? 'menu-open' : ''}
      sx={{
        padding: 0,
        // background: (theme) =>
        //   `${theme.dashboard.sidebar.background} !important`,
        // boxShadow: (theme) => theme.dashboard.sidebar.shadow,
        position: 'absolute',

        top: '20px',
        right: '-45px',
        width: '37px',
        height: '45px',

        borderRadius: '0',
        zIndex: (theme) => theme.zIndex.appBar + 1,
      }}
    >
      <Box
        sx={{
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '40px',
          '.menu-open &': {
            backgroundColor: (theme) => theme.palette.background.paper,
            boxShadow: (theme) => theme.shadows[1],
          },
        }}
      >
        <StyledImage
          src={isMenuOpen ? sideMenuOpenedIcon : sideMenuClosedIcon}
          alt={'Menu'}
        />
      </Box>
    </IconButton>
  );
};
