package com.flightbooking.backend.controller;

import com.flightbooking.backend.model.Passenger;
import com.flightbooking.backend.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = "http://localhost:3000")
public class PassengerController {
    
    @Autowired
    private PassengerRepository passengerRepository;
    
    // Get all passengers for a booking
    @GetMapping("/booking/{bookingId}")
    public List<Passenger> getPassengersByBooking(@PathVariable Integer bookingId) {
        return passengerRepository.findByBookingId(bookingId);
    }
}