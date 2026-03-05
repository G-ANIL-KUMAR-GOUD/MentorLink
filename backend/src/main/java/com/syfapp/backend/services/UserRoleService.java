package com.syfapp.backend.services;
import com.syfapp.backend.models.Batch;
import com.syfapp.backend.models.Role;
import com.syfapp.backend.models.User;
import com.syfapp.backend.models.UserRole;
import com.syfapp.backend.repositories.BatchRepository;
import com.syfapp.backend.repositories.RoleRepository;
import com.syfapp.backend.repositories.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final BatchRepository batchRepository;

    public void assignRoleToUser(User user, String roleName, Long batchId) {

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException(roleName + " role not found"));

        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);
        userRole.setBatch(batch);

        userRoleRepository.save(userRole);
    }
}
