package com.syfapp.backend.repositories;

import com.syfapp.backend.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByMentorMenteeMap_MapId(Long mapId);
    List<Task> findByMentorMenteeMap_Mentee_MenteeId(Long menteeId);
    List<Task> findByMentorMenteeMap_Mentor_MentorId(Long mentorId);
}
