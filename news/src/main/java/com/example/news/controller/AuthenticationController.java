package com.example.news.controller;

import com.example.news.dto.response.ApiResponse;
import com.example.news.dto.request.AuthenticationRequest;
import com.example.news.dto.response.AuthenticationResponse;
import com.example.news.entity.User;
import com.example.news.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/log-in")
    public ApiResponse<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request, HttpServletRequest httpRequest) {
        var result = authenticationService.authenticate(request, httpRequest);

        // Lấy thông tin người dùng từ kết quả xác thực
        User user = (User) httpRequest.getSession().getAttribute("user");
        if (user != null && user.getRole() != null) {
            // Lấy mã của vai trò
            String roleCode = user.getRole().getCode();
            // In ra dòng log với mã của vai trò
            log.info("User role: {}", roleCode);
        }

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/log-out")
    public ApiResponse<String> logout(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().invalidate(); // Vô hiệu hóa session
        return ApiResponse.<String>builder()
                .result("Logout successful")
                .build();
    }
}
