package com.example.news.controller;

import com.example.news.entity.User;
import com.example.news.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@RestController
public class Oauth2LoginController {
    UserService userService;
    HttpSession session;

    /*@GetMapping("/login/oauth2/code/google")
    public String googleCallback(OAuth2AuthenticationToken authentication) {
        if (authentication == null) {
            return "redirect:/page/login?error=true";
        }
        Map<String, Object> attributes = authentication.getPrincipal().getAttributes();
        String googleId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String fullName = (String) attributes.get("name");

        User user = userService.loginWithGoogle(googleId, email, fullName);
        session.setAttribute("user", user);

        return "redirect:/page/admin";
    }*/
}
