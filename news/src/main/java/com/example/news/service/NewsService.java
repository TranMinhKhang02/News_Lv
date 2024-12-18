package com.example.news.service;

import com.example.news.dto.request.NewsRequest;
import com.example.news.dto.request.NewsUpdateRequest;
import com.example.news.dto.request.NewsUpdateStatusRequest;
import com.example.news.dto.response.NewsResponse;
import com.example.news.entity.*;
import com.example.news.mapper.NewsMapper;
import com.example.news.repository.*;
//import jakarta.transaction.Transactional;
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
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
    ViewEventRepository viewEventRepository;
    FavoriteEventRepository favoriteEventRepository;
    SummaryService summaryService;

    /*============START GPT=================*/
    public void summarizeNews(Long newsId, String summary) {
        News news = newsRepository.findById(newsId).orElseThrow(() -> new RuntimeException("News not found"));
        news.setSummarized(true);
        news.setSummary(summary);
        news.setSummary_createDate(LocalDateTime.now());
        newsRepository.save(news);
    }
    /*public void summarizeNews(Long newsId) throws Exception {
        Optional<News> newsOptional = newsRepository.findById(newsId);
        if (newsOptional.isPresent()) {
            News news = newsOptional.get();
            String summary = summaryService.summarizeText(news.getContent());
            news.setSummary(summary);
            news.setSummarized(true);
            news.setSummary_createDate(LocalDateTime.now());
            newsRepository.save(news);
        }
    }*/
    /*public void summarizeAllNews() throws Exception {
        List<News> newsList = newsRepository.findBySummarizedFalse();
        for (News news : newsList) {
            String summary = geminiService.summarizeContent(news.getContent());
            news.setSummary(summary);
            news.setSummarized(true);
            news.setSummary_createDate(LocalDateTime.now());
            newsRepository.save(news);
        }
    }*/
    /*public void summarizeNews(Long newsId) throws Exception {
        Optional<News> newsOptional = newsRepository.findById(newsId);
        if (newsOptional.isPresent()) {
            News news = newsOptional.get();
            String summary = geminiService.summarizeContent(news.getContent());
            news.setSummary(summary);
            news.setSummarized(true);
            news.setSummary_createDate(LocalDateTime.now());
            newsRepository.save(news);
        }
    }*/
    /*============END GPT=================*/

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

    public NewsResponse update(Long newsId, NewsUpdateRequest request) {
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
        /*if (request.getStatus() != null) {
            Status status = statusRepository.findById(request.getStatus())
                    .orElseThrow(() -> new RuntimeException("Status not found"));
            news.setStatus(status); // Set lại status đã truy vấn từ DB
        }*/

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

    public List<NewsResponse> getTop10NewsByCreatedDate(String statusCode) {
        return newsRepository.findTop10ByStatusCodeOrderByCreatedDateDesc(statusCode).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public List<NewsResponse> getTop5NewsByViewCount(String statusCode) {
        return newsRepository.findTop5ByStatusCodeOrderByViewCountDesc(statusCode).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public List<NewsResponse> getTop5NewsByLikeCount(String statusCode) {
        return newsRepository.findTop5ByStatusCodeOrderByLikeCountDesc(statusCode).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public List<NewsResponse> getTop5NewsByCategoryCode(String categoryCode, String statusCode) {
        return newsRepository.findTop6ByCategories_codeAndStatusCodeOrderByModifiedDateDesc(categoryCode, statusCode).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public int countAllNews() {
        return (int) newsRepository.count();
    }

    public int countAllNewsByStatusCode(String statusCode) {
        return (int) newsRepository.countAllByStatusCode(statusCode);
    }

    public int countAllByCategoryCode(String categoryCode, String statusCode) {
        return (int) newsRepository.countByCategories_CodeAndStatusCode(categoryCode, statusCode);
    }

    public int countAllByCategoryCodeAndStatusCode(String categoryCode, String statusCode) {
        return (int) newsRepository.countAllByCategories_codeAndStatusCode(categoryCode, statusCode);
    }

    public int countAllByCreatedByAndStatusCode(String createdBy, String statusCode, String categoryCode) {
        return (int) newsRepository.countByCreatedByAndStatusCodeAndCategories_code(createdBy, statusCode, categoryCode);
    }

    public int getLikeCount(Long newsId) {
        return newsRepository.findById(newsId)
                .map(news -> news.getLikeCount() != null ? news.getLikeCount().intValue() : 0)
                .orElse(0);
    }

    public int getViewCount(Long newsId) {
        return newsRepository.findById(newsId)
                .map(news -> news.getViewCount() != null ? news.getViewCount().intValue() : 0)
                .orElse(0);
    }
    /*public int getLikeCount(Long newsId) {
        News news = new News();
        long likeCount = newsRepository.countLikesByNewsId(newsId);
        news.setLikeCount(likeCount);
        return (int) likeCount;
        return newsRepository.findById(newsId)
                .map(news -> news.getLikeCount().intValue())
                .orElse(0);
//        return (int) newsRepository.countLikesByNewsId(newsId);
    }*/

    /*public int getViewCount(Long newsId) {
        return newsRepository.findById(newsId)
                .map(News::getViewCount)
                .orElse(0L)
                .intValue();
    }*/

    public int getCommentCount(Long newsId) {
        return (int) newsRepository.countCommentsByNewId(newsId);
    }

    @Transactional
    public int incrementViewCount(Long newsId) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));
        if (news.getViewCount() == null) {
            news.setViewCount(0L);
        }
        news.setViewCount(news.getViewCount() + 1);
        newsRepository.save(news);

        // Lưu sự kiện vào bảng ViewEvent
        ViewEvent viewEvent = new ViewEvent();
        viewEvent.setEventDate(LocalDateTime.now());
        viewEvent.setNews(news);
        viewEventRepository.save(viewEvent);

        return news.getViewCount().intValue();
    }

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

    /*public List<NewsResponse> getAllByCategoryCodeAndStatusCode
            (String categoryCode, String statusCode, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        List<News> newsList = newsRepository.findAllByCategories_codeAndStatusCode(categoryCode, statusCode, pageRequest).getContent();
        return newsList.stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }*/

    public List<NewsResponse> getAllByCreatedByAndStatusCode
            (String createdBy, String statusCode, String categoryCode, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        List<News> newsList = newsRepository.findAllByCreatedByAndStatusCodeAndCategories_codeOrderByModifiedDateDesc(createdBy, statusCode, categoryCode, pageRequest).getContent();
        return newsList.stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public List<NewsResponse> getAllByCategoryCodeAndStatusCode(String categoryCode, String statusCode, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        return newsRepository.findAllByCategories_codeAndStatusCodeOrderByModifiedDateDesc(categoryCode, statusCode, pageRequest).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public void updateNewsStatus(Long newsId, NewsUpdateStatusRequest request) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        Status status = statusRepository.findById(request.getStatus())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        news.setApprovedBy(request.getApproveBy());
        news.setRejectReason(request.getRejectReason());
        news.setStatus(status);
        news.setModifiedDate(LocalDateTime.now());
        newsRepository.save(news);
    }

    @Transactional
    public void updateNewsStatus(List<Long> newsIds, Long statusId) {
        Status status = statusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("Status not found"));

        for (Long newsId : newsIds) {
            News news = newsRepository.findById(newsId)
                    .orElseThrow(() -> new RuntimeException("News not found"));
            news.setStatus(status);
            newsRepository.save(news);
        }
    }
    /*public List<NewsResponse> getAllByCategoryCode(String categoryCode) {
        return newsRepository.findAllByCategories_code(categoryCode).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }*/

    public void updateAudioPath(Long newsId, String audioUrl) {
        News news = newsRepository.findById(newsId).orElseThrow(() -> new RuntimeException("News not found"));
        news.setAudioPath(audioUrl);
        newsRepository.save(news);
    }

//    @Transactional
    public void delete(List<Long> newsIds) {
        for(Long newsId : newsIds) {
            // Xóa các liên kết trong bảng news_category
            News news = newsRepository.findById(newsId).orElseThrow(() -> new EntityNotFoundException("News not found"));

            // Xóa liên kết favorite của news với mỗi user
            for (User user : news.getUsersFavorited()) {
                user.getFavoriteNews().remove(news); // Xóa liên kết của từng user với news
            }
            // Xóa tất cả liên kết favorite của news
            news.getUsersFavorited().clear();
//            newsRepository.save(news);

            // Sau khi xóa liên kết thì xóa bản ghi news
            newsRepository.deleteById(newsId);
        }
    }

    public List<NewsResponse> getTop5NewsByViewCountInWeek(String statusCode) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        Pageable pageable = PageRequest.of(0, 5);
        return newsRepository.findTop5ByViewCountInWeek(statusCode, oneWeekAgo, pageable).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public List<NewsResponse> getTop5NewsByLikeCountInWeek(String statusCode) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        Pageable pageable = PageRequest.of(0, 5);
        return newsRepository.findTop5ByLikeCountInWeek(statusCode, oneWeekAgo, pageable).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }
    /*public List<NewsResponse> getTop5NewsByViewCountInWeek(String statusCode) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return newsRepository.findTop5ByViewCountInWeek(statusCode, oneWeekAgo).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
//        return newsRepository.findTop5ByViewCountInWeek(statusCode, oneWeekAgo);
    }

    public List<NewsResponse> getTop5NewsByLikeCountInWeek(String statusCode) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return newsRepository.findTop5ByLikeCountInWeek(statusCode, oneWeekAgo).stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
//        return newsRepository.findTop5ByLikeCountInWeek(statusCode, oneWeekAgo);
    }*/

    /*=========================VIEW-FAVORITE==================================*/

    public double getPercentageIncreaseViews() {
        LocalDateTime startOfToday = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfToday = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);
        LocalDateTime startOfYesterday = startOfToday.minusDays(1);
        LocalDateTime endOfYesterday = endOfToday.minusDays(1);

        long todayViews = viewEventRepository.countByEventDateBetween(startOfToday, endOfToday);
        long yesterdayViews = viewEventRepository.countByEventDateBetween(startOfYesterday, endOfYesterday);

        if (yesterdayViews == 0) {
            return todayViews > 0 ? 100.0 : 0.0;
        }
        return ((double) (todayViews - yesterdayViews) / yesterdayViews) * 100;
    }

    public double getPercentageIncreaseFavorites() {
        LocalDateTime startOfToday = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfToday = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);
        LocalDateTime startOfYesterday = startOfToday.minusDays(1);
        LocalDateTime endOfYesterday = endOfToday.minusDays(1);

        long todayFavorites = favoriteEventRepository.countByEventDateBetween(startOfToday, endOfToday);
        long yesterdayFavorites = favoriteEventRepository.countByEventDateBetween(startOfYesterday, endOfYesterday);

        if (yesterdayFavorites == 0) {
            return todayFavorites > 0 ? 100.0 : 0.0;
        }
        return ((double) (todayFavorites - yesterdayFavorites) / yesterdayFavorites) * 100;
    }

    public Map<LocalDateTime, Long> getViewsStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        List<ViewEvent> events = viewEventRepository.findByEventDateBetween(startDate, endDate);
        return events.stream().collect(Collectors.groupingBy(
                event -> event.getEventDate().truncatedTo(ChronoUnit.DAYS),
                Collectors.counting()
        ));
    }

    public Map<LocalDateTime, Long> getFavoritesStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        List<FavoriteEvent> events = favoriteEventRepository.findByEventDateBetween(startDate, endDate);
        return events.stream().collect(Collectors.groupingBy(
                event -> event.getEventDate().truncatedTo(ChronoUnit.DAYS),
                Collectors.counting()
        ));
    }

    public String getAudioPath(Long newsId) {
        return newsRepository.findById(newsId)
                .map(News::getAudioPath)
                .orElse(null);
    }
}
