package com.syfapp.backend.services;

import com.syfapp.backend.models.MentorProfile;
import com.syfapp.backend.models.Skill;
import com.syfapp.backend.repositories.MentorProfileRepository;
import com.syfapp.backend.repositories.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final MentorProfileRepository mentorProfileRepository;
    private final SkillRepository skillRepository;

    public List<MentorProfile> getAllMentors() {
        return mentorProfileRepository.findAll();
    }

    public MentorProfile getMentorById(Long id) {
        return mentorProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
    }

    public MentorProfile createMentor(MentorProfile mentorProfile) {
        return mentorProfileRepository.save(mentorProfile);
    }

    public MentorProfile assignSkills(Long id, List<Long> skillIds) {
        MentorProfile mentor = getMentorById(id);
        Set<Skill> skills = new HashSet<>(skillRepository.findAllById(skillIds));
        mentor.setSkills(skills);
        return mentorProfileRepository.save(mentor);
    }

    public MentorProfile addSkill(Long id, Long skillId) {
        MentorProfile mentor = getMentorById(id);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        mentor.getSkills().add(skill);
        return mentorProfileRepository.save(mentor);
    }

    public MentorProfile removeSkill(Long id, Long skillId) {
        MentorProfile mentor = getMentorById(id);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        mentor.getSkills().remove(skill);
        return mentorProfileRepository.save(mentor);
    }
}
