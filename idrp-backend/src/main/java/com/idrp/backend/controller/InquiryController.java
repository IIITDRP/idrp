package com.idrp.backend.controller;

import com.idrp.backend.dto.common.ApiResponse;
import com.idrp.backend.dto.inquiry.InquiryRequestDto;
import com.idrp.backend.dto.inquiry.InquiryResponseDto;
import com.idrp.backend.dto.inquiry.InquirySummaryDto;
import com.idrp.backend.dto.inquiry.InquiryUpdateRequestDto;
import com.idrp.backend.entity.InquiryStatus;
import com.idrp.backend.service.InquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Website lead capture. POST is public (rate limited, honeypot protected); everything
 * else is the admin "Inquiries" inbox.
 */
@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> submit(@Valid @RequestBody InquiryRequestDto requestDto) {
        // Never echo stored data back; a honeypot drop looks identical to a real save
        // so bots get no signal.
        inquiryService.submit(requestDto);
        return new ResponseEntity<>(
                ApiResponse.<Void>builder().success(true).message("Submission received").build(),
                HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<InquiryResponseDto>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) InquiryStatus status,
            @RequestParam(required = false) String formType,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.<Page<InquiryResponseDto>>builder()
                .success(true).message("Inquiries fetched successfully")
                .data(inquiryService.getInquiries(page, size, status, formType, search)).build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<InquirySummaryDto>> summary() {
        return ResponseEntity.ok(ApiResponse.<InquirySummaryDto>builder()
                .success(true).message("Inquiry summary fetched successfully")
                .data(inquiryService.getSummary()).build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InquiryResponseDto>> get(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.<InquiryResponseDto>builder()
                .success(true).message("Inquiry fetched successfully")
                .data(inquiryService.getInquiry(id)).build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<InquiryResponseDto>> update(
            @PathVariable Long id,
            @Valid @RequestBody InquiryUpdateRequestDto requestDto,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.<InquiryResponseDto>builder()
                .success(true).message("Inquiry updated successfully")
                .data(inquiryService.updateInquiry(id, requestDto, authentication.getName())).build());
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        inquiryService.deleteInquiry(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true).message("Inquiry deleted successfully").build());
    }
}
