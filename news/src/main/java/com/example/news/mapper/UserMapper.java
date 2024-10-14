package com.example.news.mapper;

import com.example.news.dto.request.UserCreationRequest;
import com.example.news.dto.request.UserUpdateRequest;
import com.example.news.dto.response.userResponse.UserResponse;
import com.example.news.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    //@Mapping(source = "", target = "")

    User toUser(UserCreationRequest request);
    // converter Entity to DTO User
//    @Mapping(target = "favoriteNews", source = "favoriteNews")
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
