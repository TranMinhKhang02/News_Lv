package com.example.news.pageRequest;

import com.example.news.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

//@RestController
/*@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final*/
@RequestMapping("/page")
@Controller
public class PageController {
    @Autowired
    private UserService userService;
    @Autowired
    private HttpSession session;

    @GetMapping("/login")
    public String login() {
        return "author/login"; // Trả về trang đăng nhập (login.html trong trường hợp này)
    }

    @GetMapping("/register")
    public String showRegistrationForm() {
        return "author/register";
    }

    @GetMapping("/home")
    public String showHomePage() {
        return "home/index";
    }

    @GetMapping("/admin")
    public String showAdminPage() {
        return "admin/homeAdmin";
    }

    @GetMapping("/profile")
    public String profile(OAuth2AuthenticationToken token, Model model) {
        model.addAttribute("name", token.getPrincipal().getAttribute("name"));
        model.addAttribute("email", token.getPrincipal().getAttribute("email"));
        model.addAttribute("photo", token.getPrincipal().getAttribute("picture"));
        return "user-profile";
    }

    @GetMapping("/info-user")
    public String showInfoUser() {
        return "user-profile";
    }

    @GetMapping("/user-profile")
    public ResponseEntity<Map<String, Object>> user(OAuth2AuthenticationToken authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Lấy thông tin người dùng từ OAuth2AuthenticationToken
        Map<String, Object> attributes = authentication.getPrincipal().getAttributes();

        // Tạo một map để chứa tất cả thông tin
        Map<String, Object> userInfo = new HashMap<>(attributes);

        return ResponseEntity.ok(userInfo); // Trả về toàn bộ thông tin người dùng
    }
    /*@GetMapping("/user-profile")
    public Principal user(Principal user) {
        return user;
    }*/
}
