package com.example.apod.service;

import com.example.apod.client.NasaApodClient;
import com.example.apod.model.ApodDto;
import com.example.apod.util.SampleData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class ApodService {
    private final NasaApodClient client;
    @Value("${app.sample.enabled:false}")
    private boolean sampleEnabled;

    public ApodService(NasaApodClient client) {
        this.client = client;
    }

    @Cacheable(cacheNames = "apod-today")
    public ApodDto getToday() {
        try {
            return client.getToday();
        } catch (Exception ex) {
            if (sampleEnabled) return SampleData.today();
            throw ex;
        }
    }

    @Cacheable(cacheNames = "apod-by-date", key = "#p0")
    public ApodDto getByDate(LocalDate date) {
        try {
            return client.getByDate(date);
        } catch (Exception ex) {
            if (sampleEnabled) return SampleData.byDate(date);
            throw ex;
        }
    }

    @Cacheable(cacheNames = "apod-recent", key = "#p0")
    public List<ApodDto> getRecent(int days) {
        int safeDays = Math.max(1, Math.min(days, 7));
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(Math.max(safeDays - 1, 0));
        try {
            List<ApodDto> list = client.getRange(start, end);
            list.sort(Comparator.comparing(ApodDto::getDate).reversed());
            return list;
        } catch (Exception ex) {
            if (sampleEnabled) return SampleData.recent(safeDays);
            ApodDto today = null;
            try { today = client.getToday(); } catch (Exception ignored) {}
            return today == null ? List.of() : List.of(today);
        }
    }
}
