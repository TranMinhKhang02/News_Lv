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

    @GetMapping("/view-events/last7days")
    public ApiResponse<Object> getViewEventsLast7Days() {
        var viewCounts = eventService.getViewEventsLast7Days();
        return ApiResponse.builder()
                .code(1000)
                .result(viewCounts)
                .build();
    }

    @GetMapping("/favorite-events/last7days")
    public ApiResponse<Object> getFavoriteEventsLast7Days() {
        var favoriteCounts = eventService.getFavoriteEventsLast7Days();
        return ApiResponse.builder()
                .code(1000)
                .result(favoriteCounts)
                .build();
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

    @GetMapping("/last7days/view")
    public ApiResponse<Object> getViewEventsLast7DaysByCategory(@RequestParam String category) {
        var viewCounts = eventService.getViewEventsLast7DaysByCategory(category);
        return ApiResponse.builder()
                .code(1000)
                .result(viewCounts)
                .build();
    }

    @GetMapping("/last7days/favorites")
    public ApiResponse<Object> getFavoriteEventsLast7DaysByCategory(@RequestParam String category) {
        var favoriteCounts = eventService.getFavoriteEventsLast7DaysByCategory(category);
        return ApiResponse.builder()
                .code(1000)
                .result(favoriteCounts)
                .build();
    }

    /*=====================Start-AUTHOR===========================*/
    @GetMapping("/today/views/createdBy")
    public ApiResponse<Object> getTodayViewEventsByCreatedBy(@RequestParam String createdBy) {
        var todayViews = eventService.getTodayViewEventsByCreatedBy(createdBy);
        return ApiResponse.builder()
                .code(1000)
                .result(todayViews)
                .build();
    }

    @GetMapping("/today/favorites/createdBy")
    public ApiResponse<Object> getTodayFavoriteEventsByCreatedBy(@RequestParam String createdBy) {
        var todayFavorites = eventService.getTodayFavoriteEventsByCreatedBy(createdBy);
        return ApiResponse.builder()
                .code(1000)
                .result(todayFavorites)
                .build();
    }

    @GetMapping("/week/views/createdBy")
    public ApiResponse<Object> getWeekViewEventsByCreatedBy(@RequestParam String createdBy) {
        var weekViews = eventService.getWeekViewEventsByCreatedBy(createdBy);
        return ApiResponse.builder()
                .code(1000)
                .result(weekViews)
                .build();
    }

    @GetMapping("/week/favorites/createdBy")
    public ApiResponse<Object> getWeekFavoriteEventsByCreatedBy(@RequestParam String createdBy) {
        var weekFavorites = eventService.getWeekFavoriteEventsByCreatedBy(createdBy);
        return ApiResponse.builder()
                .code(1000)
                .result(weekFavorites)
                .build();
    }
    /*=====================End-AUTHOR===========================*/
}
