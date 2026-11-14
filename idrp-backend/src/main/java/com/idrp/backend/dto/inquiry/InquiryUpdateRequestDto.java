package com.idrp.backend.dto.inquiry;

import com.idrp.backend.entity.InquiryStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryUpdateRequestDto {

    @NotNull(message = "Status is required")
    private InquiryStatus status;

    @Size(max = 5000)
    private String adminNotes;
}
