package com.syfapp.backend.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRoleDTO {
    private Long userId;
    private Long roleId;
    private Long batchId;
    private String userName;
    private String roleName;
    private String batchName;
}
