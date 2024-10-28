package com.example.news.controller;

import com.example.news.dto.request.CategoryRequest;
import com.example.news.dto.request.CategoryUpdateRequest;
import com.example.news.dto.response.ApiResponse;
import com.example.news.dto.response.categoryResponse.CategoryResponse;
import com.example.news.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Slf4j
@RestController
@RequestMapping("/category")
public class CategoryController {
    CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        var categories = categoryService.getAll();
        return ApiResponse.<List<CategoryResponse>>builder()
                .code(1000)
                .result(categories)
                .build();
    }

    @GetMapping("/all")
    public ApiResponse<List<CategoryResponse>> getAllCategoriesAndParent() {
        var categories = categoryService.getAllAndParent();
        return ApiResponse.<List<CategoryResponse>>builder()
                .code(1000)
                .result(categories)
                .build();
    }

    @GetMapping("/{categoryId}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable Long categoryId) {
        var category = categoryService.getById(categoryId);
        return ApiResponse.<CategoryResponse>builder()
                .code(1000)
                .result(category)
                .build();
    }

    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        ApiResponse<CategoryResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(categoryService.create(request));
        return apiResponse;
    }

    @PutMapping("/{categoryId}")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable Long categoryId, @RequestBody CategoryUpdateRequest request) {
        var category = categoryService.update(categoryId, request);
        return ApiResponse.<CategoryResponse>builder()
                .code(1000)
                .result(category)
                .build();
    }
}
