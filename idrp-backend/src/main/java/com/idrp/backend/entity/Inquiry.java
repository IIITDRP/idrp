package com.idrp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * One row per public website form submission (contact, partner, programme/course/
 * workshop applications, service enquiries, matchmaking). The common contact fields are
 * columns so admins can search and triage; everything else the form collected is kept
 * verbatim as JSON in {@code payload}.
 */
@Entity
@Table(name = "inquiries", indexes = {
        @Index(name = "idx_inquiries_status_created", columnList = "status, created_at"),
        @Index(name = "idx_inquiries_form_type", columnList = "form_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "form_type", nullable = false, length = 40)
    private String formType;

    @Column(name = "source_page", length = 255)
    private String sourcePage;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 200)
    private String organization;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(name = "consent_given", nullable = false)
    private Boolean consentGiven;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InquiryStatus status;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "handled_by", length = 150)
    private String handledBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        if (this.status == null) {
            this.status = InquiryStatus.NEW;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
