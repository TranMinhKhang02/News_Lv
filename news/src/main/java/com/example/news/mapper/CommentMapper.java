package com.example.news.mapper;

import com.example.news.dto.request.CommentRequest;
import com.example.news.dto.response.commentResponse.CommentResponse;
import com.example.news.dto.response.userResponse.UserResponseComment;
import com.example.news.entity.Comment;
import com.example.news.entity.News;
import com.example.news.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    /*@Mapping(target = "news", source = "newsId")
    @Mapping(target = "user", source = "userId")*/
    @Mapping(target = "parentComment", expression = "java(map(request.getParentComment()))")
//    @Mapping(target = "parentComment", source = "parentComment")
    Comment toComment(CommentRequest request);

    @Mapping(target = "parentComment", source = "parentComment.id") // Lấy ID từ Comment parent
    @Mapping(target = "replies", source = "replies") // Ánh xạ replies thành list CommentResponse
    CommentResponse toCommentResponse(Comment comment);

    @Mapping(target = "parentComment", source = "parentComment")
    void updateComment(CommentRequest request, @MappingTarget Comment comment);

    default Comment map(Long parentCommentId) {
        if (parentCommentId == null) {
            return null;
        }
        Comment comment = new Comment();
        comment.setId(parentCommentId);
        return comment;
    }

    default void setParentComment(CommentRequest request, @MappingTarget Comment comment) {
        if (request.getParentComment() != null) {
            comment.setParentComment(map(request.getParentComment()));
        }
    }

    default List<CommentResponse> mapReplies(List<Comment> replies) {
        if (replies == null || replies.isEmpty()) {
            return new ArrayList<>();
        }
        return replies.stream()
                .map(this::toCommentResponse)
                .collect(Collectors.toList());
    }

    default User mapToUser(Long userId) {
        if (userId == null) {
            return null;
        }
        User user = new User();
        user.setId(userId);
        return user;
    }

    default News mapToNews(Long newsId) {
        if (newsId == null) {
            return null;
        }
        News news = new News();
        news.setId(newsId);
        return news;
    }

    default UserResponseComment mapToUserCommentResponse(User user) {
        if (user == null) {
            return null;
        }
        UserResponseComment response = new UserResponseComment();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setAvatar(user.getAvatar());
        return response;
    }
}
