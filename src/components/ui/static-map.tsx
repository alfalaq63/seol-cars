'use client';

import Image from 'next/image';

interface StaticMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  width?: number;
  height?: number;
  className?: string;
}

export function StaticMap({
  latitude,
  longitude,
  zoom = 15,
  width = 600,
  height = 400,
  className,
}: StaticMapProps) {
  // Generate a static map URL from OpenStreetMap
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=${latitude},${longitude},red`;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height, width }}>
      <Image
        src={mapUrl}
        alt={`Map at ${latitude},${longitude}`}
        fill
        className="object-cover"
        unoptimized // External image
      />
      <div className="absolute bottom-2 right-2 text-xs text-gray-700 bg-white bg-opacity-70 px-1 py-0.5 rounded">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
