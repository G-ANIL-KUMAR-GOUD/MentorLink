package com.syfapp.backend.repositories;

import com.syfapp.backend.models.MenteeProfile;
import org.springframework.data.jpa.repository.JpaRepository;


public interface MenteeProfileRepository extends JpaRepository<MenteeProfile, Long> {
}
