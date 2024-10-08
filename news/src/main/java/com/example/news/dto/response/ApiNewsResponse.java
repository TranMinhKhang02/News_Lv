package com.example.news.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiNewsResponse<T> {
    int code = 1000;
//    LocalDateTime currentTime = LocalDateTime.now(); // Thêm trường timestamp
    String message;
    int page;
    int totalPage;
    T result;
}
