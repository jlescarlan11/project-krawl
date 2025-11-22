/**
 * Form validation error handling utilities for Krawl application.
 * 
 * Provides functions to parse and handle form validation errors
 * from API responses and map them to form fields.
 */

import type { ApiError } from "./api-error-handler";
import { API_ERROR_CODES } from "./api-error-handler";

/**
 * Field-level error structure.
 */
export interface FieldError {
  /** Field name */
  field: string;
  /** Error message for this field */
  message: string;
}

/**
 * Form errors mapped by field name.
 */
export interface FormErrors {
  [fieldName: string]: string;
}

/**
 * Parses validation errors from an ApiError into field-level errors.
 * 
 * Extracts field-level errors from API error response details.
 * 
 * @param error - ApiError containing validation errors
 * @returns FormErrors object with field names as keys and error messages as values
 * 
 * @example
 * ```typescript
 * try {
 *   await submitForm(data);
 * } catch (error) {
 *   const apiError = await handleApiError(error);
 *   const formErrors = parseValidationErrors(apiError);
 *   setFieldErrors(formErrors);
 * }
 * ```
 */
export function parseValidationErrors(error: ApiError): FormErrors {
  const formErrors: FormErrors = {};

  // Check if error has validation details
  if (!error.details || error.code !== API_ERROR_CODES.VALIDATION_ERROR) {
    return formErrors;
  }

  // Extract field-level errors from details
  for (const [field, errorValue] of Object.entries(error.details)) {
    if (Array.isArray(errorValue)) {
      // Multiple errors for this field - use first one
      formErrors[field] = errorValue[0] || "Invalid value";
    } else if (typeof errorValue === "string") {
      // Single error message
      formErrors[field] = errorValue;
    }
  }

  return formErrors;
}

/**
 * Gets the error message for a specific form field.
 * 
 * @param errors - FormErrors object
 * @param field - Field name to get error for
 * @returns Error message for the field, or undefined if no error
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * const emailError = getFieldError(formErrors, "email");
 * if (emailError) {
 *   setEmailError(emailError);
 * }
 * ```
 */
export function getFieldError(
  errors: FormErrors,
  field: string
): string | undefined {
  return errors[field];
}

/**
 * Checks if a form has any errors.
 * 
 * @param errors - FormErrors object
 * @returns True if form has errors, false otherwise
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * if (hasFormErrors(formErrors)) {
 *   showFormErrors(formErrors);
 * }
 * ```
 */
export function hasFormErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Gets all error messages from a form errors object.
 * 
 * @param errors - FormErrors object
 * @returns Array of all error messages
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * const allErrors = getAllErrorMessages(formErrors);
 * showToast(allErrors.join(", "));
 * ```
 */
export function getAllErrorMessages(errors: FormErrors): string[] {
  return Object.values(errors);
}

/**
 * Clears errors for a specific field.
 * 
 * @param errors - FormErrors object (will be mutated)
 * @param field - Field name to clear errors for
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * clearFieldError(formErrors, "email");
 * ```
 */
export function clearFieldError(
  errors: FormErrors,
  field: string
): void {
  delete errors[field];
}

/**
 * Clears all form errors.
 * 
 * @param errors - FormErrors object (will be mutated)
 * 
 * @example
 * ```typescript
 * const formErrors = parseValidationErrors(apiError);
 * clearAllErrors(formErrors);
 * ```
 */
export function clearAllErrors(errors: FormErrors): void {
  Object.keys(errors).forEach((field) => {
    delete errors[field];
  });
}

