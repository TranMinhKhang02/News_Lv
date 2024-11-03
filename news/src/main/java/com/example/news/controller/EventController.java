package com.example.news.controller;

import com.cloudinary.Api;
import com.example.news.dto.response.ApiResponse;
import com.example.news.entity.FavoriteEvent;
import com.example.news.entity.ViewEvent;
import com.example.news.service.EventService;
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
@RequestMapping("/events")
public class EventController {
    EventService eventService;

    @GetMapping("/favorite-events/today")
    public ApiResponse<Object> getTodayFavoriteEvents() {
        log.info("Entering getTodayFavoriteEvents method");
        List<FavoriteEvent> events = eventService.getTodayFavoriteEvents();
        int eventCount = events.size();
        log.info("Found {} favorite events", eventCount);
        return ApiResponse.builder()
                .code(1000)
                .result(eventCount)
                .build();
    }

    @GetMapping("/favorite-events/week")
    public ApiResponse<Object> getWeekFavoriteEvents() {
        log.info("Entering getWeekFavoriteEvents method");
        List<FavoriteEvent> events = eventService.getWeekFavoriteEvents();
        int eventCount = events.size();
        log.info("Found {} favorite events", eventCount);
        return ApiResponse.builder()
                .code(1000)
                .result(eventCount)
                .build();
    }

    @GetMapping("/view-events/today")
    public ApiResponse<Object> getTodayViewEvents() {
        log.info("Entering getTodayViewEvents method");
        List<ViewEvent> events = eventService.getTodayViewEvents();
        int eventCount = events.size();
        log.info("Found {} view events", eventCount);
        return ApiResponse.builder()
                .code(1000)
                .result(eventCount)
                .build();
    }

    @GetMapping("/view-events/week")
    public ApiResponse<Object> getWeekViewEvents() {
        log.info("Entering getWeekViewEvents method");
        List<ViewEvent> events = eventService.getWeekViewEvents();
        int eventCount = events.size();
        log.info("Found {} view events", eventCount);
        return ApiResponse.builder()
                .code(1000)
                .result(eventCount)
                .build();
    }

    @GetMapping("/favorite-events/year")
    public List<String> getFavoriteEventsYear() {
        return eventService.getFavoriteEventsYear();
    }

    @GetMapping("/view-events/year")
    public List<String> getViewEventsYear() {
        return eventService.getViewEventsYear();
    }

    @GetMapping("/favorite-events/month")
    public List<String> getFavoriteEventsMonth() {
        return eventService.getFavoriteEventsMonth();
    }

    @GetMapping("/view-events/month")
    public List<String> getViewEventsMonth() {
        return eventService.getViewEventsMonth();
    }

    @GetMapping("/favorite-events/custom")
    public List<String> getFavoriteEventsCustom(@RequestParam String startDate, @RequestParam String endDate) {
        return eventService.getFavoriteEventsCustom(startDate, endDate);
    }

    @GetMapping("/view-events/custom")
    public List<String> getViewEventsCustom(@RequestParam String startDate, @RequestParam String endDate) {
        return eventService.getViewEventsCustom(startDate, endDate);
    }

    @GetMapping("/today/views")
    public ApiResponse<Object> getTodayViewEventsByCategory(@RequestParam String category) {
        var todayViews = eventService.getTodayViewEventsByCategory(category);
        return ApiResponse.builder()
                .code(1000)
                .result(todayViews)
                .build();
    }

    @GetMapping("/today/favorites")
    public ApiResponse<Object> getTodayFavoriteEventsByCategory(@RequestParam String category) {
        var todayFavorites = eventService.getTodayFavoriteEventsByCategory(category);
        return ApiResponse.builder()
                .code(1000)
                .result(todayFavorites)
                .build();
    }

    @GetMapping("/week/views")
    public ApiResponse<Object> getWeekViewEventsByCategory(@RequestParam String category) {
        var weekViews = eventService.getWeekViewEventsByCategory(category);
        return ApiResponse.builder()
                .code(1000)
                .result(weekViews)
                .build();
    }

    @GetMapping("/week/favorites")
    public ApiResponse<Object> getWeekFavoriteEventsByCategory(@RequestParam String category) {
        var weekFavorites = eventService.getWeekFavoriteEventsByCategory(category);
        return ApiResponse.builder()
                .code(1000)
                .result(weekFavorites)
                .build();
    }

    @GetMapping("/month/views")
    public List<String> getViewEventsMonthByCategory(@RequestParam String category) {
        return eventService.getViewEventsMonthByCategory(category);
    }

    @GetMapping("/month/favorites")
    public List<String> getFavoriteEventsMonthByCategory(@RequestParam String category) {
        return eventService.getFavoriteEventsMonthByCategory(category);
    }

    @GetMapping("/year/views")
    public List<String> getViewEventsYearByCategory(@RequestParam String category) {
        return eventService.getViewEventsYearByCategory(category);
    }

    @GetMapping("/year/favorites")
    public List<String> getFavoriteEventsYearByCategory(@RequestParam String category) {
        return eventService.getFavoriteEventsYearByCategory(category);
    }
}
