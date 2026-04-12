'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { Box, Grid, Stack, Typography, CircularProgress } from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { Formik, Form, useFormikContext } from 'formik';
import {
  AppButton,
  DashboardTitleAndDesc,
  RowStack,
} from '../../../../../modules/components';
import {
  pxToRem,
  useGetPermissionMatrix,
  useResolvedApiQuery,
} from '../../../../../../common';
import type { PermissionMatrixResponse } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type ModulePermission = {
  key: string;
  label: string;
};

type PermissionGroup = {
  name: string;
  modules: ModulePermission[];
};

type PermissionRoleConfig = {
  id: string;
  roleName: string;
  description: string;
  icon: React.ReactElement;
  activeColor: string;
  iconBg: string;
  headerBg: string;
  isLocked?: boolean;
  enabledModules: string[];
};

type PermissionFormValues = Record<string, boolean>;




// ─── Context ────────────────────────────────────────────────────────────────

type PermissionsContextType = {
  selectedRole: PermissionRoleConfig;
  setSelectedRoleId: (id: string) => void;
};

const PermissionsContext = createContext<PermissionsContextType | null>(null);

const usePermissions = () => {
  const ctx = useContext(PermissionsContext);
  if (!ctx)
    throw new Error('usePermissions must be used within PermissionsProvider');
  return ctx;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const buildInitialValues = (
  role: PermissionRoleConfig,
  allModuleKeys: string[]
): PermissionFormValues => {
  const values: PermissionFormValues = {};
  allModuleKeys.forEach((key) => {
    values[key] = role.enabledModules.includes(key);
  });
  return values;
};

// ─── Module Row ─────────────────────────────────────────────────────────────

const ModuleRow = ({
  moduleKey,
  label,
}: {
  moduleKey: string;
  label: string;
}) => {
  const { values, setFieldValue } = useFormikContext<PermissionFormValues>();
  const { selectedRole } = usePermissions();
  const isEnabled = values[moduleKey];
  const isLocked = selectedRole.isLocked;

  return (
    <RowStack
      onClick={() => {
        if (!isLocked) {
          setFieldValue(moduleKey, !isEnabled);
        }
      }}
      justifyContent="space-between"
      sx={{
        padding: '0px 16px',
        height: 47.33,
        borderRadius: '14px',
        cursor: isLocked ? 'default' : 'pointer',
        background: isEnabled ? '#F7FBFF' : '#FAFBFC',
        border: isEnabled ? '0.67px solid #DDEEFF' : '0.67px solid #F0F4F8',
        transition: 'all 0.15s ease',
        ...(!isLocked && {
          '&:hover': {
            borderColor: isEnabled ? '#BDD7FF' : '#E0E4EA',
          },
        }),
      }}
    >
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: isEnabled ? 500 : 400,
          fontSize: pxToRem(13),
          color: isEnabled ? '#111827' : '#9CA3AF',
          lineHeight: '1.5em',
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: isEnabled ? '#EBF2FF' : '#F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CheckOutlinedIcon
          sx={{
            fontSize: 12,
            color: isEnabled ? '#2F6FED' : '#D1D5DB',
          }}
        />
      </Box>
    </RowStack>
  );
};

// ─── Permission Group Section ───────────────────────────────────────────────

const PermissionGroupSection = ({ group }: { group: PermissionGroup }) => {
  return (
    <Stack spacing={'10px'}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 700,
          fontSize: pxToRem(11),
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#9CA3AF',
          lineHeight: '1.5em',
        }}
      >
        {group.name}
      </Typography>
      <Grid container spacing={'12px'}>
        {group.modules.map((mod) => (
          <Grid key={mod.key} size={{ xs: 6 }}>
            <ModuleRow moduleKey={mod.key} label={mod.label} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

// ─── Permission Content Panel ───────────────────────────────────────────────

const PermissionContentPanel = ({
  permissionGroups,
}: {
  permissionGroups: PermissionGroup[];
}) => {
  const { selectedRole } = usePermissions();

  return (
    <Stack
      sx={{
        flex: 1,
        background: '#FFFFFF',
        border: '0.67px solid #F0F4F8',
        borderRadius: '16px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Colored Header */}
      <RowStack
        justifyContent="space-between"
        alignItems="center"
        sx={{
          padding: '0px 24px',
          minHeight: 75,
          background: selectedRole.headerBg,
          borderBottom: '0.67px solid #F0F4F8',
        }}
      >
        <RowStack spacing={'12px'}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '14px',
              background: selectedRole.activeColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {React.cloneElement(selectedRole.icon, {
              sx: { fontSize: 18, color: '#FFFFFF' },
            })}
          </Box>
          <Stack>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: '#111827',
                lineHeight: '1.5em',
              }}
            >
              {selectedRole.roleName}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#6B7280',
                lineHeight: '1.5em',
              }}
            >
              {selectedRole.description}
            </Typography>
          </Stack>
        </RowStack>

        {selectedRole.isLocked && (
          <Box
            sx={{
              padding: '5px 12px',
              borderRadius: '9999px',
              background: selectedRole.activeColor,
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(12),
                color: '#FFFFFF',
                lineHeight: '1.5em',
                whiteSpace: 'nowrap',
              }}
            >
              Full Access — Locked
            </Typography>
          </Box>
        )}
      </RowStack>

      {/* Permission Groups */}
      <Stack spacing={'20px'} sx={{ padding: '24px 24px 0px 24px' }}>
        {permissionGroups.map((group) => (
          <PermissionGroupSection key={group.name} group={group} />
        ))}
      </Stack>
    </Stack>
  );
};

// ─── Role Card for Permissions ──────────────────────────────────────────────

const PermissionRoleCard = ({
  role,
  isActive,
  onClick,
  totalModules,
}: {
  role: PermissionRoleConfig;
  isActive: boolean;
  onClick: () => void;
  totalModules: number;
}) => {
  const moduleCount = role.enabledModules.length;

  return (
    <Stack
      onClick={onClick}
      sx={{
        padding: '16.67px',
        borderRadius: '16px',
        cursor: 'pointer',
        background: isActive ? role.activeColor : '#FFFFFF',
        border: isActive
          ? `0.67px solid ${role.activeColor}`
          : '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <RowStack spacing={'8px'}>
        {isActive
          ? React.cloneElement(role.icon, {
              sx: { fontSize: 14, color: '#FFFFFF' },
            })
          : role.icon}
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(13),
            color: isActive ? '#FFFFFF' : '#111827',
            lineHeight: '1.5em',
          }}
        >
          {role.roleName}
        </Typography>
      </RowStack>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(11.5),
          color: isActive ? 'rgba(255, 255, 255, 0.65)' : '#9CA3AF',
          lineHeight: '1.5em',
          mt: '8px',
        }}
      >
        {isActive
          ? `${moduleCount}/${totalModules} modules`
          : `${moduleCount} modules`}
      </Typography>
    </Stack>
  );
};

