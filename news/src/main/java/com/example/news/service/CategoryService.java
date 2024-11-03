package com.example.news.service;

import com.example.news.dto.request.CategoryRequest;
import com.example.news.dto.request.CategoryUpdateRequest;
import com.example.news.dto.response.categoryResponse.CategoryResponse;
import com.example.news.entity.Category;
import com.example.news.mapper.CategoryMapper;
import com.example.news.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    public CategoryResponse create(CategoryRequest request) {
        Category category = new Category();
        category = categoryMapper.toCategory(request);

        if (request.getParentCategory() != null) {
            Category parentCategory = categoryRepository.findById(request.getParentCategory())
                    .orElse(null);
            category.setParentCategory(parentCategory);
        }
        category.setStatus(1);
        category = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    // Lấy danh sách category có parentId là not null
    public List<CategoryResponse> getAll(int status) {
        List<Category> categories = categoryRepository.findAllByParentCategoryNotNullAndStatus(status);
        // Chuyển đổi từ Category sang CategoryResponse nếu cần
        return categories.stream().map(categoryMapper::toCategoryResponse).toList();
    }

    public List<CategoryResponse> getAllAndParent(int status) {
        var categories = categoryRepository.findAllByStatus(status);
        return categories.stream().map(categoryMapper::toCategoryResponse).toList();
    }

    public CategoryResponse getById(Long categoryId) {
        var category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Không tìm thấy category!"));
        if (category == null) {
            return null;
        }
        return categoryMapper.toCategoryResponse(category);
    }

    public CategoryResponse update(Long categoryId, CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Không tìm thấy category!"));
        categoryMapper.updateCategory(category, request);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public CategoryResponse delete(Long categoryId) {
        var category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Không tìm thấy category!"));
        if (category == null) {
            return null;
        }
        category.setStatus(0);
        category = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

}
