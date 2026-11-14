package com.idrp.backend.repository;

import com.idrp.backend.entity.TeamMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    Optional<TeamMember> findFirstByNameIgnoreCase(String name);

    Page<TeamMember> findAllByActiveTrue(Pageable pageable);
}