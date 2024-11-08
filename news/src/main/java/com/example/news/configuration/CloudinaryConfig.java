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

    @Bean
    public Cloudinary cloudinaryAudio() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dztroerja",
                "api_key", "135674519362858",
                "api_secret", "eJQPIzzOMaZ8wmAe0nt6WJfG_tI"
        ));
    }

    @Bean
    public Cloudinary cloudinaryAvatar() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dhocs0lis",
                "api_key", "671141423223572",
                "api_secret", "AkLDlGwfdngC4fvKvD3WcGctQ7A"
        ));
    }
}
