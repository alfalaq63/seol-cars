'use client';

import { useEffect, useState } from 'react';
// Import these only on the client side
let MapContainer: any;
let TileLayer: any;
let Marker: any;
let Popup: any;
let L: any;

// Only import Leaflet on the client side
if (typeof window !== 'undefined') {
  // Dynamic imports
  import('react-leaflet').then((reactLeaflet) => {
    MapContainer = reactLeaflet.MapContainer;
    TileLayer = reactLeaflet.TileLayer;
    Marker = reactLeaflet.Marker;
    Popup = reactLeaflet.Popup;
  });

  import('leaflet').then((leaflet) => {
    L = leaflet.default;
    // Import CSS
    import('leaflet/dist/leaflet.css');
  });
}

interface MapComponentProps {
  latitude: number;
  longitude: number;
  popupText?: string;
}

export function MapComponent({
  latitude,
  longitude,
  popupText,
}: MapComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Wait for Leaflet components to be loaded
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if components are loaded
    const checkComponentsLoaded = () => {
      if (MapContainer && TileLayer && Marker && Popup && L) {
        // Fix for Leaflet marker icons in Next.js
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
        setIsLoaded(true);
      } else {
        // Check again after a short delay
        setTimeout(checkComponentsLoaded, 100);
      }
    };

    checkComponentsLoaded();
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={true}
      zoomControl={true}
      dragging={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        {popupText && (
          <Popup>
            <div className="text-center">
              <strong>{popupText}</strong>
              <div className="text-xs mt-1">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </div>
            </div>
          </Popup>
        )}
      </Marker>
    </MapContainer>
  );
}
