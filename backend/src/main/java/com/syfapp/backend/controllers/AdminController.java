package com.syfapp.backend.controllers;

import com.syfapp.backend.models.Batch;
import com.syfapp.backend.models.User;
import com.syfapp.backend.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Create a Manager
    @PostMapping("/create-manager")
    public User createManager(@RequestBody User user) {
        return adminService.createManager(user);
    }

    // Assign Manager to Batch
    @PutMapping("/assign-manager/{batchId}/{managerId}")
    public Batch assignManagerToBatch(@PathVariable Long batchId,
                                      @PathVariable Long managerId) {
        return adminService.assignManagerToBatch(batchId, managerId);
    }

    // View all batches with managers
    @GetMapping("/batches")
    public List<Batch> getAllBatches() {
        return adminService.getAllBatches();
    }
}

