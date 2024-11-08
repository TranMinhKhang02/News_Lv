package com.example.news.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String passwordPrevious;
    String password;
    String fullName;
    String email;
    String phoneNumber;
//    String avatar;
//    String cloudinaryId;
    LocalDate dob;
}
