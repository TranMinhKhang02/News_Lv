package com.example.news.dto.request;

import com.example.news.validator.DobConstraint;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminCreateUserRequest {

    @Size(min = 4, message = "USERNAME_INVALID")
    String userName;
    @Size(min = 4, message = "INVALID_PASSWORD")
    String password;
    String fullName;
    String email;
    @DobConstraint(min = 14, message = "INVALID_DOB")
    LocalDate dob;
//    Long roleId;
}
