package com.example.news.service;

import com.example.news.dto.request.RoleRequest;
import com.example.news.dto.response.RoleResponse;
import com.example.news.entity.Role;
import com.example.news.mapper.RoleMapper;
import com.example.news.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    /*public List<RoleResponse> getAll(){
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }*/

    public List<RoleResponse> getAll(int status) {
        var roles = roleRepository.findByStatus(status);
        return roles.stream().map(roleMapper::toRoleResponse).toList();
    }

    public RoleResponse getById(Long roleId) {
        var role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role!"));
        return roleMapper.toRoleResponse(role);
    }

    public RoleResponse create(RoleRequest request) {
        // Kiểm tra trùng lặp vai trò dựa trên code và categories
        boolean exists = roleRepository.existsByCodeAndCategories(request.getCode(), request.getCategories());
        if (exists) {
            throw new RuntimeException("Vai trò với mã và thể loại này đã tồn tại!");
        }
        var role = roleMapper.toRole(request);
        role.setStatus(1);
        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    public RoleResponse update(Long roleId, RoleRequest request) {
        var role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role!"));
        roleMapper.updateRole(request, role);
        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public void updateStatus(List<Long> roleIds, int status) {
        for(Long roleId : roleIds) {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy role!"));
            role.setStatus(status);
            roleRepository.save(role);
        }
    }
}
