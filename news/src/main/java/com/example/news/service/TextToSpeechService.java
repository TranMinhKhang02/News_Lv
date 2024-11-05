package com.example.news.service;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor // Thay thế Autowried
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Getter
@Service
public class TextToSpeechService {

    private final CloudinaryService cloudinaryService;
    private final NewsService newsService;

    @Value("${audio.files.path}")
    private String audioFilesPath;

    @PostConstruct
    public void init() {
        File directory = new File(audioFilesPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public String convertTextToSpeech(Long newsId, String text) {
        String fileName = "news-" + newsId + ".mp3"; // Tạo tên file từ newsId
        String filePath = new File(audioFilesPath, fileName).getAbsolutePath();

        // Kiểm tra xem file đã tồn tại hay chưa
        File audioFile = new File(filePath);
        if (audioFile.exists()) {
            // Nếu file đã tồn tại, kiểm tra URL trong cơ sở dữ liệu
            String existingAudioUrl = newsService.getAudioPath(newsId);
            if (existingAudioUrl != null && !existingAudioUrl.isEmpty()) {
                return existingAudioUrl;
            }
        }

        try {
            ProcessBuilder pb = new ProcessBuilder("python", "F:\\GitHub-Desktop\\KhangB2012215\\News_Lv\\news\\scripts\\text_to_speech.py", text, filePath);
            pb.directory(new File("F:\\GitHub-Desktop\\KhangB2012215\\News_Lv\\news"));
            Process process = pb.start();
            process.waitFor();

            // Kiểm tra xem file có được tạo ra hay không
            if (!audioFile.exists()) {
                throw new IOException("File MP3 không được tạo ra.");
            }

            // Tải tệp lên Cloudinary
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(audioFile, fileName);
            if (uploadResult != null) {
                String audioUrl = (String) uploadResult.get("secure_url");
                log.info("Đã tải tệp lên Cloudinary: " + audioUrl);
                // Cập nhật URL vào cơ sở dữ liệu
                newsService.updateAudioPath(newsId, audioUrl);
                return audioUrl;
            } else {
                throw new IOException("Tải tệp lên Cloudinary thất bại.");
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

        return null;
    }
    /*public String convertTextToSpeech(Long newsId, String text) {
        String fileName = "news-" + newsId + ".mp3"; // Tạo tên file từ newsId
        String filePath = new File(audioFilesPath, fileName).getAbsolutePath();

        // Kiểm tra xem file đã tồn tại hay chưa
        File audioFile = new File(filePath);
        if (audioFile.exists()) {
            // Nếu file đã tồn tại, trả về đường dẫn của file đó
            return filePath;
        }

        try {
            ProcessBuilder pb = new ProcessBuilder("python", "F:\\GitHub-Desktop\\KhangB2012215\\News_Lv\\news\\scripts\\text_to_speech.py", text, filePath);
            pb.directory(new File("F:\\GitHub-Desktop\\KhangB2012215\\News_Lv\\news"));
            Process process = pb.start();
            process.waitFor();

            // Kiểm tra xem file có được tạo ra hay không
            if (!audioFile.exists()) {
                throw new IOException("File MP3 không được tạo ra.");
            }

            // Tải tệp lên Cloudinary
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(audioFile);
            if (uploadResult != null) {
                String audioUrl = (String) uploadResult.get("secure_url");
                log.info("Đã tải tệp lên Cloudinary: " + audioUrl);
                // Cập nhật URL vào cơ sở dữ liệu
                newsService.updateAudioPath(newsId, audioUrl);
                return audioUrl;
            } else {
                throw new IOException("Tải tệp lên Cloudinary thất bại.");
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }

        return filePath;
    }*/

}
/*public class TextToSpeechService {

    @Value("${audio.files.path}")
    private String audioFilesPath;

    @PostConstruct
    public void init() {
        File directory = new File(audioFilesPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public String convertTextToSpeech(String text) {
        String fileName = UUID.randomUUID().toString() + ".mp3";
        String filePath = audioFilesPath + fileName;

        try (TextToSpeechClient textToSpeechClient = TextToSpeechClient.create()) {
            SynthesisInput input = SynthesisInput.newBuilder().setText(text).build();
            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                    .setLanguageCode("vi-VN")
                    .setSsmlGender(SsmlVoiceGender.NEUTRAL)
                    .build();
            AudioConfig audioConfig = AudioConfig.newBuilder()
                    .setAudioEncoding(AudioEncoding.MP3)
                    .build();
            SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(input, voice, audioConfig);
            ByteString audioContents = response.getAudioContent();

            try (FileOutputStream out = new FileOutputStream(filePath)) {
                out.write(audioContents.toByteArray());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return filePath;
    }

}*/
