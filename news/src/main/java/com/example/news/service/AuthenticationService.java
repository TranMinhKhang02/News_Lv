package com.example.news.service;

import com.example.news.dto.request.AuthenticationRequest;
import com.example.news.dto.response.AuthenticationResponse;
import com.example.news.exception.AppException;
import com.example.news.exception.ErrorCode;
import com.example.news.mapper.UserMapper;
import com.example.news.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class AuthenticationService {
    UserRepository userRepository;
    UserService userService;
    UserMapper userMapper;

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletRequest httpRequest) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Lưu thông tin người dùng vào session
        HttpSession session = httpRequest.getSession();
        session.setAttribute("user", user);

        // Lưu vai trò vào SecurityContext
        /*List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().getCode())); // Lấy mã vai trò từ user
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(user, null, authorities));*/

        var userResponse = userService.getUserByUsername(request.getUserName());

        return AuthenticationResponse.builder()
                .authenticated(true)
                .user(userResponse)
                .build();
    }
    /*public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        var user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if(!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Store user in session
//        session.setAttribute("user", user);

        var userResponse = userService.getUserByUsername(request.getUserName());

        return AuthenticationResponse.builder()
                .authenticated(true)
                .user(userResponse)
                .build();
    }*/
}
