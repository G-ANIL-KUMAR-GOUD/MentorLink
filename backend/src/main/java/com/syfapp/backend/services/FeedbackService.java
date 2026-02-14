package com.syfapp.backend.services;

import com.syfapp.backend.models.Feedback;
import com.syfapp.backend.models.MentorMenteeMap;
import com.syfapp.backend.repositories.FeedbackRepository;
import com.syfapp.backend.repositories.MentorMenteeMapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final MentorMenteeMapRepository mapRepository;

    public Feedback submitFeedback(Long mapId, String comments, int rating) {
        MentorMenteeMap map = mapRepository.findById(mapId)
                .orElseThrow(() -> new RuntimeException("Mentor-Mentee mapping not found"));

        Feedback feedback = new Feedback();
        feedback.setMentorMenteeMap(map);
        feedback.setComments(comments);
        feedback.setRating(rating);
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getFeedbackForMapping(Long mapId) {
        return feedbackRepository.findByMentorMenteeMap_MapId(mapId);
    }

    public List<Feedback> getFeedbackForMentor(Long mentorId) {
        return feedbackRepository.findByMentorMenteeMap_Mentor_MentorId(mentorId);
    }

    public List<Feedback> getFeedbackForMentee(Long menteeId) {
        return feedbackRepository.findByMentorMenteeMap_Mentee_MenteeId(menteeId);
    }
}
