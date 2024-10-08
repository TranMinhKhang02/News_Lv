package com.example.news.repository;

import com.example.news.entity.Comment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

//    @EntityGraph(attributePaths = {"replies"})
    List<Comment> findAllByNewsId(Long newsId);

    List<Comment> findAllByParentCommentId(Long parentCommentId);
}
