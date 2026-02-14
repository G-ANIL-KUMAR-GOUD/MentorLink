package com.syfapp.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "mentor_profiles")
@Getter
@Setter
public class MentorProfile {

    @Id
    private Long mentorId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "mentor_id")
    private User user;

    private String headline;
    private Integer experienceYears;
    private String expertiseArea;
    private String linkedinUrl;
    private String availability;

    @ManyToMany
    @JoinTable(
            name = "mentor_skills",
            joinColumns = @JoinColumn(name = "mentor_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills;
}

