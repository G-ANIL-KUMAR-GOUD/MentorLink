package com.syfapp.backend.services;

import com.syfapp.backend.dtos.AdminDashboardDTO;
import com.syfapp.backend.models.Batch;
import com.syfapp.backend.models.Role;
import com.syfapp.backend.models.User;
import com.syfapp.backend.models.UserRole;
import com.syfapp.backend.repositories.*;
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
    private final MentorMenteeMapRepository mentorMenteeMapRepository;
    private final TaskRepository taskRepository;

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
    public String assignManagerToBatch(Long batchId, Long managerId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        batch.setManager(manager);
        batchRepository.save(batch);
        return "Manager with id "+ managerId +" is Assigned for batch "+batchId;
    }

    // View all batches with managers
    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public AdminDashboardDTO getDashboard() {

        long totalUsers = userRepository.count();

        long mentors = userRepository.countUsersByRole("MENTOR");
        long mentees = userRepository.countUsersByRole("MENTEE");
        long managers = userRepository.countUsersByRole("MANAGER");

        long batches = batchRepository.count();
        long mappings = mentorMenteeMapRepository.count();

        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus("COMPLETED");
        long pendingTasks = totalTasks - completedTasks;

        return AdminDashboardDTO.builder()
                .totalUsers(totalUsers)
                .totalMentors(mentors)
                .totalMentees(mentees)
                .totalManagers(managers)
                .totalBatches(batches)
                .totalMappings(mappings)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .build();
    }

}
