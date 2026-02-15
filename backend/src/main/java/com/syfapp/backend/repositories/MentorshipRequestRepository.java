package com.syfapp.backend.repositories;

import com.syfapp.backend.models.MentorshipRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Long> {

    List<MentorshipRequest> findByMentorUserIdAndStatus(Long mentorId, String status);

    Optional<MentorshipRequest> findById(Long requestId);


}
