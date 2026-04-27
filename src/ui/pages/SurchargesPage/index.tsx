'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Grid, Stack, Switch, Typography, styled } from '@mui/material';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import WbTwilightOutlinedIcon from '@mui/icons-material/WbTwilightOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import AddIcon from '@mui/icons-material/Add';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Formik, Form, FormikHelpers } from 'formik';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppModal,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  pxToRem,
  useGetSurchargeKpis,
  useListSurchargeRules,
  useResolvedApiQuery,
  useSurchargeApi,
} from '../../../common';
import { ReactNode } from 'react';
import { toast } from 'sonner';
import { CreateSurchargeModal } from './CreateSurchargeModal';
import { UpdateSurchargeModal } from './UpdateSurchargeModal';
import { SurchargeRule } from '../../../common';

// ─── iOS Switch ─────────────────────────────────────────────────────────────

const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#2F6FED',
        opacity: 1,
        border: 0,
      },
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.5,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.2)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 300,
    }),
  },
}));

// ─── Types ──────────────────────────────────────────────────────────────────

type Surcharge = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  multiplier: string;
  multiplierColor: string;
  appliesTo: string;
  active: boolean;
};

interface SurchargeFormValues {
  rules: Array<{
    id: string;
    is_active: boolean;
  }>;
}

// ─── Component ──────────────────────────────────────────────────────────────

