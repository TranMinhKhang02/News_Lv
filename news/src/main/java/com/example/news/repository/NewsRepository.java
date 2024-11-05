package com.example.news.repository;

import com.example.news.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
//    void deleteNewsCategoryById(Long id);
    void deleteNewsCategoryById(Long Id);
    void deleteCommentsById(Long id);
    Page<News> findAllByStatusCode(String statusCode, Pageable pageable);
    long countAllByStatusCode(String status);

    List<News> findAllByCategories_code(String categoryCode);

    List<News> findAllByCategories_codeAndStatusCode(String categoryCode, String statusCode);
    long countByCategories_CodeAndStatusCode(String categoryCode, String statusCode);

//    Page<News> findAllByCategories_codeAndStatusCodeAndCreatedBy(String categoryCode, String statusCode, String createdBy, Pageable pageable);
Page<News> findAllByCreatedByAndStatusCodeAndCategories_code(String createdBy, String statusCode, String categoryCode, Pageable pageable);
    long countByCreatedByAndStatusCodeAndCategories_code(String createdBy, String statusCode, String categoryCode);

    Page<News> findAllByCategories_codeAndStatusCode(String categoryCode, String statusCode, Pageable pageable);
    long countAllByCategories_codeAndStatusCode(String categoryCode, String statusCode);

    Page<News> findByUsersFavorited_Id(Long userId, Pageable pageable);
    long countByUsersFavorited_Id(Long userId);

    @Query("SELECT COUNT(u) FROM User u JOIN u.favoriteNews n WHERE n.id = :newsId")
    long countLikesByNewsId(@Param("newsId") Long newsId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.news.id = :newsId")
    long countCommentsByNewId(@Param("newsId") Long newsId);

    List<News> findTop10ByOrderByCreatedDateDesc();
    List<News> findTop10ByStatusCodeOrderByCreatedDateDesc(String statusCode);

    List<News> findTop5ByOrderByViewCountDesc();
    List<News> findTop5ByStatusCodeOrderByViewCountDesc(String statusCode);

    List<News> findTop5ByOrderByLikeCountDesc();
    List<News> findTop5ByStatusCodeOrderByLikeCountDesc(String statusCode);

    List<News> findTop3ByCategories_codeAndStatusCodeOrderByModifiedDateDesc(String categoryCode, String statusCode);

    List<News> findBySummarizedFalse();


    /*@Modifying
    @Transactional
    @Query("UPDATE News n SET n.viewCount = n.viewCount + 1 WHERE n.id = :newsId")
    void incrementViewCount(@Param("newsId") Long newsId);*/
}
