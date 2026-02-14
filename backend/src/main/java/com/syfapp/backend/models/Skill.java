package com.syfapp.backend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "skills")
@Getter
@Setter
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long skillId;

    @Column(unique = true)
    private String skillName;

    @ManyToMany(mappedBy = "skills")
    private Set<MentorProfile> mentors;

    @JsonIgnore
    @ManyToMany(mappedBy = "skills")
    private Set<MenteeProfile> mentees;
}
