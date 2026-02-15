package com.syfapp.backend.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MentorSearchResponseDTO {

    private Long mentorId;
    private String mentorName;
    private String headline;
    private Integer experienceYears;
    private String expertiseArea;
}

