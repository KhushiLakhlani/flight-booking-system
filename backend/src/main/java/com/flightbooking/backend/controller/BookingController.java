package com.flightbooking.backend.controller;

import com.flightbooking.backend.model.Booking;
import com.flightbooking.backend.model.Flight;
import com.flightbooking.backend.repository.BookingRepository;
import com.flightbooking.backend.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.flightbooking.backend.model.Passenger;
import com.flightbooking.backend.repository.PassengerRepository;
import java.time.LocalDate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private FlightRepository flightRepository;
    
    // Get all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    // Create booking with seat availability check
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> bookingData) {
    try {
        // Extract booking details
        Integer userId = (Integer) bookingData.get("userId");
        Integer flightId = (Integer) bookingData.get("flightId");
        Double totalPrice = ((Number) bookingData.get("totalPrice")).doubleValue();
        
        // Extract passengers list
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> passengersList = (List<Map<String, Object>>) bookingData.get("passengers");
        
        if (passengersList == null || passengersList.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "At least one passenger is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Check if flight has enough available seats
        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Flight not found");
            return ResponseEntity.badRequest().body(error);
        }
        
        int requiredSeats = passengersList.size();
        if (flight.getAvailableSeats() < requiredSeats) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not enough seats available. Only " + flight.getAvailableSeats() + " seats remaining.");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Check if any seat is already booked
        List<Booking> existingBookings = bookingRepository.findByFlightId(flightId);
        for (Map<String, Object> passengerData : passengersList) {
            String seatNumber = (String) passengerData.get("seatNumber");
            boolean seatTaken = existingBookings.stream()
                .flatMap(b -> passengerRepository.findByBookingId(b.getId()).stream())
                .anyMatch(p -> p.getSeatNumber().equals(seatNumber) 
                            && existingBookings.stream()
                                .filter(booking -> booking.getId().equals(p.getBookingId()))
                                .anyMatch(booking -> booking.getStatus().equals("CONFIRMED")));
            
            if (seatTaken) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Seat " + seatNumber + " is already booked!");
                return ResponseEntity.badRequest().body(error);
            }
        }
        
        // Create booking
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setFlightId(flightId);
        booking.setTotalPrice(totalPrice);
        booking.setSeatNumber(passengersList.get(0).get("seatNumber").toString()); // First passenger's seat for backward compatibility
        booking.setBookingReference("BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setStatus("CONFIRMED");
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Create passengers
        for (Map<String, Object> passengerData : passengersList) {
            Passenger passenger = new Passenger();
            passenger.setBookingId(savedBooking.getId());
            passenger.setFirstName((String) passengerData.get("firstName"));
            passenger.setLastName((String) passengerData.get("lastName"));
            passenger.setDateOfBirth(LocalDate.parse((String) passengerData.get("dateOfBirth")));
            passenger.setGender((String) passengerData.get("gender"));
            passenger.setPassportNumber((String) passengerData.get("passportNumber"));
            passenger.setNationality((String) passengerData.get("nationality"));
            passenger.setSeatNumber((String) passengerData.get("seatNumber"));
            passenger.setMealPreference((String) passengerData.get("mealPreference"));
            passenger.setSpecialAssistance((String) passengerData.get("specialAssistance"));
            
            passengerRepository.save(passenger);
        }
        
        // Update available seats
        flight.setAvailableSeats(flight.getAvailableSeats() - requiredSeats);
        flightRepository.save(flight);
        
        return ResponseEntity.ok(savedBooking);
    } catch (Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Booking failed: " + e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}

    // Get bookings by user
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Integer userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    // Get booking by reference
    @GetMapping("/reference/{reference}")
    public Booking getBookingByReference(@PathVariable String reference) {
        return bookingRepository.findByBookingReference(reference).orElse(null);
    }
    
    // Cancel booking and restore seat
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id) {
        try {
            Booking booking = bookingRepository.findById(id).orElse(null);
            if (booking != null && booking.getStatus().equals("CONFIRMED")) {
                booking.setStatus("CANCELLED");
                bookingRepository.save(booking);
                
                // Restore available seats count
                Flight flight = flightRepository.findById(booking.getFlightId()).orElse(null);
                if (flight != null) {
                    flight.setAvailableSeats(flight.getAvailableSeats() + 1);
                    flightRepository.save(flight);
                }
                
                return ResponseEntity.ok(booking);
            }
            return ResponseEntity.badRequest().body("Booking not found or already cancelled");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Cancel failed: " + e.getMessage());
        }
    }
}