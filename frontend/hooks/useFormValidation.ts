"use client";

import { useState, useCallback, useMemo, useEffect } from "react";

export interface FormFieldErrors {
  [fieldName: string]: string;
}

export interface UseFormValidationOptions<T extends Record<string, any>> {
  /** Initial field values */
  initialValues: T;
  /** Validation function that returns field errors */
  validate: (values: T) => FormFieldErrors;
  /** Whether to validate on mount */
  validateOnMount?: boolean;
}

export interface UseFormValidationReturn<T extends Record<string, any>> {
  /** Current field values */
  values: T;
  /** Field errors */
  errors: FormFieldErrors;
  /** Touched fields */
  touched: Record<keyof T, boolean>;
  /** Set field value */
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Set multiple field values */
  setValues: (values: Partial<T>) => void;
  /** Mark field as touched */
  setTouched: (field: keyof T, touched: boolean) => void;
  /** Mark multiple fields as touched */
  setTouchedFields: (fields: Partial<Record<keyof T, boolean>>) => void;
  /** Check if field should show error */
  shouldShowError: (field: keyof T) => boolean;
  /** Check if field is valid */
  isFieldValid: (field: keyof T, value?: any) => boolean;
  /** Validate all fields */
  validateFields: () => boolean;
  /** Reset form */
  reset: () => void;
  /** Check if form is valid */
  isValid: boolean;
}

/**
 * useFormValidation Hook
 *
 * A reusable hook for form validation with touched state management.
 * Provides consistent validation patterns across form components.
 *
 * @example
 * ```tsx
 * const {
 *   values,
 *   errors,
 *   touched,
 *   setValue,
 *   setTouched,
 *   shouldShowError,
 *   isFieldValid,
 *   validateFields,
 *   isValid,
 * } = useFormValidation({
 *   initialValues: { name: "", email: "" },
 *   validate: (values) => {
 *     const errors: FormFieldErrors = {};
 *     if (!values.name) errors.name = "Name is required";
 *     if (!values.email) errors.email = "Email is required";
 *     return errors;
 *   },
 * });
 * ```
 */
export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validate,
  validateOnMount = false,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormFieldErrors>({});
  const [touched, setTouchedState] = useState<Record<keyof T, boolean>>(
    () => {
      const touched: Record<keyof T, boolean> = {} as Record<keyof T, boolean>;
      for (const key in initialValues) {
        touched[key] = false;
      }
      return touched;
    }
  );

  const validateFields = useCallback(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validate]);

  // Validate on mount if requested
  useEffect(() => {
    if (validateOnMount) {
      const newErrors = validate(initialValues);
      setErrors(newErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState((prev) => ({ ...prev, [field]: value }));
    // Auto-mark as touched when value changes
    setTouchedState((prev) => ({ ...prev, [field]: true }));
  }, []);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const setTouched = useCallback((field: keyof T, isTouched: boolean) => {
    setTouchedState((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  const setTouchedFields = useCallback(
    (fields: Partial<Record<keyof T, boolean>>) => {
      setTouchedState((prev) => ({ ...prev, ...fields }));
    },
    []
  );

  const shouldShowError = useCallback(
    (field: keyof T): boolean => {
      return touched[field] && !!errors[field as string];
    },
    [touched, errors]
  );

  const isFieldValid = useCallback(
    (field: keyof T, value?: any): boolean => {
      if (!touched[field]) return false;
      const fieldValue = value !== undefined ? value : values[field];
      return !errors[field as string] && fieldValue !== undefined && fieldValue !== null && fieldValue !== "";
    },
    [touched, errors, values]
  );

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setErrors({});
    setTouchedState(() => {
      const touched: Record<keyof T, boolean> = {} as Record<keyof T, boolean>;
      for (const key in initialValues) {
        touched[key] = false;
      }
      return touched;
    });
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Re-validate when values change (using useEffect would be better, but keeping it simple for now)
  // Components should call validateFields() when needed via useEffect

  return {
    values,
    errors,
    touched,
    setValue,
    setValues,
    setTouched,
    setTouchedFields,
    shouldShowError,
    isFieldValid,
    validateFields,
    reset,
    isValid,
  };
}

