/**
 * WebGL Detection Utility
 * 
 * Detects WebGL support in the browser before map initialization.
 * Provides detailed information about WebGL capabilities and performance caveats.
 */

export interface WebGLSupportResult {
  supported: boolean;
  reason?: string;
  performanceCaveat?: boolean;
}

/**
 * Detects WebGL support in the browser
 *
 * Strategy:
 * 1. Check if WebGL context can be created
 * 2. Check for performance caveats
 * 3. Use Mapbox GL JS built-in detection as fallback
 */
export function detectWebGLSupport(): WebGLSupportResult {
  // First check: Try creating a WebGL context
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      return { supported: false, reason: 'WebGL context creation failed' };
    }

    // Type guard: ensure we have a WebGLRenderingContext
    if (!(gl instanceof WebGLRenderingContext)) {
      return { supported: false, reason: 'Invalid WebGL context type' };
    }

    // Second check: Performance caveat
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      if (renderer && typeof renderer === 'string' && renderer.includes('SwiftShader')) {
        return {
          supported: true,
          performanceCaveat: true,
          reason: 'Software rendering detected'
        };
      }
    }

    return { supported: true };
  } catch (error) {
    // Fallback to Mapbox GL JS detection if available
    if (typeof window !== 'undefined' && (window as any).mapboxgl) {
      const mapboxgl = (window as any).mapboxgl;
      return {
        supported: mapboxgl.supported(),
        reason: 'Using Mapbox GL JS detection'
      };
    }

    return { supported: false, reason: 'WebGL detection failed' };
  }
}

