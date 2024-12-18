package com.example.news.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định.", HttpStatus.INTERNAL_SERVER_ERROR), // 500
    INVALID_KEY(1001, "Không tìm thấy message key.", HttpStatus.BAD_REQUEST), // 400
    USER_EXISTED(1002, "Username đã tồn tại.", HttpStatus.BAD_REQUEST), // 400
    USERNAME_INVALID(1003, "Username tối thiểu 4 kí tự.", HttpStatus.BAD_REQUEST), // 400
    INVALID_PASSWORD(1004, "Password tối thiểu 8 kí tự.", HttpStatus.BAD_REQUEST), // 400
    USER_NOT_EXISTED(1005, "Không tìm thấy username.", HttpStatus.NOT_FOUND), // 404
    UNAUTHENTICATED(1006, "Đăng nhập không thành công.", HttpStatus.UNAUTHORIZED), // 401
    // 401 Sẽ xảy ra trước khi vào tầng Service trong hệ thống, mà xảy ra ở tầng filter: Global không thể bắt
    UNLOGIN(1007, "Người dùng chưa đăng nhập vào hệ thống.", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1008, "Không có quyền truy cập.", HttpStatus.FORBIDDEN), // 403
    INVALID_DOB(1009, "Bạn không đủ tuổi để tham gia vào hệ thống", HttpStatus.BAD_REQUEST), // 400
    METHOD_NOT_ALLOWED(1010, "Phương thức yêu cầu của API không đúng hoặc thiếu value.", HttpStatus.METHOD_NOT_ALLOWED), // 400
    NEWS_EXISTED(1011, "Tin tức đã tồn tại trong danh sách yêu thích.", HttpStatus.BAD_REQUEST), // 400
    INVALID_STATE(1012, "Không tìm thấy file insert hoặc sai đường dẫn.", HttpStatus.BAD_REQUEST), // 400
    COMMENT_NOT_FOUND(1013, "Không tìm thấy bình luận.", HttpStatus.NOT_FOUND), // 404
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;

}
