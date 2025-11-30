/**
 * Custom Navigation Control
 *
 * Extends Mapbox NavigationControl to add pitch when resetting bearing to north.
 */

import mapboxgl from 'mapbox-gl';

export interface CustomNavigationControlOptions {
  /**
   * Pitch angle to set when resetting bearing to north
   * @default 40
   */
  resetPitch?: number;

  /**
   * Show zoom controls
   * @default true
   */
  showZoom?: boolean;

  /**
   * Show compass control
   * @default true
   */
  showCompass?: boolean;

  /**
   * Visualize pitch with compass
   * @default false
   */
  visualizePitch?: boolean;
}

/**
 * Custom Navigation Control that adds pitch when resetting bearing
 *
 * This control wraps the default Mapbox NavigationControl and intercepts
 * the compass click to add a pitch animation along with bearing reset.
 */
export class CustomNavigationControl implements mapboxgl.IControl {
  private _container: HTMLElement | undefined;
  private _map: mapboxgl.Map | undefined;
  private _options: Required<CustomNavigationControlOptions>;
  private _defaultControl: mapboxgl.NavigationControl;

  constructor(options: CustomNavigationControlOptions = {}) {
    this._options = {
      resetPitch: options.resetPitch ?? 40,
      showZoom: options.showZoom ?? true,
      showCompass: options.showCompass ?? true,
      visualizePitch: options.visualizePitch ?? false,
    };

    // Create default control
    this._defaultControl = new mapboxgl.NavigationControl({
      showZoom: this._options.showZoom,
      showCompass: this._options.showCompass,
      visualizePitch: this._options.visualizePitch,
    });
  }

  onAdd(map: mapboxgl.Map): HTMLElement {
    this._map = map;

    // Add the default control
    this._container = this._defaultControl.onAdd(map);

    // Find the compass button and override its behavior
    const compassButton = this._container.querySelector('.mapboxgl-ctrl-compass') as HTMLButtonElement;

    if (compassButton) {
      // Store original click handler
      const originalOnClick = compassButton.onclick;

      // Override click handler
      compassButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (this._map) {
          // Animate to north bearing with pitch
          this._map.easeTo({
            bearing: 0,
            pitch: this._options.resetPitch,
            duration: 1000,
            easing: (t) => t * (2 - t), // easeOutQuad
          });
        }

        return false;
      };
    }

    return this._container;
  }

  onRemove(): void {
    this._defaultControl.onRemove();
    this._container?.remove();
    this._map = undefined;
  }

  getDefaultPosition(): 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' {
    return 'top-right';
  }
}
