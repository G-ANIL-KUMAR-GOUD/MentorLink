package com.syfapp.backend.models;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Getter @Setter
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @ManyToOne
    @JoinColumn(name = "map_id")
    private MentorMenteeMap mentorMenteeMap;

    private LocalDateTime scheduledAt;
    private String topic;
    private String status; // SCHEDULED, COMPLETED, CANCELLED
}

