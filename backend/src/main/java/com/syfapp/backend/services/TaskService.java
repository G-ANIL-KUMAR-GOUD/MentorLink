package com.syfapp.backend.services;

import com.syfapp.backend.dtos.AssignTaskDTO;
import com.syfapp.backend.dtos.TaskResponseDTO;
import com.syfapp.backend.models.MentorMenteeMap;
import com.syfapp.backend.models.Task;
import com.syfapp.backend.repositories.MentorMenteeMapRepository;
import com.syfapp.backend.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final MentorMenteeMapRepository mapRepository;


    public TaskResponseDTO assignTask(AssignTaskDTO dto) {

        MentorMenteeMap map = mapRepository.findById(dto.getMentorMenteeMapId())
                .orElseThrow(() -> new RuntimeException("Mapping not found"));

        Task task = new Task();
        task.setMentorMenteeMap(map);
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : "ASSIGNED");
        task.setDueDate(dto.getDueDate());

        Task saved = taskRepository.save(task);

        return TaskResponseDTO.builder()
                .taskId(saved.getTaskId())
                .description(saved.getDescription())
                .status(saved.getStatus())
                .dueDate(saved.getDueDate())
                .build();
    }


    public TaskResponseDTO updateTaskStatus(Long taskId, String status) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(status);

        Task updated = taskRepository.save(task);

        return TaskResponseDTO.builder()
                .taskId(updated.getTaskId())
                .description(updated.getDescription())
                .status(updated.getStatus())
                .dueDate(updated.getDueDate())
                .build();
    }


    public List<TaskResponseDTO> getTasksForMentee(Long menteeId) {

        return taskRepository.findTasksByMenteeId(menteeId)
                .stream()
                .map(task -> TaskResponseDTO.builder()
                        .taskId(task.getTaskId())
                        .description(task.getDescription())
                        .status(task.getStatus())
                        .dueDate(task.getDueDate())
                        .build())
                .toList();
    }


    public List<Task> getTasksForMentor(Long mentorId) {
        return taskRepository.findByMentorMenteeMap_Mentor_MentorId(mentorId);
    }

    public List<Task> getTasksForMapping(Long mapId) {
        return taskRepository.findByMentorMenteeMap_MapId(mapId);
    }
}
