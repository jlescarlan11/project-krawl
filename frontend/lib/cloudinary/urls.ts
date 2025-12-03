/**
 * Cloudinary URL Helper Utilities
 *
 * Generates optimized Cloudinary URLs with transformations for different use cases:
 * - Thumbnails
 * - Medium sizes
 * - Large sizes
 * - Responsive images
 */

/**
 * Cloudinary URL transformation options
 */
export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpg' | 'png' | 'auto';
  quality?: 'auto' | number;
  crop?: 'limit' | 'fill' | 'fit' | 'scale' | 'thumb';
  gravity?: 'auto' | 'center' | 'face' | 'faces';
}

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID or null if invalid URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Cloudinary URLs format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
    const match = url.match(/\/image\/upload\/(?:[^\/]+\/)*([^\/]+)$/);
    if (match && match[1]) {
      // Remove file extension if present
      return match[1].replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Build Cloudinary transformation string from options
 * @param options - Transformation options
 * @returns Transformation string
 */
function buildTransformationString(options: CloudinaryTransformOptions): string {
  const parts: string[] = [];

  if (options.width) {
    parts.push(`w_${options.width}`);
  }
  if (options.height) {
    parts.push(`h_${options.height}`);
  }
  if (options.format) {
    parts.push(`f_${options.format}`);
  }
  if (options.quality) {
    if (options.quality === 'auto') {
      parts.push('q_auto');
    } else {
      parts.push(`q_${options.quality}`);
    }
  }
  if (options.crop) {
    parts.push(`c_${options.crop}`);
  }
  if (options.gravity) {
    parts.push(`g_${options.gravity}`);
  }

  return parts.join(',');
}

/**
 * Generate Cloudinary URL with transformations
 * @param publicIdOrUrl - Public ID or full Cloudinary URL
 * @param options - Transformation options
 * @returns Optimized Cloudinary URL
 */
export function getOptimizedUrl(
  publicIdOrUrl: string,
  options: CloudinaryTransformOptions = {}
): string {
  // Return empty string for invalid input
  if (!publicIdOrUrl || typeof publicIdOrUrl !== 'string') {
    console.warn('[Cloudinary] Invalid publicIdOrUrl provided');
    return '';
  }

  // Extract public ID if URL is provided
  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.startsWith('http')) {
    const extracted = extractPublicIdFromUrl(publicIdOrUrl);
    if (extracted) {
      publicId = extracted;
    } else {
      // If we can't extract from URL, check if it's already a valid Cloudinary URL
      // If it's a Cloudinary URL but extraction failed, return as-is
      if (publicIdOrUrl.includes('res.cloudinary.com')) {
        return publicIdOrUrl;
      }
      // Otherwise, log warning and return empty string
      console.warn('[Cloudinary] Could not extract public ID from URL:', publicIdOrUrl);
      return '';
    }
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.warn('[Cloudinary] Cloud name not configured, returning original URL');
    return publicIdOrUrl.startsWith('http') ? publicIdOrUrl : '';
  }

  // Validate public ID doesn't contain invalid characters
  if (!publicId || publicId.trim() === '') {
    console.warn('[Cloudinary] Empty public ID');
    return '';
  }

  const transformation = buildTransformationString(options);
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  if (transformation) {
    return `${baseUrl}/${transformation}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
}

/**
 * Generate thumbnail URL (300x300, filled crop)
 * @param publicIdOrUrl - Public ID or full Cloudinary URL
 * @param size - Thumbnail size (default: 300)
 * @returns Thumbnail URL
 */
export function getThumbnailUrl(
  publicIdOrUrl: string,
  size: number = 300
): string {
  return getOptimizedUrl(publicIdOrUrl, {
    width: size,
    height: size,
    format: 'webp',
    quality: 'auto',
    crop: 'fill',
    gravity: 'auto',
  });
}

/**
 * Generate medium size URL (800px width, limit crop)
 * @param publicIdOrUrl - Public ID or full Cloudinary URL
 * @param width - Medium width (default: 800)
 * @returns Medium size URL
 */
export function getMediumUrl(
  publicIdOrUrl: string,
  width: number = 800
): string {
  return getOptimizedUrl(publicIdOrUrl, {
    width,
    format: 'webp',
    quality: 'auto',
    crop: 'limit',
  });
}

/**
 * Generate large size URL (1920px width, limit crop)
 * @param publicIdOrUrl - Public ID or full Cloudinary URL
 * @param width - Large width (default: 1920)
 * @returns Large size URL
 */
export function getLargeUrl(
  publicIdOrUrl: string,
  width: number = 1920
): string {
  return getOptimizedUrl(publicIdOrUrl, {
    width,
    format: 'webp',
    quality: 'auto',
    crop: 'limit',
  });
}

/**
 * Generate responsive srcset for an image
 * @param publicIdOrUrl - Public ID or full Cloudinary URL
 * @param sizes - Array of widths for responsive images
 * @returns Srcset string
 */
export function getResponsiveSrcset(
  publicIdOrUrl: string,
  sizes: number[] = [300, 600, 800, 1200, 1920]
): string {
  return sizes
    .map((width) => {
      const url = getOptimizedUrl(publicIdOrUrl, {
        width,
        format: 'webp',
        quality: 'auto',
        crop: 'limit',
      });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * @param breakpoints - Breakpoint configuration
 * @returns Sizes attribute string
 */
export function getResponsiveSizes(
  breakpoints: Array<{ maxWidth?: number; size: string }> = [
    { maxWidth: 640, size: '100vw' },
    { maxWidth: 1024, size: '50vw' },
    { size: '33vw' },
  ]
): string {
  return breakpoints
    .map((bp) => {
      if (bp.maxWidth) {
        return `(max-width: ${bp.maxWidth}px) ${bp.size}`;
      }
      return bp.size;
    })
    .join(', ');
}

/**
 * Generate optimized avatar URL
 * Transforms Cloudinary URLs to optimized versions, leaves other URLs as-is
 * @param avatarUrl - Avatar URL (Cloudinary, Google, UI Avatars, etc.)
 * @param size - Avatar size (default: 128)
 * @returns Optimized avatar URL or original URL if not Cloudinary
 */
export function getAvatarUrl(
  avatarUrl: string | null | undefined,
  size: number = 128
): string | undefined {
  // Return undefined for null/undefined/empty strings
  if (!avatarUrl || typeof avatarUrl !== 'string' || avatarUrl.trim() === '') {
    return undefined;
  }

  // If it's a Cloudinary URL, transform it
  if (avatarUrl.includes('res.cloudinary.com')) {
    const optimizedUrl = getOptimizedUrl(avatarUrl, {
      width: size,
      height: size,
      format: 'webp',
      quality: 'auto',
      crop: 'fill',
      gravity: 'face', // Focus on face for avatars
    });
    // If optimization failed (empty string), return original URL
    return optimizedUrl || avatarUrl;
  }

  // For non-Cloudinary URLs (Google profile pictures, UI Avatars, etc.), return as-is
  return avatarUrl;
}

