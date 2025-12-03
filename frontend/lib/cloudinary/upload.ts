/**
 * Cloudinary Upload Utilities
 *
 * Handles uploading images to Cloudinary with progress tracking,
 * error handling, and retry logic.
 */

/**
 * Upload progress callback
 */
export interface UploadProgress {
  file: File;
  fileIndex: number;
  progress: number; // 0-100
  status: 'uploading' | 'success' | 'error';
  url?: string;
  publicId?: string; // Cloudinary public ID
  error?: string;
}

/**
 * Upload result for a single file
 */
export interface UploadResult {
  file: File;
  url: string;
  publicId: string;
  success: boolean;
  error?: string;
}

/**
 * Batch upload result
 */
export interface BatchUploadResult {
  success: boolean;
  results: UploadResult[];
  errors: Array<{ file: File; error: string }>;
}

/**
 * Upload options
 */
export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (result: UploadResult) => void;
  onError?: (error: string, file: File) => void;
  maxRetries?: number;
  timeout?: number; // milliseconds
}

/**
 * Get Cloudinary configuration from environment variables
 */
function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error('Cloudinary config:', { cloudName, uploadPreset });
    throw new Error(
      'Cloudinary configuration missing. Please check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env'
    );
  }

  console.log('[Cloudinary] Using config:', { cloudName, uploadPreset });
  return { cloudName, uploadPreset };
}

/**
 * Upload a single file to Cloudinary with progress tracking
 *
 * @param file - File to upload
 * @param fileIndex - Index of file in batch (for progress tracking)
 * @param options - Upload options
 * @returns Upload result
 */
export async function uploadSingleFile(
  file: File,
  fileIndex: number,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    onProgress,
    onComplete,
    onError,
    maxRetries = 3,
    timeout = 60000,
  } = options;

  const { cloudName, uploadPreset } = getCloudinaryConfig();
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!file.type || !allowedTypes.some(type => file.type.toLowerCase().includes(type.split('/')[1]))) {
    const error = `Invalid file type "${file.type}". Only JPEG, PNG, WebP, and GIF images are allowed.`;
    onError?.(error, file);
    return { file, url: '', publicId: '', success: false, error };
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const error = `File "${file.name}" is too large (${fileSizeMB}MB). Maximum size is 5MB.`;
    onError?.(error, file);
    return { file, url: '', publicId: '', success: false, error };
  }

  // Validate file name
  if (!file.name || file.name.trim().length === 0) {
    const error = 'Invalid file name. Please rename the file and try again.';
    onError?.(error, file);
    return { file, url: '', publicId: '', success: false, error };
  }

  let lastError: string = '';
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'krawl-gems'); // Store in specific folder
      
      // Note: Transformations are not allowed in unsigned uploads
      // Configure transformations in the upload preset or apply via URL transformations when displaying

      // Create XMLHttpRequest for progress tracking
      const result = await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Set timeout
        xhr.timeout = timeout;

        // Upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress?.({
              file,
              fileIndex,
              progress: percentComplete,
              status: 'uploading',
            });
          }
        });

        // Upload complete
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              const result: UploadResult = {
                file,
                url: response.secure_url,
                publicId: response.public_id,
                success: true,
              };

              onProgress?.({
                file,
                fileIndex,
                progress: 100,
                status: 'success',
                url: response.secure_url,
                publicId: response.public_id,
              });

              onComplete?.(result);
              resolve(result);
            } catch (err) {
              const error = 'Failed to parse upload response';
              console.error('[Cloudinary] Parse error:', err, xhr.responseText);
              reject(new Error(error));
            }
          } else {
            let errorMessage = `Upload failed with status ${xhr.status}`;
            
            // Handle different HTTP status codes
            if (xhr.status === 400) {
              errorMessage = 'Invalid request. Please check your file and try again.';
            } else if (xhr.status === 401) {
              errorMessage = 'Authentication failed. Please check your Cloudinary configuration.';
            } else if (xhr.status === 403) {
              errorMessage = 'Upload forbidden. Please check your upload preset permissions.';
            } else if (xhr.status === 413) {
              errorMessage = 'File too large. Maximum file size is 5MB.';
            } else if (xhr.status >= 500) {
              errorMessage = 'Cloudinary server error. Please try again in a few moments.';
            }
            
            // Try to parse error response for more details
            const responseText = xhr.responseText?.trim();
            
            // Skip if response is empty or just an empty object
            if (responseText && responseText !== '{}' && responseText !== '') {
              try {
                const errorResponse = JSON.parse(responseText);
                
                // Only process if there's actual content (not just empty object)
                const hasContent = Object.keys(errorResponse).length > 0;
                if (hasContent) {
                  console.error('[Cloudinary] Error response:', errorResponse);
                  
                  // Extract error message from various possible structures
                  if (errorResponse.error?.message) {
                    errorMessage = errorResponse.error.message;
                  } else if (errorResponse.message) {
                    errorMessage = errorResponse.message;
                  } else if (typeof errorResponse.error === 'string') {
                    errorMessage = errorResponse.error;
                  }
                }
                // If empty object, just use status-based message (already set above)
              } catch (parseError) {
                // If responseText is not valid JSON, log it for debugging
                console.error('[Cloudinary] Raw error response (non-JSON):', responseText);
                // Keep the status-based error message
              }
            }
            
            // Log the error with status code (only once, not for empty objects)
            if (!responseText || responseText === '{}' || responseText === '') {
              console.error(`[Cloudinary] Upload failed with status ${xhr.status} (no response body)`);
            }
            
            reject(new Error(errorMessage));
          }
        });

        // Upload error
        xhr.addEventListener('error', () => {
          const error = xhr.status === 0 
            ? 'Network error: Unable to connect to Cloudinary. Please check your internet connection.'
            : `Network error during upload (HTTP ${xhr.status})`;
          reject(new Error(error));
        });

        // Upload timeout
        xhr.addEventListener('timeout', () => {
          reject(new Error(`Upload timeout after ${timeout}ms. The file may be too large or your connection is slow.`));
        });

        // Upload aborted
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload was cancelled'));
        });

        // Send request
        xhr.open('POST', uploadUrl);
        xhr.send(formData);
      });

      return result;
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Unknown error';
      retryCount++;

      // If not last retry, wait before retrying (exponential backoff)
      if (retryCount <= maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  const error = `Upload failed after ${maxRetries} retries: ${lastError}`;
  onError?.(error, file);
  onProgress?.({
    file,
    fileIndex,
    progress: 0,
    status: 'error',
    error,
  });

  return { file, url: '', publicId: '', success: false, error };
}

