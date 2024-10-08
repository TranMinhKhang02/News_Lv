package com.example.news.dto.request;

import com.example.news.entity.Category;
import com.example.news.entity.Status;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NewsRequest {
    String title;
    String content;
    String thumbnail;
    String shortDescription;
    String source;
//    String rejectReason; // lý do từ chối duyệt bài viết
//    String summary;
//    boolean isSummarized;
//    String audioPath;
//    LocalDateTime summary_createDate;
    Set<Long> categories;
    Long status;
}
