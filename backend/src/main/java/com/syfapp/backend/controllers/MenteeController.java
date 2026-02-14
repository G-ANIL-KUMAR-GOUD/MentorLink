package com.syfapp.backend.controllers;

import com.syfapp.backend.models.MenteeProfile;
;
import com.syfapp.backend.services.MenteeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
@RestController
@RequestMapping("/api/mentees")
@RequiredArgsConstructor
public class MenteeController {

    private final MenteeService menteeService;

    @GetMapping
    public List<MenteeProfile> getAllMentees() {
        return menteeService.getAllMentees();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenteeProfile> getMenteeById(@PathVariable Long id) {
        return ResponseEntity.ok(menteeService.getMenteeById(id));
    }

    @PostMapping
    public MenteeProfile createMentee(@RequestBody MenteeProfile menteeProfile) {
        return menteeService.createMentee(menteeProfile);
    }

    @PutMapping("/{id}/skills")
    public MenteeProfile assignSkills(@PathVariable Long id, @RequestBody List<Long> skillIds) {
        return menteeService.assignSkills(id, skillIds);
    }

    @PostMapping("/{id}/skills/{skillId}")
    public MenteeProfile addSkill(@PathVariable Long id, @PathVariable Long skillId) {
        return menteeService.addSkill(id, skillId);
    }

    @DeleteMapping("/{id}/skills/{skillId}")
    public MenteeProfile removeSkill(@PathVariable Long id, @PathVariable Long skillId) {
        return menteeService.removeSkill(id, skillId);
    }
}
