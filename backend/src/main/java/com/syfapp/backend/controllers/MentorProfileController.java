package com.syfapp.backend.controllers;

import com.syfapp.backend.dtos.MentorProfileDTO;
import com.syfapp.backend.mappers.MentorProfileMapper;
import com.syfapp.backend.models.MentorProfile;
import com.syfapp.backend.models.Skill;
import com.syfapp.backend.models.User;
import com.syfapp.backend.repositories.MentorProfileRepository;
import com.syfapp.backend.repositories.SkillRepository;
import com.syfapp.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/api/mentor-profiles")
@RequiredArgsConstructor
public class MentorProfileController {

    private final MentorProfileRepository mentorRepo;
    private final UserRepository userRepo;
    private final SkillRepository skillRepo;
    private final MentorProfileMapper mapper;

    @PostMapping
    public MentorProfileDTO createMentorProfile(@RequestParam Long userId,
                                                @RequestParam String headline,
                                                @RequestParam Integer experienceYears,
                                                @RequestParam String expertiseArea,
                                                @RequestParam(required = false) String linkedinUrl,
                                                @RequestParam(required = false) String availability,
                                                @RequestParam(required = false) List<Long> skillIds) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MentorProfile profile = new MentorProfile();
        profile.setUser(user);
        profile.setHeadline(headline);
        profile.setExperienceYears(experienceYears);
        profile.setExpertiseArea(expertiseArea);
        profile.setLinkedinUrl(linkedinUrl);
        profile.setAvailability(availability);

        if (skillIds != null) {
            Set<Skill> skills = new HashSet<>(skillRepo.findAllById(skillIds));
            profile.setSkills(skills);
        }

        return mapper.toDTO(mentorRepo.save(profile));
    }

    @GetMapping("/{id}")
    public MentorProfileDTO getMentorProfile(@PathVariable Long id) {
        return mentorRepo.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
    }
}

