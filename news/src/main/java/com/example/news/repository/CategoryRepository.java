package com.example.news.repository;

import com.example.news.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByStatus(Integer status);
    // Lấy category parentId là null
    List<Category> findAllByParentCategoryNotNullAndStatus(int status);

    List<Category> findTop4ByStatusAndParentCategoryNotNullOrderByCreatedDateDesc(int status);
}
