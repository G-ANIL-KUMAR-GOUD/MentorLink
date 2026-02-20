package com.syfapp.backend.services;

import com.syfapp.backend.models.User;
import com.syfapp.backend.models.UserRole;
import com.syfapp.backend.repositories.UserRepository;
import com.syfapp.backend.dtos.UserResponseDTO;
import com.syfapp.backend.dtos.RoleDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public UserResponseDTO toDTO(User user) {
        if (user == null)
            return null;
        List<RoleDTO> roles = user.getUserRoles() == null ? java.util.Collections.emptyList()
                : user.getUserRoles().stream()
                        .map((UserRole ur) -> new RoleDTO(ur.getRole().getRoleId(), ur.getRole().getRoleName()))
                        .collect(Collectors.toList());

        return new UserResponseDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getProfileInfo(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                roles);
    }

    public List<UserResponseDTO> getAllUserDTOs() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<UserResponseDTO> getUserDTOById(Long id) {
        return userRepository.findById(id).map(this::toDTO);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(updatedUser.getName());
                    user.setEmail(updatedUser.getEmail());
                    user.setPasswordHash(updatedUser.getPasswordHash());
                    user.setProfileInfo(updatedUser.getProfileInfo());
                    user.setUpdatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
