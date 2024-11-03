package com.example.news.configuration;

import com.example.news.entity.User;
import com.example.news.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

@Configuration
@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    @Lazy
    @Autowired
    private UserService userService;

    private final String[] PUBLIC_ENDPOINTS = {
            "/users/**",
            "/auth/**",
            "/page/**",
            "/role/**",
            "/news/**",
            "/comment/**",
            "/category/**",
            "/status/**",
            "/image/**",
            "/events/**",
            "/tts/**",
            /*"/users",
            "/auth/**",
            "/page/**"*/
    };

    private final String[] Get_PUBLIC_ENDPOINTS = {
            "/users/**",
            "role/**",
            "/page/**"
            /*"/user-profile",
            "/profile"*/
    };

    @Bean
    public CustomOAuth2UserService customOAuth2UserService() {
        return new CustomOAuth2UserService(userService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(request -> request
                    .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
//                    .requestMatchers(HttpMethod.GET, Get_PUBLIC_ENDPOINTS).permitAll()
                    .requestMatchers("/static/**").permitAll() // Cho phép truy cập vào tất cả các tệp tin tĩnh
                    /*.logout()
                        .logoutUrl("/page/logout") // Đặt URL cho logout
                        .logoutSuccessUrl("/home/index") // Chuyển hướng sau khi logout thành công
                        .permitAll() // Cho phép tất cả mọi người truy cập vào URL logout*/
                    .anyRequest().authenticated()
            )
            // Cấu hình session management
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.ALWAYS) // Tạo session nếu cần
                    .maximumSessions(1) // Cho phép 2 session tại một thời điểm
                    .maxSessionsPreventsLogin(false) // Cho phép user login lại nếu hết session
            )
            .oauth2Login(oauth2login -> oauth2login
                    .loginPage("/page/home")
                    .userInfoEndpoint(userInfo -> userInfo
                        .userService(customOAuth2UserService())
                    )
                    .successHandler(new CustomAuthenticationSuccessHandler(userService))
            )
            .csrf(AbstractHttpConfigurer::disable);


        // Tắt csrf để truy cập vào các api
//        http.csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }

    @Bean
        // Mã hoá mật khẩu
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

}
