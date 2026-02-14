package com.syfapp.backend.repositories;

import com.syfapp.backend.models.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByMentorMenteeMap_MapId(Long mapId);
    List<Feedback> findByMentorMenteeMap_Mentor_MentorId(Long mentorId);
    List<Feedback> findByMentorMenteeMap_Mentee_MenteeId(Long menteeId);
}

