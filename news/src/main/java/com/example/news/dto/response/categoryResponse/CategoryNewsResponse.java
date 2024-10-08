package com.example.news.dto.response.categoryResponse;

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
public class CategoryNewsResponse {
    Long id;
    String name;
    String code;
    CategoryNewsResponse parentCategory; // Tham chiếu đến thể loại cha
}
