package com.syfapp.backend.services;

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

    public Task assignTask(Long mapId, String description, LocalDate dueDate) {
        MentorMenteeMap map = mapRepository.findById(mapId)
                .orElseThrow(() -> new RuntimeException("Mentor-Mentee mapping not found"));

        Task task = new Task();
        task.setMentorMenteeMap(map);
        task.setDescription(description);
        task.setStatus("ASSIGNED");
        task.setDueDate(dueDate);
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public List<Task> getTasksForMentee(Long menteeId) {
        return taskRepository.findByMentorMenteeMap_Mentee_MenteeId(menteeId);
    }

    public List<Task> getTasksForMentor(Long mentorId) {
        return taskRepository.findByMentorMenteeMap_Mentor_MentorId(mentorId);
    }

    public List<Task> getTasksForMapping(Long mapId) {
        return taskRepository.findByMentorMenteeMap_MapId(mapId);
    }
}
