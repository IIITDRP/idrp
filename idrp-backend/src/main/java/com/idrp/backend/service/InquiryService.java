package com.idrp.backend.service;

import com.idrp.backend.dto.inquiry.InquiryRequestDto;
import com.idrp.backend.dto.inquiry.InquiryResponseDto;
import com.idrp.backend.dto.inquiry.InquirySummaryDto;
import com.idrp.backend.dto.inquiry.InquiryUpdateRequestDto;
import com.idrp.backend.entity.InquiryStatus;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface InquiryService {

    /** Returns empty when the submission was silently dropped as spam (honeypot filled). */
    Optional<InquiryResponseDto> submit(InquiryRequestDto requestDto);

    Page<InquiryResponseDto> getInquiries(int page, int size, InquiryStatus status, String formType, String search);

    InquiryResponseDto getInquiry(Long id);

    InquiryResponseDto updateInquiry(Long id, InquiryUpdateRequestDto requestDto, String adminEmail);

    InquirySummaryDto getSummary();

    void deleteInquiry(Long id);
}
