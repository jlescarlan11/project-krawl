import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import { DraftsList } from '@/components/shared/creation/DraftsList';
import type { Draft } from '@/lib/types/draft';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock formatDistanceToNow and format from date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn((date: Date) => '2 hours ago'),
  format: vi.fn((date: Date, formatStr: string) => 'Jan 15, 2025'),
}));

describe('DraftsList Component', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockLoadDraftFromBackend = vi.fn();
  const mockListDrafts = vi.fn();
  const mockDeleteDraft = vi.fn();

  const mockDrafts: Draft[] = [
    {
      id: 'draft-1',
      userId: 'user-1',
      type: 'gem',
      data: {
        currentStep: 0,
        details: {
          name: 'Test Gem Draft',
        },
      },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22 hours ago
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now (not expiring soon)
    },
    {
      id: 'draft-2',
      userId: 'user-1',
      type: 'gem',
      data: {
        currentStep: 2,
        location: {
          address: '123 Main St, City, Country',
        },
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 33 * 60 * 60 * 1000).toISOString(), // 33 hours ago
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now (expiring soon!)
    },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup useSession mock
    const { useSession } = await import('next-auth/react');
    (useSession as any).mockReturnValue({
      data: { user: { id: 'user-1', name: 'Test User' } },
      status: 'authenticated',
    });

    // Setup useRouter mock
    const { useRouter } = await import('next/navigation');
    (useRouter as any).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading spinner while loading drafts', () => {
      mockListDrafts.mockReturnValue(new Promise(() => {})); // Never resolves

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Preview'}
          createRoute="/gems/create"
          emptyMessage="No gem drafts"
        />
      );

      expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveClass('animate-spin');
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no drafts exist', async () => {
      mockListDrafts.mockResolvedValue({ success: true, drafts: [] });

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Preview'}
          createRoute="/gems/create"
          emptyMessage="Your saved gem creation drafts will appear here."
        />
      );

      await waitFor(() => {
        expect(screen.getByText('No drafts')).toBeInTheDocument();
      });

      expect(screen.getByText('Your saved gem creation drafts will appear here.')).toBeInTheDocument();
    });

    it('should display sign-in message when user is not authenticated', async () => {
      const { useSession } = await import('next-auth/react');
      vi.mocked(useSession).mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: vi.fn(),
      } as any);

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Preview'}
          createRoute="/gems/create"
          emptyMessage="No gem drafts"
        />
      );

      expect(screen.getByText('Please sign in to view your drafts.')).toBeInTheDocument();
    });
  });

  describe('Draft List Rendering', () => {
    beforeEach(() => {
      mockListDrafts.mockResolvedValue({ success: true, drafts: mockDrafts });
    });

    it('should render draft list with correct count', async () => {
      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => ['Location', 'Basic Info', 'Media', 'Details'][step]}
          getDraftPreview={(draft: Draft) =>
            draft.data.details?.name || draft.data.location?.address?.split(',')[0] || 'Untitled'
          }
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Saved Drafts \(2\)/)).toBeInTheDocument();
      });
    });

    it('should render each draft with correct preview and step info', async () => {
      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => ['Location', 'Basic Info', 'Media', 'Details'][step]}
          getDraftPreview={(draft: Draft) =>
            draft.data.details?.name || draft.data.location?.address?.split(',')[0] || 'Untitled'
          }
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Test Gem Draft')).toBeInTheDocument();
      });

      expect(screen.getByText('Step 1: Location')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('Step 3: Media')).toBeInTheDocument();
    });

    it('should display expiring soon warning for drafts expiring within 7 days', async () => {
      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => ['Location', 'Basic Info', 'Media', 'Details'][step]}
          getDraftPreview={(draft: Draft) =>
            draft.data.details?.name || draft.data.location?.address?.split(',')[0] || 'Untitled'
          }
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Expires/)).toHaveLength(1);
      });
    });

    it('should display last updated time for each draft', async () => {
      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => ['Location', 'Basic Info', 'Media', 'Details'][step]}
          getDraftPreview={(draft: Draft) =>
            draft.data.details?.name || draft.data.location?.address?.split(',')[0] || 'Untitled'
          }
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText(/Last updated/)).toHaveLength(2);
      });
    });
  });

  describe('Resume Functionality', () => {
    beforeEach(() => {
      mockListDrafts.mockResolvedValue({ success: true, drafts: mockDrafts });
      mockLoadDraftFromBackend.mockResolvedValue(undefined);
    });

    it('should call loadDraftFromBackend and navigate when resume button is clicked', async () => {
      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Resume')).toHaveLength(2);
      });

      const resumeButtons = screen.getAllByText('Resume');
      fireEvent.click(resumeButtons[0]);

      expect(mockLoadDraftFromBackend).toHaveBeenCalledWith('draft-1');

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/gems/create');
      });
    });

    it('should show loading state on resume button while loading', async () => {
      mockLoadDraftFromBackend.mockReturnValue(new Promise(() => {})); // Never resolves

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Resume')).toHaveLength(2);
      });

      const resumeButtons = screen.getAllByText('Resume');
      fireEvent.click(resumeButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('should disable buttons while loading a draft', async () => {
      mockLoadDraftFromBackend.mockReturnValue(new Promise(() => {})); // Never resolves

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Resume')).toHaveLength(2);
      });

      const resumeButtons = screen.getAllByText('Resume');
      fireEvent.click(resumeButtons[0]);

      await waitFor(() => {
        const loadingButton = screen.getByText('Loading...').closest('button');
        expect(loadingButton).toBeDisabled();
      });
    });
  });

  describe('Delete Functionality', () => {
    beforeEach(() => {
      mockListDrafts.mockResolvedValue({ success: true, drafts: mockDrafts });
      mockDeleteDraft.mockResolvedValue(undefined);

      // Mock window.confirm
      global.confirm = vi.fn().mockReturnValue(true);
    });

    afterEach(() => {
      delete (global as any).confirm;
    });

    it('should show confirmation dialog before deleting', async () => {
      

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Delete')).toHaveLength(2);
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(global.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete this draft? This action cannot be undone.'
      );
    });

    it('should call deleteDraft and reload list when confirmed', async () => {
      

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Delete')).toHaveLength(2);
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockDeleteDraft).toHaveBeenCalledWith('draft-1');
      });

      // Should reload drafts after deletion
      await waitFor(() => {
        expect(mockListDrafts).toHaveBeenCalledTimes(2); // Once on mount, once after delete
      });
    });

    it('should not delete if confirmation is cancelled', async () => {
      
      (global.confirm as any).mockReturnValue(false);

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Delete')).toHaveLength(2);
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(mockDeleteDraft).not.toHaveBeenCalled();
    });

    it('should show deleting state while deleting', async () => {
      
      mockDeleteDraft.mockReturnValue(new Promise(() => {})); // Never resolves

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Delete')).toHaveLength(2);
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Deleting...')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when loading drafts fails', async () => {
      mockListDrafts.mockResolvedValue({
        success: false,
        error: 'Network error occurred',
      });

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading drafts')).toBeInTheDocument();
      });

      expect(screen.getByText('Network error occurred')).toBeInTheDocument();
    });

    it('should display error message when API throws exception', async () => {
      mockListDrafts.mockRejectedValue(new Error('Connection failed'));

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Connection failed')).toBeInTheDocument();
      });
    });

    it('should have retry button in error state', async () => {
      
      mockListDrafts
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce({ success: true, drafts: mockDrafts });

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Try again')).toBeInTheDocument();
      });

      const retryButton = screen.getByText('Try again');
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText(/Saved Drafts/)).toBeInTheDocument();
      });
    });

    it('should display error when resume draft fails', async () => {
      
      mockListDrafts.mockResolvedValue({ success: true, drafts: mockDrafts });
      mockLoadDraftFromBackend.mockRejectedValue(new Error('Failed to load draft'));

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Resume')).toHaveLength(2);
      });

      const resumeButtons = screen.getAllByText('Resume');
      fireEvent.click(resumeButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Failed to load draft')).toBeInTheDocument();
      });
    });

    it('should display error when delete draft fails', async () => {
      
      mockListDrafts.mockResolvedValue({ success: true, drafts: mockDrafts });
      mockDeleteDraft.mockRejectedValue(new Error('Failed to delete'));
      global.confirm = vi.fn().mockReturnValue(true);

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Delete')).toHaveLength(2);
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Failed to delete')).toBeInTheDocument();
      });
    });
  });

  describe('Refresh Functionality', () => {
    beforeEach(() => {
      mockListDrafts.mockResolvedValue({ success: true, drafts: mockDrafts });
    });

    it('should have refresh button', async () => {
      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Refresh')).toBeInTheDocument();
      });
    });

    it('should reload drafts when refresh button is clicked', async () => {
      

      render(
        <DraftsList
          draftType="gem"
          listDrafts={mockListDrafts}
          deleteDraft={mockDeleteDraft}
          loadDraftFromBackend={mockLoadDraftFromBackend}
          getStepName={(step: number) => `Step ${step}`}
          getDraftPreview={(draft: Draft) => 'Test Draft'}
          createRoute="/gems/create"
          emptyMessage="No drafts"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Refresh')).toBeInTheDocument();
      });

      // Initial call on mount
      expect(mockListDrafts).toHaveBeenCalledTimes(1);

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      // Should be called again after clicking refresh
      expect(mockListDrafts).toHaveBeenCalledTimes(2);
    });
  });
});
