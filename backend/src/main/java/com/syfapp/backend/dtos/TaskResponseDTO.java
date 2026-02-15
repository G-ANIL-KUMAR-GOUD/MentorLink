package com.syfapp.backend.dtos;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
public class TaskResponseDTO {

    private Long taskId;
    private String description;
    private String status;
    private LocalDate dueDate;
}
