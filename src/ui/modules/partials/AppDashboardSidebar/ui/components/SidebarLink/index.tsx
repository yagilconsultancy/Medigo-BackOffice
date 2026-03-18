'use client';
import { usePathname } from 'next/navigation';
import {
  alpha,
  Box,
  Collapse,
  ListItem,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { StaticImageData } from 'next/image';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { RowStack, StyledImage, StyledLink } from '../../../../../components';
import { pxToRem } from '../../../../../../../common';

export type SidebarLinkProps = {
  icon?: StaticImageData;
  text: string;
  link: string;
  isSidebarOpen: boolean;
};

export const SidebarLink = ({
  icon,
  text,
  link,
  isSidebarOpen,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isActive = pathname === link;

  return (
    <ListItem
      disablePadding
      sx={{
        width: '100%',
      }}
    >
      {!isSidebarOpen ? (
        <Tooltip
          title={text}
          placement="right"
          arrow
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: '#000A24',
                fontWeight: 400,
                fontSize: pxToRem(14),
                fontFamily: (theme) => theme.typography.fontFamily,
                color: '#FFF',
                borderRadius: '10px',
                ml: '12px',
              },
            },
          }}
        >
          <StyledLink href={link}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: isActive ? 'primary.main' : 'transparent',
                mx: 'auto',
                mb: '4px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: isActive
                    ? 'primary.main'
                    : alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {icon && (
                <StyledImage
                  src={icon}
                  alt={text}
                  sx={{
                    width: '22px',
                    height: '22px',
                    filter: isActive
                      ? 'invert(36%) sepia(94%) saturate(1856%) hue-rotate(208deg) brightness(95%) contrast(92%'
                      : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                />
              )}
            </Box>
          </StyledLink>
        </Tooltip>
      ) : (
        <StyledLink href={link} style={{ width: '100%' }}>
          <RowStack
            spacing={'12px'}
            sx={{
              transition: 'all 0.3s ease',
              backgroundColor: isActive ? 'primary.main' : 'transparent',
              height: '44px',
              width: '100%',
              borderRadius: '12px',
              px: '12px',
              mb: '4px',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'primary.main',
                '& .sidebar-link-text': {
                  color: '#FFF',
                },
                '& .sidebar-link-icon': {
                  filter: 'brightness(0) invert(1)',
                },
                '& .sidebar-link-chevron': {
                  opacity: 1,
                },
              },
            }}
          >
            {icon && (
              <StyledImage
                className="sidebar-link-icon"
                src={icon}
                alt={text}
                sx={{
                  width: '20px',
                  height: '20px',
                  flexShrink: 0,
                  filter: isActive ? 'brightness(0) invert(1)' : 'none',
                  transition: 'filter 0.3s ease',
                }}
              />
            )}

            <Collapse in={isSidebarOpen} orientation={'horizontal'}>
              <Typography
                className="sidebar-link-text"
                noWrap
                sx={{
                  flexGrow: 1,
                  fontWeight: isActive ? 500 : 400,
                  fontSize: pxToRem(14),
                  fontFamily: (theme) => theme.typography.fontFamily,
                  lineHeight: pxToRem(21),
                  color: isActive ? '#FFF' : '#344054',
                  transition: 'color 0.3s ease',
                }}
              >
                {text}
              </Typography>
            </Collapse>

            <ChevronRightIcon
              className="sidebar-link-chevron"
              sx={{
                fontSize: '18px',
                color: '#FFF',
                ml: 'auto',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </RowStack>
        </StyledLink>
      )}
    </ListItem>
  );
};
