package com.syfapp.backend.controllers;

import com.syfapp.backend.models.MentorProfile;


import com.syfapp.backend.services.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
public class MentorController {

    private final MentorService mentorService;

    @GetMapping
    public List<MentorProfile> getAllMentors() {
        return mentorService.getAllMentors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MentorProfile> getMentorById(@PathVariable Long id) {
        return ResponseEntity.ok(mentorService.getMentorById(id));
    }

    @PostMapping
    public MentorProfile createMentor(@RequestBody MentorProfile mentorProfile) {
        return mentorService.createMentor(mentorProfile);
    }

    @PutMapping("/{id}/skills")
    public MentorProfile assignSkills(@PathVariable Long id, @RequestBody List<Long> skillIds) {
        return mentorService.assignSkills(id, skillIds);
    }

    @PostMapping("/{id}/skills/{skillId}")
    public MentorProfile addSkill(@PathVariable Long id, @PathVariable Long skillId) {
        return mentorService.addSkill(id, skillId);
    }

    @DeleteMapping("/{id}/skills/{skillId}")
    public MentorProfile removeSkill(@PathVariable Long id, @PathVariable Long skillId) {
        return mentorService.removeSkill(id, skillId);
    }
}
