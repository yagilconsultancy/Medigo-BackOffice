import { IconButton } from '@mui/material';
import { ReactNode } from 'react';

type IconComponent = {
  icon: ReactNode;
  handleClick: () => void;
};

export const IconComponent = ({ icon, handleClick }) => {
  return (
    <IconButton
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F7F9FB',
        border: '0.67px solid #E8ECF0',
        borderRadius: '14px',
        width: '40px',
        height: '40px',
      }}
      onClick={handleClick}
    >
      {icon}
    </IconButton>
  );
};
