package com.example.news.configuration;

import com.example.news.entity.User;
import com.example.news.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.ui.Model;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;

    @Autowired
    public CustomAuthenticationSuccessHandler(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException, IOException {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
            Map<String, Object> attributes = authToken.getPrincipal().getAttributes();

            // Lấy thông tin người dùng từ Google
            String googleId = (String) attributes.get("sub");
            String email = (String) attributes.get("email");
            String fullName = (String) attributes.get("name");
            String avatar = (String) attributes.get("picture");
            log.info("Attributes: {}", attributes);
            LocalDate dob = attributes.containsKey("birthdate") ? LocalDate.parse((String) attributes.get("birthdate")) : null;
            log.info("Dob: {}", dob);

            // Lưu hoặc cập nhật người dùng trong database
            User user = userService.loginWithGoogle(googleId, email, fullName, avatar, dob);

            // Lưu thông tin user vào session
            HttpSession session = request.getSession(false);
            session.setAttribute("user", user);
            session.setAttribute("userIdGoogle", user.getId());

            // Cập nhật SecurityContextHolder với user details
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getCode()));
            Authentication newAuth = new UsernamePasswordAuthenticationToken(user, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(newAuth);

            String redirectUrl = "/news_lv/page/home";
            String userRole = user.getRole().getCode();
            if (userRole.equals("ADMIN") || userRole.equals("ADMIN_MANAGE") || userRole.equals("AUTHOR")) {
                redirectUrl = "/news_lv/page/admin";
            } else if (user.getRole().getCode().equals("USER")) {
                redirectUrl = "/news_lv/page/home";
            }

            // Thêm mã JavaScript để lưu thông tin vào sessionStorage
            String script = "<script>" +
                    "sessionStorage.setItem('userLogin', 'true');" +
                    "sessionStorage.setItem('Role', '" + user.getRole().getCode() + "');" +
                    "sessionStorage.setItem('categories', '" + user.getRole().getCategories() + "');" +
                    "sessionStorage.setItem('userName', '" + (user.getUserName() != null ? user.getUserName() : user.getEmail()) + "');" +
                    "sessionStorage.setItem('createdBy', '" + (user.getUserName() != null ? user.getUserName() : user.getEmail()) + "');" +
                    "sessionStorage.setItem('userId', '" + user.getId() + "');" +
                    "sessionStorage.setItem('fullName', '" + user.getFullName() + "');" +
                    "sessionStorage.setItem('avatar', '" + user.getAvatar() + "');" +
                    "sessionStorage.setItem('dob', '" + (user.getDob() != null ? user.getDob().toString() : "") + "');" +
                    "sessionStorage.setItem('roleName', '" + user.getRole().getName() + "');" +
                    "sessionStorage.setItem('phone', '" + user.getPhoneNumber() + "');" +
                    "sessionStorage.setItem('email', '" + user.getEmail() + "');" +
                    "window.location.href = '" + redirectUrl + "';" +
                    "</script>";

            response.setContentType("text/html");
            response.getWriter().write(script);

            // Chuyển hướng sau khi xử lý thành công
//            response.sendRedirect(redirectUrl);
        }

        // Chuyển hướng sau khi xử lý thành công
//        response.sendRedirect("/news_lv/page/home");
    }
}
