package com.example.news.configuration;

//import com.example.news.filter.SessionCheckFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final String[] PUBLIC_ENDPOINTS = {
            "/users",
            "/auth/log-in",
            "/auth/log-out"
    };

    private final String[] Get_PUBLIC_ENDPOINTS = {
            "/users/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .authorizeHttpRequests(request -> request
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.GET, Get_PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated()
                )
                // Cấu hình session management
                .sessionManagement(session -> session
                        .maximumSessions(1) // Cho phép 2 session tại một thời điểm
                        .maxSessionsPreventsLogin(false) // Cho phép user login lại nếu hết session
                )
                .csrf(AbstractHttpConfigurer::disable);
//                .addFilterBefore(new SessionCheckFilter(), UsernamePasswordAuthenticationFilter.class); // Thêm filter


        // Tắt csrf để truy cập vào các api
//        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        return httpSecurity.build();
    }

    @Bean
        // Mã hoá mật khẩu
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

}
