package com.syfapp.backend.services;

import com.syfapp.backend.dtos.MentorSearchResponseDTO;
import com.syfapp.backend.repositories.MentorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorSearchService {

    private final MentorProfileRepository mentorProfileRepository;

    public List<MentorSearchResponseDTO> searchMentorsBySkills(String skills) {

        List<String> skillList = Arrays.stream(skills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .toList();

        return mentorProfileRepository.findMentorsBySkillNames(skillList)
                .stream()
                .map(mp -> MentorSearchResponseDTO.builder()
                        .mentorId(mp.getUser().getUserId())
                        .mentorName(mp.getUser().getName())
                        .headline(mp.getHeadline())
                        .experienceYears(mp.getExperienceYears())
                        .expertiseArea(mp.getExpertiseArea())
                        .build())
                .toList();
    }

}

