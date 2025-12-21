package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentPageResponse {
    private List<CommentResponse> comments;
    private Integer currentPage;
    private Integer totalPages;
    private Long totalComments;
    private Boolean hasNext;
}
