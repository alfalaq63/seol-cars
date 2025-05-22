'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Define the props for the map component
interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  className?: string;
  height?: string;
}

// Create a client-side only component
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
  const [mapLoaded, setMapLoaded] = useState(false);

  // Update position when props change
  useEffect(() => {
    if (latitude !== null && longitude !== null && latitude !== undefined && longitude !== undefined) {
      setPosition([latitude, longitude]);
      console.log('Map position updated from props:', latitude, longitude);
    }
  }, [latitude, longitude]);

  // Load Leaflet only on client-side
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Create a unique ID for this map instance
    const mapId = `map-${Math.random().toString(36).substring(2, 9)}`;

    // Wait for DOM to be ready
    setTimeout(() => {
      const mapContainer = document.getElementById('map-container');
      if (!mapContainer) {
        console.error('Map container not found');
        return;
      }

      // Set the ID on the container
      mapContainer.id = mapId;

      // Load Leaflet and CSS
      const loadMap = async () => {
        try {
          // Import Leaflet
          const L = await import('leaflet');

          // Import CSS
          await import('leaflet/dist/leaflet.css');

          // Fix Leaflet's icon paths
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          });

          // Wait a moment to ensure the container is fully rendered
          await new Promise(resolve => setTimeout(resolve, 300));

          // Check if the container still exists (might have been unmounted)
          if (!document.getElementById(mapId)) {
            console.error('Map container no longer exists');
            return;
          }

          // Create map with better initial options
          const map = L.map(mapId, {
            center: position,
            zoom: 8,
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true,
            tap: false, // Disable tap handler for better mobile experience
            attributionControl: true
          });

          // Add tile layer with better options
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            minZoom: 3
          }).addTo(map);

          // Add marker with custom popup
          const marker = L.marker(position, {
            draggable: true // Make marker draggable for better UX
          }).addTo(map);

          marker.bindPopup("اسحب المؤشر أو انقر على الخريطة لتحديد الموقع").openPopup();

          // Handle marker drag events
          marker.on('dragend', function(e) {
            const { lat, lng } = marker.getLatLng();
            const newPos: [number, number] = [lat, lng];

            // Update state
            setPosition(newPos);

            // Notify parent
            const latitude = parseFloat(lat.toFixed(6));
            const longitude = parseFloat(lng.toFixed(6));
            onLocationChange(latitude, longitude);
          });

          // Handle map clicks
          map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            const newPos: [number, number] = [lat, lng];

            // Update marker position
            marker.setLatLng(newPos);

            // Open popup
            marker.openPopup();

            // Update state and notify parent
            setPosition(newPos);

            // Ensure we're passing numbers to the parent component
            const latitude = parseFloat(lat.toFixed(6));
            const longitude = parseFloat(lng.toFixed(6));

            onLocationChange(latitude, longitude);
          });

          // Force map to recalculate its size after a short delay
          setTimeout(() => {
            map.invalidateSize(true);
          }, 300);

          // Add resize handler to ensure map displays correctly when container size changes
          const resizeObserver = new ResizeObserver(() => {
            // Use setTimeout to ensure the resize is processed after the DOM has updated
            setTimeout(() => {
              if (map) map.invalidateSize(true);
            }, 100);
          });

          resizeObserver.observe(mapContainer);

          // Add window resize listener as a backup
          const handleResize = () => {
            if (map) map.invalidateSize(true);
          };
          window.addEventListener('resize', handleResize);

          setMapLoaded(true);

          // Cleanup on unmount
          return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
            map.remove();
          };
        } catch (error) {
          console.error('Error loading map:', error);
        }
      };

      loadMap();
    }, 100); // Short delay to ensure DOM is ready
  }, [onLocationChange]); // Remove position from dependencies to prevent re-initialization

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
          id="map-container"
          data-testid="map-container"
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
