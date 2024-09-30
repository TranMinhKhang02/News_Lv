package com.example.news.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định."),
    INVALID_KEY(1001, "Không tìm thấy message key."),
    USER_EXISTED(1002, "Username đã tồn tại."),
    USERNAME_INVALID(1003, "Username tối thiểu 4 kí tự."),
    INVALID_PASSWORD(1004, "Password tối thiểu 8 kí tự."),
    USER_NOT_EXISTED(1005, "Không tìm thấy username."),
    UNAUTHENTICATED(1006, "Đăng nhập không thành công."), // 401
    UNLogin(1007, "Người dùng chưa đăng nhập vào hệ thống."), // 401
    ;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    private int code;
    private String message;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
