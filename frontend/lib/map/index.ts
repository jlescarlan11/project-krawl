/**
 * Map Utilities Barrel Export
 *
 * Central export point for all map-related utilities.
 */

export {
  validateCoordinates,
  loadBoundaryData,
  isPointInBoundary,
  getBoundaryCoordinates,
  clearBoundaryCache,
  isBoundaryDataLoaded,
} from './boundaryValidation';

export type {
  Coordinates,
  BoundaryValidationResult,
} from './boundaryValidation';

export {
  isValidMapboxToken,
  validateContainer,
  classifyMapError,
  getMapboxAccessToken,
  getMapboxStyle,
} from './mapUtils';

export {
  detectWebGLSupport,
} from './webglDetection';

export type {
  WebGLSupportResult,
} from './webglDetection';

export {
  CEBU_CITY_CENTER,
  CEBU_CITY_BOUNDS,
  CEBU_CITY_MAX_BOUNDS,
  BOUNDARY_GEOJSON_PATH,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  MAP_LOAD_TIMEOUT,
  RETRY_DELAY,
  MAX_RETRY_ATTEMPTS,
  DEFAULT_MAP_STYLE,
  FALLBACK_MAP_STYLE,
  MIN_CONTAINER_WIDTH,
  MIN_CONTAINER_HEIGHT,
} from './constants';

export { ERROR_MESSAGES } from './errorMessages';
