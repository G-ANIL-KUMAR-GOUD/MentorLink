package com.syfapp.backend.services;

import com.syfapp.backend.models.Feedback;
import com.syfapp.backend.models.MentorMenteeMap;
import com.syfapp.backend.models.Task;
import com.syfapp.backend.repositories.FeedbackRepository;
import com.syfapp.backend.repositories.MentorMenteeMapRepository;
import com.syfapp.backend.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final MentorMenteeMapRepository mapRepository;
    private final TaskRepository taskRepository;
    private final FeedbackRepository feedbackRepository;

    // Mentor performance: average rating + task counts
    public Map<String, Object> getMentorPerformance(Long mentorId) {
        Map<String, Object> result = new HashMap<>();

        List<Feedback> feedbackList = feedbackRepository.findByMentorMenteeMap_Mentor_MentorId(mentorId);
        double avgRating = feedbackList.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

        List<Task> tasks = taskRepository.findByMentorMenteeMap_Mentor_MentorId(mentorId);
        long completedTasks = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();

        result.put("mentorId", mentorId);
        result.put("averageRating", avgRating);
        result.put("totalTasks", tasks.size());
        result.put("completedTasks", completedTasks);
        return result;
    }

    // Mentee progress: tasks completed + feedback received
    public Map<String, Object> getMenteeProgress(Long menteeId) {
        Map<String, Object> result = new HashMap<>();

        List<Task> tasks = taskRepository.findByMentorMenteeMap_Mentee_MenteeId(menteeId);
        long completedTasks = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();

        List<Feedback> feedbackList = feedbackRepository.findByMentorMenteeMap_Mentee_MenteeId(menteeId);

        result.put("menteeId", menteeId);
        result.put("completedTasks", completedTasks);
        result.put("totalTasks", tasks.size());
        result.put("feedbackCount", feedbackList.size());
        return result;
    }

    // Batch-level analytics: engagement + ratings
    public Map<String, Object> getBatchAnalytics(Long batchId) {
        Map<String, Object> result = new HashMap<>();

        List<MentorMenteeMap> mappings = mapRepository.findByBatch_BatchId(batchId);
        List<Task> tasks = taskRepository.findByMentorMenteeMap_MapId(batchId);
        List<Feedback> feedbackList = feedbackRepository.findByMentorMenteeMap_MapId(batchId);

        double avgRating = feedbackList.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

        long completedTasks = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();

        result.put("batchId", batchId);
        result.put("totalMappings", mappings.size());
        result.put("totalTasks", tasks.size());
        result.put("completedTasks", completedTasks);
        result.put("averageRating", avgRating);
        return result;
    }
}
