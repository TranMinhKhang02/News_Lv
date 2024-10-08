package com.example.news.controller;

import com.example.news.dto.request.CommentRequest;
import com.example.news.dto.response.ApiResponse;
import com.example.news.dto.response.commentResponse.CommentResponse;
import com.example.news.entity.User;
import com.example.news.exception.AppException;
import com.example.news.exception.ErrorCode;
import com.example.news.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Slf4j
@RestController
@RequestMapping("/comment")
public class CommentController {
    CommentService commentService;
    HttpServletRequest httpRequest;

    @PostMapping("/{newsId}")
    public ApiResponse<CommentResponse> createComment(
            @PathVariable Long newsId,
            @RequestParam(value = "parentId", required = false) Long parentId,
            @RequestBody CommentRequest request) {
        // Lấy thông tin người dùng từ kết quả xác thực
        User user = (User) httpRequest.getSession().getAttribute("user");

        if(user == null) {
            throw new AppException(ErrorCode.UNLOGIN);
        }

        Long userId = user.getId();
        // Chuyển userId vào request
        request.setUserId(userId); // Đảm bảo bạn đã có phương thức setter cho userId trong CommentRequest
        request.setParentComment(parentId);

        var comment = commentService.create(newsId, request);
        return ApiResponse.<CommentResponse>builder()
                .code(1000)
                .result(comment)
                .build();
    }

    @GetMapping("/{newsId}")
    public ApiResponse<List<CommentResponse>> getAllComment(@PathVariable Long newsId) {
        var comments = commentService.getAll(newsId);
        return ApiResponse.<List<CommentResponse>>builder()
                .code(1000)
                .result(comments)
                .build();
    }

    @GetMapping("/parentComment/{parentId}")
    public ApiResponse<List<CommentResponse>> getCommentByParentId(@PathVariable Long parentId) {
        var comments = commentService.getCommentsByParentCommentId(parentId);
        return ApiResponse.<List<CommentResponse>>builder()
                .code(1000)
                .result(comments)
                .build();
    }
}
