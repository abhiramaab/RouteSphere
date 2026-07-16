package com.RouteSphere.REST.entity;

import com.RouteSphere.REST.enums.DriverStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "driver")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String driverName;
    private String driverPhone;
    private String driverLicenseNumber;
    private LocalDate driverLicenseExpiry;
    private Double experienceYears;

    @Enumerated(EnumType.STRING)
    private DriverStatus driverStatus;

    @OneToMany(mappedBy = "driver")
    @JsonManagedReference
    private List<Trip> trips;

    @OneToMany(mappedBy = "driver")
    @JsonManagedReference
    private List<Shipment> shipments;
}
