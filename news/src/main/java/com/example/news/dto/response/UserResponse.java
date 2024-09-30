package com.example.news.dto.response;

import com.example.news.entity.News;
import com.example.news.entity.NewsDto;
import com.example.news.entity.Role;
import com.example.news.repository.UserRepository;
import jakarta.persistence.Column;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

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
    String password;
    String fullName;
    String email;
    String avatar;
    Date dob;
    String phoneNumber;
    Role role;
    /*String createdBy;
    LocalDateTime createdDate;
    String modifiedBy;
    LocalDateTime modifiedDate;*/
}
