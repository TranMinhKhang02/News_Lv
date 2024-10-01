package com.example.news.controller;

import com.example.news.dto.response.ApiResponse;
import com.example.news.dto.request.UserCreationRequest;
import com.example.news.dto.request.UserUpdateRequest;
import com.example.news.dto.response.UserResponse;
import com.example.news.entity.User;
import com.example.news.exception.AppException;
import com.example.news.exception.ErrorCode;
import com.example.news.mapper.UserMapper;
import com.example.news.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Slf4j
@RestController
@RequestMapping("/users")
public class UserController {

    UserService userService;
    UserMapper userMapper;
    HttpSession session;

    @PostMapping
    public ApiResponse<User> createUser(@RequestBody @Valid UserCreationRequest request) {
        log.info("Received request to create user: {}", request);  // Thêm log
        ApiResponse<User> apiResponse = new ApiResponse<>();

        apiResponse.setResult(userService.createUser(request));
        return apiResponse;
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        log.info("User is accessing getAllUsers endpoint");
        /*// Lấy đối tượng Authentication từ SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra nếu người dùng đã đăng nhập và có quyền hạn
        if (authentication != null && authentication.isAuthenticated()) {
            User user = (User) authentication.getPrincipal(); // Lấy thông tin người dùng

            // Kiểm tra role của người dùng
            if ("ADMIN".equals(user.getRole().getCode())) {
                return userService.getAllUsers(); // Trả về danh sách người dùng nếu là ADMIN
            }
        }*/
        /*User user = (User) httpRequest.getSession().getAttribute("user");
        if(user.getRole().getCode().equals("ADMIN")) {
            return userService.getAllUsers();
        }*/
//        throw new AppException(ErrorCode.UNAUTHORIZED);
        return userService.getAllUsers();
    }

    @GetMapping("/{userId}")
    public UserResponse getUser(@PathVariable("userId") long userId) {
        return userService.getUserById(userId);
    }

    @PutMapping("{userId}")
    public UserResponse updateUser(@PathVariable("userId") long userId, @RequestBody UserUpdateRequest request) {
        return userService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable("userId") long userId) {
        userService.deleteUser(userId);
        return "User has been deleted";
    }

    @GetMapping("/myInfo")
    public ApiResponse<UserResponse> getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // Lấy session hiện tại
        if (session == null || session.getAttribute("user") == null) {
            throw new AppException(ErrorCode.UNLOGIN); // Nếu không có session, throw exception
        }

        log.info("SecurityContext: {}", SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        log.info("Session ID in myInfo: {}", session.getId()); // Log ID session

        User user = (User) session.getAttribute("user");
        UserResponse userResponse = userMapper.toUserResponse(user);

        return ApiResponse.<UserResponse>builder()
                .result(userResponse)
                .build();
    }
}
