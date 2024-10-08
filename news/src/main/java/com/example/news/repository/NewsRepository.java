package com.example.news.repository;

import com.example.news.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
