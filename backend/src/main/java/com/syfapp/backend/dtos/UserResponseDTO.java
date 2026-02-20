package com.syfapp.backend.dtos;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long userId;
    private String name;
    private String email;
    private String profileInfo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RoleDTO> roles;

}