// ─── Save Button ────────────────────────────────────────────────────────────

const SaveButton = () => {
  const { isSubmitting, dirty } = useFormikContext<PermissionFormValues>();
  const { selectedRole } = usePermissions();
  const isDisabled = !dirty || selectedRole.isLocked;

  return (
    <AppButton
      type="submit"
      variant="contained"
      isLoading={isSubmitting}
      disabled={isDisabled}
      sx={{
        borderRadius: '14px',
        padding: '10px 20px',
        height: 39.5,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: pxToRem(13),
        fontFamily: (theme) => theme.typography.fontFamily,
        boxShadow: 'none',
        background: isDisabled ? '#E5E7EB' : '#2F6FED',
        color: isDisabled ? '#9CA3AF' : '#FFFFFF',
        whiteSpace: 'nowrap',
        '&:hover': {
          background: isDisabled ? '#E5E7EB' : '#2558C9',
          boxShadow: 'none',
        },
        '&.Mui-disabled': {
          background: '#E5E7EB',
          color: '#9CA3AF',
        },
      }}
    >
      Save Permissions
    </AppButton>
  );
};

// ─── Helper: Map Role Icons ─────────────────────────────────────────────────

const getRoleIcon = (roleName: string) => {
  const lowerName = roleName.toLowerCase();
  if (lowerName.includes('super')) {
    return <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 14 }} />;
  } else if (lowerName.includes('operation')) {
    return <ManageAccountsOutlinedIcon sx={{ fontSize: 14 }} />;
  } else if (lowerName.includes('finance')) {
    return <AccountBalanceOutlinedIcon sx={{ fontSize: 14 }} />;
  } else if (lowerName.includes('support')) {
    return <SupportAgentOutlinedIcon sx={{ fontSize: 14 }} />;
  }
  return <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 14 }} />;
};

