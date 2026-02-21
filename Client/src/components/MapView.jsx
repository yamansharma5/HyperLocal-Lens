import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in bundled apps
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon for user location
const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #6366f1;
      border: 3px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.6), 0 2px 8px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 2px solid rgba(99, 102, 241, 0.3);
        animation: pulseRing 2s ease-in-out infinite;
      "></div>
    </div>
    <style>
      @keyframes pulseRing {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(2); opacity: 0; }
      }
    </style>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -15],
});

// Custom icon for businesses
const businessIcon = L.divIcon({
  className: 'custom-business-marker',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #10b981, #059669);
      border: 2px solid rgba(255,255,255,0.9);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg style="transform: rotate(45deg); width: 16px; height: 16px;" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="0">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -35],
});

// Custom icon for broadcast
const broadcastIcon = L.divIcon({
  className: 'custom-broadcast-marker',
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border: 2px solid rgba(255,255,255,0.9);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg style="transform: rotate(45deg); width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="2"/>
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -35],
});

function MapView({ lat, lng, businesses = [], broadcasts = [], zoom = 14 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    if (!mapRef.current) return;

    // Create map with dark-themed OpenStreetMap tiles
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom,
      zoomControl: true,
      attributionControl: true,
    });

    // CartoDB Dark Matter tiles for dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // Add user location marker
    const userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
      <div style="text-align: center; min-width: 120px;">
        <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">📍 You are here</div>
        <div style="font-size: 12px; opacity: 0.7;">${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
      </div>
    `);

    // Add 5km radius circle
    L.circle([lat, lng], {
      radius: 5000,
      color: '#6366f1',
      fillColor: '#6366f1',
      fillOpacity: 0.05,
      weight: 1,
      dashArray: '8, 8',
      opacity: 0.4,
    }).addTo(map);

    // Add business markers
    businesses.forEach((biz) => {
      const bizLat = biz.location?.coordinates?.[1];
      const bizLng = biz.location?.coordinates?.[0];
      if (bizLat && bizLng) {
        const marker = L.marker([bizLat, bizLng], { icon: businessIcon }).addTo(map);
        marker.bindPopup(`
          <div style="min-width: 160px;">
            <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">🏪 ${biz.shopName}</div>
            <div style="display: flex; gap: 6px; margin-bottom: 6px;">
              <span style="background: rgba(99,102,241,0.2); padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 600;">${biz.category}</span>
              ${biz.verified ? '<span style="background: rgba(16,185,129,0.2); padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 600;">✅ Verified</span>' : ''}
            </div>
            <div style="font-size: 12px; opacity: 0.7;">📍 ${biz.address}</div>
          </div>
        `);
      }
    });

    // Add broadcast markers
    broadcasts.forEach((bc) => {
      const bizLat = bc.business?.location?.coordinates?.[1];
      const bizLng = bc.business?.location?.coordinates?.[0];
      if (bizLat && bizLng) {
        const marker = L.marker([bizLat, bizLng], { icon: broadcastIcon }).addTo(map);
        const expiresAt = new Date(bc.expiresAt).toLocaleString();
        marker.bindPopup(`
          <div style="min-width: 180px;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px;">📡 ${bc.business.shopName}</div>
            <div style="font-size: 13px; margin-bottom: 8px; line-height: 1.4;">${bc.message}</div>
            <div style="display: flex; gap: 6px; margin-bottom: 6px;">
              <span style="background: ${bc.category === 'Offer' ? 'rgba(245,158,11,0.2)' : 'rgba(6,182,212,0.2)'}; padding: 2px 8px; border-radius: 8px; font-size: 11px; font-weight: 600;">
                ${bc.category === 'Offer' ? '🎯' : '👥'} ${bc.category}
              </span>
            </div>
            <div style="font-size: 11px; opacity: 0.6;">⏰ Expires: ${expiresAt}</div>
          </div>
        `);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, businesses, broadcasts, zoom]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
      {/* Overlay gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-950/50 to-transparent pointer-events-none z-[1000]"></div>
    </div>
  );
}

export default MapView;
