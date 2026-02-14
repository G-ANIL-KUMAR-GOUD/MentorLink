package com.syfapp.backend.models;


import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class UserRoleId implements Serializable {

    private Long userId;
    private Long roleId;
    private Long batchId;

}