export const SurchargesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<SurchargeRule | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<{
    open: boolean;
    ruleId: string | null;
    ruleName: string | null;
  }>({ open: false, ruleId: null, ruleName: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteSurchargeRule } = useSurchargeApi();
  const { data: kpisData } = useResolvedApiQuery(useGetSurchargeKpis, null);
  const { data: rulesData, refetch } = useResolvedApiQuery(
    useListSurchargeRules,
    null
  );

  const rules = useMemo(() => rulesData?.rules || [], [rulesData?.rules]);

  const handleDeleteClick = (ruleId: string, ruleName: string) => {
    setDeleteModalState({ open: true, ruleId, ruleName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalState.ruleId) return;

    setIsDeleting(true);
    const success = await deleteSurchargeRule(deleteModalState.ruleId);

    if (success) {
      refetch();
      setDeleteModalState({ open: false, ruleId: null, ruleName: null });
    }

    setIsDeleting(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModalState({ open: false, ruleId: null, ruleName: null });
  };

  const handleEditClick = (rule: SurchargeRule) => {
    setSelectedRule(rule);
    setIsUpdateModalOpen(true);
  };

  useEffect(() => {
    if (!isUpdateModalOpen) {
      setSelectedRule(null);
    }
  }, [isUpdateModalOpen]);

  const initialValues: SurchargeFormValues = useMemo(() => {
    return {
      rules: rules.map((rule) => ({
        id: rule.id,
        is_active: rule.is_active,
      })),
    };
  }, [rules]);

  const handleSubmit = async (
    values: SurchargeFormValues,
    { setSubmitting }: FormikHelpers<SurchargeFormValues>
  ) => {
    setSubmitting(true);

    // Update all rules in parallel
    const updates = values.rules.map((formRule) => {
      const originalRule = rules.find((r) => r.id === formRule.id);
      if (!originalRule) {
        console.error('Original rule not found for ID:', formRule.id);
        return Promise.resolve(false);
      }

      const updateData = {
        name: originalRule.name,
        surcharge_type: originalRule.surcharge_type,
        multiplier: parseFloat(originalRule.multiplier),
        flat_amount: parseFloat(originalRule.flat_amount),
        schedule: originalRule.schedule || null,
        applies_to: originalRule.applies_to,
        is_active: formRule.is_active,
        ...(originalRule.description && {
          description: originalRule.description,
        }),
        ...(originalRule.sort_order !== undefined && {
          sort_order: originalRule.sort_order,
        }),
      };

      console.log('Sending update for rule:', formRule.id, updateData);

      return updateSurchargeRule({
        ruleId: formRule.id,
        data: updateData,
      });
    });

    const results = await Promise.all(updates);

    // Check if all updates succeeded
    if (results.every((success) => success)) {
      toast.success('Surcharges updated successfully');
      refetch();
    }

    setSubmitting(false);
  };

  return (
    <AppDashboardLayout>
      <Formik<SurchargeFormValues>
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, dirty, isSubmitting, setFieldValue }) => {
          const iconMap: Record<string, ReactNode> = {
            peakhours: (
              <BoltOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
            ),
            night: (
              <DarkModeOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />
            ),
            overnight: (
              <DarkModeOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />
            ),
            earlymorning: (
              <WbTwilightOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
            ),
            weatherlightsnow: (
              <WaterDropOutlinedIcon sx={{ fontSize: 20, color: '#0EA5E9' }} />
            ),
            weatherheavysnow: (
              <AcUnitOutlinedIcon sx={{ fontSize: 20, color: '#0EA5E9' }} />
            ),
            weatherpoststorm: (
              <WaterDropOutlinedIcon sx={{ fontSize: 20, color: '#0EA5E9' }} />
            ),
            weekendsaturday: (
              <BoltOutlinedIcon sx={{ fontSize: 20, color: '#8B5CF6' }} />
            ),
            weekendsunday: (
              <BoltOutlinedIcon sx={{ fontSize: 20, color: '#8B5CF6' }} />
            ),
            holiday: (
              <CelebrationOutlinedIcon
                sx={{ fontSize: 20, color: '#EC4899' }}
              />
            ),
          };

          const colorMap: Record<string, { iconBg: string; color: string }> = {
            peakhours: { iconBg: '#EBF2FF', color: '#2F6FED' },
            night: { iconBg: '#EEF2FF', color: '#6366F1' },
            overnight: { iconBg: '#EEF2FF', color: '#6366F1' },
            earlymorning: { iconBg: '#FEF3C7', color: '#F59E0B' },
            weatherlightsnow: { iconBg: '#E0F2FE', color: '#0EA5E9' },
            weatherheavysnow: { iconBg: '#E0F2FE', color: '#0EA5E9' },
            weatherpoststorm: { iconBg: '#E0F2FE', color: '#0EA5E9' },
            weekendsaturday: { iconBg: '#F5F3FF', color: '#8B5CF6' },
            weekendsunday: { iconBg: '#F5F3FF', color: '#8B5CF6' },
            holiday: { iconBg: '#FDF2F8', color: '#EC4899' },
          };

          const surcharges = rules.map((rule) => {
            const formRule = values.rules.find((r) => r.id === rule.id);
            const ruleType = (rule.surcharge_type || 'peak_hours')
              .toLowerCase()
              .replace(/_/g, '');
            const style = colorMap[ruleType] || colorMap.peakhours;
            const icon = iconMap[ruleType] || iconMap.peakhours;

            // Extract time from schedule periods if available
            let timeDescription = 'No time restriction';
            if (rule.schedule?.periods && rule.schedule.periods.length > 0) {
              const firstPeriod = rule.schedule.periods[0];
              timeDescription = `${firstPeriod.start} - ${firstPeriod.end}`;
            } else if (rule.description) {
              timeDescription = rule.description;
            }

            return {
              id: rule.id,
              title: rule.name,
              description: timeDescription,
              icon,
              iconBg: style.iconBg,
              multiplier: `$${parseFloat(rule.flat_amount).toFixed(2)}`,
              multiplierColor: style.color,
              appliesTo: rule.applies_to?.join(', ') || 'All ride types',
              active: formRule?.is_active ?? rule.is_active,
            };
          });

          const activeCount = surcharges.filter((s) => s.active).length;
          const inactiveCount = surcharges.filter((s) => !s.active).length;
          const totalCount = surcharges.length;

          const handleToggle = (id: string) => {
            const ruleIndex = values.rules.findIndex((r) => r.id === id);
            if (ruleIndex !== -1) {
              setFieldValue(
                `rules.${ruleIndex}.is_active`,
                !values.rules[ruleIndex].is_active
              );
            }
          };

          return (
            <Form>
              <Stack spacing={'24px'}>
                {/* Header */}
                <RowStack justifyContent="space-between">
                  <DashboardTitleAndDesc
                    title="Surcharges"
                    desc="Configure additional charges applied during peak periods, special conditions, or extra service requests."
                  />
                  <AppButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create Surcharge
                  </AppButton>
                </RowStack>

                {/* Stat Cards */}
                <RowStack spacing={'12px'}>
                  {/* Total Surcharges */}
                  <RowStack
                    spacing={'12px'}
                    sx={{
                      flex: 1,
                      background: '#FFFFFF',
                      border: '0.67px solid #F0F4F8',
                      borderRadius: '16px',
                      boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                      padding: '0px 20px',
                      height: 120,
                    }}
                  >
                    <Stack spacing={'9px'} sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          color: '#6B7280',
                        }}
                      >
                        Total surcharges
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(26),
                          lineHeight: '0.85em',
                          color: '#111827',
                        }}
                      >
                        {kpisData?.total_rules || totalCount}
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '16px',
                        background: '#EBF2FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <AttachMoneyOutlinedIcon
                        sx={{ fontSize: 19, color: '#2F6FED' }}
                      />
                    </Box>
                  </RowStack>

                  {/* Active Surcharges */}
                  <RowStack
                    spacing={'12px'}
                    sx={{
                      flex: 1,
                      background: '#FFFFFF',
                      border: '0.67px solid #F0F4F8',
                      borderRadius: '16px',
                      boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                      padding: '0px 20px',
                      height: 120,
                    }}
                  >
                    <Stack spacing={'9px'} sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          color: '#6B7280',
                        }}
                      >
                        Active surcharges
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(26),
                          lineHeight: '0.85em',
                          color: '#111827',
                        }}
                      >
                        {kpisData?.active_rules || activeCount}
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '16px',
                        background: '#ECFDF5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: 19, color: '#059669' }}
                      />
                    </Box>
                  </RowStack>

                  {/* Inactive Surcharges */}
                  <RowStack
                    spacing={'12px'}
                    sx={{
                      flex: 1,
                      background: '#FFFFFF',
                      border: '0.67px solid #F0F4F8',
                      borderRadius: '16px',
                      boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                      padding: '0px 20px',
                      height: 120,
                    }}
                  >
                    <Stack spacing={'9px'} sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          color: '#6B7280',
                        }}
                      >
                        Inactive surcharges
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(26),
                          lineHeight: '0.85em',
                          color: '#111827',
                        }}
                      >
                        {inactiveCount}
                      </Typography>
                    </Stack>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '16px',
                        background: '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BlockOutlinedIcon
                        sx={{ fontSize: 19, color: '#9CA3AF' }}
                      />
                    </Box>
                  </RowStack>
                </RowStack>

                {/* Surcharge Cards Grid */}
                <Grid container spacing={'20px'}>
                  {surcharges.map((surcharge) => {
                    const originalRule = rules.find(
                      (r) => r.id === surcharge.id
                    );
                    return (
                      <Grid key={surcharge.id} size={{ xs: 12, md: 6 }}>
                        <SurchargeCard
                          surcharge={surcharge}
                          onToggle={() => handleToggle(surcharge.id)}
                          onEdit={() => {
                            if (originalRule) {
                              handleEditClick(originalRule);
                            }
                          }}
                          onDelete={() =>
                            handleDeleteClick(
                              surcharge.id,
                              originalRule?.name || surcharge.title
                            )
                          }
                        />
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Save Button */}
                <RowStack justifyContent="flex-end">
                  <AppButton
                    type="submit"
                    variant="contained"
                    isLoading={isSubmitting}
                    disabled={!dirty || isSubmitting}
                  >
                    Save Changes
                  </AppButton>
                </RowStack>
              </Stack>
            </Form>
          );
        }}
      </Formik>

      {/* Create Surcharge Modal */}
      <CreateSurchargeModal
        open={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
      />

      {/* Update Surcharge Modal */}
      <UpdateSurchargeModal
        open={isUpdateModalOpen}
        setOpen={setIsUpdateModalOpen}
        rule={selectedRule}
      />

      {/* Delete Confirmation Modal */}
      <AppModal
        open={deleteModalState.open}
        setOpen={(open) => {
          if (!open) handleDeleteCancel();
        }}
        label="delete-surcharge-modal"
        sx={{
          '& .MuiDialog-paper': {
            width: '440px',
          },
        }}
      >
        <Stack spacing={'24px'}>
          {/* Header */}
          <Box>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(20),
                color: '#111827',
                marginBottom: '8px',
              }}
            >
              Delete Surcharge
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(14),
                color: '#6B7280',
              }}
            >
              Are you sure you want to delete{' '}
              <Typography
                component="span"
                sx={{
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                {deleteModalState.ruleName}
              </Typography>
              ? This action cannot be undone.
            </Typography>
          </Box>

          {/* Actions */}
          <RowStack spacing={'12px'} justifyContent="flex-end">
            <AppButton
              variant="contained"
              color="secondary"
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </AppButton>
            <AppButton
              variant="contained"
              color="primary"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
              disabled={isDeleting}
              sx={{
                backgroundColor: '#EF4444',
                '&:hover': {
                  backgroundColor: '#DC2626',
                },
              }}
            >
              Delete
            </AppButton>
          </RowStack>
        </Stack>
      </AppModal>
    </AppDashboardLayout>
  );
};

