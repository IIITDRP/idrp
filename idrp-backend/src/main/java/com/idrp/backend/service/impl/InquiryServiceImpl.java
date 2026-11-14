package com.idrp.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idrp.backend.dto.inquiry.InquiryRequestDto;
import com.idrp.backend.dto.inquiry.InquiryResponseDto;
import com.idrp.backend.dto.inquiry.InquirySummaryDto;
import com.idrp.backend.dto.inquiry.InquiryUpdateRequestDto;
import com.idrp.backend.entity.Inquiry;
import com.idrp.backend.entity.InquiryStatus;
import com.idrp.backend.exception.ResourceNotFoundException;
import com.idrp.backend.repository.InquiryRepository;
import com.idrp.backend.service.InquiryNotifier;
import com.idrp.backend.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class InquiryServiceImpl implements InquiryService {

    private static final Logger log = LoggerFactory.getLogger(InquiryServiceImpl.class);

    /** The website's public form types (idrp-frontend src/types/form.ts FormType). */
    static final Set<String> ALLOWED_FORM_TYPES = Set.of(
            "contact", "partner", "program-application", "course-application",
            "workshop-application", "event-registration", "service-inquiry",
            "startup-matchmaking", "investor-matchmaking", "community-membership", "job-application");

    private static final int MAX_PAYLOAD_CHARS = 20_000;
    private static final int MAX_PAGE_SIZE = 100;

    private final InquiryRepository inquiryRepository;
    private final InquiryNotifier inquiryNotifier;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Optional<InquiryResponseDto> submit(InquiryRequestDto dto) {
        if (dto.getBotcheck() != null && !dto.getBotcheck().isBlank()) {
            log.info("Dropped inquiry with filled honeypot (formType={})", dto.getFormType());
            return Optional.empty();
        }
        String formType = dto.getFormType().trim().toLowerCase();
        if (!ALLOWED_FORM_TYPES.contains(formType)) {
            throw new IllegalArgumentException("Unknown form type: " + dto.getFormType());
        }
        if ("contact".equals(formType) && trimToNull(dto.getOrganization()) == null) {
            // PRD Phase 1 CT-04: organisation or startup name is mandatory on the contact form.
            throw new IllegalArgumentException("Organisation or startup name is required");
        }

        Inquiry inquiry = Inquiry.builder()
                .formType(formType)
                .sourcePage(trimToNull(dto.getSourcePage()))
                .fullName(dto.getFullName().trim())
                .email(dto.getEmail().trim().toLowerCase())
                .phone(trimToNull(dto.getPhone()))
                .organization(trimToNull(dto.getOrganization()))
                .message(trimToNull(dto.getMessage()))
                .payload(writePayload(dto.getPayload()))
                .consentGiven(Boolean.TRUE.equals(dto.getConsent()))
                .status(InquiryStatus.NEW)
                .build();

        Inquiry saved = inquiryRepository.save(inquiry);
        inquiryNotifier.notifyNewInquiry(saved);
        return Optional.of(toDto(saved));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InquiryResponseDto> getInquiries(int page, int size, InquiryStatus status, String formType, String search) {
        PageRequest pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return inquiryRepository.search(status, trimToNull(formType), trimToNull(search), pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public InquiryResponseDto getInquiry(Long id) {
        return toDto(find(id));
    }

    @Override
    public InquiryResponseDto updateInquiry(Long id, InquiryUpdateRequestDto dto, String adminEmail) {
        Inquiry inquiry = find(id);
        inquiry.setStatus(dto.getStatus());
        inquiry.setAdminNotes(trimToNull(dto.getAdminNotes()));
        inquiry.setHandledBy(adminEmail);
        return toDto(inquiryRepository.save(inquiry));
    }

    @Override
    @Transactional(readOnly = true)
    public InquirySummaryDto getSummary() {
        return InquirySummaryDto.builder()
                .newCount(inquiryRepository.countByStatus(InquiryStatus.NEW))
                .inProgressCount(inquiryRepository.countByStatus(InquiryStatus.IN_PROGRESS))
                .resolvedCount(inquiryRepository.countByStatus(InquiryStatus.RESOLVED))
                .total(inquiryRepository.count())
                .build();
    }

    @Override
    public void deleteInquiry(Long id) {
        inquiryRepository.delete(find(id));
    }

    private Inquiry find(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inquiry not found with id: " + id));
    }

    private String writePayload(Map<String, Object> payload) {
        if (payload == null || payload.isEmpty()) {
            return null;
        }
        Map<String, Object> clean = new LinkedHashMap<>();
        payload.forEach((key, value) -> {
            if (key != null && !key.isBlank() && key.length() <= 80 && !"botcheck".equals(key)) {
                clean.put(key, value);
            }
        });
        String json;
        try {
            json = objectMapper.writeValueAsString(clean);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Submission could not be read");
        }
        if (json.length() > MAX_PAYLOAD_CHARS) {
            throw new IllegalArgumentException("Submission is too large");
        }
        return json;
    }

    private Map<String, Object> readPayload(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<LinkedHashMap<String, Object>>() {});
        } catch (Exception e) {
            return Map.of("raw", json);
        }
    }

    private InquiryResponseDto toDto(Inquiry inquiry) {
        return InquiryResponseDto.builder()
                .id(inquiry.getId())
                .formType(inquiry.getFormType())
                .sourcePage(inquiry.getSourcePage())
                .fullName(inquiry.getFullName())
                .email(inquiry.getEmail())
                .phone(inquiry.getPhone())
                .organization(inquiry.getOrganization())
                .message(inquiry.getMessage())
                .payload(readPayload(inquiry.getPayload()))
                .consentGiven(inquiry.getConsentGiven())
                .status(inquiry.getStatus())
                .adminNotes(inquiry.getAdminNotes())
                .handledBy(inquiry.getHandledBy())
                .createdAt(inquiry.getCreatedAt())
                .updatedAt(inquiry.getUpdatedAt())
                .build();
    }

    private static String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
