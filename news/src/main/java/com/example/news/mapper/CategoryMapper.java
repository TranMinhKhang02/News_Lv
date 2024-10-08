package com.example.news.mapper;

import com.example.news.dto.request.CategoryRequest;
import com.example.news.dto.request.CategoryUpdateRequest;
import com.example.news.dto.response.categoryResponse.CategoryResponse;
import com.example.news.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "parentCategory", source = "parentCategory")
    Category toCategory(CategoryRequest request);

    CategoryResponse toCategoryResponse(Category category);

    @Mapping(target = "parentCategory", source = "parentCategory")
    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);

    default Category map(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        Category category = new Category();
        category.setId(categoryId);
        return category;
    }
}
