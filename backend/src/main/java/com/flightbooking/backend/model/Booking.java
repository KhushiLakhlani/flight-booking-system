package com.flightbooking.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private Integer userId;
    
    @Column(nullable = false)
    private Integer flightId;
    
    @Column(nullable = false)
    private String seatNumber;
    
    @Column(nullable = false)
    private Double totalPrice;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();
    
    @Column(nullable = false)
    private String status = "CONFIRMED"; // CONFIRMED, CANCELLED
    
    @Column(nullable = false, unique = true)
    private String bookingReference;
}