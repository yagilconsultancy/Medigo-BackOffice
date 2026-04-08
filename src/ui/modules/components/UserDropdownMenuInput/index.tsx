import { Avatar, Box, Menu, MenuItem, Stack, Typography, Rating } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { pxToRem, useSearchDrivers, useSearchRiders } from "../../../../common";
import { AppSearchField } from "../TextField";
import { RowStack } from "../RowStack";
import { EmptyState } from "../../blocks";

export interface UserInputData {
  id: string;
  firstName: string;
  lastName: string;
  imageUri?: string;
  email?: string;
  role: "driver" | "rider";
  rating?: number;
}

export interface UserDropdownMenuInputProps {
  type: "rider" | "driver";
  handleUserSelected: (user: UserInputData) => void;
  selectedUserId?: string;
  selectedUserName?: string;
}

export const UserDropdownMenuInput = ({
  type,
  handleUserSelected,
  selectedUserId,
  selectedUserName,
}: UserDropdownMenuInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuButtonRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch drivers or riders based on type
  const { data: driversData, isLoading: isLoadingDrivers } = useSearchDrivers({
    search: debouncedSearch || undefined,
    limit: 10,
    page: 1,
  });

  const { data: ridersData, isLoading: isLoadingRiders } = useSearchRiders({
    search: debouncedSearch || undefined,
    limit: 10,
    page: 1,
  });

  // Transform API data to UserInputData format
  const userList = useMemo<UserInputData[]>(() => {
    if (type === "driver" && driversData?.success && driversData.data) {
      return driversData.data.drivers.map((driver) => ({
        id: driver.user_id,
        firstName: driver.first_name,
        lastName: driver.last_name,
        imageUri: driver.avatar_url || undefined,
        email: driver.email || undefined,
        role: "driver" as const,
        rating: driver.rating || 0,
      }));
    }

    if (type === "rider" && ridersData?.success && ridersData.data) {
      return ridersData.data.riders.map((rider) => ({
        id: rider.user_id,
        firstName: rider.first_name,
        lastName: rider.last_name,
        imageUri: rider.avatar_url || undefined,
        email: rider.email || undefined,
        role: "rider" as const,
        rating: undefined,
      }));
    }

    return [];
  }, [type, driversData, ridersData]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSearchQuery("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const onUserSelected = (user: UserInputData) => {
    setAnchorEl(null);
    setSearchQuery("");

    handleUserSelected(user);
  };

  const menuWidth = menuButtonRef.current?.offsetWidth || 0;

  const isLoading = type === "driver" ? isLoadingDrivers : isLoadingRiders;
  const userToRender = useMemo(() => userList, [userList]);

  return (
    <>
      <Box
        ref={menuButtonRef}
        onClick={handleMenuOpen}
        sx={{
          p: "10px 16px",
          borderRadius: "8px",
          border: "1px solid rgba(81, 93, 101, 0.20)",
          background: "#FFF",
          cursor: "pointer",
          "&:hover": {
            border: `1px solid rgba(81, 93, 101, 1)`,
            transition: ".3s ease",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: pxToRem(14),
            fontWeight: 400,
            opacity: selectedUserName ? "1" : "0.5",
            color: selectedUserName ? "#374151" : "inherit",
          }}
        >
          {selectedUserName || `Select a ${type}`}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              width: menuWidth,
              maxHeight: "500px",
              mt: "8px",
              borderRadius: "8px",
              boxShadow:
                "0 14px 22px -9px rgba(16, 25, 40, 0.14), 0 0 3px -1px rgba(16, 25, 40, 0.04)",
              "& .MuiList-root": {
                padding: "8px",
              },
            },
          },
        }}
      >
        <Box
          sx={{
            p: "8px 12px",
            position: "sticky",
            top: 0,
            background: "#FFF",
            zIndex: 1,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <AppSearchField
            variant={"filled"}
            placeholder={`Search ${type}`}
            onChange={handleSearchChange}
            onKeyDown={handleSearch}
            value={searchQuery}
            // autoFocus
            boxProps={{
              sx: {
                width: "100%",
              },
            }}
          />
        </Box>

        <Stack
          spacing={"16px"}
          sx={{
            maxHeight: "380px",
            p: "8px 12px",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#F4F4F4",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#CCC",
              borderRadius: "4px",
            },
          }}
        >
          {isLoading ? (
            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ height: "200px" }}
            >
              <Typography
                sx={{
                  fontSize: pxToRem(14),
                  fontWeight: 400,
                  color: "#6B7280",
                }}
              >
                Loading {type}s...
              </Typography>
            </Stack>
          ) : userToRender.length > 0 ? (
            userToRender.map((user) => (
              <MenuItem
                key={user.id}
                onClick={() => onUserSelected(user)}
                sx={{
                  p: "16px",
                  borderRadius: "8px",
                  background: "#FFF",
                  border: `1px solid rgba(81, 93, 101, 0.20)`,
                  boxShadow:
                    "0 14px 22px -9px rgba(16, 25, 40, 0.14), 0 0 3px -1px rgba(16, 25, 40, 0.04)",
                  cursor: "pointer",
                  "&:hover": {
                    border: `1px solid rgba(81, 93, 101, 1)`,
                    transition: ".3s ease",
                  },
                }}
              >
                <RowStack spacing={"12px"} sx={{ width: "100%" }}>
                  <Avatar
                    src={user.imageUri}
                    alt={user.firstName}
                    sx={{
                      width: 44,
                      height: 44,
                      backgroundColor: !user.imageUri ? "primary.main" : "transparent",
                      color: (theme) => theme.palette.text.primary,
                    }}
                  >
                    {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                  </Avatar>

                  <Stack spacing={"4px"} sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: pxToRem(14),
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {user.firstName} {user.lastName}
                    </Typography>

                    <RowStack spacing={"8px"}>
                      <Typography
                        sx={{
                          fontSize: pxToRem(12),
                          fontWeight: 400,
                          color: "#6B7280",
                          textTransform: "capitalize",
                        }}
                      >
                        {user.role}
                      </Typography>

                      {user.role === "driver" && user.rating !== undefined && (
                        <RowStack spacing={"4px"}>
                          <Typography
                            sx={{
                              fontSize: pxToRem(12),
                              fontWeight: 500,
                              color: "#374151",
                            }}
                          >
                            •
                          </Typography>
                          <Rating
                            value={user.rating}
                            readOnly
                            size="small"
                            precision={0.1}
                            sx={{
                              fontSize: pxToRem(14),
                              "& .MuiRating-iconFilled": {
                                color: "#FFC107",
                              },
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: pxToRem(12),
                              fontWeight: 500,
                              color: "#374151",
                            }}
                          >
                            {user.rating.toFixed(1)}
                          </Typography>
                        </RowStack>
                      )}
                    </RowStack>

                    {user.email && (
                      <Typography
                        sx={{
                          fontSize: pxToRem(12),
                          fontWeight: 400,
                          color: "#9CA3AF",
                        }}
                      >
                        {user.email}
                      </Typography>
                    )}
                  </Stack>
                </RowStack>
              </MenuItem>
            ))
          ) : (
            <EmptyState
              emptyState={
                <Typography
                  sx={{
                    fontSize: pxToRem(16),
                    fontWeight: 400,
                    textAlign: "center",
                  }}
                >
                  No {type}s found
                </Typography>
              }
            />
          )}
        </Stack>
      </Menu>
    </>
  );
};

// <Stack
//   justifyContent={"center"}
//   alignItems={"center"}
//   spacing={"8px"}
//   sx={{
//     height: "380px",
//   }}
// >
//   <Player
//     autoplay
//     loop
//     src="https://lottie.host/4b03149f-0a35-4d5e-bf54-0b906915ff84/tSLey7MBpp.json"
//     speed={1.5}
//     style={{
//       width: "200px",
//       height: "200px",
//     }}
//   />

//   <Typography
//     sx={{
//       fontSize: pxToRem(16),
//       fontWeight: 400,
//       textAlign: "center",
//     }}
//   >
//     There’s no {userType} here......Yet
//   </Typography>
// </Stack>