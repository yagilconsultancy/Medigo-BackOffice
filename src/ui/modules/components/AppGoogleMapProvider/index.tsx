import { useJsApiLoader, type Libraries } from '@react-google-maps/api';
import React from 'react';

// Hoisted to a stable reference. Passing a new array literal on every render
// makes useJsApiLoader reload the script ("LoadScript reloaded" warning).
const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'maps', 'routes'];

export function AppGoogleMapsProvider({
  apiKey,
  children,
}: {
  apiKey: string;
  children: React.ReactNode;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
    version: 'beta', // Use beta to get access to new Places API
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <>{children}</>;
}
