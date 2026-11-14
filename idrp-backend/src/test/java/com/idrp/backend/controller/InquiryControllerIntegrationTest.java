package com.idrp.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.idrp.backend.TestcontainersConfiguration;
import com.idrp.backend.entity.Admin;
import com.idrp.backend.entity.AdminRole;
import com.idrp.backend.entity.Inquiry;
import com.idrp.backend.entity.InquiryStatus;
import com.idrp.backend.repository.AdminRepository;
import com.idrp.backend.repository.InquiryRepository;
import com.idrp.backend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * End-to-end lead capture: the public form endpoint really stores rows in PostgreSQL,
 * and only authenticated admins can read or triage them.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class InquiryControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private InquiryRepository inquiryRepository;
    @Autowired private AdminRepository adminRepository;
    @Autowired private JwtService jwtService;
    @Autowired private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void clean() {
        inquiryRepository.deleteAll();
    }

    private Map<String, Object> contactSubmission() {
        Map<String, Object> body = new HashMap<>();
        body.put("formType", "contact");
        body.put("sourcePage", "/contact");
        body.put("fullName", "Asha Rao");
        body.put("email", "Asha.Rao@Example.com");
        body.put("phone", "+91 98765 43210");
        body.put("organization", "Rao Robotics");
        body.put("message", "We would like to discuss incubation.");
        body.put("consent", true);
        body.put("payload", Map.of("fullName", "Asha Rao", "message", "We would like to discuss incubation."));
        body.put("botcheck", "");
        return body;
    }

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    private String adminToken(AdminRole role) {
        String email = role.name().toLowerCase() + "-inquiry-test@idrp.in";
        Admin admin = adminRepository.findByEmail(email).orElseGet(() -> adminRepository.save(Admin.builder()
                .name("Test " + role)
                .email(email)
                .password(passwordEncoder.encode("not-used-in-this-test"))
                .role(role)
                .active(true)
                .build()));
        return jwtService.generateToken(admin);
    }

    @Test
    void publicSubmission_isStoredAsNewInquiry() throws Exception {
        mockMvc.perform(post("/api/inquiries").contentType(MediaType.APPLICATION_JSON).content(json(contactSubmission())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").doesNotExist());

        List<Inquiry> stored = inquiryRepository.findAll();
        assertThat(stored).hasSize(1);
        Inquiry inquiry = stored.get(0);
        assertThat(inquiry.getStatus()).isEqualTo(InquiryStatus.NEW);
        assertThat(inquiry.getEmail()).isEqualTo("asha.rao@example.com");
        assertThat(inquiry.getOrganization()).isEqualTo("Rao Robotics");
        assertThat(inquiry.getConsentGiven()).isTrue();
        assertThat(inquiry.getPayload()).contains("incubation");
    }

    @Test
    void honeypotSubmission_looksSuccessfulButIsNotStored() throws Exception {
        Map<String, Object> body = contactSubmission();
        body.put("botcheck", "I am a bot");

        mockMvc.perform(post("/api/inquiries").contentType(MediaType.APPLICATION_JSON).content(json(body)))
                .andExpect(status().isCreated());

        assertThat(inquiryRepository.count()).isZero();
    }

    @Test
    void contactWithoutOrganisation_isRejected() throws Exception {
        Map<String, Object> body = contactSubmission();
        body.put("organization", "  ");

        mockMvc.perform(post("/api/inquiries").contentType(MediaType.APPLICATION_JSON).content(json(body)))
                .andExpect(status().isBadRequest());
        assertThat(inquiryRepository.count()).isZero();
    }

    @Test
    void submissionWithoutConsent_isRejected() throws Exception {
        Map<String, Object> body = contactSubmission();
        body.put("consent", false);

        mockMvc.perform(post("/api/inquiries").contentType(MediaType.APPLICATION_JSON).content(json(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Consent is required"));
    }

    @Test
    void unknownFormType_isRejected() throws Exception {
        Map<String, Object> body = contactSubmission();
        body.put("formType", "newsletter-signup");

        mockMvc.perform(post("/api/inquiries").contentType(MediaType.APPLICATION_JSON).content(json(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void malformedJson_isBadRequestNotServerError() throws Exception {
        mockMvc.perform(post("/api/inquiries").contentType(MediaType.APPLICATION_JSON).content("{not json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listingInquiries_requiresAdmin() throws Exception {
        mockMvc.perform(get("/api/inquiries")).andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanListAndTriage_butOnlySuperAdminCanDelete() throws Exception {
        mockMvc.perform(post("/api/inquiries").contentType(MediaType.APPLICATION_JSON).content(json(contactSubmission())))
                .andExpect(status().isCreated());
        Long id = inquiryRepository.findAll().get(0).getId();
        String adminToken = adminToken(AdminRole.ADMIN);

        mockMvc.perform(get("/api/inquiries").param("status", "NEW").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].fullName").value("Asha Rao"))
                .andExpect(jsonPath("$.data.content[0].payload.message").value("We would like to discuss incubation."));

        mockMvc.perform(patch("/api/inquiries/" + id)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("status", "IN_PROGRESS", "adminNotes", "Called back"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.data.handledBy").value("admin-inquiry-test@idrp.in"));

        mockMvc.perform(get("/api/inquiries/summary").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.inProgressCount").value(1));

        mockMvc.perform(delete("/api/inquiries/" + id).header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/inquiries/" + id).header("Authorization", "Bearer " + adminToken(AdminRole.SUPER_ADMIN)))
                .andExpect(status().isOk());
        assertThat(inquiryRepository.count()).isZero();
    }
}
