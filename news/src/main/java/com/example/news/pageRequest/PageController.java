package com.example.news.pageRequest;

import com.example.news.entity.User;
import com.example.news.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

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
        return "login/login"; // Trả về trang đăng nhập (login.html trong trường hợp này)
    }

    @GetMapping("/register")
    public String showRegistrationForm() {
        return "login/register";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/home/index";  // Chuyển hướng đến trang home
    }

    /*@GetMapping("/home")
    public String showHomePage(HttpSession session, Model model, HttpServletRequest httpRequest) {
        // Lấy thông tin người dùng từ kết quả xác thực
        User user = (User) httpRequest.getSession().getAttribute("user");
        // Lấy thông tin từ session
//        String fullName = (String) session.getAttribute("fullName");

        // Thêm vào model
        model.addAttribute("fullName", user.getFullName());
        return "home/index";
    }*/

    @GetMapping("/home")
    public String showHomePage(HttpSession session, Model model, HttpServletRequest httpRequest) {
        // Lấy thông tin người dùng từ kết quả xác thực
        User user = (User) httpRequest.getSession().getAttribute("user");

        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (user != null) {
            // Nếu người dùng đã đăng nhập, lấy tên đầy đủ
            model.addAttribute("fullName", user.getFullName());
        } else {
            // Nếu người dùng chưa đăng nhập, có thể thiết lập một giá trị mặc định cho fullName
            model.addAttribute("fullName", "Login"); // Hoặc giá trị mặc định khác
        }

        return "home/index"; // Trả về trang home
    }

    @GetMapping("/single")
    public String showSinglePage(HttpSession session, Model model, HttpServletRequest httpRequest) {User user = (User) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("fullName", user.getFullName());
        } else {
            model.addAttribute("fullName", "Guest"); // Hoặc một giá trị mặc định khác
        }
        return "home/single";
    }

    @GetMapping("/admin")
    public String showAdminPage(HttpSession session, Model model, HttpServletRequest httpRequest) {
        // Lấy thông tin người dùng từ kết quả xác thực
        User user = (User) httpRequest.getSession().getAttribute("user");
        // Lấy thông tin từ session
//        String fullName = (String) session.getAttribute("fullName");

        // Thêm vào model
        model.addAttribute("fullName", user.getFullName());
        return "admin/index";
    }

    @GetMapping("/profile")
    public String profile(OAuth2AuthenticationToken token, Model model) {
        model.addAttribute("name", token.getPrincipal().getAttribute("name"));
        model.addAttribute("given_name", token.getPrincipal().getAttribute("given_name"));
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
