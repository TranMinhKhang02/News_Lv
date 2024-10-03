package com.example.news.controller;

import com.example.news.dto.request.UserCreationRequest;
import com.example.news.dto.response.ApiResponse;
import com.example.news.dto.request.AuthenticationRequest;
import com.example.news.dto.response.AuthenticationResponse;
import com.example.news.entity.User;
import com.example.news.service.AuthenticationService;
import com.example.news.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;

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

    @PostMapping("/log-in")
    public Object  authenticate(
            @ModelAttribute AuthenticationRequest request, HttpServletRequest httpRequest) {
        var result = authenticationService.authenticate(request, httpRequest);

        // Lấy thông tin người dùng từ kết quả xác thực
        User user = (User) httpRequest.getSession().getAttribute("user");
        if (user != null && user.getRole() != null) {

            // In log thông tin người dùng
            log.info("User role: {}", user.getRole().getCode());
            log.info("User authorities: {}", SecurityContextHolder.getContext().getAuthentication().getAuthorities());

            // Nếu role là ADMIN hoac là ADMIN_MANAGE, chuyển hướng đến trang admin
            if (user.getRole().getCode().startsWith("ADMIN")) {
                return new RedirectView("/news_lv/page/admin");
            } else if(user.getRole().getCode().equals("USER")) {
                return new RedirectView("/news_lv/page/home");
            }
        }

        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .result(result)
                .build();
    }

    @PostMapping("/log-out")
    public ApiResponse<String> logout(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().invalidate(); // Vô hiệu hóa session
        return ApiResponse.<String>builder()
                .code(1000)
                .result("Logout successful")
                .build();
    }
    /*@PostMapping("/log-in")
    public ApiResponse<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request, HttpServletRequest httpRequest) {
        var result = authenticationService.authenticate(request, httpRequest);

        // Lấy thông tin người dùng từ kết quả xác thực
        User user = (User) httpRequest.getSession().getAttribute("user");
        if (user != null && user.getRole() != null) {

            // In log thông tin người dùng
            log.info("User role: {}", user.getRole().getCode());
            log.info("User authorities: {}", SecurityContextHolder.getContext().getAuthentication().getAuthorities());
            log.info("User context: {}", SecurityContextHolder.getContext());

        }

        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .result(result)
                .build();
    }*/
}
