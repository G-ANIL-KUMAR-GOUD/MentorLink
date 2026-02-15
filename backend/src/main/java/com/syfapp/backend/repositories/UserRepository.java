package com.syfapp.backend.repositories;

import com.syfapp.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("""
            SELECT COUNT(u)
            FROM User u
            JOIN UserRole ur ON u.userId = ur.user.userId
            JOIN Role r ON ur.role.roleId = r.roleId
            WHERE r.roleName = :roleName
            """)
    long countUsersByRole(String roleName);



}
