package com.idrp.backend.dto.inquiry;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquirySummaryDto {
    private long newCount;
    private long inProgressCount;
    private long resolvedCount;
    private long total;
}
