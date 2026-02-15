package com.syfapp.backend.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardDTO {

    private long totalUsers;
    private long totalMentors;
    private long totalMentees;
    private long totalManagers;

    private long totalBatches;
    private long totalMappings;

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
}

