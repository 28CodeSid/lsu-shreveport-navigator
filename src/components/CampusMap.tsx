import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Building, CAMPUS_CENTER, DEFAULT_ZOOM, CATEGORY_INFO } from '@/data/buildings';

interface CampusMapProps {
  buildings: Building[];
  selectedBuilding?: Building | null;
  onBuildingSelect: (building: Building) => void;
  route?: [number, number][];
  userLocation?: [number, number] | null;
}

const createBuildingIcon = (category: string, isSelected: boolean) => {
  const info = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
  const bgColor = isSelected ? '#F59E0B' : '#6B21A8';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${bgColor};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.2s ease;
        cursor: pointer;
      ">
        ${info?.icon || '📍'}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute;
          inset: 0;
          background: rgba(107, 33, 168, 0.3);
          border-radius: 50%;
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        "></div>
        <div style="
          position: absolute;
          inset: 4px;
          background: #6B21A8;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      </div>
      <style>
        @keyframes pulse-ring {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function CampusMap({ 
  buildings, 
  selectedBuilding, 
  onBuildingSelect,
  route,
  userLocation 
}: CampusMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: CAMPUS_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Add/update building markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();

    // Add markers for each building
    buildings.forEach(building => {
      const isSelected = selectedBuilding?.id === building.id;
      const icon = createBuildingIcon(building.category, isSelected);
      
      const marker = L.marker(building.coordinates, { icon })
        .addTo(map)
        .on('click', () => onBuildingSelect(building));

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px; padding: 12px;">
          <h3 style="margin: 0 0 4px 0; font-weight: 600; font-size: 14px; color: #1f2937;">
            ${building.name}
          </h3>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            ${CATEGORY_INFO[building.category]?.label || building.category}
          </p>
        </div>
      `;
      
      marker.bindPopup(popupContent, {
        closeButton: false,
        className: 'custom-popup',
      });

      markersRef.current.set(building.id, marker);
    });
  }, [buildings, selectedBuilding, onBuildingSelect]);

  // Update selected marker
  useEffect(() => {
    if (!selectedBuilding) return;
    
    const map = mapInstanceRef.current;
    const marker = markersRef.current.get(selectedBuilding.id);
    
    if (map && marker) {
      map.flyTo(selectedBuilding.coordinates, 18, { duration: 0.5 });
    }
  }, [selectedBuilding]);

  // Draw route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    // Draw new route if provided
    if (route && route.length >= 2) {
      routeLayerRef.current = L.polyline(route, {
        color: '#6B21A8',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Fit map to show entire route
      map.fitBounds(routeLayerRef.current.getBounds(), { padding: [50, 50] });
    }
  }, [route]);

  // Update user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Add new user marker if location available
    if (userLocation) {
      const icon = createUserLocationIcon();
      userMarkerRef.current = L.marker(userLocation, { icon, zIndexOffset: 1000 })
        .addTo(map);
    }
  }, [userLocation]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
