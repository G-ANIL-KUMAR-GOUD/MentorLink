package com.syfapp.backend.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
    private String token;
    private String role;
    private Long userId;
}
