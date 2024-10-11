package com.example.news.mapper;

import com.example.news.dto.request.NewsRequest;
import com.example.news.dto.response.categoryResponse.CategoryNewsResponse;
import com.example.news.dto.response.NewsResponse;
import com.example.news.dto.response.StatusNewsResponse;
import com.example.news.entity.Category;
import com.example.news.entity.News;
import com.example.news.entity.Status;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface NewsMapper {

    @Mapping(target = "categories", source = "categories")
    @Mapping(target = "status", source = "status")
    News toNews(NewsRequest request);

    @Mapping(target = "countComment", expression = "java(news.getComments() != null ? news.getComments().size() : 0)")
    @Mapping(target = "countView", source = "viewCount")
    @Mapping(target = "countLike", source = "likeCount")
    NewsResponse toNewsResponse(News news);

    @Mapping(target = "categories", source = "categories")
    @Mapping(target = "status", source = "status")
    void updateNews(@MappingTarget News news, NewsRequest request);

    // Phương thức ánh xạ từ Long sang Status
    default Status map(Long statusId) {
        if (statusId == null) {
            return null;
        }
        Status status = new Status();
        status.setId(statusId); // Set ID của status
        return status;
    }

    // Phương thức ánh xạ từ Set<Long> sang Set<Category>
    default Set<Category> map(Set<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return new HashSet<>();
        }
        return categoryIds.stream().map(id -> {
            Category category = new Category();
            category.setId(id); // Set ID của category
            return category;
        }).collect(Collectors.toSet());
    }

    /*default CategoryNewsResponse toCategoryNewsResponse(Category category) {
        CategoryNewsResponse categoryNewsResponse = new CategoryNewsResponse();
        categoryNewsResponse.setId(category.getId());
        categoryNewsResponse.setName(category.getName());
        categoryNewsResponse.setCode(category.getCode());
        categoryNewsResponse.setParentCategory(category.getParentCategory() != null ? category.getParentCategory().getId() : null);
        return categoryNewsResponse;
    }*/
    default CategoryNewsResponse toCategoryNewsResponse(Category category) {
        CategoryNewsResponse categoryNewsResponse = new CategoryNewsResponse();
        categoryNewsResponse.setId(category.getId());
        categoryNewsResponse.setName(category.getName());
        categoryNewsResponse.setCode(category.getCode());
        if (category.getParentCategory() != null) {
            /*CategoryNewsResponse parentCategory = new CategoryNewsResponse();
            parentCategory.setId(category.getParentCategory().getId());
            parentCategory.setName(category.getParentCategory().getName());
            parentCategory.setCode(category.getParentCategory().getCode());
            categoryNewsResponse.setParentCategory(parentCategory);*/
            categoryNewsResponse.setParentCategory(toCategoryNewsResponse(category.getParentCategory()));
        }
        return categoryNewsResponse;
    }

    default StatusNewsResponse toStatusNewsResponse(Status status) {
        StatusNewsResponse statusNewsResponse = new StatusNewsResponse();
        statusNewsResponse.setId(status.getId());
        statusNewsResponse.setName(status.getName());
        statusNewsResponse.setCode(status.getCode());
        return statusNewsResponse;
    }
}
