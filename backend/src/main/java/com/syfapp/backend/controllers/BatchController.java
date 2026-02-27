package com.syfapp.backend.controllers;

import com.syfapp.backend.models.Batch;
import com.syfapp.backend.services.BatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @GetMapping
    public List<Batch> getAllBatches() {
        return batchService.getAllBatches();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Batch> getBatchById(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.getBatchById(id));
    }

    @PostMapping
    public Batch createBatch(@RequestBody Batch batch) {
        return batchService.createBatch(batch);
    }

    @PutMapping("/{id}")
    public Batch updateBatch(@PathVariable Long id, @RequestBody Batch updatedBatch) {
        return batchService.updateBatch(id, updatedBatch);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{batchId}/assign-manager/{managerId}")
    public Batch assignManager(@PathVariable Long batchId, @PathVariable Long managerId) {
        return batchService.assignManager(batchId, managerId);
    }

    @PutMapping("/{batchId}/assign-mentee/{menteeId}")
    public Batch assignMentee(@PathVariable Long batchId, @PathVariable Long menteeId) {
        return batchService.assignMentee(batchId, menteeId);
    }
}
