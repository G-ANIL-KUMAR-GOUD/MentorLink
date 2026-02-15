package com.syfapp.backend.dtos;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ManagerDashboardDTO {

    private int totalBatches;
    private int totalMentees;
    private int totalMentorMappings;

    private int totalTasks;
    private int completedTasks;
    private int pendingTasks;
}


