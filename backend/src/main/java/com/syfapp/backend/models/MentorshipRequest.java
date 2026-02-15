package com.syfapp.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentorship_requests")
@Getter
@Setter
@NoArgsConstructor
public class MentorshipRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private User mentor;

    @ManyToOne
    @JoinColumn(name = "mentee_id")
    private User mentee;

    private String status; // PENDING

    private LocalDateTime createdAt = LocalDateTime.now();

}
