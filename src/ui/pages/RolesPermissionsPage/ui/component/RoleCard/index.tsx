'use client';

import { Box, Stack, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { RowStack } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RoleCardProps = {
  icon: React.ReactNode;
  count: number;
  roleName: string;
  adminLabel: string;
  isActive: boolean;
  activeColor: string;
  iconBg: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const RoleCard = ({
  icon,
  count,
  roleName,
  adminLabel,
  isActive,
  activeColor,
  iconBg,
  onClick,
  onEdit,
  onDelete,
}: RoleCardProps) => {
  return (
    <Stack
      spacing={'12px'}
      sx={{
        padding: '20px',
        borderRadius: '16px',
        cursor: 'pointer',
        background: isActive ? activeColor : '#FFFFFF',
        border: isActive
          ? `0.67px solid ${activeColor}`
          : '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Icon + Count */}
      <RowStack justifyContent={'space-between'} alignItems={'center'}>
        <Box
          onClick={onClick}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '14px',
            background: isActive ? 'rgba(255, 255, 255, 0.2)' : iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography
          onClick={onClick}
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 800,
            fontSize: pxToRem(22),
            lineHeight: '1.5em',
            color: isActive ? '#FFFFFF' : '#111827',
          }}
        >
          {count}
        </Typography>
      </RowStack>

      {/* Role Name + Admin Count */}
      <Stack spacing={'2px'} onClick={onClick}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(13),
            lineHeight: '1.5em',
            color: isActive ? '#FFFFFF' : '#111827',
          }}
        >
          {roleName}
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(11.5),
            lineHeight: '1.5em',
            color: isActive ? 'rgba(255, 255, 255, 0.7)' : '#9CA3AF',
          }}
        >
          {adminLabel}
        </Typography>
      </Stack>

      {/* Action Icons */}
      {(onEdit || onDelete) && (
        <RowStack spacing={'8px'} justifyContent={'flex-end'}>
          {onEdit && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#F7F9FB',
                border: isActive
                  ? '0.67px solid rgba(255, 255, 255, 0.3)'
                  : '0.67px solid #E8ECF0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: isActive ? 'rgba(255, 255, 255, 0.3)' : '#E8ECF0',
                },
              }}
            >
              <EditOutlinedIcon
                sx={{
                  fontSize: 16,
                  color: isActive ? '#FFFFFF' : '#6B7280',
                }}
              />
            </Box>
          )}
          {onDelete && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#FEF2F2',
                border: isActive
                  ? '0.67px solid rgba(255, 255, 255, 0.3)'
                  : '0.67px solid #FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: isActive ? 'rgba(255, 255, 255, 0.3)' : '#FEE2E2',
                },
              }}
            >
              <DeleteOutlineOutlinedIcon
                sx={{
                  fontSize: 16,
                  color: isActive ? '#FFFFFF' : '#EF4444',
                }}
              />
            </Box>
          )}
        </RowStack>
      )}
    </Stack>
  );
};
