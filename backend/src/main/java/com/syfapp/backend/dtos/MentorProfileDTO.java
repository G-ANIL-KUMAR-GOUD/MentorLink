package com.syfapp.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MentorProfileDTO {
    private Long mentorId;
    private Long userId;
    private String userName;
    private String headline;
    private Integer experienceYears;
    private String expertiseArea;
    private String linkedinUrl;
    private String availability;
    private Set<String> skills; // skill names only
}

