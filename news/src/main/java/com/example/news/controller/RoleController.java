package com.example.news.controller;

import com.example.news.dto.request.RoleRequest;
import com.example.news.dto.response.ApiResponse;
import com.example.news.dto.response.RoleResponse;
import com.example.news.entity.Role;
import com.example.news.service.NewsService;
import com.example.news.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Slf4j
@RestController
@RequestMapping("/role")
public class RoleController {
    RoleService roleService;
    private final NewsService newsService;

    @GetMapping
    public ApiResponse<List<RoleResponse>> getAllRoles(
            @RequestParam(value = "status", defaultValue = "1") int status) {
        var roles = roleService.getAll(status);
//        log.info("Roles: {}", roles); // In log để kiểm tra danh sách RoleResponse
        return ApiResponse.<List<RoleResponse>>builder()
                .code(1000)
                .result(roles)
                .build();
    }

    @GetMapping("/{roleId}")
    public ApiResponse<RoleResponse> getRoleById(@PathVariable Long roleId) {
        return ApiResponse.<RoleResponse>builder()
                .code(1000)
                .result(roleService.getById(roleId))
                .build();
    }

    @PostMapping
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .code(1000)
                .result(roleService.create(request))
                .build();
    }

    @PutMapping("/{roleId}")
    public ApiResponse<RoleResponse> updateRole(@PathVariable Long roleId, @RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .code(1000)
                .result(roleService.update(roleId, request))
                .build();
    }

    @PutMapping("/update-status")
    public ApiResponse<RoleResponse> updateStatus(@RequestBody List<Long> roleIds) {
        roleService.updateStatus(roleIds, 0);
        return ApiResponse.<RoleResponse>builder()
                .code(1000)
                .message("Xóa vai trò thành công!")
                .build();
    }
}
