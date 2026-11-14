package com.idrp.backend.dto.inquiry;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryRequestDto {

    /** Must match one of the website's form types; see InquiryServiceImpl.ALLOWED_FORM_TYPES. */
    @NotBlank(message = "Form type is required")
    @Size(max = 40)
    private String formType;

    @Size(max = 255)
    private String sourcePage;

    @NotBlank(message = "Full name is required")
    @Size(max = 150, message = "Full name must not exceed 150 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Size(max = 150)
    private String email;

    @Size(max = 30)
    @Pattern(regexp = "^$|^[+0-9() .-]{7,30}$", message = "Enter a valid phone number")
    private String phone;

    @Size(max = 200)
    private String organization;

    @Size(max = 5000, message = "Message must not exceed 5000 characters")
    private String message;

    @AssertTrue(message = "Consent is required")
    private Boolean consent;

    /** Every other field the form collected, stored verbatim. */
    @Size(max = 60, message = "Too many fields")
    private Map<String, Object> payload;

    /** Honeypot - real users never fill this hidden field. */
    private String botcheck;
}
