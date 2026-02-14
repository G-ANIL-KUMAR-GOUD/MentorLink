package com.syfapp.backend.mappers;

import com.syfapp.backend.dtos.UserRoleDTO;
import com.syfapp.backend.models.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserRoleMapperService {

    public UserRoleDTO toDTO(UserRole userRole) {
        return new UserRoleDTO(
                userRole.getUser().getUserId(),
                userRole.getRole().getRoleId(),
                userRole.getBatch().getBatchId(),
                userRole.getUser().getName(),
                userRole.getRole().getRoleName(),
                userRole.getBatch().getBatchName()
        );
    }
}

