package com.syfapp.backend.mappers;

import com.syfapp.backend.dtos.MenteeProfileDTO;
import com.syfapp.backend.dtos.MentorProfileDTO;
import com.syfapp.backend.models.MenteeProfile;
import com.syfapp.backend.models.MentorProfile;
import org.springframework.stereotype.Service;
import com.syfapp.backend.models.Skill;
import java.util.Set;
import java.util.stream.Collectors;
@Service
public class MentorProfileMapper {
    public MentorProfileDTO toDTO(MentorProfile profile) {
        Set<String> skillNames = profile.getSkills().stream().map(Skill::getSkillName).collect(Collectors.toSet());
        return new MentorProfileDTO(profile.getMentorId(), profile.getUser().getUserId(), profile.getUser().getName(), profile.getHeadline(), profile.getExperienceYears(), profile.getExpertiseArea(), profile.getLinkedinUrl(), profile.getAvailability(), skillNames);
    }
}