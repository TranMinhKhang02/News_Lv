package com.example.news.controller;

import com.example.news.dto.request.StatusRequest;
import com.example.news.dto.request.StatusUpdateRequest;
import com.example.news.dto.response.ApiResponse;
import com.example.news.dto.response.StatusResponse;
import com.example.news.service.StatusService;
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
@RequestMapping("/status")
public class StatusController {
    StatusService statusService;

    @PostMapping
    public ApiResponse<StatusResponse> createStatus(@RequestBody StatusRequest request) {
        return ApiResponse.<StatusResponse>builder()
                .code(1000)
                .result(statusService.create(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<StatusResponse>> getAllStatus() {
        var statuses = statusService.getAll();
        return ApiResponse.<List<StatusResponse>>builder()
                .code(1000)
                .result(statuses)
                .build();
    }

    @PutMapping("/{statusId}")
    public ApiResponse<StatusResponse> updateStatus(@RequestBody StatusRequest request, @PathVariable Long statusId) {
        var status = statusService.update(request, statusId);
        return ApiResponse.<StatusResponse>builder()
                .code(1000)
                .result(status)
                .build();
    }
}
