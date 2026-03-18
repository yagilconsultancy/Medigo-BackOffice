import { Box, IconButton, useTheme } from '@mui/material';
import { RowStack, StyledImage } from '../../../../../components';
import logo from '../../../../../../assets/icons/logo.svg';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';

export type HeaderProps = {
  isSidebarOpen: boolean;
  handleClick: () => void;
};

export const Header = ({ isSidebarOpen, handleClick }: HeaderProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        transition: 'all 1s',
        position: 'relative',
        zIndex: 9999,
      }}
    >
      <RowStack justifyContent={'space-between'}>
        <StyledImage
          src={logo}
          alt="mediride Logo"
          sx={{
            width: isSidebarOpen ? '108px' : '71px',
            height: isSidebarOpen ? 'auto' : '40px',
          }}
        />
        <IconButton
          sx={{
            width: '26px',
            height: '26px',
            background: theme.palette.background.default,
            borderRadius: '50%',
            border: `1.33px solid #E8ECF0`,
            position: !isSidebarOpen ? 'absolute' : 'none',
            right: !isSidebarOpen ? '-25px' : '0px',
            zIndex: 9999,
          }}
          onClick={handleClick}
        >
          {isSidebarOpen ? (
            <ChevronLeftOutlinedIcon />
          ) : (
            <ChevronRightOutlinedIcon />
          )}
        </IconButton>
      </RowStack>
    </Box>
  );
};
