package com.syfapp.backend.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AssignTaskDTO {

    private Long mentorMenteeMapId;
    private String description;
    private String status;   // optional → default ASSIGNED
    private LocalDate dueDate;
}
