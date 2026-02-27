package com.syfapp.backend.services;

import com.syfapp.backend.models.Batch;
import com.syfapp.backend.models.User;
import com.syfapp.backend.repositories.BatchRepository;
import com.syfapp.backend.repositories.UserRepository;
import com.syfapp.backend.repositories.MenteeProfileRepository;

import com.syfapp.backend.models.MenteeProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final BatchRepository batchRepository;
    private final UserRepository userRepository;
    private final MenteeProfileRepository menteeRepo;

    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    public Batch getBatchById(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
    }

    public Batch createBatch(Batch batch) {
        return batchRepository.save(batch);
    }

    public Batch updateBatch(Long id, Batch updatedBatch) {
        Batch batch = getBatchById(id);
        batch.setBatchName(updatedBatch.getBatchName());
        batch.setStartDate(updatedBatch.getStartDate());
        batch.setEndDate(updatedBatch.getEndDate());
        return batchRepository.save(batch);
    }

    public void deleteBatch(Long id) {
        batchRepository.deleteById(id);
    }

    public Batch assignManager(Long batchId, Long managerId) {
        Batch batch = getBatchById(batchId);
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        batch.setManager(manager);
        return batchRepository.save(batch);
    }

    public Batch assignMentee(Long batchId, Long menteeId) {
        Batch batch = getBatchById(batchId);
        MenteeProfile mentee = menteeRepo.findById(menteeId)
                .orElseThrow(() -> new RuntimeException("Mentee profile not found"));
        mentee.setBatch(batch);
        menteeRepo.save(mentee);
        return batch;
    }
}
