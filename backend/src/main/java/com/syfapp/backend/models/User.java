package com.syfapp.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String passwordHash;

    @Column(columnDefinition = "TEXT")
    private String profileInfo;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    
    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<UserRole> userRoles;
}

