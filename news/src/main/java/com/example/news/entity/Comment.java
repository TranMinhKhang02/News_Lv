package com.example.news.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@AttributeOverrides({
        @AttributeOverride(name = "id", column = @Column(name = "com_id")),
        @AttributeOverride(name = "createdBy", column = @Column(name = "com_createBy")),
        @AttributeOverride(name = "createdDate", column = @Column(name = "com_createDate")),
        @AttributeOverride(name = "modifiedBy", column = @Column(name = "com_modifiedBy")),
        @AttributeOverride(name = "modifiedDate", column = @Column(name = "com_modifiedDate"))
})
public class Comment extends Base {

    @Column(name = "com_content")
    String content;

    @ManyToOne
    @JoinColumn(name = "com_com_id")
    Comment parentComment; // Khoá ngoại tham chiếu đến comment ID dùng trả lời bình luận

    @OneToMany(mappedBy = "parentComment")
    List<Comment> replies; // Các bình luận khi trả lời 1 bình luận

    @ManyToOne
    @JoinColumn(name = "n_id")
    News news;

    @ManyToOne
    @JoinColumn(name = "u_id")
    User user;

}
