/**
 * Error Messages
 * 
 * User-friendly error messages for different map error scenarios.
 * All error messages should be defined here for consistency.
 */

import { MapErrorCode } from '@/components/map/types';

export interface ErrorMessageConfig {
  title: string;
  message: string;
  retryable: boolean;
}

export const ERROR_MESSAGES: Record<MapErrorCode, ErrorMessageConfig> = {
  [MapErrorCode.WEBGL_NOT_SUPPORTED]: {
    title: 'WebGL Not Supported',
    message: 'Your browser doesn\'t support WebGL, which is required for map display. Please try updating your browser or using a different one.',
    retryable: false,
  },
  [MapErrorCode.INVALID_TOKEN]: {
    title: 'Configuration Error',
    message: 'There was a problem with the map configuration. Please try again later.',
    retryable: false,
  },
  [MapErrorCode.NETWORK_ERROR]: {
    title: 'Connection Error',
    message: 'Unable to load the map due to a network issue. Please check your connection and try again.',
    retryable: true,
  },
  [MapErrorCode.RATE_LIMIT_EXCEEDED]: {
    title: 'Too Many Requests',
    message: 'The map service is temporarily unavailable. Please try again in a few moments.',
    retryable: true,
  },
  [MapErrorCode.STYLE_LOAD_ERROR]: {
    title: 'Map Style Error',
    message: 'Unable to load the map style. We\'ll try using a fallback style.',
    retryable: true,
  },
  [MapErrorCode.CONTAINER_SIZE_ZERO]: {
    title: 'Display Error',
    message: 'The map container is not properly sized. Please refresh the page.',
    retryable: true,
  },
  [MapErrorCode.INITIALIZATION_ERROR]: {
    title: 'Map Initialization Error',
    message: 'Unable to initialize the map. Please try again.',
    retryable: true,
  },
  [MapErrorCode.UNKNOWN_ERROR]: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try refreshing the page.',
    retryable: true,
  },
};

