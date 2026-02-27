package com.syfapp.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

import com.syfapp.backend.models.Batch;

@Entity
@Table(name = "mentee_profiles")
@Getter
@Setter
public class MenteeProfile {

    @Id
    private Long menteeId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "mentee_id")
    private User user;

    private String currentRole;
    private String education;

    @Column(columnDefinition = "TEXT")
    private String goals;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @ManyToMany
    @JoinTable(name = "mentee_skills", joinColumns = @JoinColumn(name = "mentee_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private Set<Skill> skills = new HashSet<>();

    // a mentee may belong to a single batch; updated when they are assigned to one
    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;

}
