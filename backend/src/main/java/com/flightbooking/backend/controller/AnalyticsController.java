package com.flightbooking.backend.controller;

import com.flightbooking.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    // Get overall statistics
    @GetMapping("/stats")
    public Map<String, Object> getOverallStats() {
        return analyticsService.getOverallStats();
    }
    
    // Get revenue by flight
    @GetMapping("/revenue-by-flight")
    public List<Map<String, Object>> getRevenueByFlight() {
        return analyticsService.getRevenueByFlight();
    }
    
    // Get popular routes
    @GetMapping("/popular-routes")
    public List<Map<String, Object>> getPopularRoutes() {
        return analyticsService.getPopularRoutes();
    }
    
    // Get occupancy rates
    @GetMapping("/occupancy-rates")
    public List<Map<String, Object>> getOccupancyRates() {
        return analyticsService.getOccupancyRates();
    }
}