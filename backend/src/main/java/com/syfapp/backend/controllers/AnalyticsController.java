package com.syfapp.backend.controllers;

import com.syfapp.backend.services.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // Mentor performance dashboard
    @GetMapping("/mentor/{mentorId}")
    public Map<String, Object> getMentorPerformance(@PathVariable Long mentorId) {
        return analyticsService.getMentorPerformance(mentorId);
    }

    // Mentee progress dashboard
    @GetMapping("/mentee/{menteeId}")
    public Map<String, Object> getMenteeProgress(@PathVariable Long menteeId) {
        return analyticsService.getMenteeProgress(menteeId);
    }

    // Batch-level analytics
    @GetMapping("/batch/{batchId}")
    public Map<String, Object> getBatchAnalytics(@PathVariable Long batchId) {
        return analyticsService.getBatchAnalytics(batchId);
    }
}
