package com.syfapp.backend.controllers;

import com.syfapp.backend.dtos.*;
import com.syfapp.backend.models.MentorProfile;


import com.syfapp.backend.models.Task;
import com.syfapp.backend.services.MentorSearchService;
import com.syfapp.backend.services.MentorService;
import com.syfapp.backend.services.MentorshipRequestService;
import com.syfapp.backend.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
public class MentorController {

    private final MentorService mentorService;
    private final MentorshipRequestService mentorshipRequestService;
    private final MentorSearchService mentorSearchService;
    private final TaskService taskService;

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

    @GetMapping("/{mentorId}/requests")
    public ResponseEntity<List<MentorshipRequestResponseDTO>> getPendingRequests(
            @PathVariable Long mentorId) {

        return ResponseEntity.ok(
                mentorshipRequestService.getPendingRequestsForMentor(mentorId)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<MentorSearchResponseDTO>> searchMentors(
            @RequestParam String skills) {

        return ResponseEntity.ok(
                mentorSearchService.searchMentorsBySkills(skills)
        );
    }

    @PutMapping("/requests/{requestId}/approve")
    public ResponseEntity<String> approveRequest(@PathVariable Long requestId) {

        return ResponseEntity.ok(
                mentorshipRequestService.approveRequest(requestId)
        );
    }

    @PostMapping("/tasks/assign")
    public ResponseEntity<TaskResponseDTO> assignTask(@RequestBody AssignTaskDTO dto) {

        return ResponseEntity.ok(taskService.assignTask(dto));
    }

    @GetMapping("/{mentorId}/mentees")
    public ResponseEntity<List<MentorMenteeDTO>> getMenteesForMentor(
            @PathVariable Long mentorId) {

        return ResponseEntity.ok(
                mentorService.getMenteesForMentor(mentorId)
        );
    }







}
