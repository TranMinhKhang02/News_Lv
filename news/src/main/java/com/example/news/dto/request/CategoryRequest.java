package com.example.news.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryRequest {
    String name;
    String code;
    String description;
    int status;
    Long parentCategory; // Tham chiếu đến thể loại cha
}
