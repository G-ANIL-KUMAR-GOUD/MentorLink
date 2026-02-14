package com.syfapp.backend.services;

import com.syfapp.backend.models.Skill;
import com.syfapp.backend.repositories.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {
    private final SkillRepository skillRepository;

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }
}

