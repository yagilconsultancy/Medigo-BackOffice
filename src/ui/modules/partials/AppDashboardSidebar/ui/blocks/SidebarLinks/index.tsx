import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Divider,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
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
  moduleId?: string;
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

  // Find which accordion should be expanded based on current route
  const findActiveAccordion = (): string | false => {
    for (const section of sidebarList) {
      for (const item of section.items) {
        if (item.dropdown?.some((subItem) => pathname === subItem.link)) {
          return item.text;
        }
      }
    }
    return false;
  };

  const [expanded, setExpanded] = useState<string | false>(findActiveAccordion);

  // Auto-expand when route changes (e.g., direct navigation, browser back/forward)
  useEffect(() => {
    const activeAccordion = findActiveAccordion();
    if (activeAccordion) {
      setExpanded(activeAccordion);
    }
  }, [pathname]);

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ px: isSidebarOpen ? '12px' : '8px', py: '8px' }}>
      {sidebarList.map((section, index) => (
        <Box key={section.header}>
          {index > 0 && <Divider sx={{ my: '8px', borderColor: '#E8ECF0' }} />}

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

          {section.items.map((item) => {
            const isDropdownActive = item.dropdown?.some(
              (subItem) => pathname === subItem.link
            );
            return (
              <Box key={item.text}>
                {item.dropdown ? (
                  // Dropdown item
                  isSidebarOpen ? (
                    <Accordion
                      expanded={expanded === item.text}
                      onChange={handleAccordionChange(item.text)}
                      disableGutters
                      elevation={0}
                      sx={{
                        backgroundColor: 'transparent',
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <KeyboardArrowDownIcon
                            sx={{ fontSize: '18px', color: '#9CA3AF' }}
                          />
                        }
                        sx={{
                          minHeight: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          px: '12px',
                          mb: '4px',
                          transition: 'all 0.3s ease',
                          '& .MuiAccordionSummary-content': {
                            margin: 0,
                          },
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
                        <RowStack sx={{ flexGrow: 1, alignItems: 'center' }}>
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
                        </RowStack>
                      </AccordionSummary>

                      <AccordionDetails sx={{ padding: 0 }}>
                        <Box
                          sx={{
                            ml: '22px',
                            display: 'flex',
                            flexDirection: 'column',
                            py: '4px',
                            borderLeft: '2px solid #E8ECF0',
                          }}
                        >
                          {item.dropdown.map((subItem) => {
                            const isSubActive = pathname === subItem.link;
                            return (
                              <StyledLink
                                key={subItem.text}
                                href={subItem.link}
                              >
                                <RowStack
                                  sx={{
                                    borderLeft: `3px solid ${
                                      isSubActive
                                        ? theme.palette.primary.main
                                        : 'transparent'
                                    }`,
                                    borderRadius: '12px',
                                    py: '8px',
                                    pl: '12px',
                                    pr: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'all 0.6s ease',
                                    backgroundColor: isSubActive
                                      ? alpha(theme.palette.primary.main, 0.08)
                                      : 'transparent',
                                    '&:hover': {
                                      borderLeftColor:
                                        theme.palette.primary.main,
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
                      </AccordionDetails>
                    </Accordion>
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
                          borderLeft: isDropdownActive
                            ? `3px solid ${theme.palette.primary.main}`
                            : '3px solid transparent',
                          backgroundColor: isDropdownActive
                            ? alpha(theme.palette.primary.main, 0.08)
                            : 'transparent',
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
                            sx={{
                              width: '22px',
                              height: '22px',
                              filter: isDropdownActive
                                ? 'invert(36%) sepia(94%) saturate(1856%) hue-rotate(208deg) brightness(95%) contrast(92%)'
                                : 'none',
                              transition: 'filter 0.3s ease',
                            }}
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
            );
          })}
        </Box>
      ))}
    </Box>
  );
};
