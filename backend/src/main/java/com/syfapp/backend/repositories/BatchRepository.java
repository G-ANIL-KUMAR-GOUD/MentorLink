package com.syfapp.backend.repositories;

import com.syfapp.backend.models.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {
}
