import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSaveDraft } from '@/hooks/useSaveDraft';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

describe('useSaveDraft Hook', () => {
  const mockSaveDraft = vi.fn();
  let originalDateNow: () => number;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup useSession mock
    const { useSession } = await import('next-auth/react');
    (useSession as any).mockReturnValue({
      data: { user: { id: 'user-1', name: 'Test User' } },
      status: 'authenticated',
    });

    // Mock Date.now for consistent timestamps
    originalDateNow = Date.now;
    Date.now = vi.fn(() => 1704067200000); // 2024-01-01 00:00:00
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  describe('Initial State', () => {
    it('should have idle status initially', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'idle',
          error: null,
          lastSavedAt: null,
        })
      );

      expect(result.current.buttonText).toBe('Save Draft');
      expect(result.current.buttonVariant).toBe('outline');
      expect(result.current.isDisabled).toBe(false);
      expect(result.current.buttonClassName).toBe('');
      expect(result.current.showIcon).toBe(false);
    });

    it('should return null when user is not authenticated', async () => {
      const { useSession } = await import('next-auth/react');
      (useSession as any).mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'idle',
          error: null,
          lastSavedAt: null,
        })
      );

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Saving State', () => {
    it('should show "Saving..." when status is saving', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'saving',
          error: null,
          lastSavedAt: null,
        })
      );

      expect(result.current.buttonText).toBe('Saving...');
      expect(result.current.isDisabled).toBe(true);
      expect(result.current.showIcon).toBe(true); // Loading spinner
    });

    it('should disable button while saving', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'saving',
          error: null,
          lastSavedAt: null,
        })
      );

      expect(result.current.isDisabled).toBe(true);
    });

    it('should call saveDraft when handleSave is called', async () => {
      mockSaveDraft.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'idle',
          error: null,
          lastSavedAt: null,
        })
      );

      await act(async () => {
        await result.current.handleSave();
      });

      expect(mockSaveDraft).toHaveBeenCalledTimes(1);
    });
  });

  describe('Saved State', () => {
    it('should show "Draft Saved" when status is saved', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'saved',
          error: null,
          lastSavedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
        })
      );

      expect(result.current.buttonText).toBe('Draft Saved');
      expect(result.current.buttonVariant).toBe('primary');
      expect(result.current.buttonClassName).toContain('bg-green-500');
    });

    it('should show success message for 3 seconds then revert', async () => {
      vi.useFakeTimers();

      const { result, rerender } = renderHook(
        ({ status }) =>
          useSaveDraft({
            saveDraft: mockSaveDraft,
            status,
            error: null,
            lastSavedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
          }),
        {
          initialProps: { status: 'idle' as const },
        }
      );

      // Initially idle
      expect(result.current.buttonText).toBe('Save Draft');

      // Update to saved
      rerender({ status: 'saved' as const });
      expect(result.current.buttonText).toBe('Draft Saved');

      // After 3 seconds, should revert to "Save Draft"
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.showSavedMessage).toBe(false);

      vi.useRealTimers();
    });

    it('should format last saved timestamp for tooltip', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'saved',
          error: null,
          lastSavedAt: oneHourAgo,
        })
      );

      expect(result.current.buttonTitle).toContain('Last saved');
      expect(result.current.buttonTitle).toContain('ago');
    });

    it('should not show timestamp if lastSavedAt is null', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'saved',
          error: null,
          lastSavedAt: null,
        })
      );

      expect(result.current.buttonTitle).toBeUndefined();
    });
  });

  describe('Error State', () => {
    it('should show "Retry Save" when status is error', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'error',
          error: 'Failed to save draft',
          lastSavedAt: null,
        })
      );

      expect(result.current.buttonText).toBe('Retry Save');
      expect(result.current.buttonVariant).toBe('primary');
      expect(result.current.buttonClassName).toContain('bg-red-500');
    });

    it('should show error message in tooltip', () => {
      const errorMessage = 'Network error occurred';

      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'error',
          error: errorMessage,
          lastSavedAt: null,
        })
      );

      expect(result.current.buttonTitle).toBe(errorMessage);
    });

    it('should prioritize error message over last saved time in tooltip', () => {
      const errorMessage = 'Failed to save';
      const lastSaved = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'error',
          error: errorMessage,
          lastSavedAt: lastSaved,
        })
      );

      expect(result.current.buttonTitle).toBe(errorMessage);
    });
  });

  describe('Success Duration Configuration', () => {
    it('should use custom success duration if provided', async () => {
      vi.useFakeTimers();

      const { result, rerender } = renderHook(
        ({ status }) =>
          useSaveDraft({
            saveDraft: mockSaveDraft,
            status,
            error: null,
            lastSavedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
            successDuration: 5000, // Custom 5 second duration
          }),
        {
          initialProps: { status: 'idle' as const },
        }
      );

      // Update to saved
      rerender({ status: 'saved' as const });
      expect(result.current.buttonText).toBe('Draft Saved');

      // After 3 seconds (default), should still show "Draft Saved"
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(result.current.buttonText).toBe('Draft Saved');

      // After 5 seconds (custom), should hide
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current.showSavedMessage).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('Button Variants', () => {
    it('should return outline variant for idle state', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'idle',
          error: null,
          lastSavedAt: null,
        })
      );

      expect(result.current.buttonVariant).toBe('outline');
    });

    it('should return primary variant for saved state', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'saved',
          error: null,
          lastSavedAt: new Date().toISOString(),
        })
      );

      expect(result.current.buttonVariant).toBe('primary');
    });

    it('should return primary variant for error state', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'error',
          error: 'Error',
          lastSavedAt: null,
        })
      );

      expect(result.current.buttonVariant).toBe('primary');
    });
  });

  describe('Cleanup', () => {
    it('should cleanup timeout on unmount', () => {
      vi.useFakeTimers();
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount, rerender } = renderHook(
        ({ status }) =>
          useSaveDraft({
            saveDraft: mockSaveDraft,
            status,
            error: null,
            lastSavedAt: new Date().toISOString(),
          }),
        {
          initialProps: { status: 'idle' as const },
        }
      );

      // Update to saved (starts timer)
      rerender({ status: 'saved' as const });

      // Unmount before timer completes
      unmount();

      // Should have cleared the timeout
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
      vi.useRealTimers();
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid date gracefully', () => {
      const { result } = renderHook(() =>
        useSaveDraft({
          saveDraft: mockSaveDraft,
          status: 'saved',
          error: null,
          lastSavedAt: 'invalid-date',
        })
      );

      // Should not crash, just not show timestamp
      expect(result.current.buttonTitle).toBeUndefined();
    });

    it('should clear saved message when timer completes', async () => {
      vi.useFakeTimers();

      const { result, rerender } = renderHook(
        ({ status }) =>
          useSaveDraft({
            saveDraft: mockSaveDraft,
            status,
            error: null,
            lastSavedAt: new Date().toISOString(),
          }),
        {
          initialProps: { status: 'idle' as const },
        }
      );

      // Update to saved
      rerender({ status: 'saved' as const });
      expect(result.current.buttonText).toBe('Draft Saved');
      expect(result.current.showSavedMessage).toBe(true);

      // After full timeout
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(result.current.showSavedMessage).toBe(false);

      vi.useRealTimers();
    });
  });
});
