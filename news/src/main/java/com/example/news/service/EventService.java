package com.example.news.service;

import com.example.news.dto.request.StatusRequest;
import com.example.news.dto.response.StatusResponse;
import com.example.news.entity.FavoriteEvent;
import com.example.news.entity.ViewEvent;
import com.example.news.mapper.StatusMapper;
import com.example.news.repository.FavoriteEventRepository;
import com.example.news.repository.StatusRepository;
import com.example.news.repository.ViewEventRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class EventService {
    ViewEventRepository viewEventRepository;
    FavoriteEventRepository favoriteEventRepository;

    public List<FavoriteEvent> getTodayFavoriteEvents() {
        LocalDateTime startOfDay = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return favoriteEventRepository.findByEventDateBetween(startOfDay, endOfDay);
    }

    public List<FavoriteEvent> getWeekFavoriteEvents() {
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfWeek = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        return favoriteEventRepository.findByEventDateBetween(startOfWeek, endOfWeek);
    }

    public List<ViewEvent> getTodayViewEvents() {
        LocalDateTime startOfDay = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return viewEventRepository.findByEventDateBetween(startOfDay, endOfDay);
    }

    public List<ViewEvent> getWeekViewEvents() {
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfWeek = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        return viewEventRepository.findByEventDateBetween(startOfWeek, endOfWeek);
    }

    public List<String> getFavoriteEventsYear() {
        List<String> favoriteCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        for (int i = 0; i < currentMonth; i++) {
            LocalDate startOfMonth = now.withMonth(i + 1).withDayOfMonth(1);
            LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(startOfMonth.atStartOfDay(), endOfMonth.atTime(23, 59, 59)));
            favoriteCounts.add(String.format("%02d/%04d: %d", startOfMonth.getMonthValue(), startOfMonth.getYear(), count));
        }
        return favoriteCounts;
    }

    public List<String> getViewEventsYear() {
        List<String> viewCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        for (int i = 0; i < currentMonth; i++) {
            LocalDate startOfMonth = now.withMonth(i + 1).withDayOfMonth(1);
            LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(startOfMonth.atStartOfDay(), endOfMonth.atTime(23, 59, 59)));
            viewCounts.add(String.format("%02d/%04d: %d", startOfMonth.getMonthValue(), startOfMonth.getYear(), count));
        }
        return viewCounts;
    }

    public List<String> getFavoriteEventsMonth() {
        List<String> favoriteCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentDay = now.getDayOfMonth();

        if (currentDay < 8) {
            for (int i = 1; i <= currentDay; i++) {
                LocalDate date = now.withDayOfMonth(i);
                int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(date.atStartOfDay(), date.atTime(23, 59, 59)));
                favoriteCounts.add(String.format("%02d/%02d: %d", date.getDayOfMonth(), now.getMonthValue(), count));
            }
        } else {
            int fullWeeks = currentDay / 7;
            int remainingDays = currentDay % 7;

            for (int i = 0; i < fullWeeks; i++) {
                LocalDate startDate = now.withDayOfMonth(i * 7 + 1);
                LocalDate endDate = startDate.plusDays(6);
                int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)));
                favoriteCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
            }

            if (remainingDays > 0) {
                LocalDate startDate = now.withDayOfMonth(fullWeeks * 7 + 1);
                LocalDate endDate = now.withDayOfMonth(currentDay);
                int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)));
                if (remainingDays == 1) {
                    favoriteCounts.add(String.format("%02d/%02d: %d", startDate.getDayOfMonth(), now.getMonthValue(), count));
                } else {
                    favoriteCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
                }
            }
        }

        return favoriteCounts;
    }
    /*public List<String> getFavoriteEventsMonth() {
        List<String> favoriteCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentDay = now.getDayOfMonth();
        int fullWeeks = currentDay / 7;
        int remainingDays = currentDay % 7;

        for (int i = 0; i < fullWeeks; i++) {
            LocalDate startDate = now.withDayOfMonth(i * 7 + 1);
            LocalDate endDate = startDate.plusDays(6);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)));
            favoriteCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
//            favoriteCounts.add(String.format("%02d-%02d/%02d/%04d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), now.getYear(), count));
        }

        if (remainingDays > 0) {
            LocalDate startDate = now.withDayOfMonth(fullWeeks * 7 + 1);
            LocalDate endDate = now.withDayOfMonth(currentDay);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)));
            if (remainingDays == 1) {
                favoriteCounts.add(String.format("%02d/%02d: %d", startDate.getDayOfMonth(), now.getMonthValue(), count));
//                favoriteCounts.add(String.format("%02d/%02d/%04d: %d", startDate.getDayOfMonth(), now.getMonthValue(), now.getYear(), count));
            } else {
                favoriteCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
//                favoriteCounts.add(String.format("%02d-%02d/%02d/%04d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), now.getYear(), count));
            }
        }

        return favoriteCounts;
    }*/

    public List<String> getViewEventsMonth() {
        List<String> viewCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentDay = now.getDayOfMonth();

        if (currentDay < 8) {
            for (int i = 1; i <= currentDay; i++) {
                LocalDate date = now.withDayOfMonth(i);
                int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(date.atStartOfDay(), date.atTime(23, 59, 59)));
                viewCounts.add(String.format("%02d/%02d: %d", date.getDayOfMonth(), now.getMonthValue(), count));
            }
        } else {
            int fullWeeks = currentDay / 7;
            int remainingDays = currentDay % 7;

            for (int i = 0; i < fullWeeks; i++) {
                LocalDate startDate = now.withDayOfMonth(i * 7 + 1);
                LocalDate endDate = startDate.plusDays(6);
                int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)));
                viewCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
            }

            if (remainingDays > 0) {
                LocalDate startDate = now.withDayOfMonth(fullWeeks * 7 + 1);
                LocalDate endDate = now.withDayOfMonth(currentDay);
                int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)));
                if (remainingDays == 1) {
                    viewCounts.add(String.format("%02d/%02d: %d", startDate.getDayOfMonth(), now.getMonthValue(), count));
                } else {
                    viewCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
                }
            }
        }

        return viewCounts;
    }
    /*public List<String> getViewEventsMonth() {
        List<String> viewCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentDay = now.getDayOfMonth();
        int fullWeeks = currentDay / 7;
        int remainingDays = currentDay % 7;

        for (int i = 0; i < fullWeeks; i++) {
            LocalDate startDate = now.withDayOfMonth(i * 7 + 1);
            LocalDate endDate = startDate.plusDays(6);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)));
            viewCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
        }

        if (remainingDays > 0) {
            LocalDate startDate = now.withDayOfMonth(fullWeeks * 7 + 1);
            LocalDate endDate = now.withDayOfMonth(currentDay);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(startDate.atStartOfDay(), endDate.atTime(23, 59, 59)));
            if (remainingDays == 1) {
                viewCounts.add(String.format("%02d/%02d: %d", startDate.getDayOfMonth(), now.getMonthValue(), count));
            } else {
                viewCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
            }
        }

        return viewCounts;
    }*/

    public List<String> getViewEventsLast7Days() {
        List<String> viewCounts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime startOfDay = now.minusDays(i).truncatedTo(ChronoUnit.DAYS);
            LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(startOfDay, endOfDay));
            viewCounts.add(String.format("%02d/%02d: %d", startOfDay.getDayOfMonth(), startOfDay.getMonthValue(), count));
        }
        return viewCounts;
    }

    public List<String> getFavoriteEventsLast7Days() {
        List<String> favoriteCounts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime startOfDay = now.minusDays(i).truncatedTo(ChronoUnit.DAYS);
            LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(startOfDay, endOfDay));
            favoriteCounts.add(String.format("%02d/%02d: %d", startOfDay.getDayOfMonth(), startOfDay.getMonthValue(), count));
        }
        return favoriteCounts;
    }

    public List<String> getFavoriteEventsCustom(String startDate, String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime start = LocalDate.parse(startDate, formatter).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);
        List<String> favoriteCounts = new ArrayList<>();
        LocalDateTime current = start;
        int dayCount = 0;

        while (!current.isAfter(end)) {
            LocalDateTime weekEnd = current.plusDays(6).isAfter(end) ? end : current.plusDays(6);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(current, weekEnd));
            favoriteCounts.add(String.format("%02d-%02d/%02d: %d", current.getDayOfMonth(), weekEnd.getDayOfMonth(), current.getMonthValue(), count));
            current = weekEnd.plusDays(1);
            dayCount += 7;

            if (dayCount > 35) {
                break;
            }
        }

        if (dayCount > 35) {
            favoriteCounts.clear();
            current = start;
            while (!current.isAfter(end)) {
                LocalDateTime monthEnd = current.withDayOfMonth(current.toLocalDate().lengthOfMonth()).toLocalDate().atTime(23, 59, 59);
                if (monthEnd.isAfter(end)) {
                    monthEnd = end;
                }
                int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(current, monthEnd));
                favoriteCounts.add(String.format("%02d/%04d: %d", current.getMonthValue(), current.getYear(), count));
                current = monthEnd.plusDays(1);
            }
        }

        return favoriteCounts;
    }
    /*public List<String> getFavoriteEventsCustom(String startDate, String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime start = LocalDate.parse(startDate, formatter).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);
        List<String> favoriteCounts = new ArrayList<>();
        LocalDateTime current = start;

        while (!current.isAfter(end)) {
            LocalDateTime weekEnd = current.plusDays(6).isAfter(end) ? end : current.plusDays(6);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetween(current, weekEnd));
            favoriteCounts.add(String.format("%02d-%02d/%02d/%04d: %d", current.getDayOfMonth(), weekEnd.getDayOfMonth(), current.getMonthValue(), current.getYear(), count));
            current = weekEnd.plusDays(1);
        }

        return favoriteCounts;
    }*/

    public List<String> getViewEventsCustom(String startDate, String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime start = LocalDate.parse(startDate, formatter).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);
        List<String> viewCounts = new ArrayList<>();
        LocalDateTime current = start;
        int dayCount = 0;

        while (!current.isAfter(end)) {
            LocalDateTime weekEnd = current.plusDays(6).isAfter(end) ? end : current.plusDays(6);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(current, weekEnd));
            viewCounts.add(String.format("%02d-%02d/%02d: %d", current.getDayOfMonth(), weekEnd.getDayOfMonth(), current.getMonthValue(), count));
            current = weekEnd.plusDays(1);
            dayCount += 7;

            if (dayCount > 35) {
                break;
            }
        }

        if (dayCount > 35) {
            viewCounts.clear();
            current = start;
            while (!current.isAfter(end)) {
                LocalDateTime monthEnd = current.withDayOfMonth(current.toLocalDate().lengthOfMonth()).toLocalDate().atTime(23, 59, 59);
                if (monthEnd.isAfter(end)) {
                    monthEnd = end;
                }
                int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(current, monthEnd));
                viewCounts.add(String.format("%02d/%04d: %d", current.getMonthValue(), current.getYear(), count));
                current = monthEnd.plusDays(1);
            }
        }

        return viewCounts;
    }
    /*public List<String> getViewEventsCustom(String startDate, String endDate) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime start = LocalDate.parse(startDate, formatter).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate, formatter).atTime(23, 59, 59);
        List<String> viewCounts = new ArrayList<>();
        LocalDateTime current = start;

        while (!current.isAfter(end)) {
            LocalDateTime weekEnd = current.plusDays(6).isAfter(end) ? end : current.plusDays(6);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetween(current, weekEnd));
            viewCounts.add(String.format("%02d-%02d/%02d/%04d: %d", current.getDayOfMonth(), weekEnd.getDayOfMonth(), current.getMonthValue(), current.getYear(), count));
            current = weekEnd.plusDays(1);
        }

        return viewCounts;
    }*/

    /*==========================Start-MANAGE========================*/
    public int getTodayViewEventsByCategory(String category) {
        LocalDateTime startOfDay = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return viewEventRepository.countByEventDateBetweenAndNews_Categories_Code(startOfDay, endOfDay, category);
    }

    public int getTodayFavoriteEventsByCategory(String category) {
        LocalDateTime startOfDay = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return favoriteEventRepository.countByEventDateBetweenAndNews_Categories_Code(startOfDay, endOfDay, category);
    }

    public int getWeekViewEventsByCategory(String category) {
        LocalDateTime startOfWeek = LocalDate.now().with(java.time.DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);
        return viewEventRepository.countByEventDateBetweenAndNews_Categories_Code(startOfWeek, endOfWeek, category);
    }

    public int getWeekFavoriteEventsByCategory(String category) {
        LocalDateTime startOfWeek = LocalDate.now().with(java.time.DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);
        return favoriteEventRepository.countByEventDateBetweenAndNews_Categories_Code(startOfWeek, endOfWeek, category);
    }

    public List<String> getViewEventsMonthByCategory(String category) {
        List<String> viewCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentDay = now.getDayOfMonth();

        if (currentDay < 8) {
            // Hiển thị từng ngày khi currentDay < 8
            for (int i = 1; i <= currentDay; i++) {
                LocalDate date = now.withDayOfMonth(i);
                int count = Math.toIntExact(viewEventRepository.countByEventDateBetweenAndNews_Categories_Code(
                        date.atStartOfDay(), date.atTime(23, 59, 59), category));
                viewCounts.add(String.format("%02d/%02d: %d", date.getDayOfMonth(), now.getMonthValue(), count));
            }
        } else {
            // Chia theo tuần khi currentDay >= 8
            int fullWeeks = currentDay / 7;
            int remainingDays = currentDay % 7;

            for (int i = 0; i < fullWeeks; i++) {
                LocalDate startDate = now.withDayOfMonth(i * 7 + 1);
                LocalDate endDate = startDate.plusDays(6);
                int count = Math.toIntExact(viewEventRepository.countByEventDateBetweenAndNews_Categories_Code(
                        startDate.atStartOfDay(), endDate.atTime(23, 59, 59), category));
                viewCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
            }

            if (remainingDays > 0) {
                LocalDate startDate = now.withDayOfMonth(fullWeeks * 7 + 1);
                LocalDate endDate = now.withDayOfMonth(currentDay);
                int count = Math.toIntExact(viewEventRepository.countByEventDateBetweenAndNews_Categories_Code(
                        startDate.atStartOfDay(), endDate.atTime(23, 59, 59), category));
                if (remainingDays == 1) {
                    viewCounts.add(String.format("%02d/%02d: %d", startDate.getDayOfMonth(), now.getMonthValue(), count));
                } else {
                    viewCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
                }
            }
        }

        return viewCounts;
    }
    /*public List<String> getViewEventsMonthByCategory(String category) {
        List<String> viewCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentDay = now.getDayOfMonth();
        int fullWeeks = currentDay / 7;
        int remainingDays = currentDay % 7;

        for (int i = 0; i < fullWeeks; i++) {
            LocalDate startDate = now.withDayOfMonth(i * 7 + 1);
            LocalDate endDate = startDate.plusDays(6);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetweenAndNews_Categories_Code(startDate.atStartOfDay(), endDate.atTime(23, 59, 59), category));
            viewCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
        }

        if (remainingDays > 0) {
            LocalDate startDate = now.withDayOfMonth(fullWeeks * 7 + 1);
            LocalDate endDate = now.withDayOfMonth(currentDay);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetweenAndNews_Categories_Code(startDate.atStartOfDay(), endDate.atTime(23, 59, 59), category));
            if (remainingDays == 1) {
                viewCounts.add(String.format("%02d/%02d: %d", startDate.getDayOfMonth(), now.getMonthValue(), count));
            } else {
                viewCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
            }
        }

        return viewCounts;
    }*/

    public List<String> getFavoriteEventsMonthByCategory(String category) {
        List<String> favoriteCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentDay = now.getDayOfMonth();

        if (currentDay < 8) {
            // Hiển thị từng ngày khi currentDay < 8
            for (int i = 1; i <= currentDay; i++) {
                LocalDate date = now.withDayOfMonth(i);
                int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetweenAndNews_Categories_Code(
                        date.atStartOfDay(), date.atTime(23, 59, 59), category));
                favoriteCounts.add(String.format("%02d/%02d: %d", date.getDayOfMonth(), now.getMonthValue(), count));
            }
        } else {
            // Chia theo tuần khi currentDay >= 8
            int fullWeeks = currentDay / 7;
            int remainingDays = currentDay % 7;

            for (int i = 0; i < fullWeeks; i++) {
                LocalDate startDate = now.withDayOfMonth(i * 7 + 1);
                LocalDate endDate = startDate.plusDays(6);
                int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetweenAndNews_Categories_Code(
                        startDate.atStartOfDay(), endDate.atTime(23, 59, 59), category));
                favoriteCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
            }

            if (remainingDays > 0) {
                LocalDate startDate = now.withDayOfMonth(fullWeeks * 7 + 1);
                LocalDate endDate = now.withDayOfMonth(currentDay);
                int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetweenAndNews_Categories_Code(
                        startDate.atStartOfDay(), endDate.atTime(23, 59, 59), category));
                if (remainingDays == 1) {
                    favoriteCounts.add(String.format("%02d/%02d: %d", startDate.getDayOfMonth(), now.getMonthValue(), count));
                } else {
                    favoriteCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
                }
            }
        }

        return favoriteCounts;
    }

    /*public List<String> getFavoriteEventsMonthByCategory(String category) {
        List<String> favoriteCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentDay = now.getDayOfMonth();
        int fullWeeks = currentDay / 7;
        int remainingDays = currentDay % 7;

        for (int i = 0; i < fullWeeks; i++) {
            LocalDate startDate = now.withDayOfMonth(i * 7 + 1);
            LocalDate endDate = startDate.plusDays(6);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetweenAndNews_Categories_Code(startDate.atStartOfDay(), endDate.atTime(23, 59, 59), category));
            favoriteCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
        }

        if (remainingDays > 0) {
            LocalDate startDate = now.withDayOfMonth(fullWeeks * 7 + 1);
            LocalDate endDate = now.withDayOfMonth(currentDay);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetweenAndNews_Categories_Code(startDate.atStartOfDay(), endDate.atTime(23, 59, 59), category));
            if (remainingDays == 1) {
                favoriteCounts.add(String.format("%02d/%02d: %d", startDate.getDayOfMonth(), now.getMonthValue(), count));
            } else {
                favoriteCounts.add(String.format("%02d-%02d/%02d: %d", startDate.getDayOfMonth(), endDate.getDayOfMonth(), now.getMonthValue(), count));
            }
        }

        return favoriteCounts;
    }*/

    public List<String> getViewEventsYearByCategory(String category) {
        List<String> viewCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        for (int i = 0; i < currentMonth; i++) {
            LocalDate startOfMonth = now.withMonth(i + 1).withDayOfMonth(1);
            LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetweenAndNews_Categories_Code(startOfMonth.atStartOfDay(), endOfMonth.atTime(23, 59, 59), category));
            viewCounts.add(String.format("%02d/%04d: %d", startOfMonth.getMonthValue(), startOfMonth.getYear(), count));
        }
        return viewCounts;
    }

    public List<String> getFavoriteEventsYearByCategory(String category) {
        List<String> favoriteCounts = new ArrayList<>();
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        for (int i = 0; i < currentMonth; i++) {
            LocalDate startOfMonth = now.withMonth(i + 1).withDayOfMonth(1);
            LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetweenAndNews_Categories_Code(startOfMonth.atStartOfDay(), endOfMonth.atTime(23, 59, 59), category));
            favoriteCounts.add(String.format("%02d/%04d: %d", startOfMonth.getMonthValue(), startOfMonth.getYear(), count));
        }
        return favoriteCounts;
    }

    public List<String> getViewEventsLast7DaysByCategory(String category) {
        List<String> viewCounts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime startOfDay = now.minusDays(i).truncatedTo(ChronoUnit.DAYS);
            LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);
            int count = Math.toIntExact(viewEventRepository.countByEventDateBetweenAndNews_Categories_Code(startOfDay, endOfDay, category));
            viewCounts.add(String.format("%02d/%02d: %d", startOfDay.getDayOfMonth(), startOfDay.getMonthValue(), count));
        }
        return viewCounts;
    }

    public List<String> getFavoriteEventsLast7DaysByCategory(String category) {
        List<String> favoriteCounts = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime startOfDay = now.minusDays(i).truncatedTo(ChronoUnit.DAYS);
            LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);
            int count = Math.toIntExact(favoriteEventRepository.countByEventDateBetweenAndNews_Categories_Code(startOfDay, endOfDay, category));
            favoriteCounts.add(String.format("%02d/%02d: %d", startOfDay.getDayOfMonth(), startOfDay.getMonthValue(), count));
        }
        return favoriteCounts;
    }
    /*==========================End-MANAGE========================*/

    public int getTodayViewEventsByCreatedBy(String createdBy) {
        LocalDateTime startOfDay = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return viewEventRepository.countByEventDateBetweenAndNews_CreatedBy(startOfDay, endOfDay, createdBy);
    }

    public int getTodayFavoriteEventsByCreatedBy(String createdBy) {
        LocalDateTime startOfDay = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        return favoriteEventRepository.countByEventDateBetweenAndNews_CreatedBy(startOfDay, endOfDay, createdBy);
    }

    public int getWeekViewEventsByCreatedBy(String createdBy) {
        LocalDateTime startOfWeek = LocalDate.now().with(java.time.DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);
        return viewEventRepository.countByEventDateBetweenAndNews_CreatedBy(startOfWeek, endOfWeek, createdBy);
    }

    public int getWeekFavoriteEventsByCreatedBy(String createdBy) {
        LocalDateTime startOfWeek = LocalDate.now().with(java.time.DayOfWeek.MONDAY).atStartOfDay();
        LocalDateTime endOfWeek = startOfWeek.plusDays(7);
        return favoriteEventRepository.countByEventDateBetweenAndNews_CreatedBy(startOfWeek, endOfWeek, createdBy);
    }
}
