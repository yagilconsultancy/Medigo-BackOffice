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
import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
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

const getBrowserFileUrl = (fileUri: string) => {
  const publicStorageUrl = process.env.NEXT_PUBLIC_FILE_STORAGE_URL;

  if (!publicStorageUrl) {
    return fileUri;
  }

  try {
    const fileUrl = new URL(fileUri);

    if (fileUrl.hostname !== 'minio') {
      return fileUri;
    }

    const storageUrl = new URL(publicStorageUrl);
    storageUrl.pathname = `${storageUrl.pathname.replace(/\/$/, '')}${
      fileUrl.pathname
    }`;
    storageUrl.search = fileUrl.search;
    storageUrl.hash = fileUrl.hash;

    return storageUrl.toString();
  } catch {
    return fileUri;
  }
};

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

  const uri = useMemo(() => getBrowserFileUrl(fileUri), [fileUri]);

  const fileExtension = useMemo(() => getExtension(uri), [uri]);
  const isPdfFile = fileExtension === 'pdf';
  const isImageFile = IMAGE_EXTENSIONS.has(fileExtension);
  const isOfficeFile = OFFICE_EXTENSIONS.has(fileExtension) && !isPdfFile;
  const isDocumentFile = isPdfFile || isOfficeFile;

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
              padding: isDocumentFile ? 0 : '40px',
              width: isDocumentFile
                ? { xs: '96vw', sm: '94vw', md: '92vw' }
                : {
                    xs: '85vw',
                    sm: '80vw',
                    md: '65vw',
                    lg: '55vw',
                    xl: '50vw',
                  },
              maxWidth: isDocumentFile ? '1400px' : undefined,
              maxHeight: isDocumentFile ? '92vh' : '85vh',
              height: isDocumentFile ? '92vh' : 'auto',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
        scroll={'paper'}
        onClose={handleClose}
        keepMounted
      >
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
          <IconButton
            onClick={handleClose}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.16)',
              '&:hover': {
                backgroundColor: '#FFF',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {isPdfFile ? (
          <Box sx={{ flex: 1, minHeight: 0, width: '100%' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={uri}
                transformGetDocumentParams={(options) =>
                  Object.assign({}, options, { isEvalSupported: false })
                }
                defaultScale={SpecialZoomLevel.PageWidth}
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
              flex: 1,
              minHeight: 0,
              width: '100%',
              overflow: 'hidden',
              '& #react-doc-viewer': {
                height: '100%',
              },
              '& #proxy-renderer': {
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
              },
              '& #msdoc-renderer, & #msdoc-iframe': {
                width: '100%',
                height: '100%',
              },
            }}
          >
            <DocViewer
              documents={[{ uri, fileName: imageFileName }]}
              pluginRenderers={DocViewerRenderers}
              prefetchMethod="GET"
              config={{
                header: {
                  disableHeader: true,
                },
              }}
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
