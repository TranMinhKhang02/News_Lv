package com.example.news.dto.response;

import com.example.news.dto.response.categoryResponse.CategoryNewsResponse;
import com.example.news.dto.response.commentResponse.CommentResponse;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Data
//@SuperBuilder
//@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsResponse extends BaseResponse<NewsResponse> {
    String title;
    String content;
    String thumbnail;
    String shortDescription;
    String source;
    String rejectReason; // lý do từ chối duyệt bài viết
    String summary;
    boolean isSummarized;
    String audioPath;
    LocalDateTime summary_createDate;
    int countComment;
//    CommentResponse comment;
    Set<CategoryNewsResponse> categories;
//    Set<CategoryResponse> categories;
    StatusNewsResponse status;
//    StatusResponse status;
}
