package com.example.news.configuration;

import com.example.news.entity.User;
import com.example.news.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;


@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Lấy thông tin người dùng từ Google
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String googleId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String fullName = (String) attributes.get("name");
        String avatar = (String) attributes.get("picture");
        LocalDate dob = attributes.containsKey("birthdate") ? LocalDate.parse((String) attributes.get("birthdate")) : null;

        // Lưu hoặc cập nhật người dùng trong database
        User user = userService.loginWithGoogle(googleId, email, fullName, avatar, dob);

        return oAuth2User; // Trả về thông tin người dùng cho Spring Security
    }
}
