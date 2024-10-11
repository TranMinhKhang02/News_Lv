package com.example.news.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentRequest {
    String content;
    Long parentComment; // Khoá ngoại tham chiếu đến comment ID dùng trả lời bình luận
    /*Long newsId;
    Long userId;*/
}
