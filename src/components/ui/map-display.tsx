'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { StaticMap } from './static-map';

// Define the props for the map component
interface MapDisplayProps {
  latitude: number;
  longitude: number;
  popupText?: string;
  className?: string;
  height?: string;
}

// Create a completely client-side only dynamic import
// This ensures Leaflet is never imported during SSR
const ClientSideMap = () => {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    // Only import on client side
    if (typeof window !== 'undefined') {
      import('./map-component').then((mod) => {
        setMapComponent(() => mod.MapComponent);
      });
    }
  }, []);

  return MapComponent;
};

export function MapDisplay({
  latitude,
  longitude,
  popupText,
  className,
  height = '100%',
}: MapDisplayProps) {
  const [isMounted, setIsMounted] = useState(false);
  const DynamicMap = ClientSideMap();

  // Only render the interactive map on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert height to numeric value for StaticMap
  const heightValue = parseInt(height.replace('px', '').replace('%', '')) || 400;

  return (
    <div className="w-full">
      <div className={cn('rounded-md overflow-hidden', className)} style={{ height }}>
        {!isMounted || !DynamicMap ? (
          // Show static map during SSR and while loading
          <StaticMap
            latitude={latitude}
            longitude={longitude}
            height={heightValue}
            width={800}
            className="w-full h-full"
          />
        ) : (
          // Show interactive map once loaded on client
          <DynamicMap
            latitude={latitude}
            longitude={longitude}
            popupText={popupText}
          />
        )}
      </div>
      <div className="mt-1 text-xs text-gray-500 flex items-center justify-center space-x-1 space-x-reverse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>يمكنك استخدام عجلة الماوس للتكبير والتصغير والنقر على المؤشر لعرض المعلومات</span>
      </div>
    </div>
  );
}
