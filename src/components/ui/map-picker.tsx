'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Dynamically import Leaflet with no SSR
const LeafletMap = dynamic(() => import('./map-components'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9f9f9'
    }}>
      جاري تحميل الخريطة...
    </div>
  )
});

interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
  height?: string;
}

export function MapPicker({
  latitude,
  longitude,
  onLocationChange,
  className,
  height = '400px',
}: MapPickerProps) {
  // Default to Libya's center if no coordinates provided
  const [position, setPosition] = useState<[number, number]>(
    latitude && longitude ? [latitude, longitude] : [32.8872, 13.1913]
  );

  // Update position when props change
  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Handle position change
  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition);
    onLocationChange(newPosition[0], newPosition[1]);
  };

  return (
    <div className="w-full">
      <div className={cn('rounded-md overflow-hidden border border-gray-300', className)} style={{ height }}>
        <LeafletMap
          position={position}
          setPosition={handlePositionChange}
        />
      </div>
      <div className="mt-2 text-sm text-gray-500 text-center">
        انقر على الخريطة لتحديد الموقع
      </div>
    </div>
  );
}
