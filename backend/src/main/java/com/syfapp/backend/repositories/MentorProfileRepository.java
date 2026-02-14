package com.syfapp.backend.repositories;

import com.syfapp.backend.models.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentorProfileRepository extends JpaRepository<MentorProfile, Long> {
}
