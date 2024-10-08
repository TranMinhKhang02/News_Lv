package com.example.news.controller;

import com.example.news.dto.request.UserCreationRequest;
import com.example.news.dto.request.AuthenticationRequest;
import com.example.news.dto.response.ApiResponse;
import com.example.news.dto.response.AuthenticationResponse;
import com.example.news.entity.User;
import com.example.news.service.AuthenticationService;
import com.example.news.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    AuthenticationService authenticationService;
    UserService userService;

    @PostMapping("/register")
    public RedirectView createUser(@RequestBody @Valid UserCreationRequest request) {
        userService.createUser(request);
        return new RedirectView("/news_lv/page/home");
    }

    /*@PostMapping("/log-in")
    public ResponseEntity<Map<String, String>> authenticate(
            @RequestBody AuthenticationRequest request, HttpServletRequest httpRequest, HttpSession session) {

        var result = authenticationService.authenticate(request, httpRequest);

        User user = (User) httpRequest.getSession().getAttribute("user");
        if (user != null && user.getRole() != null) {
            log.info("User ID: {}", user.getId());
            session.setAttribute("fullName", user.getFullName());

            String redirectUrl;
            if (user.getRole().getCode().startsWith("ADMIN")) {
                redirectUrl = "/news_lv/page/admin";
            } else {
                redirectUrl = "/news_lv/page/home";
            }

            // Trả về URL chuyển hướng trong JSON
            return ResponseEntity.ok(Map.of("redirectUrl", redirectUrl));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Thông tin đăng nhập không hợp lệ"));
    }*/

    @PostMapping("/log-in")
    public ApiResponse<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request, HttpServletRequest httpRequest) {
        var result = authenticationService.authenticate(request, httpRequest);

        // Lấy thông tin người dùng từ kết quả xác thực
        User user = (User) httpRequest.getSession().getAttribute("user");
        if (user != null && user.getRole() != null) {

            // In log thông tin người dùng
            log.info("User role: {}", user.getRole().getCode());
            log.info("User authorities: {}", SecurityContextHolder.getContext().getAuthentication().getAuthorities());
            log.info("User context: {}", SecurityContextHolder.getContext().getAuthentication());

        }

        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .result(result)
                .build();
    }
}
