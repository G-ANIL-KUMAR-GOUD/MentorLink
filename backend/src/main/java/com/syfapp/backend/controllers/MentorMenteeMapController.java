package com.syfapp.backend.controllers;
import com.syfapp.backend.models.MenteeProfile;
import com.syfapp.backend.models.MentorMenteeMap;
import com.syfapp.backend.models.MentorProfile;
import com.syfapp.backend.repositories.MenteeProfileRepository;
import com.syfapp.backend.repositories.MentorMenteeMapRepository;
import com.syfapp.backend.repositories.MentorProfileRepository;
import lombok.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor-mentee")
@RequiredArgsConstructor
public class MentorMenteeMapController {

    private final MentorMenteeMapRepository mapRepository;
    private final MentorProfileRepository mentorRepo;
    private final MenteeProfileRepository menteeRepo;

    // Mentee requests a mentor
    @PostMapping("/request")
    public MentorMenteeMap requestMentor(@RequestParam Long menteeId,
                                         @RequestParam Long mentorId,
                                         @RequestParam String focusArea) {
        MenteeProfile mentee = menteeRepo.findById(menteeId)
                .orElseThrow(() -> new RuntimeException("Mentee not found"));
        MentorProfile mentor = mentorRepo.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        MentorMenteeMap map = new MentorMenteeMap();
        map.setMentee(mentee);
        map.setMentor(mentor);
        map.setFocusArea(focusArea);
        map.setStatus("REQUESTED");
        return mapRepository.save(map);
    }

    // Mentor approves a mentee request
    @PutMapping("/{mapId}/approve")
    public MentorMenteeMap approveRequest(@PathVariable Long mapId) {
        MentorMenteeMap map = mapRepository.findById(mapId)
                .orElseThrow(() -> new RuntimeException("Mapping not found"));
        map.setStatus("APPROVED");
        return mapRepository.save(map);
    }

    // Get all mentees for a mentor
    @GetMapping("/mentor/{mentorId}")
    public List<MentorMenteeMap> getMenteesForMentor(@PathVariable Long mentorId) {
        return mapRepository.findByMentor_MentorId(mentorId);
    }

    // Get all mentors for a mentee
    @GetMapping("/mentee/{menteeId}")
    public List<MentorMenteeMap> getMentorsForMentee(@PathVariable Long menteeId) {
        return mapRepository.findByMentee_MenteeId(menteeId);
    }
}

