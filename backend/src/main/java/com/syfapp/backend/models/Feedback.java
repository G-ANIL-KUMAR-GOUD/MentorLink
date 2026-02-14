package com.syfapp.backend.models;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter
@Setter
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    @ManyToOne
    @JoinColumn(name = "map_id", nullable = false)
    private MentorMenteeMap mentorMenteeMap;

    private String comments;
    private int rating; // 1–5 scale
    private LocalDateTime submittedAt = LocalDateTime.now();
}

