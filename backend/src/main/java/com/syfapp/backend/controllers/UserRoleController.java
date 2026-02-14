package com.syfapp.backend.controllers;

import com.syfapp.backend.dtos.UserRoleDTO;
import com.syfapp.backend.models.*;
import com.syfapp.backend.repositories.BatchRepository;
import com.syfapp.backend.repositories.RoleRepository;
import com.syfapp.backend.repositories.UserRepository;
import com.syfapp.backend.repositories.UserRoleRepository;
import com.syfapp.backend.mappers.UserRoleMapperService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/user-roles")
@RequiredArgsConstructor
public class UserRoleController {

    private final UserRoleRepository userRoleRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BatchRepository batchRepository;
    private final UserRoleMapperService mapper;

        @PostMapping("/assign")
        public UserRoleDTO assignRole(@RequestParam Long userId,
                                      @RequestParam Long roleId,
                                      @RequestParam Long batchId) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Batch batch = batchRepository.findById(batchId)
                    .orElseThrow(() -> new RuntimeException("Batch not found"));

            UserRoleId id = new UserRoleId(userId, roleId, batchId);

            UserRole userRole = new UserRole();
            userRole.setId(id);
            userRole.setUser(user);
            userRole.setRole(role);
            userRole.setBatch(batch);

            UserRole saved = userRoleRepository.save(userRole);
            return mapper.toDTO(saved);
        }

        @GetMapping("/user/{userId}")
        public List<UserRoleDTO> getRolesForUser(@PathVariable Long userId) {
            return userRoleRepository.findByUser_UserId(userId)
                    .stream()
                    .map(mapper::toDTO)
                    .toList();
        }

        @GetMapping("/role/{roleId}")
        public List<UserRoleDTO> getUsersForRole(@PathVariable Long roleId) {
            return userRoleRepository.findByRole_RoleId(roleId)
                    .stream()
                    .map(mapper::toDTO)
                    .toList();
        }
}