/**
 * Upload multiple files to Cloudinary with progress tracking
 *
 * @param files - Array of files to upload
 * @param options - Upload options
 * @returns Batch upload result
 */
export async function uploadMultipleFiles(
  files: File[],
  options: UploadOptions = {}
): Promise<BatchUploadResult> {
  if (files.length === 0) {
    return {
      success: true,
      results: [],
      errors: [],
    };
  }

  // Upload files in parallel
  const uploadPromises = files.map((file, index) =>
    uploadSingleFile(file, index, options)
  );

  const results = await Promise.all(uploadPromises);

  // Separate successful uploads from errors
  const successfulResults = results.filter((r) => r.success);
  const errors = results
    .filter((r) => !r.success)
    .map((r) => ({ file: r.file, error: r.error || 'Unknown error' }));

  return {
    success: errors.length === 0,
    results: successfulResults,
    errors,
  };
}

/**
 * Retry a failed upload
 *
 * @param file - File to retry
 * @param fileIndex - Index of file
 * @param options - Upload options
 * @returns Upload result
 */
export async function retryUpload(
  file: File,
  fileIndex: number,
  options: UploadOptions = {}
): Promise<UploadResult> {
  return uploadSingleFile(file, fileIndex, options);
}

/**
 * Cancel an ongoing upload (placeholder for future implementation)
 * Note: Currently XHR uploads cannot be easily cancelled once started
 * This would require storing XHR references and calling abort()
 */
export function cancelUpload(fileIndex: number): void {
  // TODO: Implement cancel logic with XHR reference storage
  console.warn('Cancel upload not yet implemented');
}
