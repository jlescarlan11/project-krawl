package com.krawl.controller;

import com.krawl.dto.response.AutocompleteResponse;
import com.krawl.dto.response.PopularSearchesResponse;
import com.krawl.dto.response.SearchResultsResponse;
import com.krawl.service.JwtTokenService;
import com.krawl.service.SearchService;
import com.krawl.service.TokenBlacklistService;
import com.krawl.service.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = SearchController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
class SearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtTokenService jwtTokenService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @MockitoBean
    private TokenBlacklistService tokenBlacklistService;

    @MockitoBean
    private SearchService searchService;

    private SearchResultsResponse searchResults;
    private AutocompleteResponse autocompleteResponse;
    private PopularSearchesResponse popularSearchesResponse;

    @BeforeEach
    void setUp() {
        searchResults = SearchResultsResponse.builder()
                .gems(Arrays.asList())
                .krawls(Arrays.asList())
                .totalResults(0)
                .query("")
                .offset(0)
                .limit(20)
                .hasMore(false)
                .build();

        AutocompleteResponse.AutocompleteSuggestion suggestion1 = AutocompleteResponse.AutocompleteSuggestion.builder()
                .text("Basilica")
                .type("gem")
                .build();
        AutocompleteResponse.AutocompleteSuggestion suggestion2 = AutocompleteResponse.AutocompleteSuggestion.builder()
                .text("Magellan's Cross")
                .type("gem")
                .build();
        autocompleteResponse = AutocompleteResponse.builder()
                .suggestions(Arrays.asList(suggestion1, suggestion2))
                .build();

        popularSearchesResponse = PopularSearchesResponse.builder()
                .queries(Arrays.asList("Basilica", "Magellan's Cross", "Fort San Pedro"))
                .build();
    }

    @Test
    void testSearch_ValidQuery_ReturnsResults() throws Exception {
        // Given
        when(searchService.search(eq("basilica"), eq(20), eq(0), isNull(), any()))
                .thenReturn(searchResults);

        // When/Then
        mockMvc.perform(get("/api/search")
                .param("q", "basilica"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalResults").exists());

        verify(searchService).search(eq("basilica"), eq(20), eq(0), isNull(), any());
    }

    @Test
    void testSearch_WithLimitAndOffset_ReturnsResults() throws Exception {
        // Given
        when(searchService.search(eq("basilica"), eq(10), eq(5), isNull(), any()))
                .thenReturn(searchResults);

        // When/Then
        mockMvc.perform(get("/api/search")
                .param("q", "basilica")
                .param("limit", "10")
                .param("offset", "5"))
                .andExpect(status().isOk());

        verify(searchService).search(eq("basilica"), eq(10), eq(5), isNull(), any());
    }

    @Test
    void testSearch_WithTypeFilter_ReturnsFilteredResults() throws Exception {
        // Given
        when(searchService.search(eq("basilica"), eq(20), eq(0), eq("gems"), any()))
                .thenReturn(searchResults);

        // When/Then
        mockMvc.perform(get("/api/search")
                .param("q", "basilica")
                .param("type", "gems"))
                .andExpect(status().isOk());

        verify(searchService).search(eq("basilica"), eq(20), eq(0), eq("gems"), any());
    }

    @Test
    void testSearch_EmptyQuery_ReturnsBadRequest() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/search")
                .param("q", ""))
                .andExpect(status().isBadRequest());

        verify(searchService, never()).search(anyString(), anyInt(), anyInt(), any(), any());
    }

    @Test
    void testSearch_MissingQuery_ReturnsBadRequest() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/search"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testSearch_InvalidLimit_ReturnsBadRequest() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/search")
                .param("q", "basilica")
                .param("limit", "101")) // Exceeds max limit
                .andExpect(status().isBadRequest());
    }

    @Test
    void testSearch_InvalidOffset_ReturnsBadRequest() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/search")
                .param("q", "basilica")
                .param("offset", "-1")) // Negative offset
                .andExpect(status().isBadRequest());
    }

    @Test
    void testSearch_InvalidType_ReturnsBadRequest() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/search")
                .param("q", "basilica")
                .param("type", "invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAutocomplete_ValidQuery_ReturnsSuggestions() throws Exception {
        // Given
        when(searchService.autocomplete(eq("bas"), eq(10)))
                .thenReturn(autocompleteResponse);

        // When/Then
        mockMvc.perform(get("/api/search/autocomplete")
                .param("q", "bas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.suggestions").isArray())
                .andExpect(jsonPath("$.suggestions.length()").value(2));

        verify(searchService).autocomplete(eq("bas"), eq(10));
    }

    @Test
    void testAutocomplete_EmptyQuery_ReturnsEmptySuggestions() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/search/autocomplete")
                .param("q", ""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.suggestions").isArray())
                .andExpect(jsonPath("$.suggestions.length()").value(0));

        verify(searchService, never()).autocomplete(anyString(), anyInt());
    }

    @Test
    void testAutocomplete_InvalidLimit_ReturnsBadRequest() throws Exception {
        // When/Then
        mockMvc.perform(get("/api/search/autocomplete")
                .param("q", "bas")
                .param("limit", "51")) // Exceeds max limit
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetPopularSearches_ReturnsPopularSearches() throws Exception {
        // Given
        when(searchService.getPopularSearches()).thenReturn(popularSearchesResponse);

        // When/Then
        mockMvc.perform(get("/api/search/popular"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.queries").isArray())
                .andExpect(jsonPath("$.queries.length()").value(3));

        verify(searchService).getPopularSearches();
    }
}

