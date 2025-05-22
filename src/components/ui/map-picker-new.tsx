'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Define the props for the map component
interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
  height?: string;
}

export function MapPickerNew({
  latitude,
  longitude,
  onLocationChange,
  className,
  height = '400px',
}: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [position, setPosition] = useState<[number, number]>(
    latitude && longitude ? [latitude, longitude] : [32.8872, 13.1913]
  );
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Update position when props change
  useEffect(() => {
    if (latitude !== null && longitude !== null && latitude !== undefined && longitude !== undefined) {
      setPosition([latitude, longitude]);
      
      // Update marker position if map is already initialized
      if (mapInstanceRef.current && markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      }
    }
  }, [latitude, longitude]);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Fix Leaflet's icon paths
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });

        // Check if map is already initialized
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Create map
        const map = L.map(mapRef.current, {
          center: position,
          zoom: 8,
          zoomControl: true,
          scrollWheelZoom: true,
          dragging: true,
        });
        
        mapInstanceRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 3
        }).addTo(map);

        // Add marker
        const marker = L.marker(position, {
          draggable: true
        }).addTo(map);
        
        markerRef.current = marker;

        marker.bindPopup("اسحب المؤشر أو انقر على الخريطة لتحديد الموقع").openPopup();

        // Handle marker drag
        marker.on('dragend', () => {
          const { lat, lng } = marker.getLatLng();
          const newPos: [number, number] = [lat, lng];
          setPosition(newPos);
          onLocationChange(lat, lng);
        });

        // Handle map click
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          marker.openPopup();
          setPosition([lat, lng]);
          onLocationChange(lat, lng);
        });

        // Force map to recalculate size
        setTimeout(() => {
          map.invalidateSize(true);
        }, 300);

        // Add resize handler
        const resizeObserver = new ResizeObserver(() => {
          setTimeout(() => {
            if (map) map.invalidateSize(true);
          }, 100);
        });

        if (mapRef.current) {
          resizeObserver.observe(mapRef.current);
        }

        // Add window resize listener
        const handleResize = () => {
          if (map) map.invalidateSize(true);
        };
        window.addEventListener('resize', handleResize);

        setMapLoaded(true);

        // Cleanup
        return () => {
          resizeObserver.disconnect();
          window.removeEventListener('resize', handleResize);
          map.remove();
          mapInstanceRef.current = null;
          markerRef.current = null;
        };
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Initialize with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initMap();
    }, 300);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to initialize only once

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </div>
        {mapLoaded && (
          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
            يمكنك سحب المؤشر أو النقر على الخريطة لتحديد الموقع بدقة
          </div>
        )}
      </div>
      <div className="relative">
        <div
          ref={mapRef}
          className={cn('rounded-md overflow-hidden border-2 border-blue-300 shadow-md', className)}
          style={{ height, minHeight: '300px', width: '100%' }}
        >
          {!mapLoaded && (
            <div style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f7ff',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 500
            }}>
              <div className="animate-pulse text-blue-600 mb-2">جاري تحميل الخريطة...</div>
              <div className="text-xs text-gray-500">يرجى الانتظار قليلاً</div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500 flex items-center justify-center space-x-1 space-x-reverse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>يمكنك استخدام عجلة الماوس للتكبير والتصغير</span>
      </div>
    </div>
  );
}
