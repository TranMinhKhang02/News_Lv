package com.example.news.pageRequest;

import com.example.news.dto.response.ApiResponse;
import com.example.news.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

//@RestController
/*@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final*/
@RequestMapping("/page")
@Controller
public class PageController {

    @ModelAttribute
    public void addUserInfoToModel(HttpSession session, Model model, HttpServletRequest httpRequest) {
        User user = (User) httpRequest.getSession().getAttribute("user");

        // Kiểm tra nếu người dùng đã đăng nhập
        if (user != null) {
            model.addAttribute("fullName", user.getFullName());
            model.addAttribute("userInfo", user);
        } else {
            model.addAttribute("userInfo", null);  // Người dùng chưa đăng nhập
        }
    }

    private void clearModelAttributes(Model model) {
        model.addAttribute("fullName", null);
        model.addAttribute("userInfo", null);
    }

    @GetMapping("/login")
    public String login() {
        return "login/login"; // Trả về trang đăng nhập (login.html trong trường hợp này)
    }

    @GetMapping("/register")
    public String showRegistrationForm() {
        return "login/register";
    }

    @GetMapping("/logout")
    public ApiResponse<Object> logout(Model model, HttpSession session) {
        session.invalidate();
        clearModelAttributes(model);
        return ApiResponse.builder().message("Logout successfully").build();
    }
    /*@GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/home/index";  // Chuyển hướng đến trang home
    }*/

    @GetMapping("/home")
    public String showHomePage() {
        return "home/index"; // Trả về trang home
    }

    @GetMapping("/myInfo")
    public String showMyInfoPage() {
        return "home/myInfo";
    }

    @GetMapping("/getSession-userId")
    public ResponseEntity<String> testSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // Không tạo session mới
        if (session != null) {
            User user = (User) session.getAttribute("user");
            if (user != null) {
                return ResponseEntity.ok("userId: " + user.getId());
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No user in session");
    }

    @GetMapping("/single")
    public String showSinglePage(HttpSession session, Model model, HttpServletRequest httpRequest) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("fullName", user.getFullName());
        } else {
            model.addAttribute("fullName"); // Hoặc một giá trị mặc định khác
        }
        return "home/single";
    }

    @GetMapping("/category")
    public String showCategoryPage() {
        return "home/category";
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

    @GetMapping("/profileAdmin")
    public String showProfilePage() {
        return "admin/profile";
    }

    @GetMapping("/newsTable")
    public String getNewsTable() {
        // Thêm dữ liệu vào model nếu cần
        return "admin/newsTable";
    }

    @GetMapping("/newsTableManage")
    public String getNewsTableManage() {
        // Thêm dữ liệu vào model nếu cần
        return "manage/newsTableManage";
    }

    @GetMapping("editNews")
    public  String getEditNews() {
        return "admin/editNews";
    }

    @GetMapping("/viewCommentByNews")
    public String getViewCommentByNews() {
        return "admin/viewCommentByNews";
    }

    @GetMapping("/categoryTable")
    public String getCategoryTable() {
        return "admin/categoryTable";
    }

    @GetMapping("/editCategory")
    public String getEditCategory() {
        return "admin/editCategory";
    }

    @GetMapping("/userTable")
    public String getUserTable() {
        return "admin/usersTable";
    }

    @GetMapping("/editUser")
    public String getEditUser() {
        return "admin/editUser";
    }

    @GetMapping("/roleTable")
    public String getRoleTable() {
        return "admin/roleTable";
    }

    @GetMapping("/editRole")
    public String getEditRole() {
        return "admin/editRole";
    }

    @GetMapping("/dashboardAdmin")
    public String getDashboardAdmin() {
        return "admin/dashboardAdmin";
    }

    @GetMapping("/dashboardManage")
    public String getDashboardManage() {
        return "manage/dashboardManage";
    }

    @GetMapping("/dashboardAuthor")
    public String getDashboardAuthor() {
        return "author/dashboardAuthor";
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
}
