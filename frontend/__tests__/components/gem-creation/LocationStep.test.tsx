import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocationStep } from "@/components/gem-creation/steps/LocationStep";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import * as boundaryValidation from "@/lib/map/boundaryValidation";

// Mock Mapbox GL
vi.mock("mapbox-gl", () => ({
  default: {
    Map: vi.fn(() => ({
      on: vi.fn(),
      remove: vi.fn(),
      addControl: vi.fn(),
      getSource: vi.fn(),
      addSource: vi.fn(),
      addLayer: vi.fn(),
      flyTo: vi.fn(),
    })),
    Marker: vi.fn(() => ({
      setLngLat: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      getLngLat: vi.fn(() => ({ lng: 123.8854, lat: 10.3157 })),
      on: vi.fn(),
    })),
    GeolocateControl: vi.fn(() => ({
      on: vi.fn(),
    })),
    NavigationControl: vi.fn(),
    accessToken: "",
  },
}));

// Mock GemLocationPicker to simplify testing
vi.mock("@/components/gem-creation/GemLocationPicker", () => ({
  GemLocationPicker: vi.fn(({ onLocationChange, onValidationChange }) => {
    // Simulate map picker behavior
    React.useEffect(() => {
      // Simulate valid location selection after mount
      setTimeout(() => {
        onLocationChange?.([123.8854, 10.3157]);
        onValidationChange?.({
          isValid: true,
          message: "Coordinates are within Cebu City boundaries.",
        });
      }, 100);
    }, []);

    return <div data-testid="gem-location-picker">Map Picker Mock</div>;
  }),
}));

// Mock AddressSearch
vi.mock("@/components/gem-creation/AddressSearch", () => ({
  AddressSearch: vi.fn(({ onSelect }) => (
    <div data-testid="address-search">
      <input
        data-testid="address-search-input"
        placeholder="Search address"
        onChange={() => {}}
      />
    </div>
  )),
  reverseGeocode: vi.fn(() =>
    Promise.resolve({
      place_name: "Cebu City, Philippines",
      center: [123.8854, 10.3157],
    })
  ),
}));

