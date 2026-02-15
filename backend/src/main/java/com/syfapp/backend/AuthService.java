package com.syfapp.backend;

import com.syfapp.backend.dtos.AuthResponseDTO;
import com.syfapp.backend.dtos.LoginRequestDTO;
import com.syfapp.backend.models.User;
import com.syfapp.backend.repositories.UserRepository;
import com.syfapp.backend.repositories.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    public AuthResponseDTO login(LoginRequestDTO dto) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow();

        String role = userRoleRepository
                .findByUserUserId(user.getUserId())
                .get(0)
                .getRole()
                .getRoleName();

        String token = jwtUtil.generateToken(user.getEmail(), role);

        return AuthResponseDTO.builder()
                .token(token)
                .role(role)
                .userId(user.getUserId())
                .build();
    }
}
