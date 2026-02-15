package com.syfapp.backend.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
public class MentorshipRequestResponseDTO {

    private Long requestId;
    private Long mentorId;
    private String mentorName;

    private Long menteeId;
    private String menteeName;

    private String status;
    private LocalDateTime createdAt;
}
