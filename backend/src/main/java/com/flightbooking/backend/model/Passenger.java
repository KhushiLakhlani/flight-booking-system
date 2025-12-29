package com.flightbooking.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "passengers")
@Data
public class Passenger {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private Integer bookingId;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false)
    private LocalDate dateOfBirth;
    
    @Column(nullable = false)
    private String gender; // MALE, FEMALE, OTHER
    
    private String passportNumber;
    
    private String nationality;
    
    @Column(nullable = false)
    private String seatNumber;
    
    private String mealPreference; // VEG, NON_VEG, VEGAN, etc.
    
    private String specialAssistance; // WHEELCHAIR, INFANT, etc.
}