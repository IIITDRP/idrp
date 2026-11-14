package com.idrp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_title", nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ResourceType type;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "file_url", length = 255)
    private String fileUrl;

    @Column(name = "cover_image_url", length = 255)
    private String coverImageUrl;

    @Column(name = "publish_date")
    private LocalDate publishDate;

    @Column(length = 150)
    private String author;

    @Column(name = "issue_number", length = 20)
    private String issueNumber;

    @Column(name = "date_label", length = 60)
    private String dateLabel;

    @Column(name = "preview_text", columnDefinition = "TEXT")
    private String previewText;

    @Column(name = "total_pages")
    private Integer totalPages;

    @ElementCollection
    @CollectionTable(name = "resource_highlights", joinColumns = @JoinColumn(name = "resource_id"))
    @OrderColumn(name = "position")
    @Column(name = "highlight", length = 500)
    @Builder.Default
    private List<String> highlights = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "created_by", length = 150)
    private String createdBy;

    @Column(name = "updated_by", length = 150)
    private String updatedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.active == null) this.active = true;
        if (this.displayOrder == null) this.displayOrder = 0;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}