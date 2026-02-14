package com.syfapp.backend.controllers;

import com.syfapp.backend.dtos.MenteeProfileDTO;
import com.syfapp.backend.mappers.MenteeProfileMapper;
import com.syfapp.backend.models.MenteeProfile;
import com.syfapp.backend.models.Skill;
import com.syfapp.backend.models.User;
import com.syfapp.backend.repositories.MenteeProfileRepository;
import com.syfapp.backend.repositories.SkillRepository;
import com.syfapp.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/mentee-profiles")
@RequiredArgsConstructor
public class MenteeProfileController {

    private final MenteeProfileRepository menteeRepo;
    private final UserRepository userRepo;
    private final SkillRepository skillRepo;
    private final MenteeProfileMapper mapper;

    @PostMapping
    public MenteeProfileDTO createMenteeProfile(@RequestParam Long userId,
                                                @RequestParam String currentRole,
                                                @RequestParam String education,
                                                @RequestParam String goals,
                                                @RequestParam String interests,
                                                @RequestParam(required = false) List<Long> skillIds) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MenteeProfile profile = new MenteeProfile();
        profile.setUser(user);
        profile.setCurrentRole(currentRole);
        profile.setEducation(education);
        profile.setGoals(goals);
        profile.setInterests(interests);

        if (skillIds != null) {
            Set<Skill> skills = new HashSet<>(skillRepo.findAllById(skillIds));
            profile.setSkills(skills);
        }

        return mapper.toDTO(menteeRepo.save(profile));
    }

    @GetMapping("/{id}")
    public MenteeProfileDTO getMenteeProfile(@PathVariable Long id) {
        return menteeRepo.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Mentee not found"));
    }
}
