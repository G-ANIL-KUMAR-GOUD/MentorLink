package com.syfapp.backend.controllers;
import com.syfapp.backend.models.MentorMenteeMap;
import com.syfapp.backend.services.MentorMenteeMapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor-mentee")
@RequiredArgsConstructor
public class MentorMenteeMapController {

    private final MentorMenteeMapService mapService;

    // Mentee requests a mentor
    @PostMapping("/request")
    public MentorMenteeMap requestMentor(@RequestParam Long menteeId,
                                         @RequestParam Long mentorId,
                                         @RequestParam Long batchId,
                                         @RequestParam String focusArea) {
        return mapService.requestMentor(menteeId, mentorId, batchId, focusArea);
    }

    // Mentor approves a mentee request
    @PutMapping("/{mapId}/approve")
    public MentorMenteeMap approveRequest(@PathVariable Long mapId) {
        return mapService.approveRequest(mapId);
    }

    // Get all mentees for a mentor
    @GetMapping("/mentor/{mentorId}")
    public List<MentorMenteeMap> getMenteesForMentor(@PathVariable Long mentorId) {
        return mapService.getMenteesForMentor(mentorId);
    }

    // Get all mentors for a mentee
    @GetMapping("/mentee/{menteeId}")
    public List<MentorMenteeMap> getMentorsForMentee(@PathVariable Long menteeId) {
        return mapService.getMentorsForMentee(menteeId);
    }

    // Get all mappings for a batch
    @GetMapping("/batch/{batchId}")
    public List<MentorMenteeMap> getMappingsForBatch(@PathVariable Long batchId) {
        return mapService.getMappingsForBatch(batchId);
    }
}
