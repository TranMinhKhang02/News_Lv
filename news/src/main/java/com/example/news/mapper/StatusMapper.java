package com.example.news.mapper;

import com.example.news.dto.request.StatusRequest;
import com.example.news.dto.request.StatusUpdateRequest;
import com.example.news.dto.response.StatusResponse;
import com.example.news.entity.Status;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StatusMapper {
    Status toStatus(StatusRequest request);
    StatusResponse toStatusResponse(Status status);

    void updateStatus(@MappingTarget Status status, StatusRequest request);
}
