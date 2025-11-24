# Authentication Components

Authentication-related UI components for the Krawl application. These components handle user sign-in, error display, and authentication state management.

## Components

### AuthErrorDisplay

Displays user-friendly error messages for authentication errors with retry and dismiss functionality.

**Location:** `components/auth/AuthErrorDisplay.tsx`

**Purpose:**
- Shows authentication error messages to users
- Provides retry functionality for transient errors
- Allows users to dismiss error messages
- Includes actionable guidance for resolving errors

**Usage:**
```tsx
import { AuthErrorDisplay } from "@/components/auth";

function SignInPage() {
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => {
    setError(null);
    // Retry sign-in logic
  };

  const handleDismiss = () => {
    setError(null);
  };

  return (
    <div>
      {error && (
        <AuthErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={handleDismiss}
          showRetry={true}
        />
      )}
    </div>
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `string` | **required** | Authentication error code (e.g., "AccessDenied", "NetworkError") |
| `onRetry?` | `() => void` | `undefined` | Callback function called when user clicks "Try Again" |
| `onDismiss?` | `() => void` | `undefined` | Callback function called when user clicks "Dismiss" |
| `showRetry?` | `boolean` | `true` | Whether to show retry/dismiss buttons for retryable errors |
| `className?` | `string` | `undefined` | Additional CSS classes |

**Supported Error Codes:**

The component supports all authentication error codes defined in `@/lib/auth-error-handler`:

**NextAuth.js Error Codes:**
- `Configuration` - Authentication configuration error
- `AccessDenied` - User denied access to Google account
- `Verification` - Account verification failed
- `Default` - Generic authentication error

**Application-Specific Error Codes:**
- `NetworkError` - Network connection error
- `TokenValidationFailed` - JWT token validation failed
- `SessionCreationFailed` - Session creation failed
- `AccountCreationFailed` - Account creation failed
- `InvalidCredentials` - Invalid authentication credentials
- `PopupBlocked` - Browser popup blocker detected
- `CookieBlocked` - Browser cookies blocked
- `CorsError` - CORS (Cross-Origin Resource Sharing) error
- `RateLimited` - Too many sign-in attempts
- `BackendError` - Backend server error

**Features:**
- ✅ User-friendly error messages
- ✅ Actionable guidance for resolving errors
- ✅ Retry functionality for transient errors
- ✅ Dismiss functionality to clear errors
- ✅ Accessibility support (ARIA labels, role="alert")
- ✅ Responsive design
- ✅ Consistent styling with design system

**Accessibility:**
- Uses `role="alert"` for screen reader announcements
- Includes `aria-live="polite"` for dynamic content updates
- Button labels include `aria-label` attributes
- Decorative icons marked with `aria-hidden="true"`

**Example Error Messages:**

```tsx
// Network error
<AuthErrorDisplay error="NetworkError" onRetry={handleRetry} />

// Popup blocked
<AuthErrorDisplay error="PopupBlocked" onRetry={handleRetry} />

// Access denied
<AuthErrorDisplay error="AccessDenied" onRetry={handleRetry} />
```

**Error Information Structure:**

Each error code maps to an `ErrorInfo` object containing:
- `code` - Error code
- `title` - Error title (e.g., "Network Error")
- `message` - User-friendly error message
- `severity` - Error severity ("transient" | "permanent" | "user-action")
- `retryable` - Whether the error can be retried
- `actionable` - Actionable guidance for resolving the error

**Styling:**
- Uses design system error colors
- Consistent with application design tokens
- Responsive layout
- Accessible color contrast

---

### GoogleSignInButton

Button component for initiating Google OAuth sign-in flow.

**Location:** `components/auth/GoogleSignInButton.tsx`

**Usage:**
```tsx
import { GoogleSignInButton } from "@/components/auth";

function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleSignInButton onClick={handleSignIn} loading={isLoading} />
  );
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `() => void` | **required** | Callback function called when button is clicked |
| `loading?` | `boolean` | `false` | Whether sign-in is in progress |
| `disabled?` | `boolean` | `false` | Whether button is disabled |
| `className?` | `string` | `undefined` | Additional CSS classes |

**Features:**
- ✅ Google branding and styling
- ✅ Loading state support
- ✅ Disabled state support
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ Responsive design

---

## Error Handling Integration

The authentication components integrate with the error handling system:

**Error Detection:**
- Edge case detection (popup blocker, cookie blocking, browser compatibility)
- Network error detection
- Backend error mapping
- CORS error detection

**Error Recovery:**
- Retry functionality for transient errors
- Error state management
- URL parameter error handling
- Component state error handling

**Error Logging:**
- Sentry integration for error tracking
- Comprehensive error context
- Error code tagging
- User action tracking

**Related Utilities:**
- `@/lib/auth-edge-cases` - Edge case detection utilities
- `@/lib/auth-error-handler` - Error handling and mapping utilities
- `@/lib/auth` - Authentication utilities

---

## Integration

All authentication components are exported from the main components index:

```tsx
import { AuthErrorDisplay, GoogleSignInButton } from "@/components/auth";
```

Components are used in:
- `/auth/sign-in` - Sign-in page
- `/auth/callback` - OAuth callback page
- Other authentication-related pages

---

## Documentation

**Related Documentation:**
- [Error Handling Guide](../../lib/auth-error-handler.ts) - Error code definitions and handling
- [Edge Case Detection](../../lib/auth-edge-cases.ts) - Edge case detection utilities
- [Authentication Flow](../../docs/SESSION_MANAGEMENT.md) - Authentication flow documentation
- [API Documentation](../../../docs/private-docs/technical/API_DOCUMENTATION.md) - Backend API documentation

---

## Accessibility

All authentication components follow WCAG 2.1 Level AA guidelines:

- ✅ Keyboard navigation support
- ✅ Screen reader support (ARIA labels)
- ✅ Focus management
- ✅ Color contrast compliance
- ✅ Semantic HTML

---

## Testing

**Manual Testing:**
- Test all error codes display correctly
- Test retry functionality
- Test dismiss functionality
- Test accessibility with screen readers
- Test responsive design

**Future:**
- Unit tests for component rendering
- Integration tests for error flows
- Accessibility tests

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-27 | Initial implementation (TASK-045) |

---

**Last Updated:** 2025-01-27  
**Status:** ✅ **Current**