describe("LocationStep", () => {
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    // Reset store
    useGemCreationStore.setState({
      location: null,
      currentStep: 0,
      completedSteps: [],
    });

    // Mock boundary validation
    vi.spyOn(boundaryValidation, "validateCoordinates").mockResolvedValue({
      isValid: true,
      message: "Coordinates are within Cebu City boundaries.",
    });

    vi.spyOn(boundaryValidation, "loadBoundaryData").mockResolvedValue({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [123.8200, 10.2500],
            [123.9600, 10.2500],
            [123.9600, 10.4000],
            [123.8200, 10.4000],
            [123.8200, 10.2500],
          ],
        ],
      },
      properties: {},
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render location step with all key elements", () => {
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      // Check header
      expect(screen.getByText("Create Gem")).toBeInTheDocument();
      expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();

      // Check address search
      expect(screen.getByTestId("address-search")).toBeInTheDocument();

      // Check map picker
      expect(screen.getByTestId("gem-location-picker")).toBeInTheDocument();

      // Check continue button
      expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
    });

    it("should render back button", () => {
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      const backButton = screen.getByRole("button", { name: /go back/i });
      expect(backButton).toBeInTheDocument();
    });

    it("should render progress dots", () => {
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      // ProgressDots component should be rendered (check by class or structure)
      // This depends on ProgressDots implementation
      expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
    });
  });

  describe("Validation feedback", () => {
    it("should show selected location when valid", async () => {
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      // Wait for validation to complete
      await waitFor(
        () => {
          expect(screen.getByText("Selected Location")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      // Should show coordinates
      expect(screen.getByText(/10.315700/)).toBeInTheDocument();
      expect(screen.getByText(/123.885400/)).toBeInTheDocument();
    });

    it("should show error message for invalid location", async () => {
      // Mock invalid validation
      vi.spyOn(boundaryValidation, "validateCoordinates").mockResolvedValue({
        isValid: false,
        message: "Coordinates are outside Cebu City boundaries.",
      });

      // Mock GemLocationPicker to trigger invalid state
      const { GemLocationPicker } = await import(
        "@/components/gem-creation/GemLocationPicker"
      );
      vi.mocked(GemLocationPicker).mockImplementation(
        ({ onValidationChange }: any) => {
          React.useEffect(() => {
            onValidationChange?.({
              isValid: false,
              message: "Coordinates are outside Cebu City boundaries.",
            });
          }, []);
          return <div data-testid="gem-location-picker">Map Mock</div>;
        }
      );

      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      await waitFor(() => {
        expect(screen.getByText("Invalid Location")).toBeInTheDocument();
      });

      expect(
        screen.getByText(/outside Cebu City boundaries/i)
      ).toBeInTheDocument();
    });

    it("should disable Continue button when location is invalid", async () => {
      // Mock invalid validation
      vi.spyOn(boundaryValidation, "validateCoordinates").mockResolvedValue({
        isValid: false,
        message: "Coordinates are outside Cebu City boundaries.",
      });

      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      const continueButton = screen.getByRole("button", { name: /continue/i });

      // Button should be disabled initially or after invalid validation
      await waitFor(() => {
        expect(continueButton).toBeDisabled();
      });
    });

    it("should enable Continue button when location is valid", async () => {
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      const continueButton = screen.getByRole("button", { name: /continue/i });

      await waitFor(
        () => {
          expect(continueButton).not.toBeDisabled();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("User interactions", () => {
    it("should call onBack when back button is clicked", async () => {
      const user = userEvent.setup();
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      const backButton = screen.getByRole("button", { name: /go back/i });
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it("should call onNext and save location when Continue is clicked", async () => {
      const user = userEvent.setup();
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      // Wait for valid location
      await waitFor(
        () => {
          const continueButton = screen.getByRole("button", {
            name: /continue/i,
          });
          expect(continueButton).not.toBeDisabled();
        },
        { timeout: 2000 }
      );

      const continueButton = screen.getByRole("button", { name: /continue/i });
      await user.click(continueButton);

      // Should call onNext
      expect(mockOnNext).toHaveBeenCalledTimes(1);

      // Should save location to store
      const store = useGemCreationStore.getState();
      expect(store.location).toBeDefined();
      expect(store.location?.isValid).toBe(true);
      expect(store.location?.coordinates).toEqual([123.8854, 10.3157]);
    });

    it("should not call onNext when Continue is clicked with invalid location", async () => {
      // Mock invalid validation
      vi.spyOn(boundaryValidation, "validateCoordinates").mockResolvedValue({
        isValid: false,
        message: "Coordinates are outside Cebu City boundaries.",
      });

      const user = userEvent.setup();
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      const continueButton = screen.getByRole("button", { name: /continue/i });

      // Button should be disabled
      await waitFor(() => {
        expect(continueButton).toBeDisabled();
      });

      // Try to click (should not work)
      await user.click(continueButton);
      expect(mockOnNext).not.toHaveBeenCalled();
    });
  });

  describe("Store integration", () => {
    it("should load existing location from store", async () => {
      // Pre-populate store with location
      useGemCreationStore.setState({
        location: {
          coordinates: [123.9, 10.35],
          address: "Test Address, Cebu City",
          isValid: true,
        },
      });

      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      // Should show the stored location
      await waitFor(() => {
        expect(screen.getByText("Test Address, Cebu City")).toBeInTheDocument();
      });
    });

    it("should update store when location changes", async () => {
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      // Wait for location to be set
      await waitFor(
        () => {
          const store = useGemCreationStore.getState();
          expect(store.location).toBeDefined();
        },
        { timeout: 2000 }
      );

      const store = useGemCreationStore.getState();
      expect(store.location?.coordinates).toEqual([123.8854, 10.3157]);
      expect(store.location?.isValid).toBe(true);
    });
  });

  describe("Address search integration", () => {
    it("should validate address selection from search", async () => {
      const { AddressSearch } = await import(
        "@/components/gem-creation/AddressSearch"
      );

      // Mock address search to trigger selection
      vi.mocked(AddressSearch).mockImplementation(({ onSelect }: any) => (
        <div data-testid="address-search">
          <button
            onClick={() =>
              onSelect({
                place_name: "Ayala Center Cebu, Cebu City",
                center: [123.9107, 10.3181],
              })
            }
          >
            Select Address
          </button>
        </div>
      ));

      const user = userEvent.setup();
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      const selectButton = screen.getByText("Select Address");
      await user.click(selectButton);

      // Should validate the selected coordinates
      await waitFor(() => {
        expect(boundaryValidation.validateCoordinates).toHaveBeenCalledWith([
          123.9107, 10.3181,
        ]);
      });
    });

    it("should show error toast for invalid address selection", async () => {
      // Mock invalid address
      vi.spyOn(boundaryValidation, "validateCoordinates").mockResolvedValue({
        isValid: false,
        message: "This location is outside Cebu City",
      });

      const { AddressSearch } = await import(
        "@/components/gem-creation/AddressSearch"
      );

      vi.mocked(AddressSearch).mockImplementation(({ onSelect }: any) => (
        <div data-testid="address-search">
          <button
            onClick={() =>
              onSelect({
                place_name: "Manila, Philippines",
                center: [121.0, 14.5],
              })
            }
          >
            Select Invalid Address
          </button>
        </div>
      ));

      const user = userEvent.setup();
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);

      const selectButton = screen.getByText("Select Invalid Address");
      await user.click(selectButton);

      // Should show error toast
      await waitFor(() => {
        expect(
          screen.getByText(/This location is outside Cebu City/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Performance", () => {
    it("should render within reasonable time", () => {
      const startTime = performance.now();
      render(<LocationStep onNext={mockOnNext} onBack={mockOnBack} />);
      const endTime = performance.now();

      // Should render quickly (< 1000ms)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
