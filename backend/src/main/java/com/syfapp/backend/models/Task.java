package com.syfapp.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @ManyToOne
    @JoinColumn(name = "map_id", nullable = false)
    private MentorMenteeMap mentorMenteeMap;

    private String description;
    private String status; // ASSIGNED, IN_PROGRESS, COMPLETED
    private LocalDate dueDate;
    private LocalDateTime createdAt = LocalDateTime.now();
}
