package com.example.news.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Base {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "createdBy", updatable = false)
    @CreatedBy // thêm thông tin người dùng
    private String createdBy;

    @Column(name = "createdDate")
    @CreatedDate // thêm ngày tạo
    //private Date createdDate;
    private LocalDateTime createdDate;

    @Column(name = "modifiedBy")
    @LastModifiedBy // người sửa
    private String modifiedBy;

    @Column(name = "modifiedDate")
    @LastModifiedDate // ngày sửa
//    private Date modifiedDate;
    private LocalDateTime modifiedDate;

    @PrePersist
    public void prePersist() {
        createdDate = LocalDateTime.now();

        // Ở đây, bạn có thể lấy thông tin người tạo (createdBy)
        // từ ngữ cảnh bảo mật hoặc bất kỳ nguồn nào khác.
        // Thiết lập createdBy nếu cần thiết
    }

    @PreUpdate
    public void preUpdate() {
        if (id != null) { // Only set modifiedDate if the entity is not new
            modifiedDate = LocalDateTime.now();
            // Set modifiedBy if necessary
        }
        // Tương tự, lấy thông tin người sửa đổi (modifiedBy).
    }
}
