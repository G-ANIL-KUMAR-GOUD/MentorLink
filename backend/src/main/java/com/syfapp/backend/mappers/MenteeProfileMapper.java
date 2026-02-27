package com.syfapp.backend.mappers;

import com.syfapp.backend.dtos.MenteeProfileDTO;
import com.syfapp.backend.models.MenteeProfile;
import org.springframework.stereotype.Service;
import com.syfapp.backend.models.Skill;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MenteeProfileMapper {
    public MenteeProfileDTO toDTO(MenteeProfile profile) {
        Set<String> skillNames = profile.getSkills().stream().map(Skill::getSkillName).collect(Collectors.toSet());
        Long batchId = null;
        String batchName = null;
        if (profile.getBatch() != null) {
            batchId = profile.getBatch().getBatchId();
            batchName = profile.getBatch().getBatchName();
        }
        return new MenteeProfileDTO(
                profile.getMenteeId(),
                profile.getUser().getUserId(),
                profile.getUser().getName(),
                profile.getCurrentRole(),
                profile.getEducation(),
                profile.getGoals(),
                profile.getInterests(),
                batchId,
                batchName,
                skillNames);
    }
}
