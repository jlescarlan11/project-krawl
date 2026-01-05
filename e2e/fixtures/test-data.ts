/**
 * Test data fixtures for E2E tests
 * 
 * Uses valid UUIDs for test data to avoid backend validation errors.
 * These UUIDs are fixed constants for consistent testing.
 */

// Valid UUIDs for test data (using fixed UUIDs for consistency)
export const TEST_UUIDS = {
  USER: "00000000-0000-0000-0000-000000000001",
  GEM: "00000000-0000-0000-0000-000000000002",
  KRAWL: "00000000-0000-0000-0000-000000000003",
  GEM_2: "00000000-0000-0000-0000-000000000004",
} as const;

/**
 * Generate a valid UUID for testing
 */
export function generateTestUUID(): string {
  return crypto.randomUUID();
}

export const testUsers = {
  authenticated: {
    email: "test@example.com",
    displayName: "Test User",
    id: TEST_UUIDS.USER,
  },
  guest: null,
};

export const testGems = {
  sampleGem: {
    id: TEST_UUIDS.GEM,
    name: "Test Gem",
    category: "historical-site",
    latitude: 10.3157,
    longitude: 123.8854,
  },
};

export const testKrawls = {
  sampleKrawl: {
    id: TEST_UUIDS.KRAWL,
    name: "Test Krawl",
    description: "A test krawl trail",
    gemIds: [TEST_UUIDS.GEM],
  },
};


