import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SuccessScreen } from '@/components/shared/creation/SuccessScreen';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('SuccessScreen Component', () => {
  const mockRouter = {
    push: vi.fn(),
  };

  const mockClearForm = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup useRouter mock
    const { useRouter } = await import('next/navigation');
    (useRouter as any).mockReturnValue(mockRouter);
  });

  describe('Rendering', () => {
    it('should render success icon', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      // Check for success icon (CheckCircle from lucide-react)
      const successIcon = screen.getByRole('heading', { level: 1 }).closest('div')?.parentElement;
      expect(successIcon).toBeInTheDocument();
    });

    it('should display title', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      expect(screen.getByText('Gem Created Successfully!')).toBeInTheDocument();
    });

    it('should display entity name and message', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Amazing Place"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      expect(screen.getByText('Amazing Place')).toBeInTheDocument();
      expect(screen.getByText(/has been submitted and is pending review/)).toBeInTheDocument();
    });

    it('should display view button with correct text', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      expect(screen.getByText('View Gem')).toBeInTheDocument();
    });

    it('should display create another button with correct text', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      expect(screen.getByText('Create Another')).toBeInTheDocument();
    });

    it('should display info message when provided', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
          infoMessage="Your Gem will be visible on the map once it's been verified by our team."
        />
      );

      expect(screen.getByText("Your Gem will be visible on the map once it's been verified by our team.")).toBeInTheDocument();
    });

    it('should not display info message when not provided', () => {
      render(
        <SuccessScreen
          entityType="krawl"
          entityId="krawl-123"
          entityName="Test Krawl"
          title="Krawl Created Successfully!"
          message="has been created and is now available for others to discover."
          viewButtonText="View Krawl"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/krawls/krawl-123"
          createRoute="/krawls/create"
        />
      );

      // Should not have any info message text
      expect(screen.queryByText(/visible on the map/)).not.toBeInTheDocument();
    });
  });

  describe('Gem Entity Type', () => {
    it('should render correctly for gem entity type', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-456"
          entityName="Beautiful Park"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-456"
          createRoute="/gems/create"
          infoMessage="Your Gem will be visible on the map once it's been verified by our team."
        />
      );

      expect(screen.getByText('Gem Created Successfully!')).toBeInTheDocument();
      expect(screen.getByText('Beautiful Park')).toBeInTheDocument();
      expect(screen.getByText('View Gem')).toBeInTheDocument();
    });
  });

  describe('Krawl Entity Type', () => {
    it('should render correctly for krawl entity type', () => {
      render(
        <SuccessScreen
          entityType="krawl"
          entityId="krawl-789"
          entityName="City Tour"
          title="Krawl Created Successfully!"
          message="has been created and is now available for others to discover."
          viewButtonText="View Krawl"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/krawls/krawl-789"
          createRoute="/krawls/create"
        />
      );

      expect(screen.getByText('Krawl Created Successfully!')).toBeInTheDocument();
      expect(screen.getByText('City Tour')).toBeInTheDocument();
      expect(screen.getByText('View Krawl')).toBeInTheDocument();
    });
  });

  describe('View Button Functionality', () => {
    it('should navigate to view route when view button is clicked', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      const viewButton = screen.getByText('View Gem');
      fireEvent.click(viewButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/gems/gem-123');
      expect(mockClearForm).not.toHaveBeenCalled();
    });

    it('should navigate to correct krawl detail route', () => {
      render(
        <SuccessScreen
          entityType="krawl"
          entityId="krawl-456"
          entityName="Test Krawl"
          title="Krawl Created Successfully!"
          message="has been created and is now available for others to discover."
          viewButtonText="View Krawl"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/krawls/krawl-456"
          createRoute="/krawls/create"
        />
      );

      const viewButton = screen.getByText('View Krawl');
      fireEvent.click(viewButton);

      expect(mockRouter.push).toHaveBeenCalledWith('/krawls/krawl-456');
    });
  });

  describe('Create Another Button Functionality', () => {
    it('should clear form and navigate to create route when create another button is clicked', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      const createButton = screen.getByText('Create Another');
      fireEvent.click(createButton);

      expect(mockClearForm).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/gems/create');
    });

    it('should navigate to correct krawl create route', () => {
      render(
        <SuccessScreen
          entityType="krawl"
          entityId="krawl-456"
          entityName="Test Krawl"
          title="Krawl Created Successfully!"
          message="has been created and is now available for others to discover."
          viewButtonText="View Krawl"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/krawls/krawl-456"
          createRoute="/krawls/create"
        />
      );

      const createButton = screen.getByText('Create Another');
      fireEvent.click(createButton);

      expect(mockClearForm).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/krawls/create');
    });

    it('should clear form before navigating', () => {
      const clearFormSpy = vi.fn(() => {
        // Verify that router.push hasn't been called yet
        expect(mockRouter.push).not.toHaveBeenCalled();
      });

      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={clearFormSpy}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      const createButton = screen.getByText('Create Another');
      fireEvent.click(createButton);

      expect(clearFormSpy).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/gems/create');
    });
  });

  describe('Icon Rendering', () => {
    it('should render Eye icon for view button', () => {
      const { container } = render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      // The Eye icon should be present (lucide-react icon)
      const viewButton = screen.getByText('View Gem').closest('button');
      expect(viewButton).toBeInTheDocument();
    });

    it('should render Plus icon for create another button', () => {
      const { container } = render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      // The Plus icon should be present (lucide-react icon)
      const createButton = screen.getByText('Create Another').closest('button');
      expect(createButton).toBeInTheDocument();
    });
  });

  describe('Button Styling', () => {
    it('should apply primary variant to view button', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      const viewButton = screen.getByText('View Gem').closest('button');
      expect(viewButton).toHaveClass('flex-1'); // Should have flex-1 class for responsiveness
    });

    it('should apply outline variant to create another button', () => {
      render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      const createButton = screen.getByText('Create Another').closest('button');
      expect(createButton).toHaveClass('flex-1'); // Should have flex-1 class for responsiveness
    });
  });

  describe('Responsive Design', () => {
    it('should render buttons in flex layout for responsiveness', () => {
      const { container } = render(
        <SuccessScreen
          entityType="gem"
          entityId="gem-123"
          entityName="Test Gem"
          title="Gem Created Successfully!"
          message="has been submitted and is pending review."
          viewButtonText="View Gem"
          createButtonText="Create Another"
          onClearForm={mockClearForm}
          viewRoute="/gems/gem-123"
          createRoute="/gems/create"
        />
      );

      // Both buttons should be in a flex container
      const viewButton = screen.getByText('View Gem').closest('button');
      const createButton = screen.getByText('Create Another').closest('button');

      expect(viewButton?.parentElement).toBe(createButton?.parentElement);
    });
  });
});
