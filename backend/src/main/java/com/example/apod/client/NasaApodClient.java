package com.example.apod.client;

import com.example.apod.model.ApodDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class NasaApodClient {

    @Value("${nasa.api.base:https://api.nasa.gov}")
    private String nasaBaseUrl;

    @Value("${nasa.api.key:}")
    private String apiKeyProperty;

    private final RestTemplate restTemplate = new RestTemplate();

    private String resolveApiKey() {
        String envKey = System.getenv("NASA_API_KEY");
        if (envKey != null && !envKey.isBlank()) return envKey;
        if (apiKeyProperty != null && !apiKeyProperty.isBlank()) return apiKeyProperty;
        return "DEMO_KEY"; // throttled key, acceptable fallback for demo
    }

    public ApodDto getToday() {
        URI uri = UriComponentsBuilder.fromHttpUrl(nasaBaseUrl + "/planetary/apod")
                .queryParam("api_key", resolveApiKey())
                .build().toUri();
        int attempts = 0;
        while (true) {
            try {
                ResponseEntity<ApodDto> resp = restTemplate.getForEntity(uri, ApodDto.class);
                return resp.getBody();
            } catch (HttpStatusCodeException ex) {
                int code = ex.getStatusCode().value();
                attempts++;
                if ((code == 429 || code >= 500) && attempts < 3) {
                    try { Thread.sleep(400L * attempts); } catch (InterruptedException ignored) {}
                    continue;
                }
                throw new ResponseStatusException(ex.getStatusCode(), ex.getResponseBodyAsString(), ex);
            }
        }
    }

    public ApodDto getByDate(LocalDate date) {
        URI uri = UriComponentsBuilder.fromHttpUrl(nasaBaseUrl + "/planetary/apod")
                .queryParam("api_key", resolveApiKey())
                .queryParam("date", date)
                .build().toUri();
        int attempts = 0;
        while (true) {
            try {
                ResponseEntity<ApodDto> resp = restTemplate.getForEntity(uri, ApodDto.class);
                return resp.getBody();
            } catch (HttpStatusCodeException ex) {
                int code = ex.getStatusCode().value();
                attempts++;
                if ((code == 429 || code >= 500) && attempts < 3) {
                    try { Thread.sleep(400L * attempts); } catch (InterruptedException ignored) {}
                    continue;
                }
                throw new ResponseStatusException(ex.getStatusCode(), ex.getResponseBodyAsString(), ex);
            }
        }
    }

    public List<ApodDto> getRange(LocalDate startDate, LocalDate endDate) {
        URI uri = UriComponentsBuilder.fromHttpUrl(nasaBaseUrl + "/planetary/apod")
                .queryParam("api_key", resolveApiKey())
                .queryParam("start_date", startDate)
                .queryParam("end_date", endDate)
                .build().toUri();
        int attempts = 0;
        while (true) {
            try {
                ResponseEntity<ApodDto[]> resp = restTemplate.getForEntity(uri, ApodDto[].class);
                ApodDto[] arr = resp.getBody();
                return arr == null ? List.of() : Arrays.asList(arr);
            } catch (HttpStatusCodeException ex) {
                int code = ex.getStatusCode().value();
                attempts++;
                if ((code == 429 || code >= 500) && attempts < 3) {
                    try { Thread.sleep(400L * attempts); } catch (InterruptedException ignored) {}
                    continue;
                }
                throw new ResponseStatusException(ex.getStatusCode(), ex.getResponseBodyAsString(), ex);
            }
        }
    }
}
