package com.example.apod.controller;

import com.example.apod.model.ApodDto;
import com.example.apod.service.ApodService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/apod")
public class ApodController {

    private final ApodService service;

    public ApodController(ApodService service) {
        this.service = service;
    }

    @GetMapping("/today")
    public ResponseEntity<ApodDto> today() {
        return ResponseEntity.ok(service.getToday());
    }

    @GetMapping("/by-date")
    public ResponseEntity<ApodDto> byDate(@RequestParam(name = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate min = LocalDate.of(1995, 6, 16);
        LocalDate max = LocalDate.now();
        if (date.isBefore(min) || date.isAfter(max)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "date must be between 1995-06-16 and today");
        }
        return ResponseEntity.ok(service.getByDate(date));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ApodDto>> recent(@RequestParam(name = "days", defaultValue = "7") @Min(1) @Max(7) int days) {
        return ResponseEntity.ok(service.getRecent(days));
    }
}
