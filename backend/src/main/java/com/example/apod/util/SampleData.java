package com.example.apod.util;

import com.example.apod.model.ApodDto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public final class SampleData {
    private SampleData() {}

    public static ApodDto today() {
        ApodDto dto = new ApodDto();
        dto.setDate(LocalDate.now().toString());
        dto.setTitle("Sample: Apep - Unusual Dust Shells");
        dto.setExplanation("Sample data: APOD content is rate-limited or offline. This is a locally served fallback explaining Apep observed by JWST.");
        dto.setUrl("https://apod.nasa.gov/apod/image/2511/ApepStars_webb_960.jpg");
        dto.setHdurl("https://apod.nasa.gov/apod/image/2511/ApepStars_webb_960.jpg");
        dto.setMedia_type("image");
        dto.setCopyright(null);
        return dto;
    }

    public static ApodDto byDate(LocalDate date) {
        ApodDto dto = new ApodDto();
        dto.setDate(date.toString());
        dto.setTitle("Sample APOD for " + date);
        dto.setExplanation("Sample data for date " + date + ". Replace with live NASA when available.");
        dto.setUrl("https://apod.nasa.gov/apod/image/2501/MoonTree_960.jpg");
        dto.setHdurl("https://apod.nasa.gov/apod/image/2501/MoonTree_960.jpg");
        dto.setMedia_type("image");
        return dto;
    }

    public static List<ApodDto> recent(int days) {
        List<ApodDto> list = new ArrayList<>();
        LocalDate d = LocalDate.now();
        for (int i = 0; i < Math.max(1, days); i++) {
            ApodDto dto = new ApodDto();
            LocalDate day = d.minusDays(i);
            dto.setDate(day.toString());
            dto.setTitle("Sample Recent APOD " + day);
            dto.setExplanation("Sample gallery item for " + day + ".");
            // Alternate between two public APOD sample images
            if (i % 2 == 0) {
                dto.setUrl("https://apod.nasa.gov/apod/image/2407/M16_Pillars_960.jpg");
                dto.setHdurl("https://apod.nasa.gov/apod/image/2407/M16_Pillars_960.jpg");
            } else {
                dto.setUrl("https://apod.nasa.gov/apod/image/2408/Andromeda_960.jpg");
                dto.setHdurl("https://apod.nasa.gov/apod/image/2408/Andromeda_960.jpg");
            }
            dto.setMedia_type("image");
            list.add(dto);
        }
        return list;
    }
}