const getLightBg = (color: string): string => {
  const colorMap: Record<string, string> = {
    '#2F6FED': '#EBF2FF',
    '#10B981': '#ECFDF5',
    '#6366F1': '#EEF2FF',
    '#F59E0B': '#FFFBEB',
  };
  return colorMap[color.toUpperCase()] || '#F3F4F6';
};

// ─── Main Component ─────────────────────────────────────────────────────────

export const PermissionControls = () => {
  const { data: matrixData, isFetching } = useResolvedApiQuery<PermissionMatrixResponse>(
    useGetPermissionMatrix,
    { roles: [], modules: [], permissions: {} }
  );

  // Map API data to UI structure
  const permissionRolesFromApi: PermissionRoleConfig[] = useMemo(() => {
    return matrixData.roles.map((role) => {
      const color = role.color || '#2F6FED';
      const enabledModules = Object.keys(matrixData.permissions[role.id] || {}).filter(
        (moduleKey) => matrixData.permissions[role.id][moduleKey]
      );

      return {
        id: role.id,
        roleName: role.display_name,
        description: role.description || '',
        icon: getRoleIcon(role.display_name),
        activeColor: color,
        iconBg: getLightBg(color),
        headerBg: getLightBg(color),
        isLocked: role.is_system,
        enabledModules,
      };
    });
  }, [matrixData]);

  // Map modules to permission groups by category
  const permissionGroupsFromApi: PermissionGroup[] = useMemo(() => {
    const groupedByCategory: Record<string, ModulePermission[]> = {};

    matrixData.modules.forEach((mod) => {
      const category = mod.category || 'Other';
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = [];
      }
      groupedByCategory[category].push({
        key: mod.module_name,
        label: mod.module_display_name,
      });
    });

    return Object.entries(groupedByCategory).map(([category, modules]) => ({
      name: category,
      modules,
    }));
  }, [matrixData]);

  const [selectedRoleId, setSelectedRoleId] = useState('');

  // Set initial role when data loads
  useEffect(() => {
    if (permissionRolesFromApi.length > 0 && !selectedRoleId) {
      setSelectedRoleId(permissionRolesFromApi[0].id);
    }
  }, [permissionRolesFromApi, selectedRoleId]);

  const selectedRole =
    permissionRolesFromApi.find((r) => r.id === selectedRoleId) ??
    permissionRolesFromApi[0];

  const totalModules = useMemo(() => {
    return permissionGroupsFromApi.reduce(
      (sum, group) => sum + group.modules.length,
      0
    );
  }, [permissionGroupsFromApi]);

  const allModuleKeys = useMemo(() => {
    return permissionGroupsFromApi.flatMap((g) => g.modules.map((m) => m.key));
  }, [permissionGroupsFromApi]);

  // Loading state
  if (isFetching || !selectedRole) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress size={40} sx={{ color: '#2F6FED' }} />
      </Stack>
    );
  }

  return (
    <PermissionsContext.Provider value={{ selectedRole, setSelectedRoleId }}>
      <Formik
        key={selectedRoleId}
        initialValues={buildInitialValues(selectedRole, allModuleKeys)}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            console.log('Save permissions:', selectedRole.roleName, values);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <Form>
          <Stack spacing={'24px'}>
            {/* Header */}
            <RowStack justifyContent="space-between">
              <DashboardTitleAndDesc
                title="Module Permissions"
                desc="Control which platform modules each admin role can access"
              />
              <SaveButton />
            </RowStack>

            {/* Content */}
            <RowStack spacing={'20px'} alignItems="flex-start">
              {/* Left: Role Cards */}
              <Stack spacing={'12px'} sx={{ width: 206, flexShrink: 0 }}>
                {permissionRolesFromApi.map((role) => (
                  <PermissionRoleCard
                    key={role.id}
                    role={role}
                    isActive={role.id === selectedRoleId}
                    onClick={() => setSelectedRoleId(role.id)}
                    totalModules={totalModules}
                  />
                ))}
              </Stack>

              {/* Right: Permission Panel */}
              <PermissionContentPanel permissionGroups={permissionGroupsFromApi} />
            </RowStack>
          </Stack>
        </Form>
      </Formik>
    </PermissionsContext.Provider>
  );
};
