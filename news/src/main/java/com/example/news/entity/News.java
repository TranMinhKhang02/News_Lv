package com.example.news.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@AttributeOverrides({
        @AttributeOverride(name = "id", column = @Column(name = "n_id")),
        @AttributeOverride(name = "createdBy", column = @Column(name = "n_createBy")),
        @AttributeOverride(name = "createdDate", column = @Column(name = "n_createDate")),
        @AttributeOverride(name = "modifiedBy", column = @Column(name = "n_modifiedBy")),
        @AttributeOverride(name = "modifiedDate", column = @Column(name = "n_modifiedDate"))
})
@Table(name = "news")
public class News extends Base {

    @Column(name = "n_title")
    String title;

    @Column(columnDefinition = "longtext", name = "n_content") // Chỉ định rõ kiểu dữ liệu trong MySQL
    String content;

    @Column(name = "n_thumbnail")
    String thumbnail;

    @Column(name = "n_shortDescription")
    String shortDescription;

    @Column(name = "n_viewCount")
    Long viewCount;

    @Column(name = "n_commentCount")
    Long commentCount;

    @Column(name = "n_likeCount")
    Long likeCount;

    @Column(name = "n_source")
    String source;

    @Column(name = "n_rejectReason")
    String rejectReason; // lý do từ chối duyệt bài viết

    @Column(name = "n_summary")
    String summary;

    @Column(name = "n_isSummarized")
    boolean isSummarized;

    @Column(name = "n_audioPath")
    String audioPath;

    @Column(name = "summary_createDate")
    LocalDateTime summary_createDate;

    @ManyToMany
    @JoinTable(
            name = "news_category",
            joinColumns = @JoinColumn(name = "n_id"),
            inverseJoinColumns = @JoinColumn(name = "c_id")
    )
    Set<Category> categories;

    @ManyToOne
    @JoinColumn(name = "s_id")
    Status status;

    @ManyToMany(mappedBy = "favoriteNews")
    Set<User> usersFavorited;

    @OneToMany(mappedBy = "news")
    List<Comment> comments;

    public void prePersist() {
        if (isSummarized) { // Chỉ cập nhật summary_createDate nếu bài viết đã được tóm tắt
            summary_createDate = LocalDateTime.now();
        }
        // Ở đây, bạn có thể lấy thông tin người tạo (createdBy)
        // từ ngữ cảnh bảo mật hoặc bất kỳ nguồn nào khác.

    }
}
