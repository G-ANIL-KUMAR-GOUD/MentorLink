package com.syfapp.backend.repositories;

import com.syfapp.backend.models.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill,Long> {
    Optional<Skill> findBySkillName(String skillName);
}
