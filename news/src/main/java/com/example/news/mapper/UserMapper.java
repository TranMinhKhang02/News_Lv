package com.example.news.mapper;

import com.example.news.dto.request.AdminCreateUserRequest;
import com.example.news.dto.request.UserCreationRequest;
import com.example.news.dto.request.UserUpdateRequest;
import com.example.news.dto.request.UserUpdateRequestByAdmin;
import com.example.news.dto.response.userResponse.UserResponse;
import com.example.news.entity.Role;
import com.example.news.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

//    @Mapping(target = "role", source = "roleId")
    User toUser(AdminCreateUserRequest request);
    //@Mapping(source = "", target = "")

    User toUser(UserCreationRequest request);
    // converter Entity to DTO User
//    @Mapping(target = "favoriteNews", source = "favoriteNews")
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget User user, UserUpdateRequest request);

    @Mapping(target = "role", source = "roleId")
    void updateUserRole(@MappingTarget User user, UserUpdateRequestByAdmin request);

    default Role map(Long roleId) {
        if (roleId == null) {
            return null;
        }
        Role role = new Role();
        role.setId(roleId);
        return role;
    }
}
