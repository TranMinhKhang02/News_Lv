package com.example.news.repository;

import com.example.news.entity.ViewEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ViewEventRepository extends JpaRepository<ViewEvent, Long> {
    Long countByEventDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<ViewEvent> findByEventDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
