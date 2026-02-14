package com.syfapp.backend.dtos;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MenteeProfileDTO {
    private Long menteeId;
    private Long userId;
    private String userName;
    private String currentRole;
    private String education;
    private String goals;
    private String interests;
    private Set<String> skills; // skill names only
}
