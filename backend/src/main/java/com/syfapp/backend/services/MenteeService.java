package com.syfapp.backend.services;

import com.syfapp.backend.models.MenteeProfile;
import com.syfapp.backend.models.Skill;
import com.syfapp.backend.models.Batch;
import com.syfapp.backend.repositories.MenteeProfileRepository;
import com.syfapp.backend.repositories.SkillRepository;
import com.syfapp.backend.repositories.BatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MenteeService {

    private final MenteeProfileRepository menteeProfileRepository;
    private final SkillRepository skillRepository;
    private final BatchRepository batchRepository;

    public List<MenteeProfile> getAllMentees() {
        return menteeProfileRepository.findAll();
    }

    public MenteeProfile getMenteeById(Long id) {
        return menteeProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mentee not found"));
    }

    public MenteeProfile createMentee(MenteeProfile menteeProfile) {
        return menteeProfileRepository.save(menteeProfile);
    }

    public MenteeProfile assignSkills(Long id, List<Long> skillIds) {
        MenteeProfile mentee = getMenteeById(id);
        Set<Skill> skills = new HashSet<>(skillRepository.findAllById(skillIds));
        mentee.setSkills(skills);
        return menteeProfileRepository.save(mentee);
    }

    public MenteeProfile addSkill(Long id, Long skillId) {
        MenteeProfile mentee = getMenteeById(id);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        mentee.getSkills().add(skill);
        return menteeProfileRepository.save(mentee);
    }

    public MenteeProfile removeSkill(Long id, Long skillId) {
        MenteeProfile mentee = getMenteeById(id);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        mentee.getSkills().remove(skill);
        return menteeProfileRepository.save(mentee);
    }

    public MenteeProfile assignBatch(Long id, Long batchId) {
        MenteeProfile mentee = getMenteeById(id);
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        mentee.setBatch(batch);
        return menteeProfileRepository.save(mentee);
    }
}
