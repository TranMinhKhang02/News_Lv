package com.example.news.repository;

import com.example.news.entity.News;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    void deleteNewsCategoryById(Long id);
    Page<News> findAllByStatusCode(String statusCode, Pageable pageable);
    long countAllByStatusCode(String status);

    List<News> findAllByCategories_code(String categoryCode);
    List<News> findAllByCategories_codeAndStatusCode(String categoryCode, String statusCode);
    long countByCategories_Code(String categoryCode);

    Page<News> findAllByCategories_codeAndStatusCode(String categoryCode, String statusCode, Pageable pageable);
    long countAllByCategories_codeAndStatusCode(String categoryCode, String statusCode);

    Page<News> findByUsersFavorited_Id(Long userId, Pageable pageable);
    long countByUsersFavorited_Id(Long userId);

    @Query("SELECT COUNT(u) FROM User u JOIN u.favoriteNews n WHERE n.id = :newsId")
    long countLikesByNewsId(@Param("newsId") Long newsId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.news.id = :newsId")
    long countCommentsByNewId(@Param("newsId") Long newsId);

    List<News> findTop10ByOrderByCreatedDateDesc();

    List<News> findTop5ByOrderByViewCountDesc();

    /*@Modifying
    @Transactional
    @Query("UPDATE News n SET n.viewCount = n.viewCount + 1 WHERE n.id = :newsId")
    void incrementViewCount(@Param("newsId") Long newsId);*/
}
