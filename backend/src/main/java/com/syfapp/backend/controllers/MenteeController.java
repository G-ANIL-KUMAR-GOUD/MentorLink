package com.syfapp.backend.controllers;

import com.syfapp.backend.dtos.MentorRequestDTO;
import com.syfapp.backend.dtos.MentorshipRequestResponseDTO;
import com.syfapp.backend.dtos.TaskResponseDTO;
import com.syfapp.backend.models.MenteeProfile;

import com.syfapp.backend.models.MentorshipRequest;
import com.syfapp.backend.services.MenteeService;
import com.syfapp.backend.services.MentorshipRequestService;
import com.syfapp.backend.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentees")
@RequiredArgsConstructor
public class MenteeController {

    private final MentorshipRequestService mentorshipRequestService;
    private final TaskService taskService;
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

    @PostMapping("/{menteeId}/request-mentor")
    public ResponseEntity<MentorshipRequestResponseDTO> requestMentor(
            @PathVariable Long menteeId,
            @RequestBody MentorRequestDTO dto) {

        return ResponseEntity.ok(
                mentorshipRequestService.sendRequest(dto.getMentorId(), menteeId)
        );
    }

    @PutMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskResponseDTO> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                taskService.updateTaskStatus(taskId, status)
        );
    }

    @GetMapping("/{menteeId}/tasks")
    public ResponseEntity<List<TaskResponseDTO>> getTasksForMentee(
            @PathVariable Long menteeId) {

        return ResponseEntity.ok(
                taskService.getTasksForMentee(menteeId)
        );
    }






}
