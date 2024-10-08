package com.example.news.configuration;

import com.example.news.entity.User;
import com.example.news.exception.AppException;
import com.example.news.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class SessionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        if(session != null) {
            User user = (User) session.getAttribute("user");
            request.setAttribute("user", user);
        } else {
            throw new AppException(ErrorCode.UNLOGIN);
        }
        /*if (session == null || session.getAttribute("user") == null) {
            throw new AppException(ErrorCode.UNLOGIN);
        } else {
            User user = (User) session.getAttribute("user");
            request.setAttribute("fullName", user.fullName);
        }*/
        return true;
    }
    /*public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return false;
        }
        return true;
    }*/
}
