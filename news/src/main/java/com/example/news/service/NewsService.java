package com.example.news.service;

import com.example.news.dto.request.NewsRequest;
import com.example.news.dto.request.NewsUpdateStatusRequest;
import com.example.news.dto.response.NewsResponse;
import com.example.news.entity.Category;
import com.example.news.entity.News;
import com.example.news.entity.Status;
import com.example.news.mapper.NewsMapper;
import com.example.news.repository.CategoryRepository;
import com.example.news.repository.NewsRepository;
import com.example.news.repository.StatusRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class NewsService {
    NewsRepository newsRepository;
    NewsMapper newsMapper;
    StatusRepository statusRepository;
    CategoryRepository categoryRepository;

    public NewsResponse create(NewsRequest request) {
        // Set status mặc định là 3L
        Status status = statusRepository.findById(3L)
                .orElseThrow(() -> new RuntimeException("Default status not found"));

        // Truy vấn categories từ repository dựa trên các ID trong request
        Set<Category> categories = request.getCategories().stream()
                .map(categoryId -> categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Category not found")))
                .collect(Collectors.toSet());

        // Ánh xạ từ NewsRequest sang News
        News news = newsMapper.toNews(request);

        // Set status mặc định là 3L
        news.setStatus(status);

        // Set categories đã truy vấn từ DB
        news.setCategories(categories);

        // Lưu vào cơ sở dữ liệu và trả về response
        return newsMapper.toNewsResponse(newsRepository.save(news));
    }
    /*public NewsResponse create(NewsRequest request) {
        if (request.getStatus() == null) {
            request.setStatus(3L); // Default status ID
        }

        News news = newsMapper.toNews(request);

        return newsMapper.toNewsResponse(newsRepository.save(news));
    }

    public NewsResponse getNewsById(Long id) {
        return newsMapper.toNewsResponse(newsRepository.findById(id).orElse(null));
    }*/

    public NewsResponse update(Long newsId, NewsRequest request) {
        // Truy vấn news từ DB dựa trên ID
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        // Cập nhật các trường cơ bản từ request
        newsMapper.updateNews(news, request);

        // Cập nhật danh sách categories (nếu có trong request)
        if (request.getCategories() != null && !request.getCategories().isEmpty()) {
            Set<Category> categories = request.getCategories().stream()
                    .map(categoryId -> categoryRepository.findById(categoryId)
                            .orElseThrow(() -> new RuntimeException("Category not found")))
                    .collect(Collectors.toSet());
            news.setCategories(categories); // Set lại categories đã truy vấn từ DB
        }

        // Cập nhật status (nếu có trong request)
        if (request.getStatus() != null) {
            Status status = statusRepository.findById(request.getStatus())
                    .orElseThrow(() -> new RuntimeException("Status not found"));
            news.setStatus(status); // Set lại status đã truy vấn từ DB
        }

        // Lưu lại bản ghi đã cập nhật
        News updatedNews = newsRepository.save(news);

        // Trả về response
        return newsMapper.toNewsResponse(updatedNews);
    }

    public List<NewsResponse> getAll() {
        return newsRepository.findAll().stream()
                .map(newsMapper::toNewsResponse)
                .toList();
    }

    public NewsResponse getNewsById(Long id) {
        return newsMapper.toNewsResponse(newsRepository.findById(id).orElse(null));
    }

    public int countAllNews() {
        return (int) newsRepository.count();
    }

    public int countAllNewsByStatusCode(String statusCode) {
        return (int) newsRepository.countAllByStatusCode(statusCode);
    }

    /*public int countAllByCategoryCode(String categoryCode) {
        return (int) newsRepository.countByCategories_Code(categoryCode);
    }*/

    public List<NewsResponse> getAll(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        List<News> newsList = newsRepository.findAll(pageRequest).getContent();
        return newsList.stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList()); // Khác toList là có thể thay đổi về số lượng phần tử
    }

    public List<NewsResponse> getAllByStatusCode(String statusCode, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        List<News> newsList = newsRepository.findAllByStatusCode(statusCode, pageRequest).getContent();
        return newsList.stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public List<NewsResponse> getAllByCategoryCodeAndStatusCode(String categoryCode, String statusCode) {
        return newsRepository.findAllByCategories_codeAndStatusCode(categoryCode, statusCode).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public void updateNewsStatus(Long newsId, NewsUpdateStatusRequest request) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        Status status = statusRepository.findById(request.getStatus())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        news.setStatus(status);
        newsRepository.save(news);
    }
    /*public List<NewsResponse> getAllByCategoryCode(String categoryCode) {
        return newsRepository.findAllByCategories_code(categoryCode).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }*/

    public void delete(Long newsId) {
        // Xoá các liên kết trong bảng news_category
        newsRepository.deleteNewsCategoryById(newsId);
        newsRepository.deleteById(newsId);
    }
}
