package com.example.news.configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dd1grolgr",
                "api_key", "165223227289875",
                "api_secret", "KuEgKknBTrJ7-FdsAHGJYa_Jx4c"
        ));
    }
}
