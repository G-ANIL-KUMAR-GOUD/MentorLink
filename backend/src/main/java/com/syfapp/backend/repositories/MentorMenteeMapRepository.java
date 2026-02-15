package com.syfapp.backend.repositories;

import com.syfapp.backend.models.MentorMenteeMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MentorMenteeMapRepository extends JpaRepository<MentorMenteeMap, Long> {
    List<MentorMenteeMap> findByMentor_MentorId(Long mentorId);
    List<MentorMenteeMap> findByMentee_MenteeId(Long menteeId);
    List<MentorMenteeMap> findByBatch_BatchId(Long batchId);

    long count();

    @Query("""
            SELECT m
            FROM MentorMenteeMap m
            WHERE m.mentor.user.userId = :mentorId
            """)
    List<MentorMenteeMap> findByMentorUserId(Long mentorId);

}

