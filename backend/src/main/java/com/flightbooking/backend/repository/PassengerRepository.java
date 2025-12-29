package com.flightbooking.backend.repository;

import com.flightbooking.backend.model.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Integer> {
    
    // Find all passengers for a booking
    List<Passenger> findByBookingId(Integer bookingId);
}