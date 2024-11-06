package com.example.news.controller;

import com.example.news.dto.request.AdminCreateUserRequest;
import com.example.news.dto.request.UserUpdateRequestByAdmin;
import com.example.news.dto.response.ApiNewsResponse;
import com.example.news.dto.response.ApiResponse;
import com.example.news.dto.request.UserCreationRequest;
import com.example.news.dto.request.UserUpdateRequest;
import com.example.news.dto.response.NewsResponse;
import com.example.news.dto.response.userResponse.UserResponse;
import com.example.news.entity.News;
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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @PostMapping("/createUser/{roleId}")
    public ApiResponse<UserResponse> adminCreateUser(
            @PathVariable("roleId") long roleId,
            @RequestBody @Valid AdminCreateUserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(userService.adminCreateUser(request, roleId))
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/usersByRoleAndStatus")
    public ApiResponse<List<UserResponse>> getUsersByRoleAndStatus
            (@RequestParam String roleCode,
            @RequestParam(value = "status", defaultValue = "1") int status) {
        return ApiResponse.<List<UserResponse>>builder()
                .code(1000)
                .result(userService.getUserByRoleAndStatus(roleCode, status))
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<UserResponse> getUser(@PathVariable("userId") long userId) {
        var userById = userService.getUserById(userId);
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(userById)
                .build();
    }

    @PutMapping("{userId}")
    public ApiResponse<UserResponse> updateUser(@PathVariable("userId") long userId, @RequestBody UserUpdateRequest request) {
        var updateUser = userService.updateUser(userId, request);
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(updateUser)
                .build();
    }

    @PutMapping("/updateRole/{userId}")
    public ApiResponse<UserResponse> updateUserRole(
            @PathVariable("userId") long userId,
            @RequestBody UserUpdateRequestByAdmin request) {
        var updateUser = userService.updateUserRole(userId, request);
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(updateUser)
                .build();
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable("userId") long userId) {
        userService.deleteUser(userId);
        return "User has been deleted";
    }

    @PostMapping("/favorite/{newsId}")
    public void favoriteNews(@PathVariable Long newsId, @RequestParam Long userId) {
//        User user = (User) session.getAttribute("user");
//        Long userId = user.getId();
        userService.favoriteNews(userId, newsId);
    }

    @GetMapping("/favorite")
    public ApiNewsResponse<Set<NewsResponse>> getFavoriteNews(
            @RequestParam Long userId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
//        User user = (User) session.getAttribute("user");
        if(userId == null) {
            throw new AppException(ErrorCode.UNLOGIN);
        }
        List<NewsResponse> newsResponses = userService.getFavoriteNewsPageable(userId, page, size);
        int totalNewsByUserId = userService.countAllFavoriteNews(userId);
        int totalPage = (int) Math.ceil((double) totalNewsByUserId / size);
        return ApiNewsResponse.<Set<NewsResponse>>builder()
                .code(1000)
                .page(page)
                .totalPage(totalPage)
                .result(new HashSet<>(newsResponses))
                .build();
    }

    @PutMapping("/favorite/{newsId}")
    public void deleteFavoriteNews(
            @PathVariable Long newsId,
            @RequestParam Long userId) {
        userService.deleteFavoriteNews(userId, newsId);
    }

    @PutMapping("/update-status")
    public ApiResponse<UserResponse> updateStatus(@RequestBody List<Long> userIds) {
        userService.updateStatus(userIds, 0);
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .build();
    }

    @GetMapping("/checkUserName")
    public ApiResponse<Boolean> checkUserName(@RequestParam String userName) {
        return ApiResponse.<Boolean>builder()
                .code(1000)
                .result(userService.checkUserExist(userName))
                .build();
    }

    @GetMapping("/myInfo")
    public ApiResponse<UserResponse> getCurrentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // Lấy session hiện tại

        User user = (User) session.getAttribute("user");
        if (user == null) {
            throw new AppException(ErrorCode.UNLOGIN); // Nếu không có user trong session, throw exception
        }

        // Kiểm tra và in ra các quyền trong SecurityContext
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            System.out.println("User authorities in myInfo: " + authentication.getAuthorities());
        } else {
            System.out.println("Authentication is null in myInfo.");
        }

        UserResponse userResponse = userMapper.toUserResponse(user);

        return ApiResponse.<UserResponse>builder()
                .result(userResponse)
                .build();
    }
}
