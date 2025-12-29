package com.flightbooking.backend.repository;

import com.flightbooking.backend.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Integer> {
    
    // Find flight by flight number
    Optional<Flight> findByFlightNumber(String flightNumber);
    
    // Find flights by status
    List<Flight> findByStatus(String status);
    
    // Find flights with available seats
    List<Flight> findByAvailableSeatsGreaterThan(Integer seats);
}