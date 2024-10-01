package com.example.news.dto.response;

import com.example.news.entity.News;
import com.example.news.entity.NewsDto;
import com.example.news.entity.Role;
import com.example.news.repository.UserRepository;
import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Data
//@SuperBuilder
//@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse extends BaseResponse<UserResponse> {
//    Long id;
    String userName;
    String fullName;
    String email;
    String avatar;
    LocalDate dob;
    String phoneNumber;
    RoleResponse role;
    /*String createdBy;
    LocalDateTime createdDate;
    String modifiedBy;
    LocalDateTime modifiedDate;*/
}
