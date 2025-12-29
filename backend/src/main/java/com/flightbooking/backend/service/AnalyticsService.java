package com.flightbooking.backend.service;

import com.flightbooking.backend.model.Booking;
import com.flightbooking.backend.model.Flight;
import com.flightbooking.backend.repository.BookingRepository;
import com.flightbooking.backend.repository.FlightRepository;
import com.flightbooking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private FlightRepository flightRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get overall statistics
    public Map<String, Object> getOverallStats() {
        List<Booking> allBookings = bookingRepository.findAll();
        List<Booking> confirmedBookings = allBookings.stream()
            .filter(b -> b.getStatus().equals("CONFIRMED"))
            .collect(Collectors.toList());
        
        double totalRevenue = confirmedBookings.stream()
            .mapToDouble(Booking::getTotalPrice)
            .sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", allBookings.size());
        stats.put("confirmedBookings", confirmedBookings.size());
        stats.put("cancelledBookings", allBookings.size() - confirmedBookings.size());
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalCustomers", userRepository.count());
        stats.put("totalFlights", flightRepository.count());
        stats.put("averageBookingValue", confirmedBookings.isEmpty() ? 0 : totalRevenue / confirmedBookings.size());
        
        return stats;
    }
    
    // Get revenue by flight
    public List<Map<String, Object>> getRevenueByFlight() {
        List<Booking> confirmedBookings = bookingRepository.findByStatus("CONFIRMED");
        
        Map<Integer, Double> revenueMap = new HashMap<>();
        Map<Integer, Integer> bookingCountMap = new HashMap<>();
        
        for (Booking booking : confirmedBookings) {
            revenueMap.put(booking.getFlightId(), 
                revenueMap.getOrDefault(booking.getFlightId(), 0.0) + booking.getTotalPrice());
            bookingCountMap.put(booking.getFlightId(),
                bookingCountMap.getOrDefault(booking.getFlightId(), 0) + 1);
        }
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Map.Entry<Integer, Double> entry : revenueMap.entrySet()) {
            Flight flight = flightRepository.findById(entry.getKey()).orElse(null);
            if (flight != null) {
                Map<String, Object> flightRevenue = new HashMap<>();
                flightRevenue.put("flightId", entry.getKey());
                flightRevenue.put("flightNumber", flight.getFlightNumber());
                flightRevenue.put("airlineName", flight.getAirlineName());
                flightRevenue.put("route", flight.getOrigin() + " → " + flight.getDestination());
                flightRevenue.put("revenue", entry.getValue());
                flightRevenue.put("bookings", bookingCountMap.get(entry.getKey()));
                result.add(flightRevenue);
            }
        }
        
        // Sort by revenue descending
        result.sort((a, b) -> Double.compare((Double)b.get("revenue"), (Double)a.get("revenue")));
        
        return result;
    }
    
    // Get popular routes
    public List<Map<String, Object>> getPopularRoutes() {
        List<Booking> confirmedBookings = bookingRepository.findByStatus("CONFIRMED");
        
        Map<String, Integer> routeCountMap = new HashMap<>();
        Map<String, Double> routeRevenueMap = new HashMap<>();
        
        for (Booking booking : confirmedBookings) {
            Flight flight = flightRepository.findById(booking.getFlightId()).orElse(null);
            if (flight != null) {
                String route = flight.getOrigin() + " → " + flight.getDestination();
                routeCountMap.put(route, routeCountMap.getOrDefault(route, 0) + 1);
                routeRevenueMap.put(route, routeRevenueMap.getOrDefault(route, 0.0) + booking.getTotalPrice());
            }
        }
        
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Map.Entry<String, Integer> entry : routeCountMap.entrySet()) {
            Map<String, Object> routeData = new HashMap<>();
            routeData.put("route", entry.getKey());
            routeData.put("bookings", entry.getValue());
            routeData.put("revenue", routeRevenueMap.get(entry.getKey()));
            result.add(routeData);
        }
        
        // Sort by bookings descending
        result.sort((a, b) -> Integer.compare((Integer)b.get("bookings"), (Integer)a.get("bookings")));
        
        return result.stream().limit(5).collect(Collectors.toList()); // Top 5 routes
    }
    
    // Get occupancy rate by flight
    public List<Map<String, Object>> getOccupancyRates() {
        List<Flight> flights = flightRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Flight flight : flights) {
            int bookedSeats = flight.getTotalSeats() - flight.getAvailableSeats();
            double occupancyRate = (bookedSeats * 100.0) / flight.getTotalSeats();
            
            Map<String, Object> flightOccupancy = new HashMap<>();
            flightOccupancy.put("flightNumber", flight.getFlightNumber());
            flightOccupancy.put("airlineName", flight.getAirlineName());
            flightOccupancy.put("route", flight.getOrigin() + " → " + flight.getDestination());
            flightOccupancy.put("totalSeats", flight.getTotalSeats());
            flightOccupancy.put("bookedSeats", bookedSeats);
            flightOccupancy.put("availableSeats", flight.getAvailableSeats());
            flightOccupancy.put("occupancyRate", Math.round(occupancyRate * 100.0) / 100.0);
            
            result.add(flightOccupancy);
        }
        
        // Sort by occupancy rate descending
        result.sort((a, b) -> Double.compare((Double)b.get("occupancyRate"), (Double)a.get("occupancyRate")));
        
        return result;
    }
}