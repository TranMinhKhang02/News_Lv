package com.example.news.service;

import com.example.news.dto.request.UserCreationRequest;
import com.example.news.dto.request.UserUpdateRequest;
import com.example.news.dto.response.UserResponse;
import com.example.news.entity.Role;
import com.example.news.entity.User;
import com.example.news.exception.AppException;
import com.example.news.exception.ErrorCode;
import com.example.news.mapper.UserMapper;
import com.example.news.repository.RoleRepository;
import com.example.news.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

//@Slf4j
@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;

    public User createUser(UserCreationRequest request) {
//        Role role = new Role();
        if(userRepository.existsByUserName(request.getUserName()))
            throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request);
        user.setStatus(1);

        // Đặt role id mặc định là 2
        Role defaultRole = roleRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role!"));
        user.setRole(defaultRole);
        // Mã hoá mật khẩu Bcrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public UserResponse updateUser(long userId, UserUpdateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));

        userMapper.updateUser(user, request);
        // Mã hoá mật khẩu Bcrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(long userId) {
        userRepository.deleteById(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public UserResponse getUserById(long id) {
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!")));
    }

    public UserResponse getUserByUsername(String username) {
        return userMapper.toUserResponse(userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!")));
    }
}
