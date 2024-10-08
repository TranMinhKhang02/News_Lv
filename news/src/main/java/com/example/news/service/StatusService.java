package com.example.news.service;

import com.example.news.dto.request.StatusRequest;
import com.example.news.dto.request.StatusUpdateRequest;
import com.example.news.dto.response.StatusResponse;
import com.example.news.mapper.StatusMapper;
import com.example.news.repository.StatusRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class StatusService {
    StatusRepository statusRepository;
    StatusMapper statusMapper;

    public StatusResponse create(StatusRequest request) {
        var status = statusMapper.toStatus(request);
        status = statusRepository.save(status);
        return statusMapper.toStatusResponse(status);
    }

    public List<StatusResponse> getAll(){
        var statuses = statusRepository.findAll();
        return statuses.stream().map(statusMapper::toStatusResponse).toList();
    }

    public StatusResponse update(StatusRequest request, Long statusId) {
        var status = statusRepository.findById(statusId).orElseThrow();
        statusMapper.updateStatus(status, request);
        status = statusRepository.save(status);
        return statusMapper.toStatusResponse(status);
    }

    public void delete(Long id) {
        statusRepository.deleteById(id);
    }
}
