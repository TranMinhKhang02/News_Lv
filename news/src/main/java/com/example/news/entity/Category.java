package com.example.news.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@AttributeOverrides({
        @AttributeOverride(name = "id", column = @Column(name = "c_id")),
        @AttributeOverride(name = "createdBy", column = @Column(name = "c_createBy")),
        @AttributeOverride(name = "createdDate", column = @Column(name = "c_createDate")),
        @AttributeOverride(name = "modifiedBy", column = @Column(name = "c_modifiedBy")),
        @AttributeOverride(name = "modifiedDate", column = @Column(name = "c_modifiedDate"))
})
public class Category extends Base {

    @Column(name = "c_name")
    String name;

    @Column(name = "c_code")
    String code;

    @Column(name = "c_description")
    String description;

    @Column(name = "c_status")
    int status;

    @ManyToOne // Quan hệ nhiều-một với chính nó
    @JoinColumn(name = "c_parent_id") // Tên cột khóa ngoại trong bảng Category
    Category parentCategory; // Tham chiếu đến thể loại cha

    @OneToMany(mappedBy = "parentCategory") // Quan hệ một-nhiều với chính nó
    @JsonBackReference // Không trả về danh sách category con trong parentCategory
    List<Category> subcategories; // Danh sách các thể loại con

    @ManyToMany(mappedBy = "categories")
    @JsonBackReference // Không trả về danh sách news trong phản hồi JSON
    Set<News> news;

}
