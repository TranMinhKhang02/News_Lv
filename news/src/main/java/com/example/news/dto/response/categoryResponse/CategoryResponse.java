package com.example.news.dto.response.categoryResponse;

import com.example.news.dto.response.BaseResponse;
import com.example.news.entity.Category;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
//@SuperBuilder
//@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse extends BaseResponse<CategoryResponse> {
    String name;
    String code;
    String description;
//    int status;
    Category parentCategory; // Tham chiếu đến thể loại cha
}
