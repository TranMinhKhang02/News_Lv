package com.example.news.dto.response.userResponse;

import com.example.news.dto.response.BaseResponse;
import com.example.news.dto.response.NewsResponse;
import com.example.news.dto.response.RoleResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
//@SuperBuilder
//@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse extends BaseResponse<UserResponse> {
    String userName;
    String fullName;
    String email;
    String avatar;
    LocalDate dob;
    String phoneNumber;
    RoleResponse role;
//    Set<NewsResponse> favoriteNews;
}
