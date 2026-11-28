package com.idrp.backend.repository;

import com.idrp.backend.entity.Startup;
import com.idrp.backend.entity.StartupDomain;
import com.idrp.backend.entity.StartupStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StartupRepository extends JpaRepository<Startup, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    Optional<Startup> findByName(String name);

    @Query("SELECT s FROM Startup s WHERE " +
            "(:status IS NULL OR :status MEMBER OF s.statuses) AND " +
            "(:domain IS NULL OR :domain MEMBER OF s.domains) AND " +
            "(:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Startup> search(@Param("status") StartupStatus status, @Param("domain") StartupDomain domain, @Param("search") String search, Pageable pageable);
}