package com.example.news.configuration;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//@RequiredArgsConstructor // Thay thế Autowried
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private SessionInterceptor sessionInterceptor;

    // Các endpoint public được định nghĩa là biến final
    public final String[] PUBLIC_ENDPOINTS = {
            "/auth/**",
            "/users",
            "/page/**",
            "/static/**"
    };

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionInterceptor)
                .addPathPatterns("/**") // Áp dụng cho tất cả các API
                .excludePathPatterns(PUBLIC_ENDPOINTS); // Ngoại trừ các endpoint public
    }
}
