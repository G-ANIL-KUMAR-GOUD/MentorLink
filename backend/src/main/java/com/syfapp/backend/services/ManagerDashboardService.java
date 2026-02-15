package com.syfapp.backend.services;

import com.syfapp.backend.dtos.ManagerDashboardDTO;
import com.syfapp.backend.models.Batch;
import com.syfapp.backend.models.Task;
import com.syfapp.backend.repositories.BatchRepository;
import com.syfapp.backend.repositories.MentorMenteeMapRepository;
import com.syfapp.backend.repositories.TaskRepository;
import com.syfapp.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ManagerDashboardService {

    private final BatchRepository batchRepository;
    private final TaskRepository taskRepository;
    private final MentorMenteeMapRepository mapRepository;

    public ManagerDashboardDTO getDashboard(Long managerId) {


        List<Batch> batches = batchRepository.findByManagerUserId(managerId);

        int totalBatches = batches.size();


        List<Long> menteeIds = batches.stream()
                .flatMap(batch -> batch.getMentees().stream()) // uses existing relation
                .map(mp -> mp.getUser().getUserId())
                .toList();

        int totalMentees = menteeIds.size();

        int mentorMappings = (int) mapRepository.findAll().stream()
                .filter(map -> menteeIds.contains(map.getMentee().getMenteeId()))
                .count();

        List<Task> tasks = taskRepository.findAll().stream()
                .filter(task -> {
                    Long menteeId = task.getMentorMenteeMap()
                            .getMentee()
                            .getMenteeId();
                    return menteeIds.contains(menteeId);
                })
                .toList();

        int totalTasks = tasks.size();

        int completedTasks = (int) tasks.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();

        int pendingTasks = (int) tasks.stream()
                .filter(t -> !"COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();

        return ManagerDashboardDTO.builder()
                .totalBatches(totalBatches)
                .totalMentees(totalMentees)
                .totalMentorMappings(mentorMappings)
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .build();
    }
}
