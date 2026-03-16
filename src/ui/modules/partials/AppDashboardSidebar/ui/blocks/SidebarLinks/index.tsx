import {
  alpha,
  Box,
  Collapse,
  Divider,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { SidebarLink } from '../../components';
import { pxToRem } from '../../../../../../../common';
import { RowStack, StyledImage, StyledLink } from '../../../../../components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type SidebarItem = {
  text: string;
  link?: string;
  icon?: any;
  dropdown?: { text: string; link: string; icon?: any }[];
};

export type SidebarLinksProps = {
  sidebarList: {
    header: string;
    items: SidebarItem[];
  }[];
  isSidebarOpen: boolean;
};

export const SidebarLinks = ({
  isSidebarOpen,
  sidebarList,
}: SidebarLinksProps) => {
  const theme = useTheme();
  const pathname = usePathname();

  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleDropdown = (text: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [text]: !prev[text],
    }));
  };

  return (
    <Box sx={{ px: isSidebarOpen ? '12px' : '8px', py: '8px' }}>
      {sidebarList.map((section, index) => (
        <Box key={section.header}>
          {index > 0 && (
            <Divider sx={{ my: '8px', borderColor: '#E8ECF0' }} />
          )}

          {/* Section Header */}
          {isSidebarOpen && section.header && (
            <Typography
              sx={{
                color: '#9CA3AF',
                fontSize: pxToRem(11),
                fontWeight: 600,
                textTransform: 'uppercase',
                fontFamily: theme.typography.fontFamily,
                lineHeight: '16px',
                letterSpacing: '0.5px',
                mb: '8px',
                px: '12px',
                pt: '8px',
              }}
            >
              {section.header}
            </Typography>
          )}

          {section.items.map((item) => (
            <Box key={item.text}>
              {item.dropdown ? (
                // Dropdown item
                isSidebarOpen ? (
                  <>
                    <RowStack
                      onClick={() => toggleDropdown(item.text)}
                      sx={{
                        cursor: 'pointer',
                        height: '44px',
                        borderRadius: '12px',
                        px: '12px',
                        mb: '4px',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                          '& .dropdown-text': {
                            color: 'primary.main',
                          },
                          '& .dropdown-icon': {
                            filter:
                              'invert(36%) sepia(94%) saturate(1856%) hue-rotate(208deg) brightness(95%) contrast(92%)',
                          },
                        },
                      }}
                    >
                      {item.icon && (
                        <StyledImage
                          className="dropdown-icon"
                          src={item.icon}
                          alt={item.text}
                          sx={{
                            width: '20px',
                            height: '20px',
                            flexShrink: 0,
                            transition: 'filter 0.3s ease',
                          }}
                        />
                      )}
                      <Typography
                        className="dropdown-text"
                        noWrap
                        sx={{
                          flexGrow: 1,
                          fontWeight: 400,
                          fontSize: pxToRem(14),
                          fontFamily: theme.typography.fontFamily,
                          lineHeight: pxToRem(21),
                          ml: '12px',
                          color: '#344054',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {item.text}
                      </Typography>
                      <Box
                        sx={{
                          color: '#9CA3AF',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'transform 0.3s ease',
                          transform: openDropdowns[item.text]
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)',
                        }}
                      >
                        <KeyboardArrowDownIcon sx={{ fontSize: '18px' }} />
                      </Box>
                    </RowStack>

                    {/* Dropdown Items */}
                    <Collapse in={openDropdowns[item.text]}>
                      <Box
                        sx={{
                          ml: '32px',
                          display: 'flex',
                          flexDirection: 'column',
                          py: '4px',
                        }}
                      >
                        {item.dropdown.map((subItem) => {
                          const isSubActive = pathname === subItem.link;
                          return (
                            <StyledLink key={subItem.text} href={subItem.link}>
                              <RowStack
                                sx={{
                                  borderLeft: `3px solid ${
                                    isSubActive
                                      ? theme.palette.primary.main
                                      : 'transparent'
                                  }`,
                                  borderRadius: '0 8px 8px 0',
                                  py: '8px',
                                  pl: '12px',
                                  pr: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  transition: 'all 0.3s ease',
                                  backgroundColor: isSubActive
                                    ? alpha(theme.palette.primary.main, 0.08)
                                    : 'transparent',
                                  '&:hover': {
                                    borderLeftColor: theme.palette.primary.main,
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.05
                                    ),
                                    '& .sub-item-text': {
                                      color: 'primary.main',
                                    },
                                    '& .sub-item-chevron': {
                                      opacity: 1,
                                    },
                                  },
                                }}
                              >
                                <Typography
                                  className="sub-item-text"
                                  noWrap
                                  sx={{
                                    flexGrow: 1,
                                    fontWeight: isSubActive ? 500 : 400,
                                    fontSize: pxToRem(14),
                                    fontFamily: theme.typography.fontFamily,
                                    lineHeight: pxToRem(21),
                                    color: isSubActive
                                      ? 'primary.main'
                                      : '#344054',
                                    transition: 'color 0.3s ease',
                                  }}
                                >
                                  {subItem.text}
                                </Typography>
                                <ChevronRightIcon
                                  className="sub-item-chevron"
                                  sx={{
                                    fontSize: '16px',
                                    color: 'primary.main',
                                    opacity: isSubActive ? 1 : 0,
                                    transition: 'opacity 0.3s ease',
                                  }}
                                />
                              </RowStack>
                            </StyledLink>
                          );
                        })}
                      </Box>
                    </Collapse>
                  </>
                ) : (
                  // Collapsed dropdown item - icon only with tooltip
                  <Tooltip
                    title={item.text}
                    placement="right"
                    arrow
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: '#000A24',
                          fontWeight: 400,
                          fontSize: pxToRem(14),
                          fontFamily: theme.typography.fontFamily,
                          color: '#FFF',
                          borderRadius: '10px',
                          ml: '12px',
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        mx: 'auto',
                        mb: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.08
                          ),
                        },
                      }}
                    >
                      {item.icon && (
                        <StyledImage
                          src={item.icon}
                          alt={item.text}
                          sx={{ width: '22px', height: '22px' }}
                        />
                      )}
                    </Box>
                  </Tooltip>
                )
              ) : (
                // Regular link item
                <SidebarLink
                  icon={item.icon}
                  text={item.text}
                  link={item.link || '#'}
                  isSidebarOpen={isSidebarOpen}
                />
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};
