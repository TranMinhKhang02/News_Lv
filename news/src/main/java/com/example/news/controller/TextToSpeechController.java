package com.example.news.controller;

import com.example.news.service.TextToSpeechService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;

@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Slf4j
@RestController
@RequestMapping("/tts")
public class TextToSpeechController {
    TextToSpeechService textToSpeechService;

    @PostMapping("/convert/{newsId}")
    public ResponseEntity<String> convertTextToSpeech(
            @PathVariable Long newsId,
            @RequestBody String text) {
        String filePath = textToSpeechService.convertTextToSpeech(newsId, text);
        return new ResponseEntity<>(filePath, HttpStatus.OK);
    }

    @GetMapping("/audio/{fileName}")
    public ResponseEntity<FileSystemResource> getAudio(@PathVariable String fileName) {
        File file = new File(textToSpeechService.getAudioFilesPath() + fileName);
        if (!file.exists()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        FileSystemResource resource = new FileSystemResource(file);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "audio/mpeg");
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }
}
