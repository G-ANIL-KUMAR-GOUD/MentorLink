package com.syfapp.backend.repositories;

import com.syfapp.backend.models.UserRole;
import com.syfapp.backend.models.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {
    List<UserRole> findByUser_UserId(Long userId);
    List<UserRole> findByRole_RoleId(Long roleId);
}

