package com.example.news.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private SessionInterceptor sessionInterceptor;

    // Các endpoint public được định nghĩa là biến final
    public final String[] PUBLIC_ENDPOINTS = {
            "/auth/log-in",
            "/auth/log-out"
    };

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionInterceptor)
                .addPathPatterns("/**") // Áp dụng cho tất cả các API
                .excludePathPatterns(PUBLIC_ENDPOINTS); // Ngoại trừ các endpoint public
    }
}
