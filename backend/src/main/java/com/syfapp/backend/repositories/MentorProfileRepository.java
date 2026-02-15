package com.syfapp.backend.repositories;

import com.syfapp.backend.models.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MentorProfileRepository extends JpaRepository<MentorProfile, Long> {


    @Query("""
            SELECT DISTINCT mp
            FROM MentorProfile mp
            JOIN mp.skills s
            WHERE LOWER(s.skillName) IN :skills
            """)
    List<MentorProfile> findMentorsBySkillNames(List<String> skills);

    Optional<MentorProfile> findByUserUserId(Long userId);


}
