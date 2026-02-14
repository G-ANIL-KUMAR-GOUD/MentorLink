package com.syfapp.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_mentee_map")
@Getter
@Setter
public class MentorMenteeMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mapId;

    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private MentorProfile mentor;

    @ManyToOne
    @JoinColumn(name = "mentee_id", nullable = false)
    private MenteeProfile mentee;

    @Column(nullable = false)
    private Long batchId; // FK to Batch (Phase 2)

    private String focusArea;   // e.g. "Java", "Leadership"
    private String status;      // e.g. "REQUESTED", "APPROVED", "ACTIVE"

    private LocalDateTime createdAt = LocalDateTime.now();
}
