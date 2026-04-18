import { useCallback } from 'react';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { RowStack, StyledImage } from '../../../../../modules/components';
import {
  AppGoogleMap,
  type MarkerPosition,
} from '../../../../../modules/components';
import { AppGoogleMapsProvider } from '../../../../../modules/components';
import { pxToRem } from '../../../../../../common';
import { InfoCard } from '../InfoCard';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import locationIcon from '../../assets/icons/location-icon.svg';
import EastIcon from '@mui/icons-material/East';

type LocationBoxProps = {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  address: string;
};

const LocationBox = ({ icon, iconBg, label, address }: LocationBoxProps) => (
  <RowStack
    spacing={'8px'}
    sx={{
      background: '#F7F9FB',
      borderRadius: '14px',
      padding: '10px 12px',
      flex: 1,
    }}
  >
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '10px',
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
    <Stack>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 500,
          fontSize: pxToRem(9),
          lineHeight: '13.5px',
          color: (theme) => theme.color.lightGrey,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(12),
          lineHeight: '18px',
          color: (theme) => theme.color.deepBlue,
        }}
      >
        {address}
      </Typography>
    </Stack>
  </RowStack>
);

type LiveRouteCardProps = {
  pickupAddress: string;
  destinationAddress: string;
  tripProgress: number;
  pickupLat?: number | null;
  pickupLng?: number | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
};

export const LiveRouteCard = ({
  pickupAddress,
  destinationAddress,
  tripProgress,
  pickupLat,
  pickupLng,
  destinationLat,
  destinationLng,
}: LiveRouteCardProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const hasCoordinates =
    pickupLat != null &&
    pickupLng != null &&
    destinationLat != null &&
    destinationLng != null;

  const computeRoute = useCallback(
    async (input: {
      origin: MarkerPosition;
      destination: MarkerPosition;
      waypoints?: MarkerPosition[];
    }): Promise<{ polyline: MarkerPosition[] } | null> => {
      try {
        const routesLib = (await google.maps.importLibrary('routes')) as any;
        const Route = routesLib.Route;

        const request: Record<string, any> = {
          origin: input.origin,
          destination: input.destination,
          travelMode: 'DRIVE',
          fields: ['path'],
        };

        if (input.waypoints?.length) {
          request.intermediates = input.waypoints;
        }

        const { routes } = await Route.computeRoutes(request);

        const route = routes?.[0];
        if (!route?.path?.length) return null;

        const polyline: MarkerPosition[] = route.path.map((point: any) => ({
          lat: typeof point.lat === 'function' ? point.lat() : point.lat,
          lng: typeof point.lng === 'function' ? point.lng() : point.lng,
        }));

        return { polyline };
      } catch {
        return null;
      }
    },
    []
  );

  return (
    <InfoCard
      icon={<MapOutlinedIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />}
      title="Live Route"
    >
      <Stack spacing={'12px'}>
        <RowStack justifyContent="flex-end">
          <RowStack
            spacing={'6px'}
            sx={{
              background: '#EBF2FF',
              borderRadius: '12px',
              padding: '4px 12px',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#2F6FED',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-3px',
                  left: '-3px',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'rgba(47, 111, 237, 0.2)',
                  animation: 'trackingPulse 2s ease-in-out infinite',
                },
                '@keyframes trackingPulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(1.3)' },
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(11),
                lineHeight: '16.5px',
                color: 'primary.main',
              }}
            >
              Tracking Active
            </Typography>
          </RowStack>
        </RowStack>

        <RowStack spacing={'8px'}>
          <LocationBox
            icon={
              <StyledImage
                src={locationIcon}
                alt="location-icon"
                sx={{
                  width: '12px',
                  height: '12px',
                }}
              />
            }
            iconBg="#F0FDF4"
            label="Pickup"
            address={pickupAddress}
          />
          <EastIcon sx={{ fontSize: 14, color: '#9CA3AF' }} />
          <LocationBox
            icon={
              <FmdGoodOutlinedIcon sx={{ fontSize: 12, color: '#2F6FED' }} />
            }
            iconBg="#EBF2FF"
            label="Destination"
            address={destinationAddress}
          />
        </RowStack>

        <Box
          sx={{
            borderRadius: '14px',
            overflow: 'hidden',
            height: 235,
          }}
        >
          {apiKey && hasCoordinates ? (
            <AppGoogleMapsProvider apiKey={apiKey}>
              <AppGoogleMap
                markerPositions={[
                  { lat: pickupLat!, lng: pickupLng! },
                  { lat: destinationLat!, lng: destinationLng! },
                ]}
                mapContainerStyle={{ width: '100%', height: '235px' }}
                showDirections={true}
                computeRoute={computeRoute}
              />
            </AppGoogleMapsProvider>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '14px',
              }}
            >
              <Typography
                sx={{
                  color: '#9CA3AF',
                  fontSize: pxToRem(13),
                  fontWeight: 500,
                }}
              >
                Map preview not available
              </Typography>
            </Box>
          )}
        </Box>

        <RowStack spacing={'12px'} width="100%">
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              lineHeight: '16.5px',
              color: (theme) => theme.color.lightGrey,
              whiteSpace: 'nowrap',
            }}
          >
            Trip Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={tripProgress}
            sx={{
              flex: 1,
              height: 5,
              borderRadius: '3px',
              backgroundColor: '#E5E7EB',
              '& .MuiLinearProgress-bar': {
                borderRadius: '3px',
                backgroundColor: '#2F6FED',
              },
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(11),
              lineHeight: '16.5px',
              color: 'primary.main',
              whiteSpace: 'nowrap',
            }}
          >
            {tripProgress}%
          </Typography>
        </RowStack>
      </Stack>
    </InfoCard>
  );
};
