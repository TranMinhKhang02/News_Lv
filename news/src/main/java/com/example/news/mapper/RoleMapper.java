package com.example.news.mapper;

import com.example.news.dto.request.RoleRequest;
import com.example.news.dto.response.RoleResponse;
import com.example.news.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    Role toRole(RoleRequest request);
    RoleResponse toRoleResponse(Role role);

    void updateRole(@MappingTarget RoleRequest request, Role role);
}
