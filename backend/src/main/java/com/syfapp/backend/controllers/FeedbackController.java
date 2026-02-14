package com.syfapp.backend.controllers;

import com.syfapp.backend.models.Feedback;
import com.syfapp.backend.services.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    // Submit feedback
    @PostMapping("/submit")
    public Feedback submitFeedback(@RequestParam Long mapId,
                                   @RequestParam String comments,
                                   @RequestParam int rating) {
        return feedbackService.submitFeedback(mapId, comments, rating);
    }

    // Get feedback for a specific mentor-mentee mapping
    @GetMapping("/map/{mapId}")
    public List<Feedback> getFeedbackForMapping(@PathVariable Long mapId) {
        return feedbackService.getFeedbackForMapping(mapId);
    }

    // Get feedback for a mentor
    @GetMapping("/mentor/{mentorId}")
    public List<Feedback> getFeedbackForMentor(@PathVariable Long mentorId) {
        return feedbackService.getFeedbackForMentor(mentorId);
    }

    // Get feedback for a mentee
    @GetMapping("/mentee/{menteeId}")
    public List<Feedback> getFeedbackForMentee(@PathVariable Long menteeId) {
        return feedbackService.getFeedbackForMentee(menteeId);
    }
}
