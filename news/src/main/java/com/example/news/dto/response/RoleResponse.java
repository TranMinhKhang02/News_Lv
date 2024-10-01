package com.example.news.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
//@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleResponse extends BaseResponse<RoleResponse> {
    String name;
    String code;
    String description;
    String categories;
    int status;
}
