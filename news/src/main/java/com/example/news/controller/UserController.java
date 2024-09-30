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
        ApiResponse<User> apiResponse = new ApiResponse<>();

        apiResponse.setResult(userService.createUser(request));
        return apiResponse;
    }


    @GetMapping
    public List<User> getAllUsers() {
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

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // Lấy session hiện tại
        if (session == null || session.getAttribute("user") == null) {
            throw new AppException(ErrorCode.UNLogin); // Nếu không có session, throw exception
        }

        User user = (User) session.getAttribute("user");
        UserResponse userResponse = userMapper.toUserResponse(user);

        return ApiResponse.<UserResponse>builder()
                .result(userResponse)
                .build();
    }
}
