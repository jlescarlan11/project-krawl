/**
 * Map Components Barrel Export
 *
 * Central export point for all map-related components.
 */

export { Map } from './Map';
export { MapLoadingState } from './MapLoadingState';
export { MapErrorState } from './MapErrorState';
export { MapWithBoundary } from './MapWithBoundary';
export type { MapWithBoundaryProps } from './MapWithBoundary';
export { LocationPicker } from './LocationPicker';
export type { LocationPickerProps } from './LocationPicker';
export { MapControls, MapControlsPortal } from './MapControls';
export type { MapControlsProps } from './MapControls';
export { MapSearchControl } from './MapSearchControl';
export type { MapSearchControlProps } from './MapSearchControl';
export { MyLocationButton } from './MyLocationButton';
export type { MyLocationButtonProps } from './MyLocationButton';
export { GemPopup, GemPopupMobile, adjustPopupPosition } from './GemPopup';
export type { GemPopupProps, GemPopupMobileProps } from './GemPopup';
export { GemMarkerLayer } from './GemMarkerLayer';
export type { GemMarkerLayerProps } from './GemMarkerLayer';
export { calculateDistance, formatDistance, calculateBearing, formatBearing } from '@/lib/map/geoUtils';
export { useBoundaryLayer } from './useBoundaryLayer';
export type { BoundaryLayerOptions } from './useBoundaryLayer';
export { useMapInstance } from './useMapInstance';
export type { MapInstanceState } from './useMapInstance';
export { useGemMarkers } from './useGemMarkers';
export type { UseGemMarkersOptions, UseGemMarkersResult } from './useGemMarkers';
export { GemStatus, MARKER_STYLES, ZOOM_BREAKPOINTS } from './gem-types';
export type { MapGem, Coordinates, FetchGemsParams, FetchGemsResponse, MarkerStyleConfig } from './gem-types';
export { getMarkerIcon, getMarkerSize, getMarkerAnchor, preloadMarkerIcons } from './marker-icons';
export { KrawlTrailLayer } from './KrawlTrailLayer';
export type { KrawlTrailLayerProps } from './KrawlTrailLayer';
export { useKrawlTrails } from './useKrawlTrails';
export type { UseKrawlTrailsOptions, UseKrawlTrailsResult } from './useKrawlTrails';
export { DEFAULT_TRAIL_STYLE, TRAIL_COLORS, getTrailColor, krawlToGeoJSON, krawlToGeoJSONWithRouting } from './krawl-types';
export type { MapKrawl, FetchKrawlsParams, FetchKrawlsResponse, TrailStyleConfig } from './krawl-types';
export type {
  MapProps,
  MapError,
  MapErrorCode,
  MapState,
  MapRef,
  ControlPosition,
  CebuBounds,
  MapConfig,
} from './types';

