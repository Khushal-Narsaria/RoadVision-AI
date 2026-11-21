import React, { useEffect } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import { useTheme } from '../context/ThemeContext';

// Standard OpenStreetMap tiles: free, no API key needed.
// Dark mode is produced with a CSS filter (see .map-tiles-dark in index.css).
const TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
// Minimal credit required by the OpenStreetMap tile usage policy
const ATTRIBUTION = '&copy; OpenStreetMap';

/**
 * Drop-in <TileLayer> replacement that auto-switches between
 * light/dark map styling whenever the app theme changes.
 */
const ThemedTileLayer = () => {
    const { theme } = useTheme();
    const map = useMap();

    // Remove the "🇺🇦 Leaflet" prefix from the map credit
    useEffect(() => {
        map.attributionControl?.setPrefix(false);
    }, [map]);

    return (
        <TileLayer
            key={theme}          // force remount on theme change
            url={TILES}
            maxZoom={19}
            className={theme === 'light' ? '' : 'map-tiles-dark'}
            attribution={ATTRIBUTION}
        />
    );
};

export default ThemedTileLayer;
