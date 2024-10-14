package com.example.news.service;

import com.example.news.dto.request.CommentRequest;
import com.example.news.dto.response.commentResponse.CommentResponse;
import com.example.news.entity.Comment;
import com.example.news.entity.News;
import com.example.news.entity.User;
import com.example.news.mapper.CommentMapper;
import com.example.news.repository.CommentRepository;
import com.example.news.repository.NewsRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class CommentService {
    CommentRepository commentRepository;
    CommentMapper commentMapper;
    NewsRepository newsRepository;
    HttpServletRequest httpRequest;

    public List<CommentResponse> getAll(Long newsId) {
        var comments = commentRepository.findAllByNewsId(newsId);
        Set<Long> replyIds = new HashSet<>();

        // Thu thập tất cả các ID của replies
        comments.forEach(comment -> collectReplyIds(comment, replyIds));

        // Lọc các bình luận không nằm trong replies
        return comments.stream()
                .filter(comment -> !replyIds.contains(comment.getId()))
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    private void collectReplyIds(Comment comment, Set<Long> replyIds) {
        if (comment.getReplies() != null) {
            comment.getReplies().forEach(reply -> {
                replyIds.add(reply.getId());
                collectReplyIds(reply, replyIds); // Đệ quy để thu thập ID của các replies con
            });
        }
    }
    /*public List<CommentResponse> getAll(Long newsId){
        var comments = commentRepository.findAllByNewsId(newsId);
        return comments.stream().map(commentMapper::toCommentResponse).toList();
    }*/

    public List<CommentResponse> getCommentsByParentCommentId(Long parentCommentId) {
        List<Comment> comments = commentRepository.findAllByParentCommentId(parentCommentId);
        return comments.stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse create(Long newsId, Long userId, CommentRequest request) {
        // Truy vấn News từ newsId
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        // Chuyển CommentRequest thành Comment
        Comment comment = commentMapper.toComment(request);

        // Gán news cho comment
        comment.setNews(news);

        // Gán user cho comment dựa trên userId từ request
        User user = new User();
        user.setId(userId); // Lấy userId
        comment.setUser(user);

        // Start count Comment
        if(news.getCommentCount() == null) {
            news.setCommentCount(0L);
        }
        news.setCommentCount(news.getCommentCount() + 1); // Tăng commentCount
        newsRepository.save(news); // Lưu lại bản ghi News đã cập nhật
        // End count Comment

        // Lưu comment vào cơ sở dữ liệu
        comment = commentRepository.save(comment);

        // Trả về response
        return commentMapper.toCommentResponse(comment);
    }
}