// ─── Sub-Components ─────────────────────────────────────────────────────────

const SurchargeCard = ({
  surcharge,
  onToggle,
  onEdit,
  onDelete,
}: {
  surcharge: Surcharge;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const isInactive = !surcharge.active;

  return (
    <Stack
      spacing={'16px'}
      sx={{
        background: '#FFFFFF',
        border: `0.67px solid ${isInactive ? '#F3F4F6' : '#F0F4F8'}`,
        borderRadius: '16px',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        padding: '20px',
        opacity: isInactive ? 0.75 : 1,
        position: 'relative',
      }}
    >
      {/* Action Icons */}
      <Box
        sx={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <Box
          onClick={onEdit}
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#E5F0FF',
            },
          }}
        >
          <EditOutlinedIcon
            sx={{
              fontSize: 18,
              color: '#2F6FED',
            }}
          />
        </Box>

        <Box
          onClick={onDelete}
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#FEE2E2',
            },
          }}
        >
          <DeleteOutlineIcon
            sx={{
              fontSize: 18,
              color: '#EF4444',
            }}
          />
        </Box>
      </Box>

      {/* Top Row: Icon + Title/Desc + Switch */}
      <RowStack justifyContent="space-between" sx={{ paddingRight: '80px' }}>
        <RowStack spacing={'12px'}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              background: isInactive ? '#F3F4F6' : surcharge.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {surcharge.icon}
          </Box>
          <Stack spacing={'2px'}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(14),
                color: '#111827',
              }}
            >
              {surcharge.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#9CA3AF',
              }}
            >
              {surcharge.description}
            </Typography>
          </Stack>
        </RowStack>
        <IOSSwitch checked={surcharge.active} onChange={onToggle} />
      </RowStack>

      {/* Bottom Row: Multiplier + Applies to + Status Badge */}
      <RowStack
        justifyContent="space-between"
        sx={{
          background: '#F7F9FB',
          border: '0.67px solid #F0F4F8',
          borderRadius: '14px',
          padding: '0px 16px',
          height: 72,
        }}
      >
        {/* Multiplier */}
        <Stack spacing={'2px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
            }}
          >
            Multiplier
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 800,
              fontSize: pxToRem(20),
              color: isInactive ? '#9CA3AF' : surcharge.multiplierColor,
            }}
          >
            {surcharge.multiplier}
          </Typography>
        </Stack>

        {/* Applies to */}
        <Stack spacing={'2px'} alignItems="flex-end">
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
              textAlign: 'right',
            }}
          >
            Applies to
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12.5),
              color: '#374151',
              textAlign: 'right',
            }}
          >
            {surcharge.appliesTo}
          </Typography>
        </Stack>

        {/* Status Badge */}
        <Box
          sx={{
            padding: '4px 10px',
            borderRadius: '100px',
            background: surcharge.active ? '#ECFDF5' : '#F3F4F6',
          }}
        >
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11),
              color: surcharge.active ? '#059669' : '#9CA3AF',
            }}
          >
            {surcharge.active ? 'Active' : 'Inactive'}
          </Typography>
        </Box>
      </RowStack>
    </Stack>
  );
};
