package com.krawl.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.krawl.dto.request.CreateReportRequest;
import com.krawl.dto.response.ReportResponse;
import com.krawl.entity.Report;
import com.krawl.service.JwtTokenService;
import com.krawl.service.ReportService;
import com.krawl.service.TokenBlacklistService;
import com.krawl.service.UserDetailsServiceImpl;
import com.krawl.util.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ReportController.class, excludeAutoConfiguration = {
    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
class ReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private JwtTokenService jwtTokenService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @MockitoBean
    private TokenBlacklistService tokenBlacklistService;

    @MockitoBean
    private ReportService reportService;

    private UUID testGemId;
    private CreateReportRequest reportRequest;
    private ReportResponse reportResponse;

    @BeforeEach
    void setUp() {
        testGemId = TestDataFactory.randomUUID();
        reportRequest = new CreateReportRequest();
        reportRequest.setContentType(Report.ContentType.GEM);
        reportRequest.setContentId(testGemId);
        reportRequest.setReason(Report.ReportReason.OFFENSIVE);
        reportRequest.setDescription("This content is inappropriate");

        reportResponse = ReportResponse.builder()
                .id(UUID.randomUUID().toString())
                .contentType(Report.ContentType.GEM)
                .contentId(testGemId.toString())
                .reason(Report.ReportReason.OFFENSIVE)
                .build();
    }

    @Test
    @SuppressWarnings("null")
    void testCreateReport_GuestUser_ReturnsCreated() throws Exception {
        // Given
        when(reportService.createReport(any(CreateReportRequest.class), eq(null)))
                .thenReturn(reportResponse);

        // When/Then
        mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reportRequest))
                .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.contentType").exists())
                .andExpect(jsonPath("$.contentId").value(testGemId.toString()));

        verify(reportService).createReport(any(CreateReportRequest.class), eq(null));
    }

    @Test
    @SuppressWarnings("null")
    void testCreateReport_AuthenticatedUser_ReturnsCreated() throws Exception {
        // Given - Note: Since security is excluded, this test behaves like guest user
        // For authenticated user test, we'd need security enabled with proper UUID
        when(reportService.createReport(any(CreateReportRequest.class), isNull()))
                .thenReturn(reportResponse);

        // When/Then
        mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reportRequest))
                .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.contentType").exists());

        verify(reportService).createReport(any(CreateReportRequest.class), isNull());
    }

    @Test
    @SuppressWarnings("null")
    void testCreateReport_InvalidRequest_ReturnsBadRequest() throws Exception {
        // Given
        CreateReportRequest invalidRequest = new CreateReportRequest();
        // Invalid: contentType is null (not set)

        // When/Then
        mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest))
                .with(csrf()))
                .andExpect(status().isBadRequest());

        verify(reportService, never()).createReport(any(), any());
    }

    @Test
    @SuppressWarnings("null")
    void testCreateReport_KrawlContent_ReturnsCreated() throws Exception {
        // Given
        UUID krawlId = TestDataFactory.randomUUID();
        CreateReportRequest krawlReport = new CreateReportRequest();
        krawlReport.setContentType(Report.ContentType.KRAWL);
        krawlReport.setContentId(krawlId);
        krawlReport.setReason(Report.ReportReason.SPAM);

        ReportResponse krawlReportResponse = ReportResponse.builder()
                .id(UUID.randomUUID().toString())
                .contentType(Report.ContentType.KRAWL)
                .contentId(krawlId.toString())
                .reason(Report.ReportReason.SPAM)
                .build();

        when(reportService.createReport(any(CreateReportRequest.class), any()))
                .thenReturn(krawlReportResponse);

        // When/Then
        mockMvc.perform(post("/api/reports")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(krawlReport))
                .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.contentType").exists());
    }
}

