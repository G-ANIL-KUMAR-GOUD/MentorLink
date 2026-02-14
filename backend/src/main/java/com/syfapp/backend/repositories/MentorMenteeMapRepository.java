package com.syfapp.backend.repositories;

import com.syfapp.backend.models.MentorMenteeMap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MentorMenteeMapRepository extends JpaRepository<MentorMenteeMap, Long> {
    List<MentorMenteeMap> findByMentor_MentorId(Long mentorId);
    List<MentorMenteeMap> findByMentee_MenteeId(Long menteeId);
    List<MentorMenteeMap> findByBatch_BatchId(Long batchId);


}

