package com.syfapp.backend.controllers;

import com.syfapp.backend.dtos.ManagerDashboardDTO;
import com.syfapp.backend.services.ManagerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/manager/dashboard")
@RequiredArgsConstructor
public class ManagerDashboardController {

    private final ManagerDashboardService dashboardService;

    @GetMapping("/{managerId}")
    public ResponseEntity<ManagerDashboardDTO> getDashboard(

            @PathVariable Long managerId) {

        return ResponseEntity.ok(
                dashboardService.getDashboard(managerId)
        );
    }
}

