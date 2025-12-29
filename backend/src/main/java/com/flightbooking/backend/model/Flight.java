package com.flightbooking.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "flights")
@Data
public class Flight {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, unique = true)
    private String flightNumber;
    
    @Column(nullable = false)
    private String airlineName;
    
    @Column(nullable = false)
    private String origin;
    
    @Column(nullable = false)
    private String destination;
    
    @Column(nullable = false)
    private LocalDateTime departureDateTime;
    
    @Column(nullable = false)
    private LocalDateTime arrivalDateTime;
    
    private String duration; 
    
    @Column(nullable = false)
    private Double price;
    
    @Column(nullable = false)
    private Integer totalSeats;
    
    @Column(nullable = false)
    private Integer availableSeats;
    
    @Column(nullable = false)
    private String status = "SCHEDULED";
}