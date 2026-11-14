package com.idrp.backend.service.impl;

import com.idrp.backend.dto.startup.StartupRequestDto;
import com.idrp.backend.dto.startup.StartupResponseDto;
import com.idrp.backend.entity.Startup;
import com.idrp.backend.entity.StartupDomain;
import com.idrp.backend.entity.StartupStatus;
import com.idrp.backend.exception.DuplicateResourceException;
import com.idrp.backend.exception.ResourceNotFoundException;
import com.idrp.backend.repository.StartupRepository;
import com.idrp.backend.service.StartupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@org.springframework.transaction.annotation.Transactional
@RequiredArgsConstructor
public class StartupServiceImpl implements StartupService {

    private final StartupRepository startupRepository;

    @Override
    public StartupResponseDto createStartup(StartupRequestDto requestDto) {
        if (startupRepository.existsByNameIgnoreCase(requestDto.getName().trim())) {
            throw new DuplicateResourceException("Startup already exists with name: " + requestDto.getName());
        }

        Startup startup = mapToEntity(requestDto);
        Startup savedStartup = startupRepository.save(startup);

        return mapToResponseDto(savedStartup);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StartupResponseDto> getAllStartups(int page, int size, StartupStatus status, StartupDomain domain, String search) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        return startupRepository.search(status, domain, search != null && !search.isBlank() ? search : null, pageable)
                .map(this::mapToResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public StartupResponseDto getStartupById(Long id) {
        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with id: " + id));

        return mapToResponseDto(startup);
    }

    @Override
    public StartupResponseDto updateStartup(Long id, StartupRequestDto requestDto) {
        Startup existingStartup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with id: " + id));

        if (startupRepository.existsByNameIgnoreCaseAndIdNot(requestDto.getName().trim(), id)) {
            throw new DuplicateResourceException("Another startup already exists with name: " + requestDto.getName());
        }

        existingStartup.setName(requestDto.getName());
        existingStartup.setSector(requestDto.getSector());
        existingStartup.setStatus(requestDto.getStatus());
        existingStartup.setDomains(new ArrayList<>(requestDto.getDomains()));
        existingStartup.setLogo(requestDto.getLogo());
        existingStartup.setWebsite(requestDto.getWebsite());
        existingStartup.setOnePager(requestDto.getOnePager());
        existingStartup.setBrief(requestDto.getBrief());
        existingStartup.setContactEmail(requestDto.getContactEmail());
        existingStartup.setTechFacultyMentors(requestDto.getTechFacultyMentors());
        existingStartup.setFounders(requestDto.getFounders());
        existingStartup.setTeamMembers(requestDto.getTeamMembers());
        existingStartup.setGallery(
                requestDto.getGallery() != null ? requestDto.getGallery() : new ArrayList<>()
        );

        Startup updatedStartup = startupRepository.save(existingStartup);

        return mapToResponseDto(updatedStartup);
    }

    @Override
    public void deleteStartup(Long id) {
        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with id: " + id));

        startupRepository.delete(startup);
    }

    private Startup mapToEntity(StartupRequestDto dto) {
        return Startup.builder()
                .name(dto.getName())
                .sector(dto.getSector())
                .status(dto.getStatus())
                .domains(new ArrayList<>(dto.getDomains()))
                .logo(dto.getLogo())
                .website(dto.getWebsite())
                .onePager(dto.getOnePager())
                .brief(dto.getBrief())
                .contactEmail(dto.getContactEmail())
                .techFacultyMentors(dto.getTechFacultyMentors())
                .founders(dto.getFounders())
                .teamMembers(dto.getTeamMembers())
                .gallery(dto.getGallery() != null ? dto.getGallery() : new ArrayList<>())
                .build();
    }

    private StartupResponseDto mapToResponseDto(Startup startup) {
        return StartupResponseDto.builder()
                .id(startup.getId())
                .name(startup.getName())
                .sector(startup.getSector())
                .status(startup.getStatus())
                .domains(copyOf(startup.getDomains()))
                .logo(startup.getLogo())
                .website(startup.getWebsite())
                .onePager(startup.getOnePager())
                .brief(startup.getBrief())
                .contactEmail(startup.getContactEmail())
                .techFacultyMentors(copyOf(startup.getTechFacultyMentors()))
                .founders(copyOf(startup.getFounders()))
                .teamMembers(copyOf(startup.getTeamMembers()))
                .gallery(copyOf(startup.getGallery()))
                .createdAt(startup.getCreatedAt())
                .updatedAt(startup.getUpdatedAt())
                .build();
    }

    /** Copies a lazy JPA collection while the session is open, so serialization never touches Hibernate. */
    private static <T> java.util.List<T> copyOf(java.util.Collection<T> source) {
        return source == null ? new java.util.ArrayList<>() : new java.util.ArrayList<>(source);
    }
}
