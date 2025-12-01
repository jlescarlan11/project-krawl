package com.krawl;

import org.apache.commons.text.similarity.LevenshteinDistance;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Test to verify Apache Commons Text dependency is correctly resolved and accessible.
 * This test validates that the LevenshteinDistance class can be imported and used
 * for the duplicate detection service.
 */
class ApacheCommonsTextDependencyTest {

    @Test
    void testLevenshteinDistanceClassIsAccessible() {
        // Verify that LevenshteinDistance can be instantiated
        LevenshteinDistance levenshteinDistance = new LevenshteinDistance();
        assertNotNull(levenshteinDistance, "LevenshteinDistance should be accessible");
    }

    @Test
    void testLevenshteinDistanceCalculation() {
        // Verify that LevenshteinDistance works correctly
        LevenshteinDistance levenshteinDistance = new LevenshteinDistance();

        // Test with identical strings
        Integer distance = levenshteinDistance.apply("test", "test");
        assertEquals(0, distance, "Distance between identical strings should be 0");

        // Test with different strings
        distance = levenshteinDistance.apply("test", "tent");
        assertEquals(1, distance, "Distance between 'test' and 'tent' should be 1");

        // Test with completely different strings
        distance = levenshteinDistance.apply("kitten", "sitting");
        assertEquals(3, distance, "Distance between 'kitten' and 'sitting' should be 3");
    }
}
