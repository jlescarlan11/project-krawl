package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KrawlVouchResponse {
    private String id;
    private KrawlCreatorResponse user;
    private String comment;
    private LocalDateTime createdAt;
}




