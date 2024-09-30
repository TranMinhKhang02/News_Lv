package com.example.news.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link News}
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsDto implements Serializable {
    private Long id;
    private String createdBy;
    private LocalDateTime createdDate;
    private String modifiedBy;
    private LocalDateTime modifiedDate;
    private String title;
    private String content;
    private String thumbnail;
    private String shortDescription;
    private Long viewCount;
    private Long commentCount;
    private Long likeCount;
    private String source;
    private String rejectReason;
    private String summary;
    private boolean isSummarized;
    private String audioPath;
    private LocalDateTime summary_createDate;
}