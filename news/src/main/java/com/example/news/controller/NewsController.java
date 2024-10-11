package com.example.news.controller;

import com.example.news.dto.request.NewsRequest;
import com.example.news.dto.request.NewsUpdateStatusRequest;
import com.example.news.dto.response.*;
import com.example.news.entity.User;
import com.example.news.exception.AppException;
import com.example.news.exception.ErrorCode;
import com.example.news.repository.NewsRepository;
import com.example.news.service.NewsService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Slf4j
@RestController
@RequestMapping("/news")
public class NewsController {
    NewsRepository newsRepository;
    NewsService newsService;
    HttpServletRequest httpRequest;

    @PostMapping
//    @PreAuthorize("hasAnyRole('ADMIN', 'ADMIN_MANAGE')")
//    @PreAuthorize("hasRole('ADMIN_MANAGE')")
    public ApiResponse<NewsResponse> createNews(@RequestBody NewsRequest request) {
        // Lấy thông tin người dùng từ kết quả xác thực
        User user = (User) httpRequest.getSession().getAttribute("user");
        if(user == null) {
            throw new AppException(ErrorCode.UNLOGIN);
        }
        return ApiResponse.<NewsResponse>builder()
                .code(1000)
                .result(newsService.create(request))
                .build();
    }

    @GetMapping
    public ApiNewsResponse<List<NewsResponse>> getAllNews(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "statusCode", defaultValue = "1") String statusCode) {
        List<NewsResponse> newsList;
        int totalNews;

        newsList = newsService.getAllByStatusCode(statusCode, page, size);
        totalNews = newsService.countAllNewsByStatusCode(statusCode);

        int totalPage = (int) Math.ceil((double) totalNews / size);

        return ApiNewsResponse.<List<NewsResponse>>builder()
                .code(1000)
                .page(page)
                .totalPage(totalPage)
                .result(newsList)
                .build();

    }
    /*@GetMapping
    public ApiNewsResponse<List<NewsResponse>> getAllNews(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        var newsList = newsService.getAll(page, size);
        int totalNews = newsService.countAllNews();
        int totalPage = (int) Math.ceil((double) totalNews / size);


        return ApiNewsResponse.<List<NewsResponse>>builder()
                .code(1000)
                .page(page)
                .totalPage(totalPage)
                .result(newsList)
                .build();
    }*/

    @GetMapping("/by-category")
    public ApiResponse<List<NewsResponse>> getAllNewsByCategory(
            @RequestParam(value = "category") String categoryCode,
            @RequestParam(value = "status", defaultValue = "1") String statusCode) {
        List<NewsResponse> newsList = newsService.getAllByCategoryCodeAndStatusCode(categoryCode, statusCode);

        return ApiResponse.<List<NewsResponse>>builder()
                .code(1000)
                .result(newsList)
                .build();
    }

    @GetMapping("/by-category-and-status")
    public ApiNewsResponse<List<NewsResponse>> getAllNewsByCategoryAndStatus(
            @RequestParam(value = "category") String categoryCode,
            @RequestParam(value = "status", defaultValue = "1") String statusCode,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        List<NewsResponse> newsList;
        int totalNewsByCategoryAndStatus;

        newsList = newsService.getAllByCategoryCodeAndStatusCode(categoryCode, statusCode, page, size);
        totalNewsByCategoryAndStatus = newsService.countAllByCategoryCodeAndStatusCode(categoryCode, statusCode);

        int totalPage = (int) Math.ceil((double) totalNewsByCategoryAndStatus / size);

        return ApiNewsResponse.<List<NewsResponse>>builder()
                .code(1000)
                .page(page)
                .totalPage(totalPage)
                .result(newsList)
                .build();
    }

    @GetMapping("/single/{newsId}")
    public ApiResponse<NewsResponse> getNews(@PathVariable Long newsId) {
        var news = newsService.getNewsById(newsId);
        return ApiResponse.<NewsResponse>builder()
                .code(1000)
                .result(news)
                .build();
    }

    /*@GetMapping("/{newsId}")
    public ModelAndView getNewsSingle(@PathVariable Long newsId) {
        NewsResponse newsResponse = newsService.getNewsById(newsId);
        ModelAndView modelAndView = new ModelAndView("home/single"); // Tên của trang HTML trong thư mục templates
        modelAndView.addObject("news", newsResponse);
        return modelAndView;
    }*/

    @PutMapping("/{newsId}")
    public ApiResponse<NewsResponse> updateNews(@RequestBody NewsRequest request, @PathVariable Long newsId) {
        return ApiResponse.<NewsResponse>builder()
                .code(1000)
                .result(newsService.update(newsId, request))
                .build();
    }

    @PutMapping("/{newsId}/status")
    public ApiResponse<String> updateNewsStatus(@PathVariable Long newsId,
                                                @RequestBody NewsUpdateStatusRequest request) {
        newsService.updateNewsStatus(newsId, request);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Cập nhật trạng thái của bài viết thành công.")
                .build();
    }

    @GetMapping("/like/{newsId}")
    public ApiResponse<Integer> getLikeCount(@PathVariable Long newsId) {
        return ApiResponse.<Integer>builder()
                .code(1000)
                .result(newsService.getLikeCount(newsId))
                .build();
    }

    @PostMapping("/view/{newsId}")
    public ApiResponse<Integer> incrementViewCount(@PathVariable Long newsId) {
        int updateViewsCount = newsService.incrementViewCount(newsId);
        return ApiResponse.<Integer>builder()
                .code(1000)
                .result(updateViewsCount)
                .build();
    }

    @GetMapping("/counts/{newsId}")
    public ApiResponse<Map<String, Integer>> getCounts(@PathVariable Long newsId) {
        int likeCount = newsService.getLikeCount(newsId);
        int viewCount = newsService.getViewCount(newsId);
        Map<String, Integer> counts = new HashMap<>();
        counts.put("likeCount", likeCount);
        counts.put("viewCount", viewCount);
        return ApiResponse.<Map<String, Integer>>builder()
                .code(1000)
                .result(counts)
                .build();
    }
}