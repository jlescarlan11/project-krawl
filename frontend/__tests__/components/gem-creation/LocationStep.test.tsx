import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { LocationStep } from "@/components/gem-creation/steps/LocationStep";
import { useGemCreationStore } from "@/stores/gem-creation-store";
import * as boundaryValidation from "@/lib/map/boundaryValidation";

// Set the act environment flag for reliability
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

// Mock boundary validation
vi.mock("@/lib/map/boundaryValidation", () => ({
  validateCoordinates: vi.fn().mockResolvedValue({
    isValid: true,
    message: "Coordinates are within Cebu City boundaries.",
  }),
  loadBoundaryData: vi.fn().mockResolvedValue({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[[123.7, 10.2], [124.0, 10.2], [124.0, 10.5], [123.7, 10.5], [123.7, 10.2]]],
    },
    properties: {},
  }),
  isPointInBoundary: vi.fn().mockReturnValue(true),
  getBoundaryCoordinates: vi.fn().mockReturnValue([[[123.7, 10.2], [124.0, 10.2], [124.0, 10.5], [123.7, 10.5], [123.7, 10.2]]]),
  clearBoundaryCache: vi.fn(),
  isBoundaryDataLoaded: vi.fn().mockReturnValue(true),
}));

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
    accessToken: "pk.mock",
  },
}));

/**
 * Helper to create a stable mock component for GemLocationPicker.
 * Renamed to start with 'mock' so it can be used within hoisted vi.mock calls.
 */
const mockCreatePicker = (isValid = true, message = "Valid") => {
  const MockPicker = ({ onLocationChange, onValidationChange, initialCoordinates }: any) => {
    React.useEffect(() => {
      const coords: [number, number] = initialCoordinates || [123.8854, 10.3157];
      
      const timer = setTimeout(() => {
        if (onLocationChange) onLocationChange(coords);
        if (onValidationChange) onValidationChange({ isValid, message });
      }, 0);

      return () => clearTimeout(timer);
    }, [onLocationChange, onValidationChange, initialCoordinates]);

    return <div data-testid="gem-location-picker">Map Mock ({isValid ? "Valid" : "Invalid"})</div>;
  };

  return MockPicker;
};

// Default mock - uses mockCreatePicker which is now safe due to the 'mock' prefix
vi.mock("@/components/gem-creation/GemLocationPicker", () => ({
  GemLocationPicker: vi.fn((props) => {
    // We define the internal logic here or use the prefixed helper
    const coords: [number, number] = props.initialCoordinates || [123.8854, 10.3157];
    
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (props.onLocationChange) props.onLocationChange(coords);
        if (props.onValidationChange) props.onValidationChange({ 
          isValid: true, 
          message: "Coordinates are within Cebu City boundaries." 
        });
      }, 0);
      return () => clearTimeout(timer);
    }, [props.onLocationChange, props.onValidationChange, props.initialCoordinates]);

    return <div data-testid="gem-location-picker">Map Mock (Valid)</div>;
  }),
}));

// Mock AddressSearch
vi.mock("@/components/gem-creation/AddressSearch", () => ({
  AddressSearch: vi.fn(({ onSelect }) => (
    <div data-testid="address-search">
      <button 
        data-testid="mock-select-address"
        onClick={() => onSelect({ place_name: "Cebu City, Philippines", center: [123.8854, 10.3157] })}
      >
        Mock Select
      </button>
    </div>
  )),
  reverseGeocode: vi.fn().mockResolvedValue({
    place_name: "Cebu City, Philippines",
    center: [123.8854, 10.3157],
  }),
}));

describe("LocationStep", () => {
  const mockOnNext = vi.fn();
  const mockOnBackToPreviousPage = vi.fn();
  const mockOnBackToPreviousStep = vi.fn();

  beforeEach(() => {
    vi.useRealTimers();
    
    act(() => {
      useGemCreationStore.setState({
        location: null,
        currentStep: 0,
        completedSteps: [],
      });
    });

    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render location step elements", async () => {
      await act(async () => {
        render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);
      });

      expect(screen.getByText(/Create Gem/i)).toBeInTheDocument();
      expect(screen.getByTestId("address-search")).toBeInTheDocument();
      expect(screen.getByTestId("gem-location-picker")).toBeInTheDocument();
    });

    it("should render back button", async () => {
      await act(async () => {
        render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);
      });
      expect(screen.getByRole("button", { name: /go back/i })).toBeInTheDocument();
    });
  });

  describe("Validation feedback", () => {
    it("should show selected location when valid", async () => {
      render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);

      await waitFor(() => {
        expect(screen.getByText(/Location Selected/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/10\.315/)).toBeInTheDocument();
      expect(screen.getByText(/123\.885/)).toBeInTheDocument();
    });

    it("should show error message for invalid location", async () => {
      vi.spyOn(boundaryValidation, "validateCoordinates").mockResolvedValue({
        isValid: false,
        message: "Outside boundary",
      });

      const { GemLocationPicker } = await import("@/components/gem-creation/GemLocationPicker");
      vi.mocked(GemLocationPicker).mockImplementationOnce(mockCreatePicker(false, "Outside boundary"));

      render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);

      await waitFor(() => {
        expect(screen.getByText(/Invalid Location/i)).toBeInTheDocument();
        expect(screen.getByText(/Outside boundary/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it("should disable Continue button when location is invalid", async () => {
      vi.spyOn(boundaryValidation, "validateCoordinates").mockResolvedValue({
        isValid: false,
        message: "Error",
      });

      const { GemLocationPicker } = await import("@/components/gem-creation/GemLocationPicker");
      vi.mocked(GemLocationPicker).mockImplementationOnce(mockCreatePicker(false, "Error"));

      render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);
      
      const continueButton = screen.getByRole("button", { name: /continue/i });
      await waitFor(() => {
        expect(continueButton).toBeDisabled();
      });
    });
  });

  describe("User interactions", () => {
    it("should call onBack when back button is clicked", async () => {
      const user = userEvent.setup();
      render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);

      const backButton = screen.getByRole("button", { name: /go back/i });
      await user.click(backButton);
      expect(mockOnBackToPreviousPage).toHaveBeenCalled();
    });

    it("should call onNext when Continue is clicked and valid", async () => {
      const user = userEvent.setup();
      render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);

      const continueButton = screen.getByRole("button", { name: /continue/i });
      
      await waitFor(() => expect(continueButton).not.toBeDisabled());
      await user.click(continueButton);

      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  describe("Store integration", () => {
    it("should load existing location from store", async () => {
      act(() => {
        useGemCreationStore.setState({
          location: {
            coordinates: [123.8854, 10.3157],
            address: "Stored Address",
            isValid: true,
          },
        });
      });

      render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);

      await waitFor(() => {
        expect(screen.getByText(/Stored Address/i)).toBeInTheDocument();
      });
    });

    it("should update store when location changes", async () => {
      render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);

      await waitFor(() => {
        const store = useGemCreationStore.getState();
        expect(store.location?.coordinates).toEqual([123.8854, 10.3157]);
      });
    });
  });

  describe("Address search integration", () => {
    it("should validate address selection from search", async () => {
      const user = userEvent.setup();
      render(<LocationStep onNext={mockOnNext} onBackToPreviousPage={mockOnBackToPreviousPage} onBackToPreviousStep={mockOnBackToPreviousStep} />);

      const selectBtn = screen.getByTestId("mock-select-address");
      await user.click(selectBtn);

      await waitFor(() => {
        expect(boundaryValidation.validateCoordinates).toHaveBeenCalledWith([123.8854, 10.3157]);
      });
    });
  });
});
