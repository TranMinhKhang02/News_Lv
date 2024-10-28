package com.example.news.repository;

import com.example.news.entity.FavoriteEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FavoriteEventRepository extends JpaRepository<FavoriteEvent, Long> {
    Long countByEventDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<FavoriteEvent> findByEventDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
