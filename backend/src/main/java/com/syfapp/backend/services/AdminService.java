package com.syfapp.backend.services;

import com.syfapp.backend.models.Batch;
import com.syfapp.backend.models.Role;
import com.syfapp.backend.models.User;
import com.syfapp.backend.models.UserRole;
import com.syfapp.backend.repositories.BatchRepository;
import com.syfapp.backend.repositories.RoleRepository;
import com.syfapp.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BatchRepository batchRepository;

    // Create a Manager user
    public User createManager(User user) {
        Role managerRole = roleRepository.findByRoleName("MANAGER")
                .orElseThrow(() -> new RuntimeException("MANAGER role not found"));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        // Assign MANAGER role
        UserRole userRole = new UserRole();
        userRole.setUser(savedUser);
        userRole.setRole(managerRole);
        // persist via UserRoleRepository if needed

        return savedUser;
    }

    // Assign Manager to a Batch
    public Batch assignManagerToBatch(Long batchId, Long managerId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        batch.setManager(manager);
        return batchRepository.save(batch);
    }

    // View all batches with managers
    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }
}
