package com.example.news.pageRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/login")
    public String login() {
        return "author/login"; // Trả về trang đăng nhập (login.html trong trường hợp này)
    }
}
