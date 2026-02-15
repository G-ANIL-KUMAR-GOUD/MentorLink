package com.syfapp.backend.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MentorMenteeDTO {

    private Long menteeId;
    private String menteeName;
    private String batchName;
    private String mappingStatus;
}

