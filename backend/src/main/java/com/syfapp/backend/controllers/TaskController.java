package com.syfapp.backend.controllers;

import com.syfapp.backend.models.Task;
import com.syfapp.backend.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // Assign a new task
    @PostMapping("/assign")
    public Task assignTask(@RequestParam Long mapId,
                           @RequestParam String description,
                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate) {
        return taskService.assignTask(mapId, description, dueDate);
    }

    // Update task status
    @PutMapping("/{taskId}/status")
    public Task updateTaskStatus(@PathVariable Long taskId, @RequestParam String status) {
        return taskService.updateTaskStatus(taskId, status);
    }

    // Get tasks for a mentee
    @GetMapping("/mentee/{menteeId}")
    public List<Task> getTasksForMentee(@PathVariable Long menteeId) {
        return taskService.getTasksForMentee(menteeId);
    }

    // Get tasks for a mentor
    @GetMapping("/mentor/{mentorId}")
    public List<Task> getTasksForMentor(@PathVariable Long mentorId) {
        return taskService.getTasksForMentor(mentorId);
    }

    // Get tasks for a specific mentor-mentee mapping
    @GetMapping("/map/{mapId}")
    public List<Task> getTasksForMapping(@PathVariable Long mapId) {
        return taskService.getTasksForMapping(mapId);
    }
}

