package com.syfapp.backend.repositories;

import com.syfapp.backend.models.MenteeProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface MenteeProfileRepository extends JpaRepository<MenteeProfile, Long> {

    Optional<MenteeProfile> findByUserUserId(Long userId);


}
