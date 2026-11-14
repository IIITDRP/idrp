package com.idrp.backend.repository;

import com.idrp.backend.entity.BoardMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardMemberRepository extends JpaRepository<BoardMember, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    Optional<BoardMember> findFirstByNameIgnoreCase(String name);

    Page<BoardMember> findAllByActiveTrue(Pageable pageable);
}