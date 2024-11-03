package com.example.news.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class SummaryService {

    private final WebClient webClient;

    // Sử dụng @Autowired để đảm bảo inject chính xác
    public SummaryService(@Value("${huggingface.api.key}") String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api-inference.huggingface.co/models/facebook/bart-large-cnn")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public String summarizeText(String text) {
        try {
            return webClient.post()
                    .bodyValue("{\"inputs\": \"" + text.replace("\"", "\\\"") + "\"}")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error in summarization: " + e.getMessage();
        }
    }
}
/*public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    public String summarizeContent(String content) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // Định dạng yêu cầu JSON cho GPT
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", List.of(Map.of("role", "user", "content", "Tóm tắt nội dung sau: " + content)));
        requestBody.put("max_tokens", 150);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // Gửi yêu cầu đến OpenAI
            ResponseEntity<String> response = restTemplate.exchange(OPENAI_API_URL, HttpMethod.POST, entity, String.class);

            // Xử lý phản hồi
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                // Xử lý lỗi quá hạn mức
                throw new Exception("Bạn đã vượt quá hạn mức hiện tại của API OpenAI. Vui lòng kiểm tra gói dịch vụ và chi tiết thanh toán.");
            } else {
                throw e;
            }
        }
    }
}*/
