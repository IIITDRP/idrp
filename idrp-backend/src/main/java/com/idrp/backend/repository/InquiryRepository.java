package com.idrp.backend.repository;

import com.idrp.backend.entity.Inquiry;
import com.idrp.backend.entity.InquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    @Query("SELECT i FROM Inquiry i WHERE " +
            "(:status IS NULL OR i.status = :status) AND " +
            "(:formType IS NULL OR i.formType = :formType) AND " +
            "(:search IS NULL OR " +
            "  LOWER(i.fullName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            "  LOWER(i.email) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR " +
            "  LOWER(COALESCE(i.organization, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Inquiry> search(@Param("status") InquiryStatus status,
                         @Param("formType") String formType,
                         @Param("search") String search,
                         Pageable pageable);

    long countByStatus(InquiryStatus status);
}
