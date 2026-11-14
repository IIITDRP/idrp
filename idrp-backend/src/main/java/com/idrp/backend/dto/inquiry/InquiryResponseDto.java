package com.idrp.backend.dto.inquiry;

import com.idrp.backend.entity.InquiryStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryResponseDto {
    private Long id;
    private String formType;
    private String sourcePage;
    private String fullName;
    private String email;
    private String phone;
    private String organization;
    private String message;
    private Map<String, Object> payload;
    private Boolean consentGiven;
    private InquiryStatus status;
    private String adminNotes;
    private String handledBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
