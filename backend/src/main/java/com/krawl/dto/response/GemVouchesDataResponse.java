package com.krawl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GemVouchesDataResponse {
    private Integer vouchCount;

    @Builder.Default
    private List<GemVouchResponse> vouches = new ArrayList<>();

    private Boolean isVouchedByCurrentUser;
}
