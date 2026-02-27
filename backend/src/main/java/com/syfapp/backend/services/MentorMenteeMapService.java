package com.syfapp.backend.services;

import com.syfapp.backend.models.Batch;
import com.syfapp.backend.models.MenteeProfile;
import com.syfapp.backend.models.MentorMenteeMap;
import com.syfapp.backend.models.MentorProfile;
import com.syfapp.backend.repositories.BatchRepository;
import com.syfapp.backend.repositories.MenteeProfileRepository;
import com.syfapp.backend.repositories.MentorMenteeMapRepository;
import com.syfapp.backend.repositories.MentorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorMenteeMapService {

    private final MentorMenteeMapRepository mapRepository;
    private final MentorProfileRepository mentorRepo;
    private final MenteeProfileRepository menteeRepo;
    private final BatchRepository batchRepo;

    public MentorMenteeMap requestMentor(Long menteeId, Long mentorId, Long batchId, String focusArea) {
        MenteeProfile mentee = menteeRepo.findById(menteeId)
                .orElseThrow(() -> new RuntimeException("Mentee not found"));
        MentorProfile mentor = mentorRepo.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));
        Batch batch = batchRepo.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        MentorMenteeMap map = new MentorMenteeMap();
        map.setMentee(mentee);
        map.setMentor(mentor);
        map.setBatch(batch);
        map.setFocusArea(focusArea);
        map.setStatus("REQUESTED");

        // also store the mentee's batch on their profile for easier access
        mentee.setBatch(batch);
        menteeRepo.save(mentee);

        return mapRepository.save(map);
    }

    public MentorMenteeMap approveRequest(Long mapId) {
        MentorMenteeMap map = mapRepository.findById(mapId)
                .orElseThrow(() -> new RuntimeException("Mapping not found"));
        map.setStatus("APPROVED");
        return mapRepository.save(map);
    }

    public List<MentorMenteeMap> getMenteesForMentor(Long mentorId) {
        return mapRepository.findByMentor_MentorId(mentorId);
    }

    public List<MentorMenteeMap> getMentorsForMentee(Long menteeId) {
        return mapRepository.findByMentee_MenteeId(menteeId);
    }

    public List<MentorMenteeMap> getMappingsForBatch(Long batchId) {
        return mapRepository.findByBatch_BatchId(batchId);
    }
}
