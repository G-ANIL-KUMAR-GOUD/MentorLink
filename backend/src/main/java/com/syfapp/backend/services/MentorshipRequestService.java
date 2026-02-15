package com.syfapp.backend.services;

import com.syfapp.backend.dtos.MentorshipRequestResponseDTO;
import com.syfapp.backend.models.*;
import com.syfapp.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorshipRequestService {

    private final MentorshipRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final MentorMenteeMapRepository mapRepository;
    private final MentorProfileRepository mentorProfileRepository;
    private final MenteeProfileRepository menteeProfileRepository;



    public MentorshipRequestResponseDTO sendRequest(Long mentorId, Long menteeId) {

        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        User mentee = userRepository.findById(menteeId)
                .orElseThrow(() -> new RuntimeException("Mentee not found"));

        MentorshipRequest request = new MentorshipRequest();
        request.setMentor(mentor);
        request.setMentee(mentee);
        request.setStatus("PENDING");

        MentorshipRequest saved = requestRepository.save(request);


        return MentorshipRequestResponseDTO.builder()
                .requestId(saved.getRequestId())
                .mentorId(mentor.getUserId())
                .mentorName(mentor.getName())
                .menteeId(mentee.getUserId())
                .menteeName(mentee.getName())
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public List<MentorshipRequestResponseDTO> getPendingRequestsForMentor(Long mentorId) {

        List<MentorshipRequest> requests =
                requestRepository.findByMentorUserIdAndStatus(mentorId, "PENDING");

        return requests.stream()
                .map(r -> MentorshipRequestResponseDTO.builder()
                        .requestId(r.getRequestId())
                        .mentorId(r.getMentor().getUserId())
                        .mentorName(r.getMentor().getName())
                        .menteeId(r.getMentee().getUserId())
                        .menteeName(r.getMentee().getName())
                        .status(r.getStatus())
                        .createdAt(r.getCreatedAt())
                        .build())
                .toList();
    }


    public String approveRequest(Long requestId) {


        MentorshipRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Request already processed");
        }

        Long mentorUserId = request.getMentor().getUserId();
        Long menteeUserId = request.getMentee().getUserId();


        MentorProfile mentorProfile = mentorProfileRepository
                .findByUserUserId(mentorUserId)
                .orElseThrow(() -> new RuntimeException("Mentor profile not found"));

        MenteeProfile menteeProfile = menteeProfileRepository
                .findByUserUserId(menteeUserId)
                .orElseThrow(() -> new RuntimeException("Mentee profile not found"));

        Batch batch = menteeProfile.getBatch();


        if (batch == null) {
            throw new RuntimeException("Mentee is not assigned to any batch");
        }

        MentorMenteeMap map = new MentorMenteeMap();
        map.setMentor(mentorProfile);
        map.setMentee(menteeProfile);
        map.setBatch(batch);

        mapRepository.save(map);


        request.setStatus("APPROVED");
        requestRepository.save(request);

        return "Request approved and mapping created";
    }



}
