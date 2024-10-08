package com.example.news.dto.response.commentResponse;

import com.example.news.dto.response.userResponse.UserResponseComment;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
//@SuperBuilder
//@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentNewsResponse {
    Long id;
    String content;
    Long parentComment; // Khoá ngoại tham chiếu đến comment ID dùng trả lời bình luận
//    NewsResponse news;
    UserResponseComment user;
    List<CommentNewsResponse> replies; // Nên là danh sách phản hồi chứ không phải một comment
}
