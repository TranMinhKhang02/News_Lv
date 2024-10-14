package com.example.news.configuration;

import com.example.news.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalControllerAdvice {

    @ModelAttribute
    public void addUserInfoToModel(Model model, HttpServletRequest request) {
        HttpSession session = request.getSession(false); // Lấy session nếu tồn tại
        if (session != null) {
            User user = (User) session.getAttribute("user");
            if (user != null) {
                model.addAttribute("userInfo", user); // Thêm user vào model
            }
        }
    }
}

