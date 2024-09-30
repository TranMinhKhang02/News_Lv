package com.example.news.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class Base {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "createdBy")
    @CreatedBy // thêm thông tin người dùng
    private String createdBy;

    @Column(name = "createdDate")
    //@CreatedDate // thêm ngày tạo
    //private Date createdDate;
    private LocalDateTime createdDate;

    @Column(name = "modifiedBy")
    @LastModifiedBy // người sửa
    private String modifiedBy;

    @Column(name = "modifiedDate")
    /*@LastModifiedDate // ngày sửa
    private Date modifiedDate;*/
    private LocalDateTime modifiedDate;

    @PrePersist
    public void prePersist() {
        createdDate = LocalDateTime.now();

        // Ở đây, bạn có thể lấy thông tin người tạo (createdBy)
        // từ ngữ cảnh bảo mật hoặc bất kỳ nguồn nào khác.

    }

    @PreUpdate
    public void preUpdate() {
        modifiedDate = LocalDateTime.now();
        // Tương tự, lấy thông tin người sửa đổi (modifiedBy).
    }
}
