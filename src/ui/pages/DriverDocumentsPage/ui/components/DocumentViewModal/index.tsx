'use client';

import { useRef } from 'react';
import { Avatar, Box, Dialog, Grid, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import {
  RowStack,
  AppNotificationSnackbar,
} from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { DocumentDetail } from '../../../index';
import { useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

type DocumentViewModalProps = {
  open: boolean;
  onClose: () => void;
  document: DocumentDetail | null;
};

// ─── Component ──────────────────────────────────────────────────────────────

export const DocumentViewModal = ({
  open,
  onClose,
  document: doc,
}: DocumentViewModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: '' });

  if (!doc) return null;

  const nameParts = doc.driverName.split(' ');
  const initials =
    nameParts.length > 1
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
      : nameParts[0].charAt(0);

  const infoFields = [
    { label: 'FULL NAME', value: doc.driverName },
    { label: 'DOCUMENT TYPE', value: doc.type },
    { label: 'ISSUE DATE', value: doc.issueDate },
    { label: 'EXPIRY DATE', value: doc.expiry },
    { label: 'DOCUMENT ID', value: doc.docId },
    {
      label: 'STATUS',
      value: 'VERIFIED & ACTIVE',
      isStatus: true,
    },
  ];

  const barcodeHash = doc.docId
    ? doc.docId.replace(/[-]/g, '').slice(0, 11).toUpperCase()
    : 'XXXXXXXXXX';

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSnackbar({
      open: true,
      message: `Document replaced with "${file.name}"`,
    });
    e.target.value = '';
  };

  const handleDownload = () => {
    setSnackbar({
      open: true,
      message: `Downloading ${doc.fileName}...`,
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 560,
            borderRadius: '16px',
            boxShadow: '0px 24px 80px 0px rgba(0, 0, 0, 0.22)',
            overflow: 'hidden',
            margin: 0,
          },
        }}
      >
        {/* Hidden file input for Replace */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
        />

        {/* Header */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '16px 24px',
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          <RowStack spacing={'12px'}>
            <Avatar
              src={doc.driverAvatar || undefined}
              alt={doc.driverName}
              sx={{
                width: 38,
                height: 38,
                fontSize: pxToRem(12),
                fontWeight: 600,
                background: '#EBF2FF',
                color: '#2F6FED',
                borderRadius: '19px',
              }}
            >
              {initials}
            </Avatar>
            <Stack spacing={0}>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: pxToRem(14),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                {doc.driverName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: pxToRem(12),
                  color: '#9CA3AF',
                  lineHeight: '1.5em',
                }}
              >
                {doc.type}
              </Typography>
            </Stack>
          </RowStack>

          <RowStack spacing={'8px'}>
            {/* Valid chip */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: '100px',
                background: '#ECFDF5',
                border: '0.46px solid #BBF7D0',
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 8, color: '#059669' }} />
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: pxToRem(8),
                  color: '#059669',
                }}
              >
                Valid
              </Typography>
            </Box>

            {/* Close button */}
            <Box
              onClick={onClose}
              sx={{
                width: 30,
                height: 30,
                borderRadius: '8px',
                background: '#F3F4F6',
                border: '0.67px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { background: '#E5E7EB' },
              }}
            >
              <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
            </Box>
          </RowStack>
        </RowStack>

        {/* Content */}
        <Stack spacing={'20px'} sx={{ padding: '24px 24px 0 24px' }}>
          {/* File Info Bar */}
          <RowStack
            sx={{
              background: '#F7F9FB',
              border: '0.67px solid #EAECF0',
              borderRadius: '14px',
              padding: '0 16px',
              height: '52px',
              gap: '12px',
            }}
          >
            {/* PDF Icon */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: '#EEF3FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DescriptionOutlinedIcon
                sx={{ fontSize: 16, color: '#2F6FED' }}
              />
            </Box>

            {/* File name + expiry */}
            <Stack spacing={0} sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(13),
                  color: '#111827',
                  lineHeight: '1.5em',
                }}
              >
                {doc.fileName}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: pxToRem(11),
                  color: '#9CA3AF',
                  lineHeight: '1.5em',
                }}
              >
                PDF Document · Expires {doc.expiry}
              </Typography>
            </Stack>

            {/* Download button */}
            <Box
              onClick={handleDownload}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#EEF3FF',
                border: '0.67px solid #C7D7F9',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              <DownloadOutlinedIcon sx={{ fontSize: 12, color: '#2F6FED' }} />
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: pxToRem(12),
                  color: '#2F6FED',
                }}
              >
                Download
              </Typography>
            </Box>
          </RowStack>

          {/* Document Preview */}
          <Box
            sx={{
              background: '#F8FAFC',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {/* Preview Header */}
            <RowStack
              justifyContent={'space-between'}
              sx={{
                padding: '24px',
                borderBottom: '2px solid #E5E7EB',
              }}
            >
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 800,
                    fontSize: pxToRem(13),
                    letterSpacing: '0.077em',
                    color: '#111827',
                    lineHeight: '1.5em',
                  }}
                >
                  {doc.authority}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: pxToRem(10),
                    color: '#9CA3AF',
                    lineHeight: '1.5em',
                  }}
                >
                  {doc.subtitle}
                </Typography>
              </Stack>

              {/* Document icon placeholder */}
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '8px',
                  background: '#E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{ fontSize: 20, color: '#9CA3AF' }}
                />
              </Box>
            </RowStack>

            {/* Info Grid */}
            <Box sx={{ padding: '20px 24px' }}>
              <Grid container spacing={'16px'}>
                {infoFields.map((field) => (
                  <Grid key={field.label} size={{ xs: 6 }}>
                    <Stack spacing={'3px'}>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 700,
                          fontSize: pxToRem(9),
                          letterSpacing: '0.089em',
                          color: '#9CA3AF',
                          lineHeight: '1.5em',
                        }}
                      >
                        {field.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: field.isStatus ? 700 : 500,
                          fontSize: pxToRem(12),
                          color: field.isStatus ? '#059669' : '#374151',
                          lineHeight: '1.5em',
                        }}
                      >
                        {field.value}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Barcode Section */}
            <Stack
              spacing={'4px'}
              sx={{
                padding: '16px 24px 20px',
                borderTop: '0.67px dashed #E5E7EB',
              }}
            >
              <RowStack
                sx={{ height: 28, gap: '4px', justifyContent: 'center' }}
              >
                {Array.from({ length: 28 }).map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: i % 3 === 0 ? 6.5 : 4,
                      height: 28,
                      background: '#374151',
                      borderRadius: '0.5px',
                    }}
                  />
                ))}
              </RowStack>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: pxToRem(9),
                  letterSpacing: '0.22em',
                  color: '#9CA3AF',
                  textAlign: 'center',
                }}
              >
                {barcodeHash}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Footer */}
        <RowStack
          justifyContent={'space-between'}
          sx={{
            padding: '16px 24px',
            borderTop: '0.67px solid #F0F4F8',
            background: '#FAFBFF',
            mt: '24px',
          }}
        >
          {/* Close button */}
          <Box
            onClick={onClose}
            sx={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#F3F4F6',
              border: '0.67px solid #E5E7EB',
              cursor: 'pointer',
              '&:hover': { background: '#E5E7EB' },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#374151',
                textAlign: 'center',
              }}
            >
              Close
            </Typography>
          </Box>

          {/* Replace Document button */}
          <Box
            onClick={handleReplace}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: '#F7F9FB',
              border: '0.67px solid #E5E7EB',
              cursor: 'pointer',
              '&:hover': { background: '#EEF3FF' },
            }}
          >
            <SyncOutlinedIcon sx={{ fontSize: 13, color: '#374151' }} />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#374151',
              }}
            >
              Replace Document
            </Typography>
          </Box>
        </RowStack>
      </Dialog>

      <AppNotificationSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </>
  );
};
