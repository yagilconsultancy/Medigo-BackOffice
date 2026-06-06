'use client';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Dialog,
  IconButton,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import {
  forwardRef,
  ReactElement,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { TransitionProps } from '@mui/material/transitions';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { Loader, RowStack } from '../../components';
import { pxToRem } from '../../../../common';
export interface ImagePdfViewerProps {
  imageFileName: string;
  fileUri: string;
  children?: ReactNode;
}

const Transition = forwardRef<
  unknown,
  TransitionProps & { children: ReactElement }
>(function Transition({ children, ...rest }, ref) {
  return (
    <Slide direction="up" ref={ref} {...rest}>
      {children}
    </Slide>
  );
});

const IMAGE_EXTENSIONS = new Set([
  'bmp',
  'gif',
  'jpeg',
  'jpg',
  'png',
  'tif',
  'tiff',
  'webp',
]);

const OFFICE_EXTENSIONS = new Set([
  'csv',
  'doc',
  'docx',
  'htm',
  'html',
  'odt',
  'pdf',
  'ppt',
  'pptx',
  'txt',
  'xls',
  'xlsx',
]);

const getExtension = (url: string) => {
  const normalizedUrl = url.split('?')[0].split('#')[0];

  try {
    const pathname = new URL(normalizedUrl).pathname;
    const fileName = pathname.split('/').filter(Boolean).pop() || pathname;
    return fileName.includes('.')
      ? fileName.split('.').pop()?.toLowerCase() || ''
      : '';
  } catch {
    const fileName = normalizedUrl.split('/').filter(Boolean).pop() || '';
    return fileName.includes('.')
      ? fileName.split('.').pop()?.toLowerCase() || ''
      : '';
  }
};

export const ImagePdfViewer = ({
  imageFileName,
  fileUri,
  children,
}: ImagePdfViewerProps) => {
  const [openViewerModal, setOpenViewerModal] = useState(false);

  const defaultLayoutPluginInstanceRef = useRef(defaultLayoutPlugin());
  const defaultLayoutPluginInstance = defaultLayoutPluginInstanceRef.current;

  const handleOpen = () => setOpenViewerModal(true);

  const handleClose = () => setOpenViewerModal(false);

  const uri = useMemo(() => fileUri, [fileUri]);

  const fileExtension = useMemo(() => getExtension(uri), [uri]);
  const isPdfFile = fileExtension === 'pdf';
  const isImageFile = IMAGE_EXTENSIONS.has(fileExtension);
  const isOfficeFile = OFFICE_EXTENSIONS.has(fileExtension) && !isPdfFile;

  return (
    <>
      {children ? (
        <Box onClick={handleOpen} sx={{ cursor: 'pointer' }}>
          {children}
        </Box>
      ) : (
        <RowStack
          spacing={1}
          onClick={handleOpen}
          sx={{
            cursor: 'pointer',
            alignItems: 'center',
          }}
        >
          <AttachFileIcon sx={{ color: 'text.primary' }} />

          <Typography
            sx={{
              color: 'primary.main',
              fontWeight: 500,
              fontSize: pxToRem(16),
              lineHeight: '24px',
              fontFamily: (theme) => theme.typography.fontFamily,
              textDecoration: 'underline',
            }}
          >
            {imageFileName}
          </Typography>
        </RowStack>
      )}

      <Dialog
        open={openViewerModal}
        slots={{
          transition: Transition,
        }}
        maxWidth={false}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              background: '#FFF',
              padding: '40px',
              width: {
                xs: '85vw',
                sm: '80vw',
                md: '65vw',
                lg: '55vw',
                xl: '50vw',
              },
              maxHeight: '85vh',
              height: 'auto',
              position: 'relative',
              overflow: 'hidden',
            },
          },
        }}
        scroll={'paper'}
        onClose={handleClose}
        keepMounted
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isPdfFile ? (
          <Box sx={{ height: '65vh', width: '100%' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={uri}
                plugins={[defaultLayoutPluginInstance]}
                renderLoader={() => (
                  <Stack
                    sx={{
                      height: '100%',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Loader size={50} />
                  </Stack>
                )}
              />
            </Worker>
          </Box>
        ) : isImageFile ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              maxHeight: '75vh',
            }}
          >
            <Avatar
              src={uri}
              alt={imageFileName}
              sx={{
                width: '35vw',
                height: '45vh',
                borderRadius: '10px',
              }}
            />
          </Box>
        ) : isOfficeFile ? (
          <Box
            sx={{
              height: '65vh',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <DocViewer
              documents={[{ uri, fileName: imageFileName }]}
              pluginRenderers={DocViewerRenderers}
              prefetchMethod="GET"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              minHeight: '400px',
              maxHeight: '75vh',
              textAlign: 'center',
              px: 3,
            }}
          >
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(14),
                color: '#111827',
              }}
            >
              Preview not available for this file type.
            </Typography>
            <Box
              component="a"
              href={uri}
              target="_blank"
              rel="noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: '#2F6FED',
                textDecoration: 'none',
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
              }}
            >
              <DownloadIcon sx={{ fontSize: 18 }} />
              Download file
            </Box>
          </Box>
        )}
      </Dialog>
    </>
  );
};
