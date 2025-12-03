package com.krawl.constants;

import java.util.Arrays;
import java.util.List;

/**
 * Constants for Gem categories.
 * 
 * These categories match the frontend gem creation form categories.
 * Categories are used for classifying gems in the Krawl app.
 */
public final class GemCategoryConstants {
    
    private GemCategoryConstants() {
        // Utility class - prevent instantiation
    }
    
    /**
     * Valid gem category values.
     * These must match the values defined in frontend/lib/constants/gem-categories.ts
     */
    public static final String FOOD_DRINK = "food-drink";
    public static final String HISTORICAL_SITE = "historical-site";
    public static final String ART_MUSIC = "art-music";
    public static final String NATURE = "nature";
    public static final String CULTURE = "culture";
    public static final String SHOPPING = "shopping";
    public static final String RELIGIOUS_SITE = "religious-site";
    public static final String VIEWPOINT = "viewpoint";
    public static final String MONUMENT = "monument";
    public static final String PARK = "park";
    
    /**
     * List of all valid category values.
     */
    public static final List<String> VALID_CATEGORIES = Arrays.asList(
        FOOD_DRINK,
        HISTORICAL_SITE,
        ART_MUSIC,
        NATURE,
        CULTURE,
        SHOPPING,
        RELIGIOUS_SITE,
        VIEWPOINT,
        MONUMENT,
        PARK
    );
    
    /**
     * Check if a category value is valid.
     * 
     * @param category The category value to validate
     * @return true if the category is valid, false otherwise
     */
    public static boolean isValidCategory(String category) {
        return category != null && VALID_CATEGORIES.contains(category);
    }
    
    /**
     * Get all valid category values as an array for use in Schema annotations.
     * 
     * @return Array of valid category values
     */
    public static String[] getValidCategoriesArray() {
        return VALID_CATEGORIES.toArray(new String[0]);
    }
}



