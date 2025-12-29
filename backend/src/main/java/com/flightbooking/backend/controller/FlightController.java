package com.flightbooking.backend.controller;

import com.flightbooking.backend.model.Flight;
import com.flightbooking.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:3000")
public class FlightController {
    
    @Autowired
    private FlightRepository flightRepository;
    
    // Get all flights
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }
    
    // Create flight
    @PostMapping
    public Flight createFlight(@RequestBody Flight flight) {
        return flightRepository.save(flight);
    }
    
    // Get flight by ID
    @GetMapping("/{id}")
    public Flight getFlightById(@PathVariable Integer id) {
        return flightRepository.findById(id).orElse(null);
    }
    
    // Get available flights
    @GetMapping("/available")
    public List<Flight> getAvailableFlights() {
        return flightRepository.findByAvailableSeatsGreaterThan(0);
    }

    // Delete flight
    @DeleteMapping("/{id}")
    public void deleteFlight(@PathVariable Integer id) {
        flightRepository.deleteById(id);
    }
}