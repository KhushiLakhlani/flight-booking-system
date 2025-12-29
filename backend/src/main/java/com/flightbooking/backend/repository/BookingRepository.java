package com.flightbooking.backend.repository;

import com.flightbooking.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    
    // Find bookings by user
    List<Booking> findByUserId(Integer userId);
    
    // Find booking by reference
    Optional<Booking> findByBookingReference(String bookingReference);
    
    // Find bookings by status
    List<Booking> findByStatus(String status);
    
    // Find bookings by flight
    List<Booking> findByFlightId(Integer flightId);
}