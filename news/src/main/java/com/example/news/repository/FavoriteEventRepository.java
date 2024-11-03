package com.example.news.repository;

import com.example.news.entity.FavoriteEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FavoriteEventRepository extends JpaRepository<FavoriteEvent, Long> {
    Long countByEventDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<FavoriteEvent> findByEventDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    int countByEventDateBetweenAndNews_Categories_Code(LocalDateTime startOfDay, LocalDateTime endOfDay, String category);

    void deleteByNewsIdAndUserId(long newsId, long userId);

    int countByEventDateBetweenAndNews_CreatedBy(LocalDateTime startOfDay, LocalDateTime endOfDay, String createdBy);
}
