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

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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

    public User loginWithGoogle(String googleId, String email, String fullName, String avatar, LocalDate dob) {
        // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu hay chưa
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);

        if (existingUser.isPresent()) {
            // Nếu người dùng đã tồn tại, trả về người dùng đó
            return existingUser.get();
        } else {
            // Nếu người dùng chưa tồn tại, tạo tài khoản mới
            User newUser = new User();
            newUser.setGoogleId(googleId);
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setAvatar(avatar);
            newUser.setDob(dob);
            newUser.setStatus(1);

            // Đặt role mặc định cho người dùng mới
            Role defaultRole = roleRepository.findById(2L)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy role!"));
            newUser.setRole(defaultRole);

            // Lưu người dùng mới vào cơ sở dữ liệu
            return userRepository.save(newUser);
        }
    }
    /*public User loginWithGoogle(String googleId, String email, String fullName) {
        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setGoogleId(googleId);
                    newUser.setEmail(email);
                    newUser.setFullName(fullName);
                    newUser.setStatus(1);
                    return userRepository.save(newUser);
                });
        return user;
    }*/
}
